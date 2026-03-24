import { Injectable, signal, inject } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface ChatMessage {
    id?: string;
    senderId: string;
    senderName: string;
    recipientId?: string;
    content: string;
    timestamp?: string;
    status?: string;
}

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    private auth = inject(AuthService);
    private http = inject(HttpClient);
    private stompClient: Client | null = null;
    
    public messages = signal<ChatMessage[]>([]);
    private messageSubject = new BehaviorSubject<ChatMessage[]>([]);
    public messages$ = this.messageSubject.asObservable();

    constructor() {
        this.initConnection();
    }

    private initConnection() {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('/ws-chat'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                this.subscribeToMessages();
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            }
        });

        this.stompClient.activate();
    }

    private subscribeToMessages() {
        const user = this.auth.currentUser();
        
        // Public/Support channel
        this.stompClient?.subscribe('/topic/support', (message: IMessage) => {
            if (message.body) {
                this.addMessage(JSON.parse(message.body));
            }
        });

        // Private channel if logged in
        if (user) {
            this.stompClient?.subscribe(`/user/${user.id}/queue/messages`, (message: IMessage) => {
                if (message.body) {
                    this.addMessage(JSON.parse(message.body));
                }
            });
            this.loadHistory(user.id, 'SUPPORT');
        }
    }

    private addMessage(msg: ChatMessage) {
        const current = this.messages();
        this.messages.set([...current, msg]);
        this.messageSubject.next(this.messages());
    }

    public sendMessage(content: string, recipientId?: string) {
        const user = this.auth.currentUser();
        if (!user) return;

        const chatMessage: ChatMessage = {
            senderId: user.id,
            senderName: user.fullName,
            recipientId: recipientId,
            content: content
        };

        this.stompClient?.publish({
            destination: '/app/chat',
            body: JSON.stringify(chatMessage)
        });
        
        // Optimistically add to local list if it's sent to support topic
        // although the server will broadcast it back to /topic/support
    }

    public loadHistory(senderId: string, recipientId: string) {
        this.http.get<ChatMessage[]>(`/api/chat/history?senderId=${senderId}&recipientId=${recipientId}`)
            .subscribe(msgs => {
                this.messages.set(msgs);
                this.messageSubject.next(msgs);
            });
    }
}
