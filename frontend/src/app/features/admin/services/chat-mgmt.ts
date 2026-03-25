import { Component, inject, signal, effect, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../../core/services/chat.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="chat-dashboard-container">
      <!-- Sidebar: User List -->
      <div class="chat-sidebar">
        <div class="sidebar-header">
          <h3>Hội thoại trực tuyến</h3>
          <button class="btn-refresh" (click)="refresh()"><i class="fas fa-sync-alt"></i></button>
        </div>
        <div class="user-list">
          <div *ngFor="let user of chatService.activeChatUsers()" 
               class="user-item" 
               [class.active]="selectedUserId() === user.userId"
               (click)="selectUser(user)">
            <div class="user-avatar">{{ user.userName.charAt(0) }}</div>
            <div class="user-info">
              <div class="user-name">{{ user.userName }}</div>
              <div class="last-seen">Đang chờ hỗ trợ...</div>
            </div>
            <div class="unread-dot" *ngIf="hasNewMessage(user.userId)"></div>
          </div>
          <div *ngIf="chatService.activeChatUsers().length === 0" class="no-users">
            Chưa có khách hàng nào nhắn tin.
          </div>
        </div>
      </div>

      <!-- Main: Chat Window -->
      <div class="chat-main">
        <div class="chat-header" *ngIf="selectedUser(); else noSelection">
          <div class="header-user">
            <div class="header-avatar">{{ selectedUser()?.userName?.charAt(0) }}</div>
            <div>
              <div class="header-name">{{ selectedUser()?.userName }}</div>
              <div class="header-status">Đang trực tuyến</div>
            </div>
          </div>
        </div>

        <div class="chat-body" #scrollMe>
          <div *ngFor="let msg of filteredMessages()" 
               class="message-wrapper" 
               [class.sent]="msg.senderId === user()?.id">
            <div class="message-bubble">
              <div class="msg-content">{{ msg.content }}</div>
              <div class="msg-time">{{ msg.timestamp | date:'HH:mm' }}</div>
            </div>
          </div>
          <div *ngIf="!selectedUserId()" class="empty-state">
            <i class="fas fa-comments big-icon"></i>
            <p>Chọn một khách hàng để bắt đầu hỗ trợ</p>
          </div>
        </div>

        <div class="chat-footer" *ngIf="selectedUserId()">
          <input type="text" 
                 [(ngModel)]="newMessage" 
                 (keyup.enter)="send()" 
                 placeholder="Nhập phản hồi cho khách hàng..."
                 class="chat-input" />
          <button class="btn-send" (click)="send()"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    </div>

    <ng-template #noSelection>
      <div class="chat-header-empty">
        <h3>Hệ thống Chăm sóc Khách hàng</h3>
      </div>
    </ng-template>
  `,
  styles: [`
    .chat-dashboard-container { display: flex; height: calc(100vh - 180px); background: #0f172a; border-radius: 24px; border: 1px solid rgba(212, 175, 55, 0.2); overflow: hidden; }
    
    .chat-sidebar { width: 350px; border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; background: rgba(15, 23, 42, 0.6); }
    .sidebar-header { padding: 25px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
    .sidebar-header h3 { color: #D4AF37; margin: 0; font-size: 1.1rem; }
    
    .user-list { flex: 1; overflow-y: auto; padding: 10px; }
    .user-item { display: flex; align-items: center; gap: 15px; padding: 15px; border-radius: 16px; cursor: pointer; transition: 0.3s; margin-bottom: 8px; position: relative; }
    .user-item:hover { background: rgba(255,255,255,0.05); }
    .user-item.active { background: rgba(212, 175, 55, 0.15); border-left: 4px solid #D4AF37; }
    
    .user-avatar { width: 45px; height: 45px; border-radius: 12px; background: #334155; color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
    .user-name { font-weight: 600; font-size: 0.95rem; color: #f1f5f9; }
    .last-seen { font-size: 0.75rem; color: #64748b; }
    .unread-dot { width: 10px; height: 10px; background: #D4AF37; border-radius: 50%; position: absolute; right: 20px; box-shadow: 0 0 8px #D4AF37; }

    .chat-main { flex: 1; display: flex; flex-direction: column; background: #020617; }
    .chat-header { padding: 20px 30px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; }
    .header-user { display: flex; align-items: center; gap: 15px; }
    .header-avatar { width: 40px; height: 40px; border-radius: 50%; background: #D4AF37; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; }
    .header-name { font-weight: 700; color: #fff; }
    .header-status { font-size: 0.75rem; color: #22c55e; }

    .chat-body { flex: 1; overflow-y: auto; padding: 30px; display: flex; flex-direction: column; gap: 20px; background-image: radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.02) 0%, transparent 100%); }
    .message-wrapper { display: flex; flex-direction: column; align-items: flex-start; max-width: 70%; }
    .message-wrapper.sent { align-items: flex-end; margin-left: auto; }
    
    .message-bubble { padding: 12px 18px; border-radius: 18px; background: #1e293b; color: #f1f5f9; position: relative; }
    .sent .message-bubble { background: #D4AF37; color: #000; border-bottom-right-radius: 4px; }
    .msg-content { font-size: 0.9rem; line-height: 1.5; }
    .msg-time { font-size: 0.65rem; margin-top: 5px; opacity: 0.6; text-align: right; }

    .chat-footer { padding: 25px 30px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 15px; }
    .chat-input { flex: 1; background: #1e293b; border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 14px; padding: 12px 20px; color: #fff; outline: none; transition: 0.3s; }
    .chat-input:focus { border-color: #D4AF37; box-shadow: 0 0 10px rgba(212, 175, 55, 0.1); }
    .btn-send { width: 50px; height: 50px; border-radius: 14px; background: #D4AF37; border: none; color: #000; cursor: pointer; transition: 0.3s; }
    .btn-send:hover { transform: scale(1.05); background: #facc15; }

    .empty-state { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #475569; gap: 15px; }
    .big-icon { font-size: 4rem; opacity: 0.2; }
    .btn-refresh { background: none; border: none; color: #64748b; cursor: pointer; font-size: 1rem; }
    .btn-refresh:hover { color: #D4AF37; }
  `]
})
export class AdminChatComponent {
  public chatService = inject(ChatService);
  private auth = inject(AuthService);
  
  user = this.auth.currentUser;
  selectedUserId = signal<string | null>(null);
  selectedUser = signal<{userId: string, userName: string} | null>(null);
  newMessage = '';

  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  constructor() {
    this.chatService.refreshActiveUsers();
    
    // Auto scroll when messages change
    effect(() => {
      this.chatService.messages();
      setTimeout(() => this.scrollToBottom(), 100);
    });
  }

  selectUser(user: {userId: string, userName: string}) {
    this.selectedUserId.set(user.userId);
    this.selectedUser.set(user);
    this.chatService.loadHistory(user.userId, this.user()?.id!); 
  }

  filteredMessages() {
    const selectedId = this.selectedUserId();
    if (!selectedId) return [];
    
    // In professional mode, filter messages by the conversation between Admin and Selected User
    return this.chatService.messages().filter(m => 
        (m.senderId === selectedId && (m.recipientId === 'SUPPORT' || m.recipientId === this.user()?.id)) ||
        (m.senderId === this.user()?.id && m.recipientId === selectedId) ||
        (m.senderId === selectedId && !m.recipientId) // Initial message from customer
    );
  }

  send() {
    if (!this.newMessage.trim() || !this.selectedUserId()) return;
    this.chatService.sendMessage(this.newMessage, this.selectedUserId()!);
    
    // Optimistic local update (ChatService will also handle it via STOMP)
    const tempMsg: ChatMessage = {
      senderId: this.user()?.id!,
      senderName: this.user()?.fullName!,
      recipientId: this.selectedUserId()!,
      content: this.newMessage,
      timestamp: new Date().toISOString()
    };
    // this.chatService.messages.update(m => [...m, tempMsg]); // STOMP will push it back
    
    this.newMessage = '';
  }

  refresh() {
    this.chatService.refreshActiveUsers();
  }

  hasNewMessage(userId: string) {
    // Basic logic: if latest message sender is this user and not admin
    const msgs = this.chatService.messages();
    if (msgs.length === 0) return false;
    const last = msgs[msgs.length - 1];
    return last.senderId === userId && this.selectedUserId() !== userId;
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
