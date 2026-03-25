import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { BookingService, BookingResponse } from '../../../core/services/booking.service';

@Component({
    selector: 'app-booking-mgmt',
    standalone: true,
    imports: [CommonModule, GenericMgmtComponent, FormsModule],
    template: `
    <div class="filter-tabs mb-4 flex gap-2">
      <button class="filter-btn" [class.active]="activeFilter() === 'ALL'" (click)="activeFilter.set('ALL')">Tất Cả</button>
      <button class="filter-btn" [class.active]="activeFilter() === 'TOUR'" (click)="activeFilter.set('TOUR')">Tour Du Lịch</button>
      <button class="filter-btn" [class.active]="activeFilter() === 'FLIGHT'" (click)="activeFilter.set('FLIGHT')">Vé Máy Bay</button>
      <button class="filter-btn" [class.active]="activeFilter() === 'HOTEL'" (click)="activeFilter.set('HOTEL')">Khách Sạn</button>
    </div>

    <app-generic-mgmt
      [title]="'Quản lý Đơn hàng'"
      [columns]="columns"
      [items]="filteredBookings"
      (onCreate)="handleCreate()"
      (onEdit)="openDetail($event)"
      (onDelete)="handleDelete($event)"
    ></app-generic-mgmt>

    <!-- Booking Detail Modal Pro -->
    <div class="modal-overlay-pro" *ngIf="showDetail()" (click)="$event.target === modalOverlay && showDetail.set(false)" #modalOverlay>
      <div class="modal-card-pro glass-pro-heavy">
        <div class="modal-header-pro text-center">
            <h2 class="luxury-font primary-gradient-text w-full">Chi tiết đơn hàng</h2>
        </div>
        
        <div class="booking-content" *ngIf="selectedBooking()">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="d-label">Mã đơn hàng</span>
              <span class="d-value mono">{{ selectedBooking()?.id }}</span>
            </div>
            
            <div class="detail-item">
              <span class="d-label">Tổng thanh toán</span>
              <span class="d-value gold-text text-xl">{{ selectedBooking()?.totalAmount | number }} VNĐ</span>
            </div>
            
            <div class="detail-item">
              <span class="d-label">Thời gian đặt</span>
              <span class="d-value">{{ selectedBooking()?.createdAt | date:'dd MMM yyyy, HH:mm' }}</span>
            </div>
          </div>
          
          <div class="status-update mt-6">
            <label>Cập nhật trạng thái:</label>
            <select [(ngModel)]="newStatus" class="status-select">
              <option value="PENDING">Chờ xử lý (PENDING)</option>
              <option value="AWAITING_PAYMENT">Chờ thanh toán (AWAITING_PAYMENT)</option>
              <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
              <option value="REFUNDED">Đã hoàn tiền (REFUNDED)</option>
            </select>
          </div>
        </div>

        <div class="modal-footer-pro mt-8">
          <button type="button" class="btn-cancel-pro" (click)="showDetail.set(false)">Đóng cửa sổ</button>
          <button type="button" class="btn-save-pro" (click)="updateStatus()" [disabled]="loading()">
            <i class="fas fa-arrows-rotate mr-2" [class.fa-spin]="loading()"></i>
            {{ loading() ? 'Đang xử lý...' : 'Cập nhật ngay' }}
          </button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay-pro { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card-pro { width: 500px; padding: 40px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.08); background: rgba(15, 23, 42, 0.9); box-shadow: 0 40px 80px rgba(0,0,0,0.5); }
    
    .primary-gradient-text { background: linear-gradient(135deg, #FFD700, #D4AF37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    
    .detail-grid { display: flex; flex-direction: column; gap: 20px; margin-top: 20px; }
    .detail-item { display: flex; flex-direction: column; gap: 6px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.03); }
    .d-label { font-size: 0.75rem; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1.5px; }
    .d-value { color: #f1f5f9; font-size: 1rem; font-weight: 600; }
    .mono { font-family: 'JetBrains Mono', monospace; font-size: 0.8rem; color: #94a3b8; }
    
    .status-update { margin-top: 20px; }
    .status-update label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 10px; }
    .status-select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; }
    .status-select option { background: #1a1a1a; color: white; }
    
    .modal-footer-pro { display: flex; gap: 15px; }
    .btn-cancel-pro { flex: 1; background: none; border: 1px solid rgba(255,255,255,0.1); color: #64748b; padding: 14px; border-radius: 14px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-cancel-pro:hover { background: rgba(255,255,255,0.05); color: #fff; }
    
    .btn-save-pro { flex: 1.5; background: linear-gradient(135deg, #FFD700, #D4AF37); color: #000; border: none; padding: 14px; border-radius: 14px; font-weight: 800; cursor: pointer; transition: 0.3s; }
    .btn-save-pro:hover { transform: scale(1.02); box-shadow: 0 10px 20px rgba(212,175,55,0.2); }
    .btn-save-pro[disabled] { opacity: 0.6; cursor: not-allowed; }

    .mt-8 { margin-top: 32px; }
    .mt-6 { margin-top: 24px; }
    .mb-3 { margin-bottom: 12px; }
    .w-full { width: 100%; }
    .text-xl { font-size: 1.25rem; }
    
    .filter-tabs { border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 15px; }
    .filter-btn { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); color: #94a3b8; padding: 8px 16px; border-radius: 8px; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; }
    .filter-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
    .filter-btn.active { background: rgba(212,175,55,0.15); border-color: rgba(212,175,55,0.4); color: var(--gold-primary); }
    .flex { display: flex; }
    .gap-2 { gap: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
  `]
})
export class BookingMgmtComponent implements OnInit {
    private bookingService = inject(BookingService);

