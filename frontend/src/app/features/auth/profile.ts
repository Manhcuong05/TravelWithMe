import { Component, inject, OnInit, signal, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { AppValidators } from '../../core/utils/validators';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="profile-page animate-fade-in">
      <div class="container">
        
        <div class="profile-header-pro glass-pro">
          <!-- Cover Photo Area -->
          <div class="cover-photo">
            <div class="cover-overlay"></div>
          </div>

          <!-- Avatar Section (Facebook Style) -->
          <div class="avatar-center-wrap">
            <div class="avatar-holder">
              <img [src]="user()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + user()?.fullName + '&background=D4AF37&color=fff'" 
                   class="main-avatar">
              
              <button class="avatar-edit-btn" (click)="fileInput.click()" [disabled]="uploading()">
                <i class="fas" [ngClass]="uploading() ? 'fa-spinner fa-spin' : 'fa-camera'"></i>
              </button>
              
              <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" class="hidden">
            </div>
            
            <div class="profile-identity">
              <h1 class="luxury-font">{{ user()?.fullName }}</h1>
              <div class="badge-role">{{ user()?.role }}</div>
            </div>
          </div>
        </div>

        <div class="profile-content-wrap mt-10">
          <div class="glass-pro form-card-pro">
            <div class="card-header-pro">
               <h2 class="luxury-font">Thông Tin Tài Khoản</h2>
               <p>Cập nhật thông tin cá nhân của bạn để nhận được phục vụ tốt nhất.</p>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="save()" class="pro-form">
              <div class="form-row">
                <div class="form-group-pro">
                  <label>Họ và Tên</label>
                  <input type="text" formControlName="fullName" placeholder="VD: Nguyễn Văn A" class="input-pro">
                  <div class="error-msg" *ngIf="isInvalid('fullName')">
                    <small *ngIf="profileForm.get('fullName')?.errors?.['required']">Họ tên không được trống</small>
                    <small *ngIf="profileForm.get('fullName')?.errors?.['minlength']">Tên quá ngắn</small>
                  </div>
                </div>
              </div>

              <div class="form-grid-2">
                <div class="form-group-pro">
                  <label>Email liên hệ</label>
                  <input type="email" formControlName="email" class="input-pro" readonly>
                  <div class="hint">Email không thể thay đổi để bảo mật</div>
                </div>

                <div class="form-group-pro">
                  <label>Số điện thoại</label>
                  <input type="text" formControlName="phone" placeholder="090..." class="input-pro">
                  <div class="error-msg" *ngIf="isInvalid('phone')">
                    <small *ngIf="profileForm.get('phone')?.errors?.['pattern']">Số điện thoại không hợp lệ</small>
                  </div>
                </div>
              </div>

              <div class="form-actions-pro">
                <button type="submit" class="btn-gold-pro w-full" [disabled]="saving() || profileForm.invalid">
                    <i class="fas fa-save mr-2"></i>
                    {{ saving() ? 'Đang lưu hệ thống...' : 'Cập Nhật Hồ Sơ' }}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #FFD700; --bg-card: rgba(15, 23, 42, 0.7); }

    .profile-page { padding: 120px 0 100px; min-height: 100vh; background: #020617; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
    
    .glass-pro { 
      background: var(--bg-card); backdrop-filter: blur(25px); 
      border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; 
      overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
    }

    /* Profile Header - Facebook Style */
    .profile-header-pro { margin-bottom: 40px; }
    .cover-photo { 
      height: 240px; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); 
      position: relative; overflow: hidden;
    }
    .cover-overlay { 
      position: absolute; inset: 0; 
      background: url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=1500') center/cover;
      opacity: 0.3; filter: grayscale(100%);
    }

    .avatar-center-wrap { text-align: center; margin-top: -85px; padding-bottom: 40px; position: relative; }
    .avatar-holder { 
      position: relative; width: 170px; height: 170px; margin: 0 auto 20px; 
      border-radius: 50%; border: 6px solid #020617; box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      background: #1e293b;
    }
    .main-avatar { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; }
    
    .avatar-edit-btn { 
      position: absolute; bottom: 8px; right: 8px; width: 40px; height: 40px; 
      border-radius: 50%; background: #334155; color: #fff; border: none;
      display: flex; align-items: center; justify-content: center; cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: 0.3s;
    }
    .avatar-edit-btn:hover { background: var(--gold-primary); color: #000; transform: scale(1.1); }
    
    .profile-identity h1 { font-size: 2.2rem; color: #fff; margin: 0; }
    .badge-role { 
      display: inline-block; margin-top: 10px; padding: 5px 15px; border-radius: 30px;
      background: rgba(212,175,55,0.1); color: var(--gold-primary); 
      font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px;
    }

    /* Form Content */
    .card-header-pro { padding: 40px 50px 0; }
    .card-header-pro h2 { font-size: 1.5rem; color: #fff; margin: 0; }
    .card-header-pro p { color: #64748b; font-size: 0.9rem; margin-top: 5px; }

    .pro-form { padding: 40px 50px; }
    .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 30px; }
    .form-group-pro { display: flex; flex-direction: column; gap: 10px; }
    .form-group-pro label { font-size: 0.75rem; color: var(--gold-primary); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
    
    .input-pro { 
      background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
      padding: 15px 18px; border-radius: 14px; color: #fff; font-size: 1rem;
      transition: all 0.3s;
    }
    .input-pro:focus { border-color: var(--gold-primary); outline: none; box-shadow: 0 0 0 4px rgba(212,175,55,0.1); }
    .input-pro[readonly] { opacity: 0.6; cursor: not-allowed; }

    .hint { font-size: 0.7rem; color: #475569; font-style: italic; }
    .error-msg { color: #f87171; font-size: 0.75rem; margin-top: 5px; }

    .form-actions-pro { margin-top: 40px; }
    .btn-gold-pro { 
      background: var(--gold-gradient); color: #000; font-weight: 800; 
      padding: 18px; border-radius: 16px; border: none; cursor: pointer;
      transition: 0.3s; box-shadow: 0 10px 20px rgba(212,175,55,0.2);
    }
    .btn-gold-pro:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(212,175,55,0.4); }
    .btn-gold-pro:disabled { opacity: 0.7; cursor: not-allowed; }

    .hidden { display: none; }

    @media (max-width: 768px) {
      .form-grid-2 { grid-template-columns: 1fr; }
      .cover-photo { height: 180px; }
      .pro-form, .card-header-pro { padding: 30px; }
    }
  `]
})
export class ProfileComponent implements OnInit {
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
          // Auto update user profile with new avatar URL
          const updateData = {
            ...this.profileForm.getRawValue(),
            avatarUrl: res.data
          };
          this.authService.updateProfile(updateData).subscribe({
            next: (updateRes) => {
              if (updateRes.success) {
                // Success - the signal will update automatically via tap in service
              }
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
    // Include current avatarUrl when saving text info
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
