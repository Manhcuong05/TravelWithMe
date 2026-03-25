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

    <!-- Booking Detail/Status Modal -->
    <div class="modal-overlay" *ngIf="showDetail()">
      <div class="modal-card glass-effect">
        <h2 class="luxury-font">Chi tiết đơn hàng</h2>
        
        <div class="booking-info" *ngIf="selectedBooking()">
          <div class="info-row">
            <span class="label">Mã đơn:</span>
            <span class="value">{{ selectedBooking()?.id }}</span>
          </div>
          <div class="info-row">
            <span class="label">Tổng tiền:</span>
            <span class="value gold">{{ selectedBooking()?.totalAmount | number }} VNĐ</span>
          </div>
          <div class="info-row">
            <span class="label">Ngày đặt:</span>
            <span class="value">{{ selectedBooking()?.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
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

        <div class="modal-actions">
          <button type="button" class="btn-gold" (click)="updateStatus()" [disabled]="loading()">
            {{ loading() ? 'Đang cập nhật...' : 'Cập nhật trạng thái' }}
          </button>
          <button type="button" class="btn-outline" (click)="showDetail.set(false)">Đóng</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; }
    .modal-card { width: 450px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); }
    h2 { color: var(--gold-primary); margin-bottom: 25px; text-align: center; }
    
    .booking-info { display: flex; flex-direction: column; gap: 15px; }
    .info-row { display: flex; justify-content: space-between; padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .info-row .label { color: #94a3b8; font-size: 0.9rem; }
    .info-row .value { color: white; font-weight: 500; }
    .info-row .value.gold { color: var(--gold-primary); }
    
    .status-update { margin-top: 20px; }
    .status-update label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 10px; }
    .status-select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; }
    .status-select option { background: #1a1a1a; color: white; }
    
    .modal-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 30px; }
    .modal-actions button { width: 100%; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .mt-6 { margin-top: 24px; }
    
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
