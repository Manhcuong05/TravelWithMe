import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingService, BookingResponse } from '../../core/services/booking.service';
import { PaymentService } from '../../core/services/payment.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="detail-page animate-fade-in" *ngIf="booking()">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Chi Tiết Đơn Hàng</h1>
          <p>Thông tin xác nhận và phương thức thanh toán cho hành trình sắp tới.</p>
        </div>

        <div class="main-grid">
          <div class="info-side">
            <div class="card glass-effect status-card">
              <div class="label">Trạng thái đơn hàng</div>
              <div class="status-val" [attr.data-status]="booking()?.status">
                {{ booking()?.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN' : (booking()?.status === 'AWAITING_PAYMENT' ? 'CHỜ THANH TOÁN' : booking()?.status) }}
              </div>
              <p *ngIf="booking()?.status === 'AWAITING_PAYMENT'" class="instruction">
                Đơn hàng đã được giữ chỗ. Vui lòng hoàn tất thanh toán để xác nhận.
              </p>
            </div>

            <div class="card glass-effect items-card">
              <h3 class="luxury-font">Tóm Tắt Đơn Hàng</h3>
              <div *ngFor="let item of booking()?.items" class="booking-item">
                <div class="item-info">
                  <span class="type-tag">{{ item.type === 'HOTEL' ? 'KHÁCH SẠN' : (item.type === 'TOUR' ? 'TOUR' : item.type) }}</span>
                  <div class="service-name">Dịch vụ: {{ item.serviceId }}</div>
                  <div class="date-range" *ngIf="item.checkInDate">
                    {{ item.checkInDate | date:'dd/MM/yyyy' }} - {{ item.checkOutDate | date:'dd/MM/yyyy' }}
                  </div>
                </div>
                <div class="item-qty">Số lượng: {{ item.quantity }}</div>
              </div>
              <div class="total-row">
                <span>Tổng cộng</span>
                <span class="amount">{{ booking()?.totalAmount | number }} VNĐ</span>
              </div>
            </div>
          </div>

          <div class="payment-side" *ngIf="booking()?.status === 'AWAITING_PAYMENT'">
            <div class="card glass-effect payment-card">
              <h3 class="luxury-font">Thanh Toán An Toàn</h3>
              <p>Quét mã QR dưới đây bằng ứng dụng ngân hàng của bạn để hoàn tất giao dịch.</p>
              
              <div class="qr-container">
                <img [src]="getVietQRUrl()" alt="Payment QR">
                <div class="qr-overlay luxury-font">VIETQR</div>
              </div>

              <!-- Promo Code Section -->
              <div class="promo-section" *ngIf="!promoApplied()">
                <div class="input-group">
                  <input type="text" [(ngModel)]="promoCode" placeholder="Nhập mã khuyến mãi" class="promo-input">
                  <button (click)="applyPromo()" class="btn-apply" [disabled]="!promoCode() || applyingPromo()">
                    {{ applyingPromo() ? 'Đang áp dụng...' : 'Áp dụng' }}
                  </button>
                </div>
                <div class="promo-error" *ngIf="promoError()">{{ promoError() }}</div>
              </div>
              <div class="promo-success" *ngIf="promoApplied()">
                <div class="success-header">
                  <div class="icon">✓</div>
                  Mã Khuyến Mãi Đã Được Áp Dụng
                </div>
                <div class="discount-calculation" *ngIf="originalTotal()">
                  <div class="calc-row">Số tiền gốc: <span class="calc-val">{{ originalTotal() | number }} đ</span></div>
                  <div class="calc-row text-green">Giảm giá: <span class="calc-val">- {{ originalTotal()! - booking()!.totalAmount | number }} đ</span></div>
                  <div class="calc-row final">Còn lại: <span class="calc-val text-gold">{{ booking()!.totalAmount | number }} đ</span></div>
                </div>
              </div>

              <div class="sim-actions" *ngIf="authService.currentUser()?.role === 'ADMIN' || authService.currentUser()?.role === 'CTV'">
                <p class="hint">Mô phỏng thanh toán thành công để kiểm tra (Chỉ dành cho Admin/CTV):</p>
                <button (click)="simulatePaymentSuccess()" class="btn-gold w-full" [disabled]="simulating()">
                  {{ simulating() ? 'Đang xử lý...' : 'Xác nhận Đã chuyển khoản' }}
                </button>
              </div>
            </div>
          </div>

          <div class="payment-side" *ngIf="booking()?.status === 'CONFIRMED'">
            <div class="card glass-effect success-card animate-fade-in">
              <div class="success-icon">✓</div>
              <h3 class="luxury-font">Thanh Toán Thành Công</h3>
              <p>Hành trình của bạn đã chính thức được thiết lập. Một email xác nhận đã được gửi đến bạn.</p>
              <button routerLink="/itinerary" class="btn-gold w-full">Xem Lịch Trình Của Tôi</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .detail-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    
    .main-grid { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
    .card { padding: 40px; margin-bottom: 30px; border-radius: 24px; }
    
    .status-card { text-align: center; }
    .status-card .label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 15px; letter-spacing: 1px; }
    .status-val { font-size: 2rem; font-weight: 700; color: var(--gold-primary); font-family: 'Playfair Display', serif; }
    .status-val[data-status="CONFIRMED"] { color: #22c55e; }
    .instruction { margin-top: 15px; color: var(--text-secondary); font-size: 0.9rem; }

    .items-card h3 { margin-bottom: 30px; font-size: 1.5rem; }
    .booking-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border); margin-bottom: 20px; }
    .type-tag { font-size: 0.65rem; background: var(--bg-accent); padding: 3px 10px; border-radius: 4px; color: var(--gold-secondary); text-transform: uppercase; margin-bottom: 8px; display: inline-block; }
    .service-name { font-size: 1rem; color: var(--text-primary); }
    .item-qty { color: var(--text-muted); font-size: 0.9rem; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; font-weight: 700; font-size: 1.3rem; }
    .total-row .amount { color: var(--gold-primary); }

    .payment-card { text-align: center; position: sticky; top: 120px; }
    .payment-card h3 { margin-bottom: 20px; font-size: 1.5rem; }
    .payment-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 30px; line-height: 1.5; }
    .qr-container { padding: 20px; background: white; border-radius: 16px; display: inline-block; margin-bottom: 30px; position: relative; width: 100%; max-width: 300px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .qr-container img { width: 100%; height: auto; display: block; border-radius: 8px; }
    .qr-overlay { position: absolute; bottom: 5px; right: 5px; font-size: 10px; color: #ccc; }
    
    .sim-actions { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--glass-border); text-align: left; }
    .hint { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; }

    .promo-section { margin-bottom: 20px; text-align: left;}
    .input-group { display: flex; gap: 10px; }
    .promo-input { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px 15px; color: white; outline: none; transition: border-color 0.2s; font-family: monospace; text-transform: uppercase;}
    .promo-input:focus { border-color: var(--gold-primary); }
    .btn-apply { background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); border: 1px solid rgba(212, 175, 55, 0.3); padding: 0 20px; border-radius: 10px; cursor: pointer; transition: all 0.2s; font-weight: 600; }
    .btn-apply:hover:not([disabled]) { background: rgba(212, 175, 55, 0.2); border-color: var(--gold-primary); }
    .btn-apply[disabled] { opacity: 0.5; cursor: not-allowed; }
    .promo-error { color: #ef4444; font-size: 0.8rem; margin-top: 5px; }
    .promo-success { background: rgba(16, 185, 129, 0.05); padding: 15px; border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.2); margin-bottom: 20px; font-size: 0.9rem; }
    .success-header { display: flex; align-items: center; gap: 8px; justify-content: center; color: #10b981; font-weight: 600; margin-bottom: 12px; }
    .success-header .icon { background: #10b981; color: #000; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.7rem; }
    .discount-calculation { border-top: 1px dashed rgba(255,255,255,0.1); padding-top: 10px; }
    .calc-row { display: flex; justify-content: space-between; margin-bottom: 8px; color: var(--text-secondary); }
    .calc-val { font-weight: 600; color: white; }
    .text-green { color: #10b981; }
    .text-gold { color: var(--gold-primary); }
    .calc-row.final { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 8px; margin-top: 5px; color: white; }

    .success-card { text-align: center; border-color: #22c55e; }
    .success-icon { width: 60px; height: 60px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 25px; }
    .success-card h3 { color: #22c55e; margin-bottom: 15px; font-size: 1.8rem; }
    .success-card p { color: var(--text-secondary); margin-bottom: 30px; }

    .date-range { font-size: 0.8rem; color: var(--gold-secondary); margin-top: 5px; }
    .w-full { width: 100%; }
  `]
})
export class BookingDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(BookingService);
  private paymentService = inject(PaymentService);
  public authService = inject(AuthService);

  booking = signal<BookingResponse | null>(null);
  simulating = signal<boolean>(false);
  promoCode = signal<string>('');
  applyingPromo = signal<boolean>(false);
  promoError = signal<string>('');
  promoApplied = signal<boolean>(false);
  originalTotal = signal<number | null>(null);

  ngOnInit() {
    this.loadBooking();
  }

  loadBooking() {
    const id = this.route.snapshot.params['id'];
    this.service.getBooking(id).subscribe({
      next: (res) => {
        if (res.success) this.booking.set(res.data);
      }
    });
  }

  getVietQRUrl(): string {
    const b = this.booking();
    if (!b) return '';

    const bankId = 'ICB'; // VietinBank
    const accountNo = '101880779992';
    const template = 'compact2';
    const amount = b.totalAmount;
    const description = `Thanh Toan Booking ${b.id}`;
    const accountName = 'TravelWithMe';

    return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${encodeURIComponent(description)}&accountName=${encodeURIComponent(accountName)}`;
  }

  applyPromo() {
    if (!this.booking() || !this.promoCode()) return;
    this.applyingPromo.set(true);
    this.promoError.set('');

    const currentTotal = this.booking()!.totalAmount;

    this.paymentService.applyPromotion(this.booking()!.id, this.promoCode().toUpperCase()).subscribe({
      next: (res) => {
        if (res.success) {
          this.originalTotal.set(currentTotal);
          this.promoApplied.set(true);
          this.loadBooking(); // Reload booking to get new price
        }
        this.applyingPromo.set(false);
      },
      error: (err) => {
        this.promoError.set(err.error?.message || 'Mã không hợp lệ hoặc đã hết hạn.');
        this.applyingPromo.set(false);
      }
    });
  }

  simulatePaymentSuccess() {
    if (!this.booking()) return;
    this.simulating.set(true);

    const data = {
      bookingId: this.booking()!.id,
      amount: this.booking()!.totalAmount,
      paymentMethod: 'VietQR'
    };

    this.paymentService.processPayment(data).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadBooking(); // Refresh to show success state
        }
        this.simulating.set(false);
      },
      error: (err) => {
        console.error("Lỗi giao dịch", err);
        alert(err.error?.message || 'Có lỗi xảy ra trong quá trình thanh toán.');
        this.simulating.set(false);
      }
    });
  }
}
