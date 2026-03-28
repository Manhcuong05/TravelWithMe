import { Component, inject, OnInit, signal, computed, effect, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CatalogService, Tour } from '../../core/services/catalog.service';
import { BookingService } from '../../core/services/booking.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { ReviewsComponent } from '../review/review';
import { gsap } from 'gsap';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewsComponent, RouterLink],
  template: `
    <section class="detail-page" *ngIf="tour()">
      <!-- Luxury Hero Section -->
      <div class="hero-section">
        <div class="hero-bg animate-scale-in" [style.backgroundImage]="'url(' + (tour()?.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920') + ')'"></div>
        <div class="hero-overlay"></div>
        
        <div class="container hero-container">
          <div class="hero-content">
            <div class="breadcrumb-luxury">
              <a routerLink="/tours">Exclusive Tours</a>
              <span class="sep">/</span>
              <span class="active">{{ tour()?.location }}</span>
            </div>
            
            <h1 class="luxury-font main-title reveal-text">{{ tour()?.title }}</h1>
            
            <div class="hero-meta reveal-up">
              <div class="meta-item">
                <i class="fas fa-star text-gold"></i>
                <span>4.9 (120+ Đánh giá)</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-clock"></i>
                <span>{{ tour()?.durationDays }} Ngày {{ tour()?.durationDays! - 1 }} Đêm</span>
              </div>
              <div class="meta-item">
                <i class="fas fa-shield-alt"></i>
                <span>Bảo hiểm hành trình trọn gói</span>
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
          
          <!-- Experience Highlights -->
          <div class="section-card glass-luxury reveal-up">
            <h2 class="luxury-font section-title">Trải Nghiệm Độc Bản</h2>
            <div class="highlights-grid">
              <div class="highlight-item" *ngFor="let h of tour()?.highlights">
                <div class="h-icon"><i class="fas fa-check-circle"></i></div>
                <p>{{ h }}</p>
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="section-card glass-luxury reveal-up">
            <h2 class="luxury-font section-title">Giới Thiệu Hành Trình</h2>
            <div class="desc-content">
              <p>{{ tour()?.description }}</p>
            </div>
          </div>

          <!-- Timeline Itinerary Pro Max -->
          <div class="section-card glass-luxury reveal-up">
            <h2 class="luxury-font section-title">Lịch Trình Chi Tiết</h2>
            <div class="timeline-container">
              <div class="timeline-line"></div>
              
              <!-- Mock days since real tours might just have a text description -->
              <div class="timeline-item" *ngFor="let day of [1,2,3]; let i = index">
                <div class="timeline-dot">Day {{ day }}</div>
                <div class="timeline-content">
                  <h3 class="luxury-font day-title">Khám Phá {{ tour()?.location }} - Giai đoạn {{ day }}</h3>
                  <p>Trải nghiệm trọn vẹn từng khoảnh khắc tại những địa điểm biểu tượng nhất. Dịch vụ cao cấp được phục vụ chu đáo tận nơi.</p>
                  <div class="day-tags">
                    <span class="d-tag"><i class="fas fa-utensils"></i> Bữa sáng/trưa/tối</span>
                    <span class="d-tag"><i class="fas fa-car"></i> Xe đưa đón 5 sao</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Map Section -->
          <div class="section-card glass-luxury reveal-up" *ngIf="hasCoordinates()">
             <div class="section-header-flex">
                <h2 class="luxury-font section-title">Vị Trí Hành Trình</h2>
                <a [href]="getGoogleMapsUrl()" target="_blank" class="btn-text-gold">
                  Xem trên Google Maps <i class="fas fa-external-link-alt"></i>
                </a>
             </div>
             <div class="map-container-pro">
                <iframe [src]="getMapEmbedUrl()" class="iframe-map" allowfullscreen loading="lazy"></iframe>
             </div>
          </div>

          <!-- Reviews -->
          <div class="reviews-section reveal-up">
            <app-reviews [serviceId]="tour()!.id" serviceType="TOUR"></app-reviews>
          </div>
        </div>

        <!-- Sticky Sidebar Booking -->
        <aside class="sidebar-sticky">
          <div class="booking-card-pro glass-luxury reveal-right">
            <div class="card-header">
              <span class="starting-label">Giá trọn gói từ</span>
              <div class="card-price">
                <span class="currency">VNĐ</span>
                <span class="amount">{{ tour()?.price | number }}</span>
              </div>
              <p class="price-desc">Đã bao gồm VAT & Phí dịch vụ cao cấp</p>
            </div>

            <div class="booking-form">
              <div class="form-group">
                <label class=" luxury-font">📅 NGÀY KHỞI HÀNH</label>
                <div class="input-wrapper">
                  <input type="date" [(ngModel)]="departureDate" [min]="today" (change)="onDepartureDateChange()" class="luxury-input">
                </div>
              </div>

              <div class="return-info-glass" *ngIf="returnDate">
                <div class="info-row">
                  <i class="fas fa-plane-arrival"></i>
                  <span>Ngày về dự kiến: <strong>{{ returnDate | date:'dd/MM/yyyy' }}</strong></span>
                </div>
              </div>

              <div class="inclusions-mini">
                <div class="inc-item"><i class="fas fa-hotel"></i> Khách sạn 5 sao</div>
                <div class="inc-item"><i class="fas fa-plane"></i> Vé máy bay khứ hồi</div>
                <div class="inc-item"><i class="fas fa-shuttle-van"></i> Xe đưa đón riêng</div>
              </div>

              <button class="btn-book-luxury" [disabled]="!departureDate" (click)="onBook()">
                <span>{{ departureDate ? 'XÁC NHẬN ĐẶT TOUR' : 'CHỌN NGÀY ĐI' }}</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>

            <div class="card-footer">
              <i class="fas fa-headset"></i>
              <span>Hỗ trợ 24/7 bởi chuyên gia du lịch</span>
            </div>
          </div>

          <!-- Contact Mini Card -->
          <div class="contact-mini-glass glass-luxury reveal-right" style="margin-top: 20px;">
             <p>Cần tư vấn thêm cho hành trình này?</p>
             <a href="tel:19001234" class="phone-link luxury-font">1900 1234</a>
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
    .hero-section { height: 85vh; position: relative; overflow: hidden; display: flex; align-items: center; }
    .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: 1.5s ease-out; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, #020617 5%, rgba(2, 6, 23, 0.4) 60%, rgba(2, 6, 23, 0.8) 100%); }
    
    .hero-container { position: relative; z-index: 10; width: 100%; top: 50px; }
    .breadcrumb-luxury { display: flex; align-items: center; gap: 12px; margin-bottom: 30px; font-size: 0.8rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #64748b; }
    .breadcrumb-luxury a { color: var(--gold-primary); text-decoration: none; transition: 0.3s; }
    .breadcrumb-luxury a:hover { color: #fff; }
    .breadcrumb-luxury .active { color: #fff; }

    .main-title { font-size: 5rem; line-height: 1.1; margin-bottom: 35px; max-width: 900px; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .hero-meta { display: flex; gap: 40px; }
    .meta-item { display: flex; align-items: center; gap: 12px; font-size: 0.9rem; color: #94a3b8; font-weight: 600; }
    .meta-item i { color: var(--gold-primary); font-size: 1.1rem; }

    /* Floating Bookmark */
    .btn-bookmark-floating { 
      position: absolute; top: 40px; right: 40px; width: 70px; height: 70px; 
      border-radius: 50%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
      color: #fff; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
      cursor: pointer; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); backdrop-filter: blur(15px); z-index: 100;
    }
    .btn-bookmark-floating:hover { transform: scale(1.1) rotate(5deg); background: var(--gold-primary); border-color: var(--gold-primary); color: #000; box-shadow: 0 0 40px rgba(212, 175, 55, 0.4); }
    .btn-bookmark-floating.active { background: var(--gold-gradient); color: #000; border-color: transparent; }

    /* Layout */
    .main-layout { display: grid; grid-template-columns: 1fr 420px; gap: 60px; margin-top: -120px; position: relative; z-index: 20; }
    .content-primary { display: flex; flex-direction: column; gap: 40px; }

    .glass-luxury { background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(30px); border: 1px solid rgba(255,255,255,0.08); border-radius: 40px; }
    .section-card { padding: 50px; }
    .section-title { font-size: 2.2rem; color: #fff; margin-bottom: 35px; border-left: 5px solid var(--gold-primary); padding-left: 25px; }

    .highlights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
    .highlight-item { display: flex; gap: 15px; align-items: flex-start; }
    .h-icon { color: var(--gold-primary); font-size: 1.2rem; margin-top: 3px; }
    .highlight-item p { font-size: 1.05rem; color: #cbd5e1; line-height: 1.5; }

    .desc-content p { font-size: 1.15rem; line-height: 1.8; color: #94a3b8; font-weight: 300; }

    /* Timeline */
    .timeline-container { position: relative; padding-left: 20px; }
    .timeline-line { position: absolute; left:-2px; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--gold-primary), transparent); }
    .timeline-item { position: relative; margin-bottom: 50px; padding-left: 45px; }
    .timeline-dot { 
      position: absolute; left: -25px; top: 0; width: 50px; height: 50px; 
      border-radius: 50%; background: #020617; border: 2px solid var(--gold-primary);
      display: flex; align-items: center; justify-content: center; font-size: 0.7rem; 
      font-weight: 800; color: var(--gold-primary); text-transform: uppercase;
    }
    .day-title { font-size: 1.6rem; color: #fff; margin-bottom: 15px; }
    .day-tags { display: flex; gap: 15px; margin-top: 20px; }
    .d-tag { background: rgba(255,255,255,0.05); padding: 6px 14px; border-radius: 8px; font-size: 0.75rem; color: #64748b; display: flex; align-items: center; gap: 8px; font-weight: 600; }
    .d-tag i { color: var(--gold-primary); }

    /* Sidebar */
    .sidebar-sticky { position: sticky; top: 120px; height: fit-content; display: flex; flex-direction: column; gap: 30px; }
    .booking-card-pro { padding: 45px; }
    .card-header { text-align: center; margin-bottom: 35px; }
    .starting-label { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; color: #64748b; font-weight: 800; }
    .card-price { display: flex; align-items: baseline; justify-content: center; gap: 10px; margin: 10px 0; }
    .currency { font-size: 1.2rem; color: var(--gold-primary); font-weight: 700; }
    .amount { font-size: 3.5rem; font-weight: 800; color: #fff; font-family: 'Playfair Display', serif; }
    .price-desc { font-size: 0.8rem; color: #475569; }

    .form-group { margin-bottom: 30px; }
    .form-group label { display: block; font-size: 0.7rem; letter-spacing: 2px; color: var(--gold-primary); margin-bottom: 15px; font-weight: 800; }
    .luxury-input { width: 100%; border: none; background: rgba(255,255,255,0.05); padding: 18px; border-radius: 12px; color: #fff; font-size: 1rem; border: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: 0.3s; box-sizing: border-box; }
    .luxury-input:focus { outline: none; border-color: var(--gold-primary); background: rgba(212, 175, 55, 0.05); }

    .return-info-glass { background: rgba(212, 175, 55, 0.1); padding: 15px; border-radius: 12px; border: 1px solid rgba(212, 175, 55, 0.3); margin-bottom: 25px; }
    .info-row { display: flex; align-items: center; gap: 12px; color: #cbd5e1; font-size: 0.9rem; }
    .info-row i { color: var(--gold-primary); }

    .inclusions-mini { display: flex; flex-direction: column; gap: 12px; margin-bottom: 35px; }
    .inc-item { display: flex; align-items: center; gap: 15px; font-size: 0.85rem; color: #94a3b8; font-weight: 600; }
    .inc-item i { width: 20px; color: var(--gold-primary); text-align: center; }

    .btn-book-luxury { 
      width: 100%; padding: 22px; border: none; border-radius: 18px; 
      background: var(--gold-gradient); color: #000; font-weight: 900; 
      letter-spacing: 2px; font-size: 1rem; cursor: pointer; transition: 0.4s;
      display: flex; align-items: center; justify-content: center; gap: 15px;
      box-shadow: 0 15px 35px rgba(212, 175, 55, 0.3);
    }
    .btn-book-luxury:hover { transform: translateY(-5px); box-shadow: 0 20px 50px rgba(212, 175, 55, 0.5); }
    .btn-book-luxury:disabled { opacity: 0.3; cursor: not-allowed; box-shadow: none; transform: none; }

    .contact-mini-glass { padding: 25px; text-align: center; }
    .phone-link { color: var(--gold-primary); font-size: 1.8rem; text-decoration: none; display: block; margin-top: 10px; }

    /* Map */
    .map-container-pro { height: 450px; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .iframe-map { width: 100%; height: 100%; border:0; filter: grayscale(1) invert(0.9) contrast(1.2); }

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
export class TourDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private bookingService = inject(BookingService);
  private favoriteService = inject(FavoriteService);
  private sanitizer = inject(DomSanitizer);
  private el = inject(ElementRef);

  tour = signal<any | null>(null);
  isFavorite = signal(false);
  departureDate: string = '';
  returnDate: Date | null = null;
  today = new Date().toISOString().split('T')[0];

  constructor() {
    effect(() => {
      const t = this.tour();
      if (t) {
        this.checkFavorite();
        this.initAnimations();
      }
    });
  }

  ngOnInit() {
    this.loadTour();
  }

  loadTour() {
    const id = this.route.snapshot.params['id'];
    this.catalogService.getTour(id).subscribe({
      next: (res) => {
        if (res.success) {
          this.tour.set(res.data);
        }
      }
    });
  }

  checkFavorite() {
    const t = this.tour();
    if (!t) return;
    this.favoriteService.getFavoriteStatus('TOUR', t.id).subscribe((res: any) => {
      this.isFavorite.set(res.success && res.data);
    });
  }

  toggleFavorite() {
    const t = this.tour();
    if (!t) return;
    this.favoriteService.toggleFavorite({ itemType: 'TOUR', itemId: t.id }).subscribe(res => {
      if (res.success) {
        this.isFavorite.set(!this.isFavorite());
        // Small GSAP pop effect
        gsap.to('.btn-bookmark-floating', { scale: 1.3, duration: 0.2, yoyo: true, repeat: 1 });
      }
    });
  }

  private initAnimations() {
    setTimeout(() => {
      gsap.to('.reveal-text', { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, stagger: 0.1, ease: 'power4.out' });
      gsap.to('.reveal-up', { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: 'power3.out', delay: 0.5 });
      gsap.to('.reveal-right', { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 1 });
    }, 100);
  }

  getMapEmbedUrl(): SafeResourceUrl {
    const t = this.tour();
    if (!this.hasCoordinates()) return this.sanitizer.bypassSecurityTrustResourceUrl('');
    const url = `https://maps.google.com/maps?q=${t.latitude},${t.longitude}&z=15&output=embed`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  hasCoordinates(): boolean {
    const t = this.tour();
    return !!(t && t.latitude !== null && t.longitude !== null && t.latitude !== undefined);
  }

  getGoogleMapsUrl(): string {
    const t = this.tour();
    if (!t?.latitude || !t?.longitude) return '#';
    return `https://www.google.com/maps?q=${t.latitude},${t.longitude}&z=15`;
  }

  onDepartureDateChange() {
    const currentTour = this.tour();
    if (!this.departureDate || !currentTour?.durationDays) {
      this.returnDate = null;
      return;
    }
    const dep = new Date(this.departureDate);
    dep.setDate(dep.getDate() + currentTour.durationDays);
    this.returnDate = dep;
  }

  onBook() {
    const currentTour = this.tour();
    if (!currentTour) return;
    if (!this.departureDate) {
      alert('Vui lòng chọn ngày khởi hành!');
      return;
    }

    this.bookingService.createBooking({
      items: [
        {
          type: 'TOUR',
          serviceId: currentTour.id,
          quantity: 1,
          checkInDate: this.departureDate,
        }
      ]
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.router.navigate(['/bookings', res.data.id]);
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Có lỗi xảy ra khi đặt tour. Vui lòng thử lại.';
        alert(errorMsg);
      }
    });
  }
}
