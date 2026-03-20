import { Component, inject, OnInit, signal } from '@angular/core';
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
        <div class="page-header">
          <h1 class="luxury-font">Hồ Sơ Cá Nhân</h1>
          <p>Quản lý thông tin và trải nghiệm độc bản của bạn.</p>
        </div>

        <div class="profile-grid">
          <div class="profile-card glass-effect">
            <div class="avatar-section">
              <div class="avatar-container">
                <img [src]="user()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + user()?.fullName + '&background=D4AF37&color=fff'" 
                     class="large-avatar">
                <div class="avatar-overlay">
                  <span>Thay đổi ảnh</span>
                </div>
              </div>
              <h2 class="luxury-font">{{ user()?.fullName }}</h2>
              <span class="role-badge">{{ user()?.role }}</span>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="save()" class="form-container">
              <div class="form-group">
                <label>Họ và Tên</label>
                <input type="text" formControlName="fullName" placeholder="Nhập họ tên...">
                <div class="error-msg text-left" *ngIf="isInvalid('fullName')">
                  <small *ngIf="profileForm.get('fullName')?.errors?.['required']">Họ và tên không được để trống</small>
                  <small *ngIf="profileForm.get('fullName')?.errors?.['minlength']">Họ và tên ít nhất 2 ký tự</small>
                </div>
              </div>
              
              <div class="form-group">
                <label>Email liên hệ</label>
                <input type="email" formControlName="email" placeholder="Nhập email...">
                <div class="error-msg text-left" *ngIf="isInvalid('email')">
                  <small *ngIf="profileForm.get('email')?.errors?.['required']">Email không được để trống</small>
                  <small *ngIf="profileForm.get('email')?.errors?.['email']">Email không đúng định dạng</small>
                </div>
              </div>

              <div class="form-group">
                <label>Số điện thoại</label>
                <input type="text" formControlName="phone" placeholder="Nhập số điện thoại...">
                <div class="error-msg text-left" *ngIf="isInvalid('phone')">
                  <small *ngIf="profileForm.get('phone')?.errors?.['pattern']">Số điện thoại không hợp lệ</small>
                </div>
              </div>

              <div class="form-group">
                <label>URL Ảnh đại diện</label>
                <input type="text" formControlName="avatarUrl" placeholder="Link ảnh của bạn...">
              </div>

              <div class="actions">
                <button type="submit" class="btn-gold" [disabled]="saving() || profileForm.invalid">
                  {{ saving() ? 'Đang lưu...' : 'Cập nhật hồ sơ' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .profile-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 800px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 50px; }
    .page-header h1 { font-size: 3rem; margin-bottom: 10px; }
    .profile-card { padding: 50px; border-radius: 30px; display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; align-items: start; }
    .avatar-section { text-align: center; }
    .avatar-container { 
      position: relative; width: 180px; height: 180px; margin: 0 auto 25px; 
      border-radius: 50%; overflow: hidden; border: 3px solid var(--gold-primary); 
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }
    .large-avatar { width: 100%; height: 100%; object-fit: cover; }
    .avatar-overlay {
      position: absolute; inset: 0; background: rgba(0,0,0,0.6); color: white;
      display: flex; align-items: center; justify-content: center; font-size: 0.8rem;
      opacity: 0; transition: 0.3s; cursor: pointer;
    }
    .avatar-container:hover .avatar-overlay { opacity: 1; }
    .role-badge { 
      display: inline-block; padding: 4px 12px; background: rgba(212,175,55,0.1); 
      color: var(--gold-primary); font-size: 0.7rem; font-weight: 700; border-radius: 4px;
      text-transform: uppercase; letter-spacing: 1px; margin-top: 10px;
    }
    .form-group { margin-bottom: 25px; position: relative; }
    .form-group label { display: block; font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
    .form-group input {
      width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
      padding: 12px 18px; border-radius: 10px; color: var(--text-primary); outline: none; transition: 0.3s;
    }
    .form-group input:focus { border-color: var(--gold-primary); background: rgba(255,255,255,0.08); }
    .btn-gold { width: 100%; padding: 15px; border-radius: 12px; font-weight: 600; font-size: 1rem; }
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 4px; display: block; }
    @media (max-width: 768px) {
      .profile-card { grid-template-columns: 1fr; gap: 30px; padding: 30px; }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  authService = inject(AuthService);
  fb = inject(FormBuilder);
  user = this.authService.currentUser;
  saving = signal(false);

  ngOnInit() {
    this.profileForm = this.fb.group({
      fullName: [this.user()?.fullName || '', AppValidators.fullName],
      email: [this.user()?.email || '', AppValidators.email],
      phone: [this.user()?.phone || '', AppValidators.phone],
      avatarUrl: [this.user()?.avatarUrl || '']
    });
  }

  isInvalid(controlName: string) {
    const control = this.profileForm.get(controlName);
    return control && control.invalid && (control.touched || control.dirty);
  }

  save() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.authService.updateProfile(this.profileForm.value).subscribe({
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