    bookings = signal<any[]>([]);
    showDetail = signal(false);
    selectedBooking = signal<BookingResponse | null>(null);
    newStatus = '';
    loading = signal(false);

    activeFilter = signal<'ALL' | 'TOUR' | 'FLIGHT' | 'HOTEL'>('ALL');

    filteredBookings = computed(() => {
        const filter = this.activeFilter();
        const all = this.bookings();
        if (filter === 'ALL') return all;
        return all.filter(b => b.rawServiceType === filter);
    });

    columns: Column[] = [
        { key: 'id', label: 'Mã đơn' },
        { key: 'serviceTypeLabel', label: 'Loại Dịch Vụ' },
        { key: 'totalAmount', label: 'Tổng tiền', type: 'price' },
        { key: 'status', label: 'Trạng thái', type: 'badge' },
        { key: 'createdAt', label: 'Ngày đặt' }
    ];

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.bookingService.getAllBookings().subscribe(res => {
            if (res.success && res.data) {
                const mapped = res.data.map(b => {
                    const type = b.items?.length > 0 ? b.items[0].serviceType : 'UNKNOWN';
                    return {
                        ...b,
                        rawServiceType: type,
                        serviceTypeLabel: type === 'HOTEL' ? 'Khách sạn' : (type === 'TOUR' ? 'Tour' : (type === 'FLIGHT' ? 'Vé Máy Bay' : 'Khác'))
                    };
                });
                this.bookings.set(mapped);
            }
        });
    }

    handleCreate() {
        alert('Chức năng tạo đơn mới cho CTV/Admin đang được phát triển...');
    }

    openDetail(booking: BookingResponse) {
        this.selectedBooking.set(booking);
        this.newStatus = booking.status;
        this.showDetail.set(true);
    }

    updateStatus() {
        if (!this.selectedBooking()) return;

        this.loading.set(true);
        this.bookingService.updateStatus(this.selectedBooking()!.id, this.newStatus).subscribe({
            next: (res) => {
                if (res.success) {
                    this.loadBookings();
                    this.showDetail.set(false);
                }
            },
            error: (err) => {
                console.error('Error updating status:', err);
                alert(err.error?.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
            },
            complete: () => this.loading.set(false)
        });
    }

    handleDelete(booking: BookingResponse) {
        if (confirm(`Bạn có chắc muốn hủy đơn hàng ${booking.id}?`)) {
            this.bookingService.cancelBooking(booking.id).subscribe(res => {
                if (res.success) this.loadBookings();
            });
        }
    }
}
