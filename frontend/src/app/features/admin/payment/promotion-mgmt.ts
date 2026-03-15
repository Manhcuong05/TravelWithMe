import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { PaymentService, Promotion } from '../../../core/services/payment.service';

@Component({
    selector: 'app-promotion-mgmt',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    providers: [DatePipe, DecimalPipe],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-info">
          <h1 class="luxury-font">Quản lý Khuyến Mãi</h1>
          <p class="subtitle">Thiết lập và quản lý các chiến dịch mã giảm giá trên toàn hệ thống.</p>
        </div>
        <div class="header-actions">
          <button class="btn-gold shadow-gold" (click)="openForm()">
            <span class="plus">+</span> Thêm Mã Mới
          </button>
        </div>
      </div>

      <div class="table-card glass-effect animate-in">
        <table class="admin-table">
          <thead>
            <tr>
              <th>MÃ CODE</th>
              <th>MÔ TẢ</th>
              <th>MỨC GIẢM</th>
              <th>THỜI HẠN</th>
              <th>ĐÃ DÙNG</th>
              <th>TRẠNG THÁI</th>
              <th class="text-right">THAO TÁC</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let promo of promotions()" class="table-row">
              <td><span class="code-badge">{{ promo.code }}</span></td>
              <td><div class="text-truncate" style="max-width: 200px;" [title]="promo.description">{{ promo.description }}</div></td>
              <td>
                <div class="discount-info">
                  <span class="percent">-{{ promo.discountPercent }}%</span>
                  <span class="max-amount">Tối đa {{ promo.maxDiscountAmount | number }}đ</span>
                </div>
              </td>
              <td>
                <div class="date-info">
                  <span>Từ: {{ promo.validFrom | date:'dd/MM/yyyy HH:mm' }}</span>
                  <span>Đến: {{ promo.validTo | date:'dd/MM/yyyy HH:mm' }}</span>
                </div>
              </td>
              <td>
                <div class="usage-info" [class.danger]="promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit">
                  {{ promo.usedCount }} / {{ promo.usageLimit > 0 ? promo.usageLimit : '∞' }}
                </div>
              </td>
              <td>
                <span class="status-badge" [class.active]="promo.active && isNotExpired(promo.validTo)" [class.inactive]="!promo.active || !isNotExpired(promo.validTo)">
                  {{ !promo.active ? 'Đã tắt' : (isNotExpired(promo.validTo) ? 'Đang chạy' : 'Hết hạn') }}
                </span>
              </td>
              <td class="text-right">
                <div class="row-actions">
                  <button class="action-btn edit" title="Chỉnh sửa" (click)="openForm(promo)">✏️</button>
                  <button class="action-btn delete" title="Xóa" (click)="deletePromo(promo)">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="promotions().length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-icon">🎟️</div>
                <p>Chưa có mã khuyến mãi nào trong hệ thống.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Form Modal -->
    <div class="modal-overlay" *ngIf="showForm()" (click)="showForm.set(false)">
      <div class="modal-card glass-effect stop-propagation" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="luxury-font">{{ editingPromo() ? 'Sửa Mã Khuyến Mãi' : 'Thêm Mã Mới' }}</h2>
          <button class="close-modal" (click)="showForm.set(false)">✕</button>
        </div>
        
        <form [formGroup]="promoForm" (ngSubmit)="savePromo()" class="promo-form">
          <div class="form-grid">
            <div class="form-group full">
              <label>Mã Code (Chữ in hoa, số)</label>
              <input type="text" formControlName="code" placeholder="VD: SUMMER2026" style="text-transform: uppercase;">
              <div class="error-msg" *ngIf="promoForm.get('code')?.touched && promoForm.get('code')?.invalid">Mã code không được để trống</div>
            </div>

            <div class="form-group full">
              <label>Mô tả chiến dịch</label>
              <textarea formControlName="description" rows="2" placeholder="Chương trình tri ân khách hàng..."></textarea>
            </div>
            
            <div class="form-group">
              <label>Phần trăm giảm (%)</label>
              <input type="number" formControlName="discountPercent" min="0" max="100" placeholder="VD: 10">
            </div>
            
            <div class="form-group">
              <label>Giảm tối đa (VNĐ)</label>
              <input type="number" formControlName="maxDiscountAmount" min="0" placeholder="VD: 500000">
            </div>

            <div class="form-group">
              <label>Thời gian bắt đầu</label>
              <input type="datetime-local" formControlName="validFrom">
            </div>
            <div class="form-group">
              <label>Thời gian kết thúc</label>
              <input type="datetime-local" formControlName="validTo">
            </div>

            <div class="form-group">
              <label>Giới hạn số lần dùng (0 = Không giới hạn)</label>
              <input type="number" formControlName="usageLimit" min="0">
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-container">
                <input type="checkbox" formControlName="active">
                <span class="checkmark"></span>
                Kích hoạt mã chạy ngay
              </label>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-outline" (click)="showForm.set(false)">Hủy bỏ</button>
            <button type="submit" class="btn-gold" [disabled]="promoForm.invalid || loading()">
              {{ loading() ? 'Đang lưu...' : 'Lưu Mã Khuyến Mãi' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .page-container { animation: fadeIn 0.5s ease; }
    .page-header { margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .page-header h1 { color: var(--gold-primary); font-size: 2rem; margin-bottom: 5px; }
    .subtitle { color: #64748b; font-size: 0.9rem; }

    .table-card { padding: 5px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; background: rgba(255,255,255,0.02); }
    .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .admin-table th { text-align: left; padding: 20px 24px; color: #475569; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
    .admin-table td { padding: 18px 24px; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.02); }
    
    .table-row { transition: all 0.2s; }
    .table-row:hover { background: rgba(255,255,255,0.03); transform: scale(1.002); }

    .code-badge { background: rgba(212, 175, 55, 0.15); border: 1px dashed var(--gold-primary); color: var(--gold-primary); padding: 6px 12px; border-radius: 8px; font-family: monospace; font-size: 1.1rem; font-weight: 700; letter-spacing: 2px; }
    .text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #cbd5e1; font-size: 0.85rem; }
    
    .discount-info { display: flex; flex-direction: column; }
    .percent { font-weight: 800; color: #10b981; font-size: 1.1rem; }
    .max-amount { font-size: 0.7rem; color: #94a3b8; }

    .date-info { display: flex; flex-direction: column; gap: 4px; font-size: 0.8rem; color: #e2e8f0; }

    .usage-info { font-weight: 600; color: #38bdf8; background: rgba(56, 189, 248, 0.1); padding: 4px 10px; border-radius: 12px; display: inline-block; font-size: 0.85rem; }
    .usage-info.danger { color: #ef4444; background: rgba(239, 68, 68, 0.1); }

    .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .status-badge.active { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .status-badge.inactive { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

    .text-right { text-align: right; }
    .row-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .action-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.9rem; }
    .action-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
    .action-btn.delete:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }

    /* Modal Styles */
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card { width: 100%; max-width: 600px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: #0a0a0c; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    
    .modal-header { padding: 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .modal-header h2 { margin: 0; color: var(--gold-primary); font-size: 1.5rem; }
    .close-modal { background: none; border: none; color: #475569; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
    .close-modal:hover { color: #f1f5f9; }

    .promo-form { padding: 30px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group.full { grid-column: span 2; }
    .form-group label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 8px; text-transform: uppercase; font-weight: 700; }
    .form-group input, .form-group textarea { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px; color: white; outline: none; transition: all 0.3s; font-family: inherit; }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--gold-primary); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1); }
    
    .error-msg { color: #ef4444; font-size: 0.75rem; margin-top: 5px; }

    .checkbox-group { display: flex; align-items: flex-end; padding-bottom: 10px; }
    .checkbox-container { display: flex; align-items: center; gap: 10px; cursor: pointer; user-select: none; color: #e2e8f0; font-size: 0.9rem; text-transform: none !important; }
    .checkbox-container input { display: none; }
    .checkmark { width: 24px; height: 24px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .checkbox-container input:checked ~ .checkmark { background: var(--gold-primary); border-color: var(--gold-primary); }
    .checkbox-container input:checked ~ .checkmark::after { content: '✓'; color: #000; font-weight: 900; }

    .modal-footer { display: flex; gap: 12px; margin-top: 35px; justify-content: flex-end; }
    .modal-footer button { padding: 12px 28px; border-radius: 14px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }

    .empty-state { text-align: center; padding: 60px 0; color: #475569; }
    .empty-icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.3; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-gold { box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.3); }
  `]
})
export class PromotionMgmtComponent implements OnInit {
    private paymentService = inject(PaymentService);
    private fb = inject(FormBuilder);

    promotions = signal<Promotion[]>([]);
    showForm = signal(false);
    editingPromo = signal<Promotion | null>(null);
    loading = signal(false);

    promoForm = this.fb.group({
        code: ['', Validators.required],
        description: [''],
        discountPercent: [0, [Validators.min(0), Validators.max(100)]],
        maxDiscountAmount: [0, Validators.min(0)],
        validFrom: ['', Validators.required],
        validTo: ['', Validators.required],
        usageLimit: [0, Validators.min(0)],
        active: [true]
    });

    ngOnInit() {
        this.loadPromotions();
    }

    loadPromotions() {
        this.paymentService.getPromotions().subscribe({
            next: (res) => {
                if (res.success) this.promotions.set(res.data);
            }
        });
    }

    isNotExpired(dateString: string): boolean {
        return new Date(dateString) > new Date();
    }

    openForm(promo?: Promotion) {
        if (promo) {
            this.editingPromo.set(promo);
            this.promoForm.patchValue({
                code: promo.code,
                description: promo.description,
                discountPercent: promo.discountPercent,
                maxDiscountAmount: promo.maxDiscountAmount,
                validFrom: promo.validFrom.substring(0, 16), // datetime-local expects YYYY-MM-DDThh:mm
                validTo: promo.validTo.substring(0, 16),
                usageLimit: promo.usageLimit,
                active: promo.active
            });
        } else {
            this.editingPromo.set(null);

            // Default dates
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            const nextWeek = new Date(now);
            nextWeek.setDate(nextWeek.getDate() + 7);

            this.promoForm.reset({
                active: true,
                discountPercent: 10,
                maxDiscountAmount: 500000,
                usageLimit: 0,
                validFrom: now.toISOString().substring(0, 16),
                validTo: nextWeek.toISOString().substring(0, 16)
            });
        }
        this.showForm.set(true);
    }

    savePromo() {
        if (this.promoForm.invalid) {
            this.promoForm.markAllAsTouched();
            return;
        }

        this.loading.set(true);
        // Convert to proper object, ensure uppercase code
        const rawVal = this.promoForm.getRawValue();
        const requestData = {
            ...rawVal,
            code: rawVal.code?.toUpperCase(),
            // Spring expects full date time maybe with seconds
            validFrom: rawVal.validFrom + ':00',
            validTo: rawVal.validTo + ':00'
        };

        const action = this.editingPromo()
            ? this.paymentService.updatePromotion(this.editingPromo()!.id, requestData)
            : this.paymentService.createPromotion(requestData);

        action.subscribe({
            next: (res) => {
                if (res.success) {
                    this.showForm.set(false);
                    this.loadPromotions();
                }
            },
            error: (err) => {
                alert(err.error?.message || 'Có lỗi xảy ra khi lưu mã.');
            },
            complete: () => this.loading.set(false)
        });
    }

    deletePromo(promo: Promotion) {
        if (confirm(`Bạn có chắc muốn xóa mã khuyến mãi "${promo.code}"?`)) {
            this.paymentService.deletePromotion(promo.id).subscribe({
                next: (res) => {
                    if (res.success) this.loadPromotions();
                }
            });
        }
    }
}
