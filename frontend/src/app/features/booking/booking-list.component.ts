import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService, BookingResponse } from '../../core/services/booking.service';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="booking-page animate-fade-in">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Đơn Hàng Của Tôi</h1>
          <p>Những hành trình tuyệt mỹ bạn đã kiến tạo cùng chúng tôi.</p>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="luxury-spinner"></div>
        </div>

        <div *ngIf="!loading() && bookings().length === 0" class="empty-state glass-effect">
          <h2 class="luxury-font">Chưa Có Hành Trình Nào</h2>
          <p>Bộ sưu tập những chuyến đi xa hoa của bạn đang chờ ngày khởi đầu.</p>
          <a routerLink="/" class="btn-gold">Khám Phá Ngay</a>
        </div>

        <div class="booking-grid" *ngIf="!loading()">
          <div *ngFor="let booking of bookings()" class="booking-card glass-effect">
            <div class="card-header">
              <span class="status-badge" [attr.data-status]="booking.status">{{ booking.status === 'CONFIRMED' ? 'Đã xác nhận' : (booking.status === 'AWAITING_PAYMENT' ? 'Chờ thanh toán' : booking.status) }}</span>
              <span class="date">{{ booking.createdAt | date:'dd/MM/yyyy' }}</span>
            </div>
            
            <div class="card-body">
              <div class="booking-id">Mã đơn #{{ booking.id.substring(0, 8) }}</div>
              <div class="amount">{{ booking.totalAmount | number }} VNĐ</div>
            </div>

            <div class="card-footer">
              <a [routerLink]="['/bookings', booking.id]" class="link-gold">Xem chi tiết →</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .booking-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }

    .booking-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 25px; }
    .booking-card { padding: 30px; border-radius: 20px; transition: var(--transition-smooth); }
    .booking-card:hover { border-color: var(--gold-primary); transform: translateY(-5px); }

    .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .status-badge { font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
    .status-badge[data-status="CONFIRMED"] { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
    .status-badge[data-status="AWAITING_PAYMENT"] { background: rgba(234, 179, 8, 0.1); color: #eab308; }
    .date { font-size: 0.85rem; color: var(--text-muted); }

    .card-body { margin-bottom: 25px; }
    .booking-id { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 8px; }
    .amount { font-size: 1.5rem; color: var(--gold-primary); font-weight: 600; }

    .card-footer { border-top: 1px solid var(--glass-border); padding-top: 20px; }
    .link-gold { color: var(--gold-primary); text-decoration: none; font-size: 0.9rem; font-weight: 500; }

    .empty-state { text-align: center; padding: 100px 40px; border-radius: 30px; }
    .empty-state h2 { margin-bottom: 20px; font-size: 2rem; }
    .empty-state p { color: var(--text-secondary); margin-bottom: 40px; }

    .luxury-spinner { width: 50px; height: 50px; border: 2px solid var(--glass-border); border-top: 2px solid var(--gold-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 100px auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class BookingListComponent implements OnInit {
  private service = inject(BookingService);

  bookings = signal<BookingResponse[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.service.getMyBookings().subscribe({
      next: (res) => {
        if (res.success) this.bookings.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
