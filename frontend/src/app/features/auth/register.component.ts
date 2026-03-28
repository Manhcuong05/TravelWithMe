import { Component, inject, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AppValidators } from '../../core/utils/validators';
import { gsap } from 'gsap';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page-wrapper">
      <div class="split-layout">
        <!-- Visual Side -->
        <div class="visual-side" style="background-image: url('/images/auth_bg.png')">
           <div class="visual-overlay"></div>
           <div class="visual-content container">
              <span class="pro-tag-white">MEMBERSHIP</span>
              <h1 class="luxury-font">Khởi Đầu <br><span class="gold-gradient-text">Hành Trình Mới</span></h1>
              <p>Trở thành thành viên của cộng đồng du hành thượng lưu và trải nghiệm sự phục vụ tận tâm từ AI.</p>
           </div>
        </div>

        <!-- Form Side -->
        <div class="form-side">
          <div class="form-scroll-container">
            <div class="form-card-pro animate-form">
               <div class="brand-logo mb-40">
                  <span class="logo-text luxury-font">TravelWithMe</span>
               </div>
               
               <h2 class="luxury-font welcome-title">Đăng Ký <span class="gold-text">Tài Khoản</span></h2>
               <p class="subtitle">Bắt đầu trải nghiệm du lịch cá nhân hóa ngay hôm nay</p>

               <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="auth-form-pro">
                  <div class="floating-group">
                    <input type="text" formControlName="fullName" id="fullName" placeholder=" " required>
                    <label for="fullName">Họ và Tên</label>
                    <div class="err-line" *ngIf="isInvalid('fullName')">
                       <small *ngIf="registerForm.get('fullName')?.errors?.['required']">Họ tên là bắt buộc</small>
                       <small *ngIf="registerForm.get('fullName')?.errors?.['minlength']">Tối thiểu 2 ký tự</small>
                    </div>
                  </div>

                  <div class="floating-group">
                    <input type="email" formControlName="email" id="email" placeholder=" " required>
                    <label for="email">Địa chỉ Email</label>
                    <div class="err-line" *ngIf="isInvalid('email')">
                       <small *ngIf="registerForm.get('email')?.errors?.['required']">Email là bắt buộc</small>
                       <small *ngIf="registerForm.get('email')?.errors?.['email']">Email không hợp lệ</small>
                    </div>
                  </div>

                  <div class="floating-group">
                    <input type="password" formControlName="password" id="password" placeholder=" " required>
                    <label for="password">Mật khẩu</label>
                    <div class="err-line" *ngIf="isInvalid('password')">
                       <small *ngIf="registerForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</small>
                       <small *ngIf="registerForm.get('password')?.errors?.['minlength']">Tối thiểu 8 ký tự</small>
                    </div>
                  </div>

                  <div class="floating-group">
                    <input type="text" formControlName="phone" id="phone" placeholder=" ">
                    <label for="phone">Số điện thoại</label>
                    <div class="err-line" *ngIf="isInvalid('phone')">
                       <small *ngIf="registerForm.get('phone')?.errors?.['pattern']">Số điện thoại không hợp lệ</small>
                    </div>
                  </div>

                  <div *ngIf="errorMessage" class="alert-error">{{ errorMessage }}</div>

                  <button type="submit" class="btn-primary-auth" [disabled]="loading">
                    {{ loading ? 'Đang tạo...' : 'TẠO TÀI KHOẢN' }}
                  </button>
               </form>

               <div class="form-footer mt-40">
                  Đã có tài khoản? <a routerLink="/auth/login" class="gold-text">Đăng nhập ngay</a>
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
    .mb-40 { margin-bottom: 40px; }
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

    .err-line { color: #ef4444; font-size: 0.75rem; margin-top: 4px; height: 15px; }
    .alert-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 8px; margin-bottom: 25px; font-size: 0.85rem; border: 1px solid rgba(239, 68, 68, 0.2); }

    .btn-primary-auth { 
      width: 100%; background: var(--gold-primary); color: #000; border: none; padding: 18px; 
      border-radius: 16px; font-weight: 800; letter-spacing: 2px; cursor: pointer; transition: 0.4s; margin-top: 10px;
    }
    .btn-primary-auth:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3); }
    .btn-primary-auth:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    .form-footer { text-align: center; color: var(--text-muted); font-size: 0.95rem; }

    @media (max-width: 1024px) {
      .split-layout { grid-template-columns: 1fr; }
      .visual-side { display: none; }
      .form-side { height: 100vh; overflow-y: auto; align-items: flex-start; }
    }
  `]
})
export class RegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  registerForm!: FormGroup;
  loading = false;
  errorMessage = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private el = inject(ElementRef);
  private ctx: any;

  ngOnInit() {
    this.registerForm = this.fb.group({
      fullName: ['', AppValidators.fullName],
      email: ['', AppValidators.email],
      password: ['', AppValidators.password],
      phone: ['', AppValidators.phone]
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
