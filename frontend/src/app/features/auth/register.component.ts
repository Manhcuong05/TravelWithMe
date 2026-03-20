import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppValidators } from '../../core/utils/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-effect animate-fade-in">
        <h2 class="luxury-font">Gia Nhập TravelWithMe</h2>
        <p class="subtitle">Tạo tài khoản để bắt đầu hành trình của bạn</p>
        
        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label>Họ và Tên</label>
              <input type="text" formControlName="fullName" placeholder="VD: Nguyễn Văn A">
              <div class="error-msg text-left" *ngIf="isInvalid('fullName')">
                <small *ngIf="registerForm.get('fullName')?.errors?.['required']">Họ và tên không được để trống</small>
                <small *ngIf="registerForm.get('fullName')?.errors?.['minlength']">Họ và tên ít nhất 2 ký tự</small>
              </div>
            </div>
          </div>
          
          <div class="form-group">
            <label>Địa chỉ Email</label>
            <input type="email" formControlName="email" placeholder="email@cua-ban.com">
            <div class="error-msg text-left" *ngIf="isInvalid('email')">
              <small *ngIf="registerForm.get('email')?.errors?.['required']">Email không được để trống</small>
              <small *ngIf="registerForm.get('email')?.errors?.['email']">Email không đúng định dạng</small>
            </div>
          </div>
          
          <div class="form-group">
            <label>Mật khẩu</label>
            <input type="password" formControlName="password" placeholder="••••••••">
            <div class="error-msg text-left" *ngIf="isInvalid('password')">
              <small *ngIf="registerForm.get('password')?.errors?.['required']">Mật khẩu không được để trống</small>
              <small *ngIf="registerForm.get('password')?.errors?.['minlength']">Mật khẩu tối thiểu 8 ký tự</small>
              <small *ngIf="registerForm.get('password')?.errors?.['pattern']">
                Mật khẩu (có 1 chữ hoa, 1 số, 1 ký tự đặc biệt)
              </small>
            </div>
          </div>

          <div class="form-group">
            <label>Số điện thoại</label>
            <input type="text" formControlName="phone" placeholder="+84 123 456 789">
            <div class="error-msg text-left" *ngIf="isInvalid('phone')">
              <small *ngIf="registerForm.get('phone')?.errors?.['pattern']">Số điện thoại không hợp lệ</small>
            </div>
          </div>
          
          <div *ngIf="errorMessage" class="error-msg center-text">
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
      background: linear-gradient(rgba(5, 10, 20, 0.8), rgba(5, 10, 20, 0.9)), 
                  url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920');
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
    .form-group { margin-bottom: 20px; position: relative; }
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
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', AppValidators.fullName],
      email: ['', AppValidators.email],
      password: ['', AppValidators.password],
      phone: ['', AppValidators.phone]
    });
  }

  isInvalid(controlName: string) {
    const control = this.registerForm.get(controlName);
    return control && control.invalid && (control.touched || control.dirty);
  }

  onRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.register(this.registerForm.value).subscribe({
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
