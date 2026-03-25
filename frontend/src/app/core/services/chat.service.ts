import { Injectable, signal, inject, effect } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { AuthService } from './auth.service';
import { ApiResponse } from '../../data/models/auth.model';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
    public activeChatUsers = signal<{userId: string, userName: string, avatarUrl?: string}[]>([]);
    public supportAvatar = signal<string>('https://i.pravatar.cc/150?u=support_expert');
    private messageSubject = new BehaviorSubject<ChatMessage[]>([]);
    public messages$ = this.messageSubject.asObservable();

    private subscriptions: any[] = [];

    constructor() {
        this.initConnection();
        
        // Watch for user changes to re-subscribe reactively
        effect(() => {
            const user = this.auth.currentUser();
            if (this.stompClient?.connected) {
                this.refreshSubscriptions();
            }
        });
    }

    private initConnection() {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('/ws-chat'),
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                this.refreshSubscriptions();
            },
            onStompError: (frame: any) => {
                console.error('STOMP error', frame);
            }
        });

        this.stompClient.activate();
    }

    private refreshSubscriptions() {
        // Clear old ones first
        this.subscriptions.forEach(s => {
            try { s.unsubscribe(); } catch(e) {}
        });
        this.subscriptions = [];

        const user = this.auth.currentUser();
        if (!this.stompClient?.connected) return;

        console.log('Refreshing subscriptions for user:', user?.email || 'Guest');
        
        // Public/Support channel (Admins listen to this for NEW requests)
        if (user?.role === 'ADMIN' || user?.role === 'CTV') {
            const sub = this.stompClient.subscribe('/topic/support', (message: IMessage) => {
                if (message.body) {
                    const msg = JSON.parse(message.body);
                    this.addMessage(msg);
                    this.refreshActiveUsers();
                }
            });
            this.subscriptions.push(sub);
        }

        // Private channel
        if (user) {
            const sub = this.stompClient.subscribe(`/topic/chat.${user.id}`, (message: IMessage) => {
                if (message.body) {
                    this.addMessage(JSON.parse(message.body));
                }
            });
            this.subscriptions.push(sub);
            
            if (user.role !== 'ADMIN' && user.role !== 'CTV') {
                this.loadHistory(user.id, 'SUPPORT');
            }
        }
    }

    public refreshActiveUsers() {
        const user = this.auth.currentUser();
        if (user?.role === 'ADMIN' || user?.role === 'CTV') {
            this.http.get<{userId: string, userName: string, avatarUrl?: string}[]>('/api/chat/users')
                .subscribe({
                    next: (users) => this.activeChatUsers.set(users),
                    error: (err) => console.error('Failed to load active users', err)
                });
        }
    }

    private addMessage(msg: ChatMessage) {
        const current = this.messages();
        // Avoid duplicates if we receive the same message via multiple channels
        if (msg.id && current.some(m => m.id === msg.id)) return;
        
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
    }

    public loadHistory(senderId: string, recipientId: string) {
        this.http.get<ChatMessage[]>(`/api/chat/history?senderId=${senderId}&recipientId=${recipientId}`)
            .subscribe({
                next: (msgs) => {
                    this.messages.set(msgs);
                    this.messageSubject.next(msgs);
                },
                error: (err) => console.error('Failed to load chat history', err)
            });
    }

    public loadSupportAvatar() {
        this.http.get<ApiResponse<string>>('/api/settings/SUPPORT_AVATAR').subscribe(res => {
            if (res.success && res.data) {
                this.supportAvatar.set(res.data);
            }
        });
    }

    public updateSupportAvatar(url: string): Observable<ApiResponse<string>> {
        return this.http.put<ApiResponse<string>>('/api/settings/SUPPORT_AVATAR', { value: url }).pipe(
            tap((res: ApiResponse<string>) => {
                if (res.success) this.supportAvatar.set(url);
            })
        );
    }
}
