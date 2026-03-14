import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-effect animate-fade-in">
        <h2 class="luxury-font">Gia Nhập TravelWithMe</h2>
        <p class="subtitle">Tạo tài khoản để bắt đầu hành trình của bạn</p>
        
        <form (ngSubmit)="onRegister()" #registerForm="ngForm" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label>Họ và Tên</label>
              <input type="text" name="fullName" [(ngModel)]="userData.fullName" required placeholder="VD: Nguyễn Văn A">
            </div>
          </div>
          
          <div class="form-group">
            <label>Địa chỉ Email</label>
            <input type="email" name="email" [(ngModel)]="userData.email" required placeholder="email@cua-ban.com">
          </div>
          
          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" name="password" [(ngModel)]="userData.password" required placeholder="••••••••">
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="text" name="phone" [(ngModel)]="userData.phone" placeholder="+84 123 456 789">
          </div>
          
          <div *ngIf="errorMessage" class="error-msg">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-gold w-full" [disabled]="loading">
            {{ loading ? 'Đang tạo tài khoản...' : 'Tạo Tài Khoản' }}
          </button>
        </form>
        
        <p class="footer-text">
          Đã có tài khoản? <a routerLink="/auth/login">Đăng nhập</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      padding: 100px 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(rgba(5, 10, 20, 0.8), rgba(5, 10, 20, 0.9)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920');
      background-size: cover;
      background-position: center;
    }
    .auth-card {
      width: 100%;
      max-width: 500px;
      padding: 50px;
      text-align: center;
    }
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 40px; }
    .auth-form { text-align: left; }
    .form-group { margin-bottom: 20px; }
    .form-group label {
      display: block; font-size: 0.75rem; text-transform: uppercase;
      color: var(--gold-primary); margin-bottom: 8px; letter-spacing: 0.5px;
    }
    .form-group input {
      width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border);
      padding: 12px 15px; border-radius: 8px; color: var(--text-primary); outline: none; transition: var(--transition-smooth);
    }
    .form-group input:focus { border-color: var(--gold-primary); background: rgba(255, 255, 255, 0.08); }
    .w-full { width: 100%; }
    .footer-text { margin-top: 30px; font-size: 0.9rem; color: var(--text-secondary); }
    .footer-text a { color: var(--gold-primary); text-decoration: none; font-weight: 500; }
    .error-msg { color: #ef4444; font-size: 0.85rem; margin-bottom: 20px; text-align: center; }
  `]
})
export class RegisterComponent {
  userData = { email: '', password: '', fullName: '', phone: '' };
  loading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onRegister() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.userData).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/auth/login']);
        } else {
          this.errorMessage = res.message || 'Đăng ký thất bại.';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Đã có lỗi xảy ra trong quá trình đăng ký.';
        this.loading = false;
      }
    });
  }
}
