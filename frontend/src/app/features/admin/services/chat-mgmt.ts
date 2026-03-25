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
    <div class="chat-pro-container animate-in">
      <!-- Sidebar / User List Section -->
      <aside class="chat-sidebar-pro">
        <div class="sidebar-header-pro">
          <div class="header-title-zone">
            <h3 class="luxury-font">Hội thoại trực tuyến</h3>
            <span class="status-badge">Live Support</span>
          </div>
          <button class="btn-refresh-pro" (click)="refresh()" title="Làm mới">
            <i class="fas fa-sync-alt" [class.fa-spin]="loading()"></i>
          </button>
        </div>

        <div class="user-list-pro custom-scrollbar">
          <div *ngFor="let user of chatService.activeChatUsers()" 
               class="user-card-pro" 
               [class.active]="selectedUserId() === user.userId"
               (click)="selectUser(user)">
            <div class="avatar-zone">
              <div class="avatar-pro gold-gradient">{{ user.userName.charAt(0) }}</div>
              <div class="status-dot"></div>
            </div>
            <div class="user-meta-pro">
              <div class="name-row">
                <span class="u-name">{{ user.userName }}</span>
              </div>
              <div class="u-status">Đang chờ hỗ trợ...</div>
            </div>
            <div class="new-indicator" *ngIf="hasNewMessage(user.userId)"></div>
          </div>

          <div *ngIf="chatService.activeChatUsers().length === 0" class="empty-list-pro">
            <i class="fas fa-users-slash"></i>
            <p>Không có khách hàng trực tuyến</p>
          </div>
        </div>
      </aside>

      <!-- Main Chat Window Area -->
      <main class="chat-viewport-pro">
        <header class="chat-header-pro" *ngIf="selectedUser(); else noSelection">
          <div class="header-user-info">
            <div class="h-avatar-pro luxury-border">{{ selectedUser()?.userName?.charAt(0) }}</div>
            <div class="h-text-pro">
              <h4 class="h-name-pro">{{ selectedUser()?.userName }}</h4>
              <div class="h-status-pro"><span class="dot"></span> Đang trực tuyến</div>
            </div>
          </div>
          <div class="header-actions-pro">
             <button class="btn-action-pro" title="Thông tin khách hàng"><i class="fas fa-info-circle"></i></button>
          </div>
        </header>

        <div class="chat-body-pro custom-scrollbar" #scrollMe>
          <div *ngFor="let msg of filteredMessages()" 
               class="msg-row-pro" 
               [class.admin-msg]="msg.senderId === user()?.id">
            <div class="msg-bubble-pro animate-pop">
              <div class="msg-content-pro">{{ msg.content }}</div>
              <div class="msg-meta-pro">
                <span>{{ msg.timestamp | date:'HH:mm' }}</span>
                <i class="fas fa-check-double" *ngIf="msg.senderId === user()?.id"></i>
              </div>
            </div>
          </div>

          <div *ngIf="!selectedUserId()" class="welcome-pro">
            <div class="welcome-box glass-effect">
              <div class="welcome-icon gold-glow"><i class="fas fa-comments"></i></div>
              <h3>Hệ thống Support Elite</h3>
              <p>Chọn một khách hàng từ danh sách bên trái để bắt đầu hỗ trợ trực tuyến cao cấp.</p>
            </div>
          </div>
        </div>

        <footer class="chat-input-pro" *ngIf="selectedUserId()">
          <div class="input-card-pro glass-effect">
            <input type="text" 
                   [(ngModel)]="newMessage" 
                   (keyup.enter)="send()" 
                   placeholder="Nhập phản hồi..."
                   class="luxury-input" />
            <div class="input-actions-pro">
                <button class="btn-send-pro shadow-gold" (click)="send()" [disabled]="!newMessage.trim()">
                  <i class="fas fa-paper-plane"></i>
                </button>
            </div>
          </div>
        </footer>
      </main>
    </div>

    <ng-template #noSelection>
      <header class="chat-header-pro empty">
        <h3 class="luxury-font">Trung tâm Điều hành Hỗ trợ</h3>
      </header>
    </ng-template>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #BB9531; --slate-950: #020617; --slate-900: #0f172a; --slate-800: #1e293b; }
    
    .chat-pro-container { 
      display: flex; height: calc(100vh - 160px); background: var(--slate-950); 
      border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }

    /* Sidebar Pro */
    .chat-sidebar-pro { width: 380px; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); border-right: 1px solid rgba(255,255,255,0.05); display: flex; flex-direction: column; }
    .sidebar-header-pro { padding: 30px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
    .header-title-zone h3 { margin: 0; color: var(--gold-primary); font-size: 1.2rem; }
    .status-badge { font-size: 0.6rem; color: #22c55e; background: rgba(34, 197, 94, 0.1); padding: 2px 8px; border-radius: 20px; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; }

    .user-list-pro { flex: 1; overflow-y: auto; padding: 15px; }
    .user-card-pro { 
      display: flex; align-items: center; gap: 15px; padding: 18px; border-radius: 20px; 
      cursor: pointer; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); margin-bottom: 10px; position: relative;
      border: 1px solid transparent;
    }
    .user-card-pro:hover { background: rgba(255,255,255,0.03); transform: translateX(5px); }
    .user-card-pro.active { 
        background: rgba(212, 175, 55, 0.08); border-color: rgba(212, 175, 55, 0.2);
        box-shadow: inset 0 0 20px rgba(212, 175, 55, 0.05);
    }
    .user-card-pro.active::before { content: ''; position: absolute; left: 0; top: 25%; height: 50%; width: 4px; background: var(--gold-primary); border-radius: 0 4px 4px 0; }

    .avatar-zone { position: relative; }
    .avatar-pro { width: 50px; height: 50px; border-radius: 16px; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; font-size: 1.3rem; }
    .gold-gradient { background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary)); }
    .status-dot { position: absolute; bottom: -2px; right: -2px; width: 14px; height: 14px; background: #22c55e; border-radius: 50%; border: 3px solid #0f172a; }

    .user-meta-pro { flex: 1; min-width: 0; }
    .u-name { display: block; font-weight: 700; color: #f8fafc; font-size: 1rem; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .u-status { font-size: 0.75rem; color: #64748b; margin-top: 4px; }
    .new-indicator { width: 10px; height: 10px; background: var(--gold-primary); border-radius: 50%; box-shadow: 0 0 12px var(--gold-primary); }

    /* Main Viewport */
    .chat-viewport-pro { flex: 1; display: flex; flex-direction: column; background: var(--slate-950); position: relative; }
    .chat-header-pro { 
      padding: 25px 40px; background: rgba(2, 6, 23, 0.5); backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center;
    }
    .header-user-info { display: flex; align-items: center; gap: 20px; }
    .h-avatar-pro { width: 45px; height: 45px; border-radius: 50%; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; font-weight: 800; color: var(--gold-primary); }
    .luxury-border { border: 2px solid rgba(212, 175, 55, 0.3); }
    .h-name-pro { margin: 0; color: #fff; font-size: 1.1rem; }
    .h-status-pro { font-size: 0.75rem; color: #22c55e; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .h-status-pro .dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; animation: pulse 2s infinite; }

    /* Chat Body */
    .chat-body-pro { flex: 1; overflow-y: auto; padding: 40px; display: flex; flex-direction: column; gap: 25px; background: radial-gradient(circle at top right, rgba(212, 175, 55, 0.05) 0%, transparent 40%); }
    .msg-row-pro { display: flex; justify-content: flex-start; }
    .msg-row-pro.admin-msg { justify-content: flex-end; }

    .msg-bubble-pro { 
      max-width: 65%; padding: 16px 20px; border-radius: 24px; position: relative;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #f1f5f9;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .admin-msg .msg-bubble-pro { 
        background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
        color: #000; border: none; border-bottom-right-radius: 4px; font-weight: 500;
        box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.4);
    }
    .msg-content-pro { line-height: 1.6; font-size: 0.95rem; }
    .msg-meta-pro { display: flex; align-items: center; justify-content: flex-end; gap: 8px; font-size: 0.65rem; margin-top: 8px; opacity: 0.6; }

    /* Input Footer */
    .chat-input-pro { padding: 30px 40px; }
    .input-card-pro { display: flex; align-items: center; padding: 8px 8px 8px 25px; border-radius: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); }
    .luxury-input { flex: 1; background: none; border: none; color: #fff; outline: none; padding: 12px 0; font-size: 0.95rem; }
    .btn-send-pro { width: 50px; height: 50px; border-radius: 15px; background: var(--gold-primary); color: #000; border: none; cursor: pointer; transition: 0.3s; font-size: 1.1rem; }
    .btn-send-pro:hover:not(:disabled) { transform: translateY(-3px) scale(1.05); background: #facc15; }
    .btn-send-pro:disabled { opacity: 0.3; cursor: not-allowed; filter: grayscale(1); }

    /* Utilities */
    .custom-scrollbar::-webkit-scrollbar { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.3); }

    .welcome-pro { height: 100%; display: flex; align-items: center; justify-content: center; }
    .welcome-box { padding: 50px; border-radius: 30px; text-align: center; max-width: 450px; transform: translateY(-20px); }
    .welcome-icon { font-size: 4rem; color: var(--gold-primary); margin-bottom: 25px; }
    .gold-glow { filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.4)); }
    .welcome-box h3 { font-size: 1.5rem; margin-bottom: 15px; color: #fff; }
    .welcome-box p { color: #64748b; line-height: 1.6; }

    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
    @keyframes animateIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    .animate-in { animation: animateIn 0.8s cubic-bezier(0.23, 1, 0.32, 1); }
    @keyframes pop { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-pop { animation: pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    
    .btn-refresh-pro { background: none; border: none; color: #475569; cursor: pointer; transition: 0.3s; padding: 10px; }
    .btn-refresh-pro:hover { color: var(--gold-primary); transform: rotate(180deg); }
  `]
})
export class AdminChatComponent {
  public chatService = inject(ChatService);
  private auth = inject(AuthService);

  user = this.auth.currentUser;
  selectedUserId = signal<string | null>(null);
  selectedUser = signal<{ userId: string, userName: string } | null>(null);
  loading = signal(false);
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

  selectUser(user: { userId: string, userName: string }) {
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
    this.loading.set(true);
    this.chatService.refreshActiveUsers();
    setTimeout(() => this.loading.set(false), 800);
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
    } catch (err) { }
  }
}
