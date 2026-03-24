import { Component, inject, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../../core/services/chat.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-contact-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Floating Contact Button -->
    <div class="contact-fab-container" (click)="toggleChat()">
      <div class="fab-pulse" *ngIf="!isOpen()"></div>
      <div class="contact-fab">
        <i class="fas" [ngClass]="isOpen() ? 'fa-times' : 'fa-comments-alt'"></i>
        <span class="btn-label" *ngIf="!isOpen()">LIÊN HỆ CTV</span>
      </div>
    </div>

    <!-- Chat Window Pro Max -->
    <div class="chat-window-pro glass-effect" [class.open]="isOpen()">
      <div class="chat-header">
        <div class="user-info">
          <div class="status-dot"></div>
          <div>
            <h3>Cộng Tác Viên</h3>
            <p>Trực tuyến · Sẵn sàng hỗ trợ</p>
          </div>
        </div>
        <div class="header-actions">
          <button (click)="toggleChat()"><i class="fas fa-minus"></i></button>
        </div>
      </div>

      <div class="chat-messages" #scrollContainer>
        <div class="welcome-msg">
          <i class="fas fa-robot"></i>
          <p>Xin chào! Chúng tôi có thể giúp gì cho bạn trong chuyến đi này?</p>
        </div>

        <div *ngFor="let msg of chatService.messages()" 
             class="msg-item" 
             [class.is-me]="msg.senderId === currentUserId()">
          <div class="msg-bubble">
            <span class="sender-name" *ngIf="msg.senderId !== currentUserId()">{{ msg.senderName }}</span>
            <p>{{ msg.content }}</p>
            <span class="time">{{ msg.timestamp | date:'HH:mm' }}</span>
          </div>
        </div>
      </div>

      <div class="chat-input-area" *ngIf="auth.isAuthenticated(); else loginRequired">
        <input type="text" 
               [(ngModel)]="newMessage" 
               (keyup.enter)="send()"
               placeholder="Nhập tin nhắn..." 
               class="chat-input" />
        <button (click)="send()" [disabled]="!newMessage.trim()">
          <i class="fas fa-paper-plane"></i>
        </button>
      </div>
      
      <ng-template #loginRequired>
        <div class="login-prompt">
          <p>Vui lòng đăng nhập để bắt đầu trò chuyện</p>
          <button class="btn-gold-sm" (click)="goToLogin()">Đăng Nhập Ngay</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .contact-fab-container { position: fixed; bottom: 30px; right: 30px; z-index: 9999; cursor: pointer; display: flex; align-items: center; }
    .contact-fab { 
      width: 60px; height: 60px; border-radius: 50%; 
      background: linear-gradient(135deg, #D4AF37, #B8860B);
      color: #000; display: flex; align-items: center; justify-content: center;
      font-size: 1.5rem; box-shadow: 0 10px 30px rgba(212,175,55,0.4);
      border: 3px solid #050a14; position: relative; z-index: 2;
    }
    .btn-label { 
      position: absolute; right: 70px; background: #fff; color: #000;
      padding: 8px 15px; border-radius: 8px; font-weight: 800; font-size: 0.75rem;
      white-space: nowrap; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease-out;
    }
    @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }

    .fab-pulse { 
      position: absolute; inset: -8px; border-radius: 50%;
      border: 2px solid #D4AF37; animation: pulse 2s infinite; opacity: 0;
    }
    @keyframes pulse { 0% { transform: scale(1); opacity: 0.8; } 100% { transform: scale(1.4); opacity: 0; } }

    .chat-window-pro {
      position: fixed; bottom: 100px; right: 30px; width: 380px; height: 500px;
      z-index: 9998; border-radius: 20px; overflow: hidden;
      display: flex; flex-direction: column;
      transform: translateY(20px) scale(0.9); opacity: 0; pointer-events: none;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      border: 1px solid rgba(212,175,55,0.2);
    }
    .chat-window-pro.open { transform: translateY(0) scale(1); opacity: 1; pointer-events: all; }

    .chat-header { 
      padding: 20px; background: rgba(0,0,0,0.4); border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex; justify-content: space-between; align-items: center;
    }
    .user-info { display: flex; align-items: center; gap: 12px; }
    .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #4dfa4d; box-shadow: 0 0 10px #4dfa4d; }
    .user-info h3 { font-size: 1rem; color: #fff; margin: 0; font-family: 'Playfair Display', serif; }
    .user-info p { font-size: 0.7rem; color: #94a3b8; margin: 0; }
    .header-actions button { background: none; border: none; color: #94a3b8; cursor: pointer; }

    .chat-messages { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
    .welcome-msg { text-align: center; color: #94a3b8; font-size: 0.8rem; margin-bottom: 20px; }
    .welcome-msg i { font-size: 1.5rem; margin-bottom: 10px; color: var(--gold-primary); }

    .msg-item { display: flex; flex-direction: column; max-width: 80%; }
    .msg-item.is-me { align-self: flex-end; }
    .msg-bubble { 
      padding: 12px 16px; border-radius: 15px 15px 15px 0; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.05); color: #f1f5f9; position: relative;
    }
    .is-me .msg-bubble { background: rgba(212,175,55,0.15); border-color: rgba(212,175,55,0.3); border-radius: 15px 15px 0 15px; }
    .sender-name { font-size: 0.65rem; color: #D4AF37; font-weight: 700; display: block; margin-bottom: 4px; }
    .time { font-size: 0.6rem; color: #64748b; align-self: flex-end; margin-top: 4px; display: block; }

    .chat-input-area { padding: 15px; background: rgba(0,0,0,0.3); display: flex; gap: 10px; }
    .chat-input { 
      flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
      padding: 10px 15px; border-radius: 10px; color: #fff; font-size: 0.9rem; outline: none;
    }
    .chat-input-area button { 
      width: 40px; height: 40px; border-radius: 10px; background: #D4AF37; color: #000;
      border: none; cursor: pointer; transition: 0.3s;
    }
    .chat-input-area button:disabled { opacity: 0.5; cursor: not-allowed; }

    .login-prompt { padding: 30px; text-align: center; }
    .login-prompt p { color: #94a3b8; font-size: 0.9rem; margin-bottom: 15px; }
    .btn-gold-sm { background: #D4AF37; color: #000; border: none; padding: 10px 25px; border-radius: 8px; font-weight: 700; cursor: pointer; }
  `]
})
export class ContactChatComponent implements AfterViewChecked {
  public chatService = inject(ChatService);
  public auth = inject(AuthService);
  
  @ViewChild('scrollContainer') private scrollContainer?: ElementRef;

  isOpen = signal(false);
  newMessage = '';

  currentUserId() {
    return this.auth.currentUser()?.id;
  }

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  send() {
    if (this.newMessage.trim()) {
      this.chatService.sendMessage(this.newMessage);
      this.newMessage = '';
    }
  }

  goToLogin() {
    // Implement navigation to login
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    if (this.scrollContainer) {
      try {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      } catch (err) { }
    }
  }
}
