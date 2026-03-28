import { Component, inject, OnInit, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AppValidators } from '../../core/utils/validators';
import { gsap } from 'gsap';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="profile-page-promax">
      <div class="container relative z-10">
        
        <!-- Cover & Avatar Section -->
        <div class="profile-hero glass-premium">
          <div class="cover-photo" style="background-image: url('https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&q=80&w=1920')">
            <div class="overlay-lux"></div>
          </div>
          
          <div class="avatar-section">
            <div class="avatar-holder">
              <img [src]="user()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + user()?.fullName + '&background=D4AF37&color=fff'" alt="Avatar" class="avatar-img">
              <button class="btn-edit-avatar" (click)="fileInput.click()" [disabled]="uploading()">
                <i class="fas" [ngClass]="uploading() ? 'fa-spinner fa-spin' : 'fa-camera'"></i>
              </button>
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" class="hidden">
            </div>
            
            <div class="identity-info">
              <h1 class="luxury-font">{{ user()?.fullName }}</h1>
              <span class="role-badge">{{ user()?.role }}</span>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <div class="profile-body mt-40">
          <div class="glass-premium info-card">
            <div class="card-title-group mb-40">
              <span class="pro-label">CÀI ĐẶT CÁ NHÂN</span>
              <h2 class="luxury-font text-3xl">Thông Tin Tài Khoản</h2>
              <p class="text-gray mt-10">Cập nhật thông tin cá nhân của bạn để nhận được phục vụ tốt nhất.</p>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="save()" class="luxury-form">
              <div class="form-grid">
                
                <div class="floating-group form-element">
                  <input type="text" formControlName="fullName" id="fullName" placeholder=" ">
                  <label for="fullName">HỌ VÀ TÊN</label>
                  <i class="fas fa-user input-icon"></i>
                  <div class="error-msg" *ngIf="isInvalid('fullName')">Họ tên không hợp lệ</div>
                </div>

                <div class="floating-group readonly-group form-element">
                  <input type="email" formControlName="email" id="email" placeholder=" " readonly>
                  <label for="email">EMAIL LIÊN HỆ</label>
                  <i class="fas fa-envelope input-icon"></i>
                  <div class="hint-text text-mobile-mt">Email không thể thay đổi để bảo mật</div>
                </div>

                <div class="floating-group form-element">
                  <input type="text" formControlName="phone" id="phone" placeholder=" ">
                  <label for="phone">SỐ ĐIỆN THOẠI</label>
                  <i class="fas fa-phone input-icon"></i>
                  <div class="error-msg text-mobile-mt" *ngIf="isInvalid('phone')">Số điện thoại không hợp lệ</div>
                </div>

              </div>

              <div class="action-row mt-50 form-element">
                <button type="submit" class="btn-luxury-lg w-full" [disabled]="saving() || profileForm.invalid">
                  <span>{{ saving() ? 'ĐANG LƯU HỆ THỐNG...' : 'CẬP NHẬT HỒ SƠ' }}</span>
                  <i class="fas fa-arrow-right ml-10"></i>
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-gradient: linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%); }
    .profile-page-promax { min-height: 100vh; background: #020617; padding: 120px 0 100px; color: #fff; overflow-x: hidden; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
    
    .glass-premium { 
      background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(25px); 
      border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; 
      box-shadow: 0 25px 50px rgba(0,0,0,0.5); overflow: hidden;
    }

    .profile-hero { position: relative; }
    .cover-photo { height: 280px; background-size: cover; background-position: center; position: relative; }
    .overlay-lux { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 20%, #020617 100%); opacity: 0.8; }
    
    .avatar-section { display: flex; flex-direction: column; align-items: center; margin-top: -120px; padding-bottom: 50px; position: relative; z-index: 10; }
    
    .avatar-holder { position: relative; width: 190px; height: 190px; border-radius: 50%; padding: 6px; background: var(--gold-gradient); box-shadow: 0 15px 35px rgba(0,0,0,0.5); }
    .avatar-img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; border: 6px solid #020617; }
    
    .btn-edit-avatar {
      position: absolute; bottom: 8px; right: 8px; width: 50px; height: 50px;
      border-radius: 50%; background: #1e293b; color: var(--gold-primary); border: 2px solid var(--gold-primary);
      display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-size: 1.2rem; box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
    }
    .btn-edit-avatar:hover { background: var(--gold-primary); color: #000; transform: scale(1.15) rotate(10deg); }
    
    .identity-info { text-align: center; margin-top: 25px; }
    .identity-info h1 { font-size: 2.8rem; margin-bottom: 12px; text-shadow: 0 5px 15px rgba(0,0,0,0.5); }
    .role-badge { 
      background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3);
      color: var(--gold-primary); padding: 8px 25px; border-radius: 30px;
      font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
    }

    .info-card { padding: 50px 70px; }
    .pro-label { font-size: 0.75rem; font-weight: 800; letter-spacing: 3px; color: var(--gold-primary); margin-bottom: 15px; display: block; }
    .text-3xl { font-size: 2.4rem; margin: 0; color: #fff; }
    .text-gray { color: #94a3b8; font-size: 1.05rem; }
    .mt-10 { margin-top: 10px; }
    .mb-40 { margin-bottom: 40px; }
    .mt-40 { margin-top: 40px; }
    .mt-50 { margin-top: 50px; }
    
    .form-grid { display: flex; flex-direction: column; gap: 30px; }
    
    .floating-group { position: relative; }
    .floating-group input {
      width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1);
      padding: 28px 20px 12px 60px; color: #fff; font-size: 1.15rem; border-radius: 18px;
      transition: 0.4s; outline: none; box-sizing: border-box;
    }
    .floating-group label {
      position: absolute; left: 60px; top: 22px; color: rgba(255,255,255,0.4);
      font-size: 0.85rem; font-weight: 700; letter-spacing: 1px;
      pointer-events: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .input-icon { position: absolute; left: 24px; top: 24px; color: var(--gold-primary); font-size: 1.2rem; opacity: 0.7; }
    
    .floating-group input:focus { border-color: var(--gold-primary); background: rgba(212, 175, 55, 0.05); box-shadow: 0 0 20px rgba(212, 175, 55, 0.1); }
    .floating-group input:focus + label, .floating-group input:not(:placeholder-shown) + label {
      top: 10px; font-size: 0.65rem; color: var(--gold-primary);
    }
    
    .readonly-group input { opacity: 0.6; cursor: not-allowed; }
    .hint-text { position: absolute; right: 24px; top: 24px; font-size: 0.8rem; color: #64748b; font-style: italic; }
    .error-msg { position: absolute; right: 24px; top: 24px; color: #f87171; font-size: 0.8rem; font-weight: 600; }
    
    .btn-luxury-lg { 
      background: var(--gold-gradient); color: #000; padding: 24px; 
      border-radius: 20px; border: none; font-weight: 900; letter-spacing: 2px;
      font-size: 1rem; cursor: pointer; transition: 0.4s;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3);
    }
    .btn-luxury-lg:hover:not(:disabled) { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(212, 175, 55, 0.5); }
    .btn-luxury-lg:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; filter: grayscale(1); }
    
    .w-full { width: 100%; }
    .ml-10 { margin-left: 10px; }
    .hidden { display: none; }

    @media (max-width: 768px) {
      .info-card { padding: 40px 25px; }
      .avatar-holder { width: 140px; height: 140px; margin-top: 20px; }
      .cover-photo { height: 200px; }
      .hint-text, .error-msg { position: static; display: block; margin-top: 10px; margin-left: 15px; }
      .text-mobile-mt { margin-top: 10px; }
      .floating-group input { padding: 28px 20px 12px 50px; font-size: 1rem; }
      .floating-group label { left: 50px; }
      .input-icon { left: 20px; top: 26px; }
    }
  `]
})
export class ProfileComponent implements OnInit, AfterViewInit {
  profileForm!: FormGroup;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  user = this.authService.currentUser;
  saving = signal(false);
  uploading = signal(false);

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: [this.user()?.fullName || '', AppValidators.fullName],
      email: [this.user()?.email || '', AppValidators.email],
      phone: [this.user()?.phone || '', AppValidators.phone]
    });
  }

  ngAfterViewInit() {
    // GSAP Pro Max Animations
    setTimeout(() => {
      gsap.from('.cover-photo', { duration: 1.5, scale: 1.1, opacity: 0, ease: 'power3.out' });
      gsap.from('.avatar-holder', { duration: 1.2, y: 60, opacity: 0, delay: 0.3, ease: 'back.out(1.5)' });
      gsap.from('.identity-info', { duration: 1, y: 30, opacity: 0, delay: 0.5, ease: 'power3.out' });
      gsap.from('.info-card', { duration: 1, y: 50, opacity: 0, delay: 0.6, ease: 'power4.out' });
      gsap.from('.form-element', { duration: 0.8, x: -30, opacity: 0, stagger: 0.15, delay: 0.8, ease: 'power3.out' });
    }, 100);
  }

  isInvalid(controlName: string) {
    const control = this.profileForm.get(controlName);
    return control && control.invalid && (control.touched || control.dirty);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading.set(true);
    this.authService.uploadAvatar(file).subscribe({
      next: (res) => {
        if (res.success) {
          const updateData = {
            ...this.profileForm.getRawValue(),
            avatarUrl: res.data
          };
          this.authService.updateProfile(updateData).subscribe({
            next: (updateRes) => {
              this.uploading.set(false);
            },
            error: () => this.uploading.set(false)
          });
        } else {
          this.uploading.set(false);
        }
      },
      error: (err) => {
        console.error('Lỗi upload', err);
        this.uploading.set(false);
      }
    });
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const updateData = {
        ...this.profileForm.value,
        avatarUrl: this.user()?.avatarUrl
    };

    this.authService.updateProfile(updateData).subscribe({
      next: (res) => {
        if (res.success) {
          alert('Hồ sơ của bạn đã được cập nhật thành công!');
        }
        this.saving.set(false);
      },
      error: () => this.saving.set(false)
    });
  }
}
