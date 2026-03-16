import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

            <div class="form-container">
              <div class="form-group">
                <label>Họ và Tên</label>
                <input type="text" [(ngModel)]="editData.fullName" placeholder="Nhập họ tên...">
              </div>
              
              <div class="form-group">
                <label>Email liên hệ</label>
                <input type="email" [(ngModel)]="editData.email" placeholder="Nhập email...">
              </div>

              <div class="form-group">
                <label>Số điện thoại</label>
                <input type="text" [(ngModel)]="editData.phone" placeholder="Nhập số điện thoại...">
              </div>

              <div class="form-group">
                <label>URL Ảnh đại diện</label>
                <input type="text" [(ngModel)]="editData.avatarUrl" placeholder="Link ảnh của bạn...">
              </div>

              <div class="actions">
                <button (click)="save()" class="btn-gold" [disabled]="saving()">
                  {{ saving() ? 'Đang lưu...' : 'Cập nhật hồ sơ' }}
                </button>
              </div>
            </div>
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

    .form-group { margin-bottom: 25px; }
    .form-group label { display: block; font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; margin-bottom: 8px; letter-spacing: 1px; }
    .form-group input {
      width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border);
      padding: 12px 18px; border-radius: 10px; color: var(--text-primary); outline: none; transition: 0.3s;
    }
    .form-group input:focus { border-color: var(--gold-primary); background: rgba(255,255,255,0.08); }
    
    .btn-gold { width: 100%; padding: 15px; border-radius: 12px; font-weight: 600; font-size: 1rem; }

    @media (max-width: 768px) {
      .profile-card { grid-template-columns: 1fr; gap: 30px; padding: 30px; }
    }
  `]
})
export class ProfileComponent {
    authService = inject(AuthService);
    user = this.authService.currentUser;

    editData = {
        fullName: this.user()?.fullName || '',
        email: this.user()?.email || '',
        phone: this.user()?.phone || '',
        avatarUrl: this.user()?.avatarUrl || ''
    };

    saving = signal(false);

    save() {
        this.saving.set(true);
        this.authService.updateProfile(this.editData).subscribe({
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
