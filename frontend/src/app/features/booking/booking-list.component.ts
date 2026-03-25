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
      <!-- Decorative Background Elements -->
      <div class="bg-decoration">
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
      </div>

      <div class="container relative-z">
        <div class="page-header">
          <span class="page-tag">Hành Trình Cá Nhân</span>
          <h1 class="luxury-font main-title">Đơn Hàng Của Tôi</h1>
          <div class="decorative-line"></div>
          <p class="subtitle">Những hành trình tuyệt mỹ bạn đã kiến tạo cùng chúng tôi.</p>
        </div>

        <div *ngIf="loading()" class="loading-state">
           <div class="luxury-spinner-wrap">
            <div class="luxury-spinner"></div>
          </div>
        </div>

        <div *ngIf="!loading() && bookings().length === 0" class="empty-state glass-pro animate-pop">
          <div class="empty-icon"><i class="fas fa-box-open"></i></div>
          <h2 class="luxury-font">Chưa Có Hành Trình Nào</h2>
          <p>Bộ sưu tập những chuyến đi xa hoa của bạn đang chờ ngày khởi đầu.</p>
          <a routerLink="/" class="btn-gold-pro">Khám Phá Ngay</a>
        </div>

        <div class="booking-grid" *ngIf="!loading()">
          <div *ngFor="let booking of bookings(); let i = index" 
               class="booking-card glass-pro animate-stagger" 
               [style.--index]="i">
            
            <div class="card-header-pro">
              <div class="status-wrap">
                <span class="status-badge-pro" [attr.data-status]="booking.status">
                  <i class="fas fa-circle-notch fa-spin mr-2" *ngIf="booking.status === 'AWAITING_PAYMENT'"></i>
                  <i class="fas fa-check-circle mr-2" *ngIf="booking.status === 'CONFIRMED'"></i>
                  {{ getStatusText(booking.status) }}
                </span>
              </div>
              <span class="date-tag">{{ booking.createdAt | date:'dd/MM/yyyy' }}</span>
            </div>
            
            <div class="card-body-pro">
              <div class="id-wrap">
                <span class="label">Mã định danh</span>
                <div class="booking-id-text">#{{ booking.id.substring(0, 8) | uppercase }}</div>
              </div>
              
              <div class="amount-wrap-pro">
                <span class="label">Tổng giá trị</span>
                <div class="amount-display">
                  <span class="val">{{ booking.totalAmount | number }}</span>
                  <span class="currency">VNĐ</span>
                </div>
              </div>
            </div>

            <div class="card-footer-pro">
              <a [routerLink]="['/bookings', booking.id]" class="btn-action-pro">
                <span>Xem chi tiết</span>
                <i class="fas fa-arrow-right"></i>
              </a>
            </div>
            
            <!-- Hover Decoration -->
            <div class="card-glow-overlay"></div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #FFD700; --bg-card: rgba(15, 23, 42, 0.6); }

    .booking-page { padding: 180px 0 120px; min-height: 100vh; position: relative; overflow: hidden; background: #020617; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 30px; }
    .relative-z { position: relative; z-index: 10; }

    /* Background Decoration */
    .bg-decoration { position: absolute; inset: 0; pointer-events: none; }
    .glow-orb { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; }
    .orb-1 { width: 400px; height: 400px; background: var(--gold-primary); top: -100px; left: -100px; }
    .orb-2 { width: 500px; height: 500px; background: #3b82f6; bottom: -150px; right: -150px; }

    .page-header { text-align: center; margin-bottom: 80px; }
    .page-tag { font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-primary); font-weight: 800; margin-bottom: 20px; display: block; }
    .main-title { font-size: 4rem; margin-bottom: 20px; color: #fff; }
    .decorative-line { width: 80px; height: 3px; background: linear-gradient(90deg, transparent, var(--gold-primary), transparent); margin: 0 auto 30px; }
    .subtitle { color: #94a3b8; font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }

    /* Grid & Cards */
    .booking-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 35px; }
    
    .glass-pro { 
      background: var(--bg-card); backdrop-filter: blur(25px); 
      border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; 
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative; overflow: hidden;
    }

    .booking-card { display: flex; flex-direction: column; cursor: pointer; }
    .booking-card:hover { 
      transform: translateY(-12px); 
      border-color: rgba(212, 175, 55, 0.4);
      box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5), 0 0 40px rgba(212, 175, 55, 0.1);
    }

    .card-header-pro { padding: 30px 30px 0; display: flex; justify-content: space-between; align-items: flex-start; }
    .status-badge-pro { 
      font-size: 0.65rem; font-weight: 800; padding: 6px 14px; border-radius: 10px; 
      text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center;
    }
    .status-badge-pro[data-status="CONFIRMED"] { background: rgba(74, 222, 128, 0.1); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.2); }
    .status-badge-pro[data-status="AWAITING_PAYMENT"] { background: rgba(251, 191, 36, 0.1); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.2); }
    .status-badge-pro[data-status="CANCELLED"] { background: rgba(248, 113, 113, 0.1); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.2); }
    
    .date-tag { font-size: 0.75rem; color: #475569; font-weight: 700; }

    .card-body-pro { padding: 40px 30px 30px; }
    .id-wrap { margin-bottom: 25px; }
    .label { font-size: 0.65rem; text-transform: uppercase; color: #475569; letter-spacing: 2px; display: block; margin-bottom: 8px; font-weight: 700; }
    .booking-id-text { font-size: 1.4rem; color: #fff; font-weight: 600; letter-spacing: 1px; }

    .amount-wrap-pro { background: rgba(0,0,0,0.2); padding: 20px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.03); }
    .amount-display { display: flex; align-items: baseline; gap: 8px; }
    .amount-display .val { font-size: 1.8rem; font-weight: 800; color: var(--gold-primary); text-shadow: 0 0 20px rgba(212, 175, 55, 0.2); }
    .amount-display .currency { font-size: 0.8rem; color: var(--gold-secondary); font-weight: 700; }

    .card-footer-pro { padding: 0 30px 30px; border-top: none; }
    .btn-action-pro { 
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 16px; width: 100%; border-radius: 16px; background: rgba(255,255,255,0.03); 
      border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 700; font-size: 0.85rem; 
      text-decoration: none; transition: 0.3s;
    }
    .booking-card:hover .btn-action-pro { background: var(--gold-primary); color: #000; border-color: var(--gold-primary); }
    .btn-action-pro i { transition: transform 0.3s; }
    .btn-action-pro:hover i { transform: translateX(5px); }

    .card-glow-overlay { 
      position: absolute; bottom: -50px; right: -50px; width: 100px; height: 100px; 
      background: var(--gold-primary); filter: blur(60px); opacity: 0; transition: 0.5s; 
    }
    .booking-card:hover .card-glow-overlay { opacity: 0.15; }

    /* Empty State */
    .empty-state { text-align: center; padding: 100px 50px; }
    .empty-icon { font-size: 4rem; color: var(--gold-primary); margin-bottom: 30px; opacity: 0.5; }
    .btn-gold-pro { 
      display: inline-block; background: var(--gold-gradient); color: #000; padding: 18px 45px; 
      border-radius: 16px; font-weight: 800; text-decoration: none; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); 
    }
    
    /* Loading */
    .luxury-spinner-wrap { height: 300px; display: flex; align-items: center; justify-content: center; }
    .luxury-spinner { width: 60px; height: 60px; border: 2px solid rgba(212, 175, 55, 0.1); border-top: 2px solid var(--gold-primary); border-radius: 50%; animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Animations */
    .animate-stagger { 
       opacity: 0; transform: translateY(30px);
       animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
       animation-delay: calc(var(--index) * 0.1s);
    }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .main-title { font-size: 2.8rem; }
      .booking-grid { grid-template-columns: 1fr; }
    }
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

  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'AWAITING_PAYMENT': return 'Chờ thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }
}
