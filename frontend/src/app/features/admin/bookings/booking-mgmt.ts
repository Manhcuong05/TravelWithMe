import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { BookingService, BookingResponse } from '../../../core/services/booking.service';

@Component({
    selector: 'app-booking-mgmt',
    standalone: true,
    imports: [CommonModule, GenericMgmtComponent, FormsModule],
    template: `
    <app-generic-mgmt
      [title]="'Quản lý Đơn hàng'"
      [columns]="columns"
      [items]="bookings"
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
              <option value="CONFIRMED">Đã xác nhận (CONFIRMED)</option>
              <option value="PAID">Đã thanh toán (PAID)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
              <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
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
    
    .modal-actions { display: flex; flex-direction: column; gap: 10px; margin-top: 30px; }
    .modal-actions button { width: 100%; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .mt-6 { margin-top: 24px; }
  `]
})
export class BookingMgmtComponent implements OnInit {
    private bookingService = inject(BookingService);

    bookings = signal<BookingResponse[]>([]);
    showDetail = signal(false);
    selectedBooking = signal<BookingResponse | null>(null);
    newStatus = '';
    loading = signal(false);

    columns: Column[] = [
        { key: 'id', label: 'Mã đơn' },
        { key: 'totalAmount', label: 'Tổng tiền', type: 'price' },
        { key: 'status', label: 'Trạng thái', type: 'badge' },
        { key: 'createdAt', label: 'Ngày đặt' }
    ];

    ngOnInit() {
        this.loadBookings();
    }

    loadBookings() {
        this.bookingService.getMyBookings().subscribe(res => {
            if (res.success && res.data) {
                this.bookings.set(res.data);
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
                // Note: Generic updateStatus might not exist on backend yet, 
                // fallback to cancel if status is CANCELLED
                if (this.newStatus === 'CANCELLED') {
                    this.bookingService.cancelBooking(this.selectedBooking()!.id).subscribe(() => {
                        this.loadBookings();
                        this.showDetail.set(false);
                    });
                } else {
                    alert('Tính năng cập nhật trạng thái này đang được hoàn thiện ở phía backend.');
                }
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
