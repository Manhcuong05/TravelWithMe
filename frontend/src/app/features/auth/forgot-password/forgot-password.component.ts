import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppValidators } from '../../../core/utils/validators';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-effect animate-fade-in">
        <h2 class="luxury-font">Khôi Phục Mật Khẩu</h2>
        <p class="subtitle" *ngIf="!otpSent">Nhập email đăng ký để nhận mã OTP khôi phục mật khẩu</p>
        <p class="subtitle" *ngIf="otpSent">Nhập mã OTP (10 phút) và mật khẩu mới của bạn</p>

        <!-- Bước 1: Get OTP -->
        <form *ngIf="!otpSent" [formGroup]="emailForm" (ngSubmit)="onSendOtp()" class="auth-form">
          <div class="form-group">
            <label>Địa chỉ Email</label>
            <input 
              type="email" 
              formControlName="email" 
              placeholder="email@cua-ban.com">
            <div class="error-msg text-left" *ngIf="isInvalid('email', emailForm)">
              <small *ngIf="emailForm.get('email')?.errors?.['required']">Email không được để trống</small>
              <small *ngIf="emailForm.get('email')?.errors?.['email']">Email không đúng định dạng</small>
            </div>
          </div>
          
          <div *ngIf="errorMessage && !otpSent" class="error-msg center-text">{{ errorMessage }}</div>
          
          <button type="submit" class="btn-gold w-full" [disabled]="loading">
            {{ loading ? 'Đang gửi...' : 'Gửi Mã OTP' }}
          </button>
        </form>

        <!-- Bước 2: Reset Password -->
        <form *ngIf="otpSent" [formGroup]="resetForm" (ngSubmit)="onResetPassword()" class="auth-form">
          <div class="form-group">
            <label>Mã OTP (6 số)</label>
            <input 
              type="text" 
              formControlName="code" 
              maxlength="6"
              placeholder="123456">
            <div class="error-msg text-left" *ngIf="isInvalid('code', resetForm)">
              <small *ngIf="resetForm.get('code')?.errors?.['required']">Mã OTP không được để trống</small>
            </div>
            <div class="resend-wrapper mt-mt text-right">
              <p class="resend-text">
                Chưa nhận được mã? 
                <a href="javascript:void(0)" 
                   class="resend-link" 
                   [class.disabled]="resendCountdown > 0" 
                   (click)="onResendOtp()">
                  Gửi lại {{ resendCountdown > 0 ? '(' + resendCountdown + 's)' : '' }}
                </a>
              </p>
            </div>
          </div>

          <div class="form-group">
            <label>Mật Khẩu Mới</label>
            <input 
              type="password" 
              formControlName="newPassword" 
              placeholder="••••••••">
            <div class="error-msg text-left" *ngIf="isInvalid('newPassword', resetForm)">
              <small *ngIf="resetForm.get('newPassword')?.errors?.['required']">Mật khẩu không được để trống<br></small>
              <small *ngIf="resetForm.get('newPassword')?.errors?.['minlength']">Mật khẩu phải dài ít nhất 8 ký tự<br></small>
              <small *ngIf="resetForm.get('newPassword')?.errors?.['pattern']">Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 số và 1 ký tự đặc biệt (@$!%*?&)</small>
            </div>
          </div>

          <div class="form-group">
            <label>Xác Nhận Mật Khẩu</label>
            <input 
              type="password" 
              formControlName="confirmPassword" 
              placeholder="••••••••">
            <div class="error-msg text-left" *ngIf="isInvalid('confirmPassword', resetForm) || (resetForm.errors?.['passwordMismatch'] && resetForm.get('confirmPassword')?.touched)">
              <small *ngIf="resetForm.get('confirmPassword')?.errors?.['required']">Vui lòng xác nhận mật khẩu</small>
              <small *ngIf="resetForm.errors?.['passwordMismatch'] && !resetForm.get('confirmPassword')?.errors?.['required']">Mật khẩu xác nhận không khớp</small>
            </div>
          </div>
          
          <div *ngIf="errorMessage && otpSent" class="error-msg center-text">{{ errorMessage }}</div>
          <div *ngIf="successMessage" class="success-msg center-text">{{ successMessage }}</div>
          
          <button type="submit" class="btn-gold w-full" [disabled]="loading" *ngIf="!resetSuccess">
            {{ loading ? 'Đang đặt lại...' : 'Đặt Lại Mật Khẩu' }}
          </button>
          <button type="button" class="btn-gold w-full mt-mt" routerLink="/auth/login" *ngIf="resetSuccess">
            Quay Lại Đăng Nhập
          </button>
        </form>
        
        <p class="footer-text mt-mt">
          <a routerLink="/auth/login">Quay lại đăng nhập</a>
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
    .auth-card { width: 100%; max-width: 450px; padding: 50px; text-align: center; }
    .subtitle { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 40px; }
    .auth-form { text-align: left; }
    .form-group { margin-bottom: 25px; position: relative; }
    .form-group label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--gold-primary); margin-bottom: 8px; letter-spacing: 0.5px; }
    .form-group input { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); padding: 12px 15px; border-radius: 8px; color: var(--text-primary); outline: none; transition: var(--transition-smooth); }
    .form-group input:focus { border-color: var(--gold-primary); background: rgba(255, 255, 255, 0.08); }
    .w-full { width: 100%; }
    .footer-text { margin-top: 30px; font-size: 0.9rem; color: var(--text-secondary); text-align: center; }
    .footer-text a { color: var(--gold-primary); text-decoration: none; font-weight: 500; }
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block; }
    .success-msg { color: #10b981; font-size: 0.85rem; margin-top: 4px; display: block; margin-bottom: 20px;}
    .text-left { text-align: left; }
    .center-text { text-align: center; margin-bottom: 20px; }
    .mt-mt { margin-top: 20px;}
    .text-right { text-align: right; }
    .resend-wrapper { margin-top: 8px; }
    .resend-text { font-size: 0.8rem; color: var(--text-secondary); margin: 0; }
    .resend-link { color: var(--gold-primary); font-weight: 500; text-decoration: none; transition: 0.3s; }
    .resend-link:hover:not(.disabled) { text-decoration: underline; }
    .resend-link.disabled { color: #666; cursor: not-allowed; text-decoration: none; }
  `]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  emailForm!: FormGroup;
  resetForm!: FormGroup;
  
  loading = false;
  otpSent = false;
  resetSuccess = false;
  
  errorMessage = '';
  successMessage = '';
  
  resendCountdown = 60;
  countdownInterval: any;

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: ['', AppValidators.email]
    });

    this.resetForm = this.fb.group({
      code: ['', Validators.required],
      newPassword: ['', AppValidators.password],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.resendCountdown = 60;
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      this.resendCountdown--;
      if (this.resendCountdown <= 0) {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('newPassword')?.value === g.get('confirmPassword')?.value
      ? null : { 'passwordMismatch': true };
  }

  isInvalid(controlName: string, form: FormGroup) {
    const control = form.get(controlName);
    return control && control.invalid && (control.touched || control.dirty);
  }

  // Bước 1
  onSendOtp() {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.sendPasswordResetOtp(this.emailForm.value.email).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.otpSent = true;
          this.startCountdown();
          this.successMessage = 'Mã OTP đã được gửi đến email của bạn.';
          this.errorMessage = '';
        } else {
          this.errorMessage = res.message || 'Lỗi gửi mã OTP. Email có thể chưa đăng ký.';
          this.successMessage = '';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Không tìm thấy tài khoản với email này, vui lòng kiểm tra lại.';
        this.successMessage = '';
        this.loading = false;
      }
    });
  }

  onResendOtp() {
    if (this.resendCountdown > 0) return;
    
    this.errorMessage = '';
    this.successMessage = 'Đang gửi lại mã OTP...';
    
    this.authService.sendPasswordResetOtp(this.emailForm.value.email).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.successMessage = 'Mã OTP mới đã được gửi đến email của bạn.';
          this.startCountdown();
        } else {
          this.errorMessage = res.message || 'Lỗi gửi lại mã OTP.';
          this.successMessage = '';
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Có lỗi xảy ra khi gửi lại OTP.';
        this.successMessage = '';
      }
    });
  }

  // Bước 2
  onResetPassword() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload = {
      email: this.emailForm.value.email,
      code: this.resetForm.value.code,
      newPassword: this.resetForm.value.newPassword
    };

    this.authService.resetPassword(payload).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.resetSuccess = true;
          this.successMessage = 'Đổi mật khẩu thành công! Bạn sẽ được chuyển hướng về đăng nhập trong giây lát...';
          
          // Auto redirect
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2500);
        } else {
          this.errorMessage = res.message || 'Lỗi khôi phục mật khẩu.';
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.';
        this.loading = false;
      }
    });
  }
}
