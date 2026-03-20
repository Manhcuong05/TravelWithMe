import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { AppValidators } from '../../core/utils/validators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, GoogleSigninButtonModule],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-effect animate-fade-in">
        <h2 class="luxury-font">Chào Mừng Trở Lại</h2>
        <p class="subtitle">Vui lòng nhập thông tin để đăng nhập</p>
        
        <div class="google-login-wrapper">
          <asl-google-signin-button type="standard" size="large" [width]="350" theme="filled_black"></asl-google-signin-button>
        </div>
        
        <div class="divider">
          <span>Hoặc đăng nhập bằng Email</span>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form">
          <div class="form-group">
            <label>Địa chỉ Email</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="email@cua-ban.com">
            <div class="error-msg text-left" *ngIf="isInvalid('email')">
              <small *ngIf="loginForm.get('email')?.errors?.['required']">Email không được để trống</small>
              <small *ngIf="loginForm.get('email')?.errors?.['email']">Email không đúng định dạng</small>
            </div>
          </div>
          
          <div class="form-group">
            <label>Mật khẩu</label>
            <input 
              type="password" 
              formControlName="password" 
              placeholder="••••••••">
            <div class="error-msg text-left" *ngIf="isInvalid('password')">
              <small *ngIf="loginForm.get('password')?.errors?.['required']">Mật khẩu không được để trống</small>
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="error-msg center-text">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-gold w-full" [disabled]="loading">
            {{ loading ? 'Đang đăng nhập...' : 'Đăng Nhập' }}
          </button>
        </form>
        
        <p class="footer-text">
          Chưa có tài khoản? <a routerLink="/auth/register">Đăng ký ngay</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(rgba(5, 10, 20, 0.8), rgba(5, 10, 20, 0.9)), 
                  url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920');
      background-size: cover;
      background-position: center;
    }
    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 50px;
      text-align: center;
    }
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 40px; }
    .auth-form { text-align: left; }
    .form-group { margin-bottom: 25px; position: relative; }
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
    .google-login-wrapper { display: flex; justify-content: center; margin-bottom: 20px; }
    .divider {
      display: flex; align-items: center; text-align: center; margin: 20px 0;
      color: var(--text-secondary); font-size: 0.8rem;
    }
    .divider::before, .divider::after { content: ''; flex: 1; border-bottom: 1px solid var(--glass-border); }
    .divider:not(:empty)::before { margin-right: .75em; }
    .divider:not(:empty)::after { margin-left: .75em; }
    .footer-text { margin-top: 30px; font-size: 0.9rem; color: var(--text-secondary); }
    .footer-text a { color: var(--gold-primary); text-decoration: none; font-weight: 500; }
    .error-msg { 
      color: #ef4444; 
      font-size: 0.75rem; 
      margin-top: 4px; 
      display: block;
    }
    .text-left { text-align: left; }
    .center-text { text-align: center; margin-bottom: 20px; }
  `]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', AppValidators.email],
      password: ['', [AppValidators.password[0]]] // Only required for login
    });

    this.socialAuthService.authState.subscribe((user: any) => {
      if (user) {
        this.loading = true;
        this.authService.loginWithGoogle(user.idToken).subscribe({
          next: (res: any) => {
            if (res.success) {
              this.router.navigate(['/']);
            } else {
              this.errorMessage = res.message || 'Đăng nhập Google thất bại.';
              this.loading = false;
            }
          },
          error: (err: any) => {
            this.errorMessage = err.error?.message || 'Có lỗi khi xác thực tài khoản Google.';
            this.loading = false;
          }
        });
      }
    });
  }

  isInvalid(controlName: string) {
    const control = this.loginForm.get(controlName);
    return control && control.invalid && (control.touched || control.dirty);
  }

  onLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = res.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Đã có lỗi xảy ra trong quá trình đăng nhập.';
        this.loading = false;
      }
    });
  }
}
