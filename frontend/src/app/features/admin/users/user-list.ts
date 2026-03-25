import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { AdminService } from '../../../core/services/admin.service';
import { AppValidators } from '../../../core/utils/validators';
import { User } from '../../../data/models/auth.model';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-info">
          <h1 class="luxury-font">Quản lý Người dùng</h1>
          <p class="subtitle">Quản lý danh sách thành viên và cộng tác viên hệ thống</p>
        </div>
        <button class="btn-gold shadow-gold" (click)="openCreateModal()">
          <span class="plus">+</span> Tạo CTV mới
        </button>
      </div>
 
      <div class="table-card glass-effect animate-in">
        <table class="admin-table">
          <thead>
            <tr>
              <th>THÀNH VIÊN</th>
              <th>LIÊN HỆ</th>
              <th>VAI TRÒ</th>
              <th>NGÀY TẠO</th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users()" class="table-row">
              <td>
                <div class="user-cell">
                  <div class="user-avatar gold-gradient">{{ user.fullName.charAt(0) }}</div>
                  <div class="user-details">
                    <span class="user-name">{{ user.fullName }}</span>
                    <span class="user-id">ID: {{ user.id.substring(0,8) }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="contact-cell">
                  <div class="email">{{ user.email }}</div>
                  <div class="phone" *ngIf="user.phone">{{ user.phone }}</div>
                </div>
              </td>
              <td>
                <span class="role-chip" [class]="user.role">{{ user.role }}</span>
              </td>
              <td>
                <span class="date-text">{{ (user.createdAt | date:'dd/MM/yyyy') || 'N/A' }}</span>
              </td>
              <td class="text-right">
                <div class="row-actions">
                  <button class="action-btn edit" 
                          (click)="openEditModal(user)" 
                          *ngIf="user.role !== 'ADMIN'"
                          title="Chỉnh sửa">
                    ✏️
                  </button>
                  <button class="action-btn delete" 
                          (click)="deleteUser(user)" 
                          *ngIf="user.role !== 'ADMIN'"
                          title="Xóa tài khoản">
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
            <tr *ngIf="users().length === 0">
              <td colspan="5" class="empty-state">
                <div class="empty-icon">👥</div>
                <p>Chưa có người dùng nào được tìm thấy.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
 
    <!-- Create CTV Modal -->
    <div class="modal-overlay" *ngIf="showCreateModal()" (click)="showCreateModal.set(false)">
      <div class="modal-card glass-effect stop-propagation" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="luxury-font">Tạo tài khoản CTV</h2>
          <button class="close-modal" (click)="showCreateModal.set(false)">✕</button>
        </div>
        
        <form [formGroup]="ctvForm" (ngSubmit)="createCTV()" class="ctv-form">
          <div class="form-grid">
            <div class="form-group full">
              <label>Họ và tên</label>
              <input type="text" formControlName="fullName" placeholder="VD: Nguyễn Văn A">
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" formControlName="email" placeholder="email@example.com">
            </div>
            <div class="form-group">
              <label>Số điện thoại</label>
              <input type="text" formControlName="phone" placeholder="VD: 0912345678">
              <div class="error-msg" *ngIf="ctvForm.get('phone')?.touched && ctvForm.get('phone')?.errors">
                <small *ngIf="ctvForm.get('phone')?.errors?.['required']">Số điện thoại là bắt buộc</small>
                <small *ngIf="ctvForm.get('phone')?.errors?.['pattern']">SĐT phải gồm 10 chữ số</small>
              </div>
            </div>
            <div class="form-group full">
              <label>Mật khẩu</label>
              <input type="password" formControlName="password" placeholder="Min 8 ký tự, 1 hoa, 1 số, 1 đặt biệt">
              <div class="error-msg" *ngIf="ctvForm.get('password')?.touched && ctvForm.get('password')?.errors">
                <small *ngIf="ctvForm.get('password')?.errors?.['required']">Mật khẩu là bắt buộc</small>
                <small *ngIf="ctvForm.get('password')?.errors?.['minlength']">Tối thiểu 8 ký tự</small>
                <small *ngIf="ctvForm.get('password')?.errors?.['pattern']">Phải có chữ hoa, số và ký tự đặc biệt</small>
              </div>
            </div>
          </div>

          <div class="global-error" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>
 
          <div class="modal-footer">
            <button type="button" class="btn-outline" (click)="showCreateModal.set(false)">Hủy bỏ</button>
            <button type="submit" class="btn-gold" [disabled]="ctvForm.invalid || loading()">
              {{ loading() ? 'Đang khởi tạo...' : 'Xác nhận tạo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit User Modal -->
    <div class="modal-overlay" *ngIf="showEditModal()" (click)="showEditModal.set(false)">
      <div class="modal-card glass-effect stop-propagation" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="luxury-font">Chỉnh sửa thông tin</h2>
          <button class="close-modal" (click)="showEditModal.set(false)">✕</button>
        </div>
        
        <form [formGroup]="editForm" (ngSubmit)="updateUser()" class="ctv-form">
          <div class="form-grid">
            <div class="form-group full">
              <label>Họ và tên</label>
              <input type="text" formControlName="fullName" placeholder="VD: Nguyễn Văn A">
              <div class="error-msg" *ngIf="editForm.get('fullName')?.touched && editForm.get('fullName')?.errors">
                <small *ngIf="editForm.get('fullName')?.errors?.['required']">Họ tên là bắt buộc</small>
                <small *ngIf="editForm.get('fullName')?.errors?.['minlength']">Tối thiểu 2 ký tự</small>
              </div>
            </div>
            <div class="form-group">
                <label>Email (Chỉ xem)</label>
                <input type="text" [value]="selectedUser()?.email" disabled class="disabled-input">
            </div>
            <div class="form-group">
                <label>Vai trò (Chỉ xem)</label>
                <input type="text" [value]="selectedUser()?.role" disabled class="disabled-input">
            </div>
          </div>

          <div class="global-error" *ngIf="errorMessage()">
            {{ errorMessage() }}
          </div>
 
          <div class="modal-footer">
            <button type="button" class="btn-outline" (click)="showEditModal.set(false)">Hủy bỏ</button>
            <button type="submit" class="btn-gold" [disabled]="editForm.invalid || loading()">
              {{ loading() ? 'Đang cập nhật...' : 'Lưu thay đổi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .page-container { animation: fadeIn 0.5s ease; }
    .page-header { margin-bottom: 35px; display: flex; justify-content: space-between; align-items: flex-end; }
    .page-header h1 { color: var(--gold-primary); font-size: 2rem; margin-bottom: 5px; }
    .subtitle { color: #64748b; font-size: 0.9rem; }
 
    .table-card { padding: 5px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; background: rgba(255,255,255,0.02); }
    .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .admin-table th { text-align: left; padding: 20px 24px; color: #475569; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
    .admin-table td { padding: 18px 24px; vertical-align: middle; }
    
    .table-row { transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.02); }
    .table-row:hover { background: rgba(255,255,255,0.03); transform: scale(1.002); }
 
    .user-cell { display: flex; align-items: center; gap: 15px; }
    .user-avatar { width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: #000; font-size: 1.1rem; }
    .gold-gradient { background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary)); }
    .user-details { display: flex; flex-direction: column; }
    .user-name { font-weight: 600; color: #f1f5f9; font-size: 0.95rem; }
    .user-id { font-size: 0.7rem; color: #475569; }
 
    .contact-cell .email { color: #94a3b8; font-size: 0.9rem; }
    .contact-cell .phone { color: #475569; font-size: 0.8rem; margin-top: 2px; }
 
    .role-chip { padding: 4px 12px; border-radius: 8px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.5px; border: 1px solid transparent; }
    .role-chip.ADMIN { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.2); }
    .role-chip.CTV { background: rgba(59, 130, 246, 0.1); color: #3b82f6; border-color: rgba(59, 130, 246, 0.2); }
    .role-chip.TRAVELER { background: rgba(148, 163, 184, 0.1); color: #94a3b8; border-color: rgba(148, 163, 184, 0.2); }
 
    .date-text { font-size: 0.85rem; color: #64748b; }
    .text-right { text-align: right; }
 
    .row-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .action-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.9rem; }
    .action-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
    .action-btn.delete:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }
 
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card { width: 100%; max-width: 550px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: #0a0a0c; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    
    .modal-header { padding: 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .modal-header h2 { margin: 0; color: var(--gold-primary); font-size: 1.5rem; }
    .close-modal { background: none; border: none; color: #475569; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
    .close-modal:hover { color: #f1f5f9; }
 
    .ctv-form { padding: 30px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group.full { grid-column: span 2; }
    .form-group label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 8px; text-transform: uppercase; font-weight: 700; }
    .form-group input { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px; color: white; outline: none; transition: all 0.3s; }
    .form-group input:focus { border-color: var(--gold-primary); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1); }
 
    .modal-footer { display: flex; gap: 12px; margin-top: 35px; justify-content: flex-end; }
    .modal-footer button { padding: 12px 28px; border-radius: 14px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }
 
    .empty-state { text-align: center; padding: 80px 0; color: #475569; }
    .empty-icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.3; }
 
    .global-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 12px; border-radius: 10px; margin-top: 20px; font-size: 0.85rem; text-align: center; border: 1px solid rgba(239, 68, 68, 0.2); }
    .error-msg { color: #ef4444; font-size: 0.7rem; margin-top: 4px; }
    .disabled-input { opacity: 0.6; cursor: not-allowed; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-gold { box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.3); }
  `]
})
export class UserListComponent implements OnInit {
    private adminService = inject(AdminService);
    private fb = inject(FormBuilder);

    users = signal<User[]>([]);
    showCreateModal = signal(false);
    showEditModal = signal(false);
    selectedUser = signal<User | null>(null);
    loading = signal(false);
    errorMessage = signal<string | null>(null);
 
    ctvForm = this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', AppValidators.email],
        phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
        password: ['', AppValidators.password]
    });

    editForm = this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]]
    });
 
    ngOnInit() {
        this.loadUsers();
    }
 
    loadUsers() {
        this.adminService.getAllUsers().subscribe(res => {
            if (res.success) this.users.set(res.data);
        });
    }
 
    openCreateModal() {
        this.ctvForm.reset();
        this.errorMessage.set(null);
        this.showCreateModal.set(true);
    }
 
    createCTV() {
        if (this.ctvForm.invalid) {
            this.ctvForm.markAllAsTouched();
            return;
        }
 
        this.loading.set(true);
        this.errorMessage.set(null);

        this.adminService.createCTV(this.ctvForm.value).subscribe({
            next: (res) => {
                if (res.success) {
                    this.loadUsers();
                    this.showCreateModal.set(false);
                }
            },
            error: (err) => {
                console.error('Error creating CTV:', err);
                const msg = err.error?.message || 'Có lỗi xảy ra khi tạo tài khoản CTV.';
                this.errorMessage.set(msg);
            },
            complete: () => this.loading.set(false)
        });
    }

    openEditModal(user: User) {
        this.selectedUser.set(user);
        this.editForm.patchValue({
            fullName: user.fullName
        });
        this.errorMessage.set(null);
        this.showEditModal.set(true);
    }

    updateUser() {
        if (this.editForm.invalid || !this.selectedUser()) return;

        this.loading.set(true);
        this.errorMessage.set(null);

        const request = {
            ...this.selectedUser(),
            fullName: this.editForm.value.fullName
        };

        this.adminService.updateUser(this.selectedUser()!.id, request).subscribe({
            next: (res) => {
                if (res.success) {
                    this.loadUsers();
                    this.showEditModal.set(false);
                }
            },
            error: (err) => {
                console.error('Error updating user:', err);
                this.errorMessage.set(err.error?.message || 'Có lỗi xảy ra khi cập nhật.');
            },
            complete: () => this.loading.set(false)
        });
    }
 
    deleteUser(user: User) {
        if (confirm(`Bạn có chắc muốn xóa người dùng ${user.fullName}?`)) {
            this.adminService.deleteUser(user.id).subscribe(res => {
                if (res.success) this.loadUsers();
            });
        }
    }
}
