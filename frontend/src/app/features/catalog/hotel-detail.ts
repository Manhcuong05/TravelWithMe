import { Component, inject, OnInit, signal, computed, effect, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HotelService, Hotel } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ReviewsComponent } from '../review/review';
import { gsap } from 'gsap';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewsComponent, RouterLink],
  template: `
    <section class="detail-page" *ngIf="hotel()">
      <!-- Luxury Hero Section -->
      <div class="hero-section">
        <div class="hero-bg animate-scale-in" [style.backgroundImage]="'url(' + (hotel()?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920') + ')'"></div>
        <div class="hero-overlay"></div>
        
        <div class="container hero-container">
          <div class="hero-content">
            <div class="breadcrumb-luxury">
              <a routerLink="/hotels">Premium Stays</a>
              <span class="sep">/</span>
              <span class="active">{{ hotel()?.city }}</span>
            </div>
            
            <h1 class="luxury-font main-title reveal-text">{{ hotel()?.name }}</h1>
            
            <div class="hero-meta reveal-up">
              <div class="meta-item">
                <i class="fas fa-star text-gold"></i>
                <span class="luxury-font">{{ hotel()?.rating }} / 5.0 Global Rating</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>{{ hotel()?.address }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Bookmark Button -->
        <button class="btn-bookmark-floating" 
                [class.active]="isFavorite()" 
                (click)="toggleFavorite()"
                [title]="isFavorite() ? 'Xóa khỏi yêu thích' : 'Lưu vào yêu thích'">
          <i [class]="isFavorite() ? 'fas fa-bookmark' : 'far fa-bookmark'"></i>
        </button>
      </div>

      <div class="container main-layout">
        <div class="content-primary">
          
          <!-- About Hotel -->
          <div class="section-card glass-luxury reveal-up">
            <h2 class="luxury-font section-title">Về Khách Sạn</h2>
            <div class="desc-content">
              <p>{{ hotel()?.description }}</p>
            </div>
          </div>

          <!-- Room Selection Pro Max -->
          <div class="rooms-section">
            <h2 class="luxury-font section-title reveal-up">Hạng Phòng Thượng Lưu</h2>
            <div class="room-grid">
              <div *ngFor="let room of hotel()?.rooms; let i = index" 
                   class="room-card-pro glass-luxury reveal-up"
                   [class.selected]="selectedRoomId() === room.id"
                   (click)="selectedRoomId.set(room.id)"
                   [style.animation-delay]="(i * 0.1) + 's'">
                
                <div class="room-status-badge" [ngClass]="getBadgeClass(room.classification)">
                  {{ getClassificationLabel(room.classification) || 'Standard' }}
                </div>

                <div class="room-card-inner">
                  <div class="room-header">
                    <h3 class="luxury-font">{{ room.roomType }}</h3>
                    <div class="room-price">
                       <span class="amt">{{ room.pricePerNight | number }}</span>
                       <span class="unit">VNĐ / Đêm</span>
                    </div>
                  </div>

                  <div class="room-details">
                    <div class="detail-pill"><i class="fas fa-users"></i> {{ room.capacity }} Khách</div>
                    <div class="detail-pill"><i class="fas fa-door-open"></i> {{ room.availableRooms }} Phòng còn trống</div>
                  </div>

                  <div class="amenities-wrap">
                    <span class="amenity-tag" *ngFor="let a of room.amenities">
                      <i class="fas fa-gem"></i> {{ a }}
                    </span>
                  </div>

                  <div class="room-action">
                    <div class="select-indicator">
                      <i class="fas" [class.fa-check-circle]="selectedRoomId() === room.id" [class.fa-circle]="selectedRoomId() !== room.id"></i>
                      <span>{{ selectedRoomId() === room.id ? 'Hạng phòng đã chọn' : 'Chọn hạng phòng này' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Section -->
          <div class="section-card glass-luxury reveal-up" *ngIf="hasCoordinates()">
             <div class="section-header-flex">
                <h2 class="luxury-font section-title">Vị Trí Khách Sạn</h2>
                <a [href]="getGoogleMapsUrl()" target="_blank" class="btn-text-gold">
                  Chỉ đường <i class="fas fa-directions"></i>
                </a>
             </div>
             <div class="map-container-pro">
                <iframe [src]="getMapEmbedUrl()" class="iframe-map" allowfullscreen loading="lazy"></iframe>
             </div>
          </div>

          <!-- Reviews -->
          <div class="reviews-section reveal-up">
            <app-reviews [serviceId]="hotel()!.id" serviceType="HOTEL"></app-reviews>
          </div>
        </div>

        <!-- Sticky Sidebar Booking -->
        <aside class="sidebar-sticky">
          <div class="booking-card-pro glass-luxury reveal-right">
            <h3 class="luxury-font sidebar-heading">Đặt Phòng Trực Tuyến</h3>
            
            <div class="booking-form">
              <div class="date-grid">
                <div class="form-group">
                  <label class=" luxury-font">📅 NHẬN PHÒNG</label>
                  <input type="date" [(ngModel)]="checkIn" (change)="calculateNights()" class="luxury-input">
                </div>
                <div class="form-group">
                  <label class=" luxury-font">📅 TRẢ PHÒNG</label>
                  <input type="date" [(ngModel)]="checkOut" (change)="calculateNights()" class="luxury-input">
                </div>
              </div>

              <!-- Selection Summary -->
              <div class="selection-summary-glass" *ngIf="nights() > 0 && selectedRoom()">
                <div class="summary-line">
                  <span>{{ selectedRoom()?.roomType }}</span>
                  <span>x {{ nights() }} đêm</span>
                </div>
                <div class="summary-total">
                  <span>TỔNG CỘNG</span>
                  <span class="total-amt">{{ (selectedRoom()?.pricePerNight || 0) * nights() | number }} VNĐ</span>
                </div>
              </div>

              <div class="booking-guarantees">
                <div class="g-item"><i class="fas fa-check"></i> Xác nhận tức thì</div>
                <div class="g-item"><i class="fas fa-check"></i> Giá tốt nhất trực tiếp từ khách sạn</div>
                <div class="g-item"><i class="fas fa-check"></i> Miễn phí hủy phòng (điều kiện kèm theo)</div>
              </div>

              <button class="btn-book-luxury" [disabled]="nights() <= 0 || !selectedRoomId()" (click)="onBook()">
                <span>ĐẶT PHÒNG NGAY</span>
                <i class="fas fa-calendar-check"></i>
              </button>
            </div>

            <div class="card-footer-pro">
               <p><i class="fas fa-lock"></i> Thanh toán bảo mật 256-bit</p>
            </div>
          </div>

          <!-- Help Card -->
          <div class="help-mini-glass glass-luxury reveal-right" style="margin-top: 20px;">
             <p>Bạn cần hỗ trợ đặt phòng đặc biệt?</p>
             <button class="btn-contact-mini">Liên hệ Chuyên gia</button>
          </div>
        </aside>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-gradient: linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%); }

    .detail-page { background: #020617; color: #fff; min-height: 100vh; padding-bottom: 100px; }
    .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }

    /* Hero Section */
    .hero-section { height: 75vh; position: relative; overflow: hidden; display: flex; align-items: center; }
    .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: 1.5s ease-out; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #020617 5%, rgba(2, 6, 23, 0.3) 60%, rgba(2, 6, 23, 0.7) 100%); }
    
    .hero-container { position: relative; z-index: 10; width: 100%; top: 40px; }
    .breadcrumb-luxury { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #64748b; }
    .breadcrumb-luxury a { color: var(--gold-primary); text-decoration: none; }
    .breadcrumb-luxury .active { color: #fff; }

    .main-title { font-size: 5rem; line-height: 1.1; margin-bottom: 35px; max-width: 1000px; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .hero-meta { display: flex; gap: 40px; }
    .meta-item { display: flex; align-items: center; gap: 12px; font-size: 1rem; color: #cbd5e1; font-weight: 500; }
    .meta-item i { color: var(--gold-primary); font-size: 1.2rem; }

    /* Floating Bookmark */
    .btn-bookmark-floating { 
      position: absolute; top: 40px; right: 40px; width: 70px; height: 70px; 
      border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
      cursor: pointer; transition: all 0.4s; backdrop-filter: blur(15px); z-index: 100;
    }
    .btn-bookmark-floating:hover { transform: scale(1.1); background: var(--gold-primary); color: #000; box-shadow: 0 0 30px rgba(212, 175, 55, 0.4); }
    .btn-bookmark-floating.active { background: var(--gold-gradient); color: #000; border-color: transparent; }

    /* Layout */
    .main-layout { display: grid; grid-template-columns: 1fr 420px; gap: 60px; margin-top: -100px; position: relative; z-index: 20; }
    .content-primary { display: flex; flex-direction: column; gap: 50px; }

    .glass-luxury { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; }
    
    .help-mini-glass { padding: 30px; text-align: center; display: flex; flex-direction: column; gap: 20px; align-items: center; border-radius: 30px; }
    .help-mini-glass p { font-size: 1rem; color: #fff; margin: 0; line-height: 1.5; font-weight: 500; }
    .btn-contact-mini { 
      background: var(--gold-primary); color: #000; 
      border: none; padding: 14px 25px; border-radius: 12px; 
      font-weight: 800; cursor: pointer; transition: 0.3s; font-size: 0.9rem;
      letter-spacing: 1px; width: 100%; text-transform: uppercase;
    }
    .btn-contact-mini:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3); }

    .section-card { padding: 55px; }
    .section-title { font-size: 2.4rem; color: #fff; margin-bottom: 40px; border-left: 5px solid var(--gold-primary); padding-left: 30px; }

    .desc-content p { font-size: 1.2rem; line-height: 1.9; color: #94a3b8; font-weight: 300; }

    /* Room Grid */
    .room-grid { display: flex; flex-direction: column; gap: 30px; }
    .room-card-pro { position: relative; cursor: pointer; transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1); border: 1px solid rgba(255,255,255,0.08); }
    .room-card-pro:hover { transform: scale(1.02); border-color: rgba(212, 175, 55, 0.3); background: rgba(212, 175, 55, 0.03); }
    .room-card-pro.selected { border-width: 2px; border-color: var(--gold-primary); background: rgba(212, 175, 55, 0.08); box-shadow: 0 20px 40px rgba(0,0,0,0.3); }

    .room-status-badge { 
      position: absolute; top: -15px; left: 40px; background: #1e293b; color: #94a3b8; 
      padding: 6px 18px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; 
      text-transform: uppercase; letter-spacing: 2px; border: 1px solid rgba(255,255,255,0.1);
    }
    .room-status-badge.premium { color: var(--gold-primary); border-color: var(--gold-primary); }
    .room-status-badge.luxury { background: var(--gold-gradient); color: #000; border-color: transparent; }

    .room-card-inner { padding: 45px; }
    .room-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 25px; }
    .room-header h3 { font-size: 1.8rem; margin: 0; }
    .room-price { text-align: right; }
    .room-price .amt { font-size: 2rem; font-weight: 800; color: var(--gold-primary); display: block; }
    .room-price .unit { font-size: 0.8rem; color: #64748b; font-weight: 700; }

    .room-details { display: flex; gap: 20px; margin-bottom: 30px; }
    .detail-pill { background: rgba(255,255,255,0.04); padding: 8px 16px; border-radius: 12px; font-size: 0.85rem; color: #cbd5e1; display: flex; align-items: center; gap: 10px; font-weight: 600; }
    .detail-pill i { color: var(--gold-primary); }

    .amenities-wrap { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 30px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 25px; }
    .amenity-tag { font-size: 0.8rem; color: #64748b; font-weight: 500; display: flex; align-items: center; gap: 8px; }
    .amenity-tag i { font-size: 0.6rem; color: var(--gold-primary); }

    .room-action { display: flex; justify-content: flex-end; }
    .select-indicator { display: flex; align-items: center; gap: 12px; color: #475569; font-weight: 700; font-size: 0.9rem; transition: 0.3s; }
    .selected .select-indicator { color: var(--gold-primary); }
    .select-indicator i { font-size: 1.4rem; }

    /* Sidebar */
    .sidebar-sticky { position: sticky; top: 120px; height: fit-content; display: flex; flex-direction: column; gap: 30px; }
    .booking-card-pro { padding: 45px; }
    .sidebar-heading { font-size: 1.8rem; text-align: center; margin-bottom: 40px; color: var(--gold-primary); }

    .date-grid { display: grid; gap: 20px; margin-bottom: 30px; }
    .form-group label { display: block; font-size: 0.7rem; letter-spacing: 2px; color: #64748b; margin-bottom: 12px; font-weight: 800; }
    .luxury-input { width: 100%; border: none; background: rgba(255,255,255,0.05); padding: 18px; border-radius: 15px; color: #fff; font-size: 1rem; border: 1px solid rgba(255,255,255,0.1); box-sizing: border-box; }
    .luxury-input:focus { outline: none; border-color: var(--gold-primary); background: rgba(212, 175, 55, 0.05); }

    .selection-summary-glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 25px; border-radius: 20px; margin-bottom: 30px; }
    .summary-line { display: flex; justify-content: space-between; color: #94a3b8; font-size: 0.95rem; margin-bottom: 15px; }
    .summary-total { display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 15px; font-weight: 800; }
    .total-amt { color: var(--gold-primary); font-size: 1.4rem; }

    .booking-guarantees { display: flex; flex-direction: column; gap: 15px; margin-bottom: 40px; padding: 0 10px; }
    .g-item { display: flex; align-items: center; gap: 15px; font-size: 0.8rem; color: #64748b; font-weight: 600; }
    .g-item i { color: #22c55e; }

    .btn-book-luxury { 
      width: 100%; padding: 22px; border: none; border-radius: 20px; 
      background: var(--gold-gradient); color: #000; font-weight: 900; 
      letter-spacing: 2px; font-size: 1rem; cursor: pointer; transition: 0.4s;
      display: flex; align-items: center; justify-content: center; gap: 15px;
      box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3);
    }
    .btn-book-luxury:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(212, 175, 55, 0.5); }
    .btn-book-luxury:disabled { opacity: 0.2; cursor: not-allowed; box-shadow: none; transform: none; }

    .card-footer-pro { text-align: center; margin-top: 25px; color: #475569; font-size: 0.75rem; font-weight: 600; }

    /* Map */
    .map-container-pro { height: 450px; border-radius: 32px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .iframe-map { width: 100%; height: 100%; border:0; filter: grayscale(1) invert(0.9) contrast(1.1); }

    /* Animations */
    .animate-scale-in { animation: scaleIn 2s ease-out forwards; }
    @keyframes scaleIn { from { transform: scale(1.1); } to { transform: scale(1); } }
    .reveal-up { opacity: 0; transform: translateY(50px); }
    .reveal-right { opacity: 0; transform: translateX(50px); }
    .reveal-text { opacity: 0; transform: translateY(20px); filter: blur(5px); }

    @media (max-width: 1200px) {
      .main-layout { grid-template-columns: 1fr; }
      .main-title { font-size: 3.5rem; }
      .sidebar-sticky { position: static; max-width: 500px; margin: 0 auto; }
    }
  `]
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);
  private favoriteService = inject(FavoriteService);
  private sanitizer = inject(DomSanitizer);

  hotel = signal<Hotel | null>(null);
  isFavorite = signal(false);
  selectedRoomId = signal<string | null>(null);
  checkIn: string = '';
  checkOut: string = '';
  nights = signal<number>(0);

  selectedRoom = computed(() => {
    return this.hotel()?.rooms?.find(r => r.id === this.selectedRoomId());
  });

  constructor() {
    effect(() => {
      const h = this.hotel();
      if (h) {
        this.checkFavorite();
        this.initAnimations();
      }
    });
  }

  ngOnInit() {
    this.loadHotel();
  }

  loadHotel() {
    const id = this.route.snapshot.params['id'];
    this.hotelService.getHotel(id, this.checkIn, this.checkOut).subscribe({
      next: (res) => {
        if (res.success) this.hotel.set(res.data);
      }
    });
  }

  checkFavorite() {
    const h = this.hotel();
    if (!h) return;
    this.favoriteService.getFavoriteStatus('HOTEL', h.id).subscribe((res: any) => {
      this.isFavorite.set(res.success && res.data);
    });
  }

  toggleFavorite() {
    const h = this.hotel();
    if (!h) return;
    this.favoriteService.toggleFavorite({ itemType: 'HOTEL', itemId: h.id }).subscribe(res => {
      if (res.success) {
        this.isFavorite.set(!this.isFavorite());
        gsap.to('.btn-bookmark-floating', { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 });
      }
    });
  }

  private initAnimations() {
    setTimeout(() => {
      gsap.to('.reveal-text', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power4.out' });
      gsap.to('.reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out', delay: 0.5 });
      gsap.to('.reveal-right', { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 1 });
    }, 100);
  }

  getMapEmbedUrl(): SafeResourceUrl {
    const h = this.hotel();
    if (!this.hasCoordinates()) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const url = `https://maps.google.com/maps?q=${h!.latitude},${h!.longitude}&z=16&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  hasCoordinates(): boolean {
    const h = this.hotel();
    return !!(h && h.latitude !== null && h.longitude !== null && h.latitude !== undefined);
  }

  getGoogleMapsUrl(): string {
    const h = this.hotel();
    if (!h?.latitude || !h?.longitude) return '#';
    return `https://www.google.com/maps?q=${h.latitude},${h.longitude}&z=17`;
  }

  calculateNights() {
    if (this.checkIn && this.checkOut) {
      const start = new Date(this.checkIn);
      const end = new Date(this.checkOut);
      const diff = end.getTime() - start.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      this.nights.set(days > 0 ? days : 0);

      if (days > 0) {
        this.loadHotel();
      }
    }
  }

  onBook() {
    if (!this.hotel() || this.nights() <= 0) return;

    const request = {
      items: [{
        type: 'HOTEL',
        serviceId: this.selectedRoomId()!,
        quantity: 1,
        checkInDate: this.checkIn,
        checkOutDate: this.checkOut
      }]
    };

    this.bookingService.createBooking(request).subscribe({
      next: (res) => {
        if (res.success) {
          this.router.navigate(['/bookings', res.data.id]);
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi đặt phòng. Vui lòng thử lại.';
        alert(errorMsg);
      }
    });
  }

  getClassificationLabel(classification: string | undefined): string {
    switch (classification) {
      case 'BEST_VALUE': return 'Giá tốt nhất';
      case 'PREMIUM': return 'Cao cấp';
      case 'LUXURY': return 'Thượng hạng';
      default: return '';
    }
  }

  getBadgeClass(classification: string | undefined): string {
    switch (classification) {
      case 'PREMIUM': return 'premium';
      case 'LUXURY': return 'luxury';
      default: return '';
    }
  }
}
