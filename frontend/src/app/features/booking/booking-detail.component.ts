import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
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
        
        <div class="page-header text-center">
           <p class="text-gold tracking-widest uppercase text-sm font-bold mb-2">Trải Nghiệm Đẳng Cấp</p>
           <h1 class="luxury-font text-white text-4xl m-0">Chi Tiết Quản Lý Đơn Hàng</h1>
           <p class="text-gray mt-3">Sắp hoàn tất! Vui lòng kiểm tra kỹ thông tin và thanh toán để xuất vé.</p>
        </div>

        <div class="checkout-layout mt-5">
          <!-- Left Column: Booking Info -->
          <div class="checkout-main">

            <!-- Status Card -->
            <div class="card glass-effect relative text-center py-6">
              <div class="flex justify-center mb-3">
                 <div class="status-badge" [attr.data-status]="booking()?.status">
                   <i class="fas fa-spinner fa-spin mr-2" *ngIf="booking()?.status === 'AWAITING_PAYMENT'"></i>
                   <i class="fas fa-check-circle mr-2" *ngIf="booking()?.status === 'CONFIRMED'"></i>
                   {{ booking()?.status === 'CONFIRMED' ? 'ĐÃ XÁC NHẬN - CHUẨN BỊ KHỞI HÀNH' : (booking()?.status === 'AWAITING_PAYMENT' ? 'ĐANG CHỜ THANH TOÁN' : booking()?.status) }}
                 </div>
              </div>
              <h2 class="text-white text-xl m-0">Mã Đặt Chỗ: <span class="text-gold tracking-widest">{{ booking()?.id | uppercase | slice:0:8 }}</span></h2>
              <p class="text-gray mt-2 text-sm" *ngIf="booking()?.status === 'AWAITING_PAYMENT'">Phiên giao dịch sẽ hết hạn trong 15 phút. Vui lòng thanh toán sớm.</p>
            </div>

            <!-- Contact Info -->
            <div class="card glass-effect" *ngIf="booking()?.contact">
               <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-id-card text-gold"></i></div>
                 <h2 class="luxury-font m-0 text-lg">Thông Tin Người Đặt</h2>
               </div>
               <div class="card-body">
                  <div class="info-grid">
                     <div class="info-item">
                        <div class="info-label">Họ và Tên</div>
                        <div class="info-value uppercase">{{ booking()!.contact!.name }}</div>
                     </div>
                     <div class="info-item">
                        <div class="info-label">Điện Thoại</div>
                        <div class="info-value">{{ booking()!.contact!.phone }}</div>
                     </div>
                     <div class="info-item">
                        <div class="info-label">Email Liên Hệ</div>
                        <div class="info-value">{{ booking()!.contact!.email }}</div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Passengers Info -->
            <div class="card glass-effect" *ngIf="booking()?.passengers && booking()!.passengers!.length > 0">
               <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-user-friends text-gold"></i></div>
                 <h2 class="luxury-font m-0 text-lg">Danh Sách Hành Khách</h2>
               </div>
               <div class="card-body p-0">
                  <div class="passenger-row" *ngFor="let pax of booking()?.passengers; let i = index">
                     <div class="pax-badge-small">{{ i + 1 }}</div>
                     <div class="flex-1">
                        <div class="pax-name uppercase text-white font-bold">{{ pax.title }} {{ pax.lastName }} {{ pax.firstName }}</div>
                        <div class="text-xs text-gray mt-1 flex gap-3">
                           <span *ngIf="pax.dob"><i class="fas fa-birthday-cake text-gold mr-1"></i> {{ pax.dob | date:'dd/MM/yyyy' }}</span>
                           <span><i class="fas fa-globe text-gold mr-1"></i> Quốc tịch: {{ pax.nationality }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

            <!-- Items Info -->
            <div class="card glass-effect items-card">
              <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-cubes text-gold"></i></div>
                 <h2 class="luxury-font m-0 text-lg">Dịch Vụ Đã Đặt</h2>
              </div>
              <div class="card-body p-0">
                <div *ngFor="let item of booking()?.items" class="booking-item-row">
                  <div class="flex items-start gap-4">
                     <div class="service-icon">
                        <i class="fas fa-plane" *ngIf="item.serviceType === 'FLIGHT'"></i>
                        <i class="fas fa-hotel" *ngIf="item.serviceType === 'HOTEL'"></i>
                        <i class="fas fa-map-marked-alt" *ngIf="item.serviceType === 'TOUR'"></i>
                     </div>
                     <div class="flex-1">
                        <span class="type-tag">{{ item.serviceType === 'HOTEL' ? 'KHÁCH SẠN' : (item.serviceType === 'TOUR' ? 'TOUR' : (item.serviceType === 'FLIGHT' ? 'VÉ MÁY BAY' : item.serviceType)) }}</span>
                        <div class="service-name text-white font-bold mt-1 text-lg">Mã Dịch Vụ: {{ item.serviceId }}</div>
                        <div class="date-range text-sm text-gray mt-1" *ngIf="item.checkInDate">
                          <i class="far fa-calendar-alt text-gold mr-1"></i> {{ item.checkInDate | date:'dd/MM/yyyy' }} - {{ item.checkOutDate | date:'dd/MM/yyyy' }}
                        </div>
                     </div>
                     <div class="item-qty flex flex-col items-end">
                        <span class="text-xs text-gray uppercase tracking-widest">Số Lượng</span>
                        <span class="text-xl text-white font-bold">x{{ item.quantity }}</span>
                     </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
          
          <!-- Right Column: Payment & Summary -->
          <div class="checkout-sidebar">
             <div class="stick-top-wrapper">

               <div class="card glass-effect payment-side-card" *ngIf="booking()?.status === 'CONFIRMED'">
                 <div class="card-body p-5 text-center">
                   <div class="success-icon animate-pulse-glow"><i class="fas fa-check"></i></div>
                   <h3 class="luxury-font text-green-400 m-0 text-2xl">Đã hoàn tất thanh toán</h3>
                   <p class="text-sm text-gray mt-3 line-height-1">Hành trình của bạn đã chính thức được thiết lập. Một email xác nhận vé điện tử đã được gửi đến bạn.</p>
                   <button routerLink="/itinerary" class="btn-primary w-full mt-5">Trải Nghiệm AI Trợ Lý</button>
                 </div>
               </div>

               <div class="card glass-effect payment-side-card text-center" *ngIf="booking()?.status === 'AWAITING_PAYMENT'">
                 <div class="card-header border-bottom py-4 px-5 bg-dark-gradient flex items-center justify-center gap-2">
                    <i class="fas fa-shield-alt text-gold"></i>
                    <h3 class="luxury-font m-0 text-lg">Cổng Thanh Toán An Toàn</h3>
                 </div>
                 
                 <div class="card-body p-5">
                   <p class="text-sm text-gray mb-4">Mở ứng dụng ngân hàng và quét mã VietQR để hoàn tất giao dịch tự động.</p>
                   
                   <div class="qr-pedestal">
                     <div class="qr-container">
                       <img [src]="getVietQRUrl()" alt="Payment QR">
                     </div>
                     <div class="qr-overlay luxury-font tracking-widest text-gold text-xs mt-3 opacity-50">ĐƯỢC BẢO TRỢ BỞI NAPAS 247</div>
                   </div>

                   <!-- Promo Code Section -->
                   <div class="promo-section mt-6 border-top-dashed pt-5 text-left" *ngIf="!promoApplied()">
                     <div class="text-xs text-gray uppercase tracking-widest font-bold mb-2">Mã Khuyến Mãi</div>
                     <div class="flex gap-2">
                       <input type="text" [(ngModel)]="promoCode" placeholder="Nhập mã (VD: SUMMER24)" class="form-control flex-1 uppercase">
                       <button (click)="applyPromo()" class="btn-outline-gold" [disabled]="!promoCode() || applyingPromo()">
                         {{ applyingPromo() ? '...' : 'ÁP DỤNG' }}
                       </button>
                     </div>
                     <div class="text-error text-xs mt-2" *ngIf="promoError()">{{ promoError() }}</div>
                   </div>

                   <div class="promo-success mt-5 text-left" *ngIf="promoApplied()">
                     <div class="flex items-center gap-2 text-green-400 font-bold mb-2">
                       <i class="fas fa-check-circle"></i> Đã áp dụng mã giảm giá
                     </div>
                     <div class="discount-calc mt-2 pt-2 border-top-dashed text-sm">
                       <div class="flex-between text-gray mb-1"><span>Tạm tính:</span> <span>{{ originalTotal() | number }} đ</span></div>
                       <div class="flex-between text-green-400 mb-1"><span>Khuyến mãi:</span> <span>- {{ originalTotal()! - booking()!.totalAmount | number }} đ</span></div>
                     </div>
                   </div>

                   <!-- Total -->
                   <div class="total-block mt-5 text-left">
                      <div class="flex-between items-end">
                        <span class="text-sm text-gray uppercase font-bold tracking-widest">Cần Thanh Toán</span>
                        <span class="text-2xl font-bold luxury-font text-gold text-shadow-gold">{{ booking()?.totalAmount | number }} đ</span>
                      </div>
                   </div>

                   <div class="sim-actions mt-5 pt-5 border-top-dashed text-left" *ngIf="authService.currentUser()?.role === 'ADMIN' || authService.currentUser()?.role === 'CTV'">
                     <div class="text-xs text-gray mb-2">Chức năng Debug (Dành cho Admin):</div>
                     <button (click)="simulatePaymentSuccess()" class="btn-primary w-full text-sm py-3" [disabled]="simulating()">
                       <i class="fas fa-bolt text-gold mr-2 text-dark"></i> {{ simulating() ? 'Đang duyệt...' : 'Xác nhận thanh toán' }}
                     </button>
                   </div>

                 </div>
               </div>

             </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Utilities */
    .text-gold { color: var(--gold-primary, #d4af37); }
    .text-white { color: #ffffff; }
    .text-gray { color: #8b9bb4; }
    .text-error { color: #ff4d4f; }
    .text-dark { color: #0b0f19; }
    .text-green-400 { color: #4ade80; }
    .tracking-widest { letter-spacing: 0.1em; }
    .uppercase { text-transform: uppercase; }
    .font-bold { font-weight: 700; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-4xl { font-size: 2.25rem; }
    .m-0 { margin: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-5 { margin-top: 1.25rem; }
    .mt-6 { margin-top: 1.5rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mr-1 { margin-right: 0.25rem; }
    .mr-2 { margin-right: 0.5rem; }
    .p-0 { padding: 0 !important; }
    .p-5 { padding: 1.25rem; }
    .pt-2 { padding-top: 0.5rem; }
    .pt-5 { padding-top: 1.25rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .items-end { align-items: flex-end; }
    .justify-center { justify-content: center; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .flex-1 { flex: 1 1 0%; }
    .relative { position: relative; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .opacity-50 { opacity: 0.5; }
    .line-height-1 { line-height: 1.4; }
    .text-shadow-gold { text-shadow: 0 0 15px rgba(212,175,55,0.4); }
    .bg-dark-gradient { background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1)); }

    /* Core Layout */
    .detail-page { padding: 120px 0 100px 0; background-color: transparent; min-height: 100vh; }
    .checkout-layout { display: flex; gap: 32px; align-items: flex-start; }
    .checkout-main { flex: 1; display: flex; flex-direction: column; gap: 28px; }
    .checkout-sidebar { width: 420px; flex-shrink: 0; }
    .stick-top-wrapper { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
    
    /* Premium Cards */
    .card.glass-effect {
      background: linear-gradient(145deg, rgba(26, 31, 44, 0.85) 0%, rgba(15, 19, 28, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .card.glass-effect:hover { border-color: rgba(212, 175, 55, 0.3); }
    
    .card-header { padding: 22px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .card-body { padding: 28px; }
    .border-bottom { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .border-top-dashed { border-top: 1px dashed rgba(255, 255, 255, 0.1); }
    
    .icon-circle { width: 40px; height: 40px; border-radius: 50%; background: rgba(212, 175, 55, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid rgba(212, 175, 55, 0.2); }
    
    /* Badges */
    .status-badge { display: inline-flex; align-items: center; padding: 8px 20px; border-radius: 30px; font-weight: 800; font-size: 0.85rem; letter-spacing: 1px; }
    .status-badge[data-status="AWAITING_PAYMENT"] { background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); border: 1px solid rgba(212, 175, 55, 0.3); }
    .status-badge[data-status="CONFIRMED"] { background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }

    /* Forms & Inputs */
    .form-control {
      background: rgba(8, 11, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px 18px; border-radius: 12px;
      font-size: 1rem; color: #fff;
      transition: all 0.3s;
    }
    .form-control:focus { border-color: var(--gold-primary); background: rgba(0,0,0,0.5); box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1); outline: none; }

    /* Contacts & Passengers & Items */
    .info-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; }
    .info-item { background: rgba(0,0,0,0.2); padding: 15px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.03); }
    .info-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; color: #8b9bb4; margin-bottom: 5px; font-weight: 700; }
    .info-value { font-size: 1.05rem; color: #fff; font-weight: 600; }

    .passenger-row { display: flex; align-items: center; gap: 20px; padding: 20px 28px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
    .passenger-row:last-child { border-bottom: none; }
    .passenger-row:hover { background: rgba(255,255,255,0.02); }
    .pax-badge-small { width: 32px; height: 32px; border-radius: 10px; background: rgba(212,175,55,0.1); color: var(--gold-primary); border: 1px solid rgba(212,175,55,0.2); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1rem; }

    .booking-item-row { padding: 24px 28px; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
    .booking-item-row:last-child { border-bottom: none; }
    .booking-item-row:hover { background: rgba(255,255,255,0.02); }
    .service-icon { width: 48px; height: 48px; border-radius: 12px; background: linear-gradient(135deg, rgba(212,175,55,0.2), rgba(0,0,0,0.5)); border: 1px solid rgba(212,175,55,0.3); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; font-size: 1.4rem; box-shadow: 0 4px 15px rgba(0,0,0,0.2); }
    .type-tag { font-size: 0.65rem; background: var(--gold-primary); color: #000; padding: 4px 8px; border-radius: 6px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; }

    /* QR Pedestal */
    .qr-pedestal { position: relative; padding: 25px; background: linear-gradient(145deg, #131720, #0b0f19); border-radius: 20px; border: 1px solid rgba(212,175,55,0.2); box-shadow: inset 0 0 30px rgba(0,0,0,0.8), 0 10px 40px rgba(0,0,0,0.4); display: flex; flex-direction: column; align-items: center; overflow: hidden; }
    .qr-container { padding: 15px; background: #fff; border-radius: 12px; position: relative; z-index: 2; width: 100%; max-width: 250px; box-shadow: 0 0 20px rgba(212,175,55,0.3); }
    .qr-container img { width: 100%; height: auto; display: block; filter: contrast(1.1); }

    /* Promo and Totals */
    .promo-success { background: rgba(74, 222, 128, 0.1); border: 1px solid rgba(74, 222, 128, 0.2); border-radius: 12px; padding: 15px; }
    .total-block { background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0,0,0,0.3)); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 16px; padding: 22px; box-shadow: inset 0 0 20px rgba(0,0,0,0.2); }

    /* Buttons */
    .btn-primary { 
        background: linear-gradient(135deg, #dfc15a 0%, #c49a20 100%); 
        color: #0b0f19; border: none; padding: 16px 24px; border-radius: 12px; 
        font-size: 1.05rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; 
        cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
        box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.4); 
    }
    .btn-primary:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255,255,255,0.5); }
    .btn-primary:active { transform: translateY(0); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); }
    
    .btn-outline-gold { background: transparent; border: 1px solid var(--gold-primary); color: var(--gold-primary); font-weight: 800; border-radius: 12px; padding: 0 20px; transition: all 0.3s; }
    .btn-outline-gold:hover:not(:disabled) { background: rgba(212,175,55,0.1); box-shadow: 0 0 15px rgba(212,175,55,0.2); }

    .success-icon { width: 70px; height: 70px; background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 2px solid #4ade80; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 20px; }
    .animate-pulse-glow { animation: pulseGlow 2s infinite; }
    @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(74, 222, 128, 0); } 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0); } }

    @media (max-width: 992px) {
      .checkout-layout { flex-direction: column; }
      .checkout-sidebar { width: 100%; }
      .info-grid { grid-template-columns: 1fr; }
    }
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
    const acct = '101880779992';
    const bank = 'VietinBank';
    const amount = this.booking()?.totalAmount || 0;
    const accountName = 'Nguyen Manh Cuong';
    const info = `THANH TOAN DH ${this.booking()?.id?.substring(0, 8) || ''}`;
    return `https://img.vietqr.io/image/${bank}-${acct}-compact.png?amount=${amount}&addInfo=${encodeURIComponent(info)}&accountName=${encodeURIComponent(accountName)}`;
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
