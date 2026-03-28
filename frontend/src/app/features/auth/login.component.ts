import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GoogleSigninButtonModule, SocialAuthService } from '@abacritt/angularx-social-login';
import { AppValidators } from '../../core/utils/validators';
import { gsap } from 'gsap';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, GoogleSigninButtonModule],
  template: `
    <div class="auth-page-wrapper">
      <div class="split-layout">
        <!-- Visual Side -->
        <div class="visual-side" style="background-image: url('/images/auth_bg.png')">
           <div class="visual-overlay"></div>
           <div class="visual-content container">
              <span class="pro-tag-white">PRIVATE JOURNEY</span>
              <h1 class="luxury-font">Kết Nối Với <br><span class="gold-gradient-text">Thế Giới Bản Sắc</span></h1>
              <p>Mỗi lần đăng nhập là một bước chân gần hơn đến hành trình độc bản được thiết kế riêng cho bạn bởi AI.</p>
           </div>
        </div>

        <!-- Form Side -->
        <div class="form-side">
          <div class="form-scroll-container">
            <div class="form-card-pro animate-form">
               <div class="brand-logo mb-40">
                  <span class="logo-text luxury-font">TravelWithMe</span>
               </div>
               
               <h2 class="luxury-font welcome-title">Chào Mừng <span class="gold-text">Trở Lại</span></h2>
               <p class="subtitle">Đăng nhập để bắt đầu hành trình của bạn</p>

               <div class="google-login-section mb-30">
                  <asl-google-signin-button type="standard" size="large" [width]="350" theme="filled_black"></asl-google-signin-button>
               </div>

               <div class="divider"><span>Hoặc tiếp tục với email</span></div>

               <div class="mode-selector mb-30">
                  <button type="button" [class.active]="loginMode === 'PASSWORD'" (click)="setMode('PASSWORD')">Mật Khẩu</button>
                  <button type="button" [class.active]="loginMode === 'OTP'" (click)="setMode('OTP')">Mã OTP</button>
               </div>

               <!-- PASSWORD FORM -->
               <form *ngIf="loginMode === 'PASSWORD'" [formGroup]="loginForm" (ngSubmit)="onLogin()" class="auth-form-pro">
                  <div class="floating-group">
                    <input type="email" formControlName="email" id="email" placeholder=" " required autocomplete="email">
                    <label for="email">Địa chỉ Email</label>
                    <div class="err-line" *ngIf="isInvalid('email')">
                       <small *ngIf="loginForm.get('email')?.errors?.['required']">Email là bắt buộc</small>
                       <small *ngIf="loginForm.get('email')?.errors?.['email']">Email không hợp lệ</small>
                    </div>
                  </div>

                  <div class="floating-group">
                    <input type="password" formControlName="password" id="password" placeholder=" " required autocomplete="current-password">
                    <label for="password">Mật khẩu</label>
                    <div class="err-line" *ngIf="isInvalid('password')">
                       <small *ngIf="loginForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</small>
                    </div>
                  </div>

                  <div class="form-utils mb-30">
                     <a routerLink="/auth/forgot-password" class="gold-link">Quên mật khẩu?</a>
                  </div>

                  <div *ngIf="errorMessage" class="alert-error">{{ errorMessage }}</div>

                  <button type="submit" class="btn-primary-auth" [disabled]="loading">
                    {{ loading ? 'Xác thực...' : 'ĐĂNG NHẬP' }}
                  </button>
               </form>

               <!-- OTP FORM -->
               <form *ngIf="loginMode === 'OTP'" [formGroup]="otpForm" (ngSubmit)="onLoginOtp()" class="auth-form-pro">
                  <div class="floating-group with-action">
                    <input type="email" formControlName="email" id="otp-email" placeholder=" " required autocomplete="email">
                    <label for="otp-email">Địa chỉ Email</label>
                    <button type="button" class="btn-inline" (click)="onSendLoginOtp()" [disabled]="otpLoading || otpSent || !otpForm.get('email')?.valid">
                       {{ otpSent ? 'Đã gửi' : 'Gửi mã' }}
                    </button>
                  </div>
                  <div class="err-line" *ngIf="isOtpInvalid('email')">
                     <small *ngIf="otpForm.get('email')?.errors?.['required']">Email là bắt buộc</small>
                     <small *ngIf="otpForm.get('email')?.errors?.['email']">Email không hợp lệ</small>
                  </div>

                  <div class="floating-group mt-20" *ngIf="otpSent">
                    <input type="text" formControlName="code" id="code" placeholder=" " required maxlength="6">
                    <label for="code">Mã OTP (6 số)</label>
                    <div class="err-line" *ngIf="isOtpInvalid('code')">
                       <small *ngIf="otpForm.get('code')?.errors?.['required']">Mã OTP là bắt buộc</small>
                    </div>
                  </div>

                  <div *ngIf="errorMessage" class="alert-error">{{ errorMessage }}</div>
                  <div *ngIf="successMessage" class="alert-success">{{ successMessage }}</div>

                  <button *ngIf="otpSent" type="submit" class="btn-primary-auth" [disabled]="loading">
                    {{ loading ? 'Xác thực...' : 'ĐĂNG NHẬP' }}
                  </button>
               </form>

               <div class="form-footer mt-40">
                  Chưa có tài khoản? <a routerLink="/auth/register" class="gold-text">Đăng ký ngay</a>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --bg-dark: #0a0a0b; --text-muted: rgba(255,255,255,0.6); }

    .auth-page-wrapper { height: 100vh; background: var(--bg-dark); overflow: hidden; }
    .split-layout { display: grid; grid-template-columns: 1fr 500px; height: 100%; }

    /* Visual Side */
    .visual-side { position: relative; background-size: cover; background-position: center; display: flex; align-items: center; padding: 80px; }
    .visual-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to right, rgba(5,10,20,0.1), rgba(10,10,11,1)); }
    .visual-content { position: relative; z-index: 5; max-width: 600px; }
    .visual-content h1 { font-size: 3.5rem; color: #fff; line-height: 1.2; margin-bottom: 25px; }
    .visual-content p { color: rgba(255,255,255,0.7); font-size: 1.1rem; line-height: 1.6; }
    .pro-tag-white { display: inline-block; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 16px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; letter-spacing: 3px; margin-bottom: 25px; }
    .gold-gradient-text { background: linear-gradient(135deg, #d4af37 0%, #f9e29c 50%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    /* Form Side */
    .form-side { background: var(--bg-dark); color: #fff; display: flex; align-items: center; justify-content: center; position: relative; }
    .form-scroll-container { width: 100%; padding: 40px; }
    .form-card-pro { max-width: 400px; margin: 0 auto; }
    .welcome-title { font-size: 2.2rem; margin-bottom: 15px; }
    .gold-text { color: var(--gold-primary); }
    .subtitle { color: var(--text-muted); margin-bottom: 40px; font-weight: 300; }

    .logo-text { font-size: 1.8rem; color: #fff; }
    .mb-30 { margin-bottom: 30px; }
    .mb-40 { margin-bottom: 40px; }
    .mt-10 { margin-top: 10px; }
    .mt-40 { margin-top: 40px; }

    /* Floating Labels Fix */
    .floating-group { position: relative; margin-bottom: 25px; z-index: 1; }
    .floating-group input { 
      width: 100%; background: transparent !important; border: none; border-bottom: 1px solid rgba(255,255,255,0.1); 
      padding: 30px 0 10px; color: #fff; font-size: 1rem; outline: none; transition: 0.3s;
      position: relative; z-index: 2;
    }
    .floating-group label { 
      position: absolute; left: 0; top: 30px; color: var(--text-muted); 
      transition: 0.3s ease-in-out; pointer-events: none; font-size: 1rem; z-index: 1;
    }
    
    /* Autofill Hack */
    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus {
      -webkit-text-fill-color: #fff !important;
      -webkit-box-shadow: 0 0 0px 1000px #0a0a0b inset !important;
      transition: background-color 5000s ease-in-out 0s;
    }

    .floating-group input:focus + label, 
    .floating-group input:not(:placeholder-shown) + label,
    .floating-group input:-webkit-autofill + label { 
      top: 0px; font-size: 0.75rem; color: var(--gold-primary); letter-spacing: 1px; font-weight: 700;
    }

    .with-action { display: grid; grid-template-columns: 1fr auto; gap: 15px; }
    .btn-inline { background: transparent; border: 1px solid var(--gold-primary); color: var(--gold-primary); border-radius: 8px; padding: 0 15px; cursor: pointer; height: 40px; margin-top: 15px; font-weight: 600; font-size: 0.8rem; }
    .btn-inline:hover:not(:disabled) { background: var(--gold-primary); color: #000; }
    .btn-inline:disabled { opacity: 0.3; cursor: not-allowed; }

    .err-line { color: #ef4444; font-size: 0.75rem; margin-top: -20px; margin-bottom: 15px; }
    .alert-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 25px; font-size: 0.85rem; border: 1px solid rgba(239, 68, 68, 0.2); }
    .alert-success { background: rgba(16, 185, 129, 0.1); color: #10b981; padding: 12px; border-radius: 8px; margin-bottom: 25px; font-size: 0.85rem; border: 1px solid rgba(16, 185, 129, 0.2); }

    .divider { display: flex; align-items: center; margin: 30px 0; color: rgba(255,255,255,0.2); font-size: 0.8rem; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(255,255,255,0.1); }
    .divider span { padding: 0 15px; }

    .mode-selector { display: flex; gap: 10px; padding: 5px; background: rgba(255,255,255,0.03); border-radius: 12px; }
    .mode-selector button { flex: 1; border: none; background: transparent; color: var(--text-muted); padding: 12px; border-radius: 8px; cursor: pointer; transition: 0.3s; font-weight: 600; }
    .mode-selector button.active { background: var(--gold-primary); color: #000; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }

    .btn-primary-auth { 
      width: 100%; background: var(--gold-primary); color: #000; border: none; padding: 18px; 
      border-radius: 16px; font-weight: 800; letter-spacing: 2px; cursor: pointer; transition: 0.4s; margin-top: 10px;
    }
    .btn-primary-auth:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3); }
    .btn-primary-auth:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    .gold-link { color: var(--gold-primary); text-decoration: none; font-size: 0.9rem; transition: 0.3s; }
    .gold-link:hover { text-decoration: underline; }
    .form-footer { text-align: center; color: var(--text-muted); font-size: 0.95rem; }

    @media (max-width: 1024px) {
      .split-layout { grid-template-columns: 1fr; }
      .visual-side { display: none; }
      .form-side { height: 100vh; }
    }
  `]
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  loginForm!: FormGroup;
  otpForm!: FormGroup;
  loading = false;
  otpLoading = false;
  otpSent = false;
  errorMessage = '';
  successMessage = '';
  loginMode: 'PASSWORD' | 'OTP' = 'PASSWORD';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private socialAuthService = inject(SocialAuthService);
  private el = inject(ElementRef);
  private ctx: any;

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', AppValidators.email],
      password: ['', [AppValidators.password[0]]] // Only required for login
    });

    this.otpForm = this.fb.group({
      email: ['', AppValidators.email],
      code: ['']
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

  ngAfterViewInit() {
    this.ctx = gsap.context(() => {
      gsap.from('.visual-side', { scale: 1.1, duration: 2, ease: 'power2.out' });
      gsap.from('.visual-content', { x: -50, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.5 });
      gsap.from('.animate-form', { x: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
    }, this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.ctx) this.ctx.revert();
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

  setMode(mode: 'PASSWORD' | 'OTP') {
    this.loginMode = mode;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Quick GSAP pulse on mode change
    gsap.from('.auth-form-pro', { opacity: 0, y: 10, duration: 0.4 });
  }

  isOtpInvalid(controlName: string) {
    const control = this.otpForm.get(controlName);
    return control && control.invalid && (control.touched || control.dirty);
  }

  onSendLoginOtp() {
    const emailControl = this.otpForm.get('email');
    if (!emailControl || emailControl.invalid) {
      emailControl?.markAsTouched();
      return;
    }

    this.otpLoading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    this.authService.sendLoginOtp(emailControl.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.otpSent = true;
          this.successMessage = 'Mã OTP đã được gửi đến email của bạn.';
          this.otpForm.get('code')?.setValidators([Validators.required]);
          this.otpForm.get('code')?.updateValueAndValidity();
        } else {
          this.errorMessage = res.message || 'Lỗi gửi mã OTP.';
        }
        this.otpLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Có lỗi xảy ra. Hãy kiểm tra lại email của bạn.';
        this.otpLoading = false;
      }
    });
  }

  onLoginOtp() {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    const { email, code } = this.otpForm.value;
    this.authService.loginWithOtp(email, code).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = res.message || 'Đăng nhập bằng OTP thất bại.';
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn.';
        this.loading = false;
      }
    });
  }
}
