import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CatalogService, Tour } from '../../core/services/catalog.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewsComponent } from '../review/review';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewsComponent],
  template: `
    <section class="detail-page animate-fade-in" *ngIf="tour()">
      <div class="hero-header" [style.backgroundImage]="'url(' + (tour()?.imageUrl || 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920') + ')'">
        <div class="overlay"></div>
        <div class="container hero-content">
          <div class="rating luxury-font">ĐIỂM ĐẾN THƯỢNG LƯU · {{ tour()?.location }}</div>
          <h1 class="luxury-font">{{ tour()?.title }}</h1>
          <p class="address">📍 {{ tour()?.location }} · {{ tour()?.duration }}</p>
        </div>
      </div>

      <div class="container main-grid">
        <div class="content-side">
          <div class="description-block glass-effect">
            <h2 class="luxury-font">Giới Thiệu Chuyến Đi</h2>
            <p>{{ tour()?.description }}</p>
          </div>

          <div class="highlights-block glass-effect">
            <h2 class="luxury-font">Điểm Nhấn Nổi Bật</h2>
            <ul class="highlights-list">
              <li *ngFor="let highlight of tour()?.highlights">
                <span class="icon">✨</span> {{ highlight }}
              </li>
            </ul>
          </div>

          <!-- Combo Details -->
          <div class="combo-section" *ngIf="tour()?.hotelId || tour()?.flightId || tour()?.poiIds?.length">
            <h2 class="luxury-font section-title">Combo Trọn Gói Thượng Lưu</h2>
            <div class="combo-grid">
              <div class="combo-card glass-effect animate-slide-up" *ngIf="tour()?.hotelId">
                <div class="card-icon">🏨</div>
                <div class="card-info">
                  <h3>Khách Sạn Sang Trọng</h3>
                  <p>Lưu trú tại resort/khách sạn 5 sao cao cấp.</p>
                  <span class="badge">Đã bao gồm</span>
                </div>
              </div>

              <div class="combo-card glass-effect animate-slide-up" *ngIf="tour()?.flightId">
                <div class="card-icon">✈️</div>
                <div class="card-info">
                  <h3>Vé Máy Bay Hạng Thương Gia</h3>
                  <p>Trải nghiệm bay đẳng cấp với dịch vụ ưu tiên.</p>
                  <span class="badge">Đã bao gồm</span>
                </div>
              </div>

              <div class="combo-card glass-effect animate-slide-up" *ngIf="tour()?.poiIds?.length">
                <div class="card-icon">🗺️</div>
                <div class="card-info">
                  <h3>Điểm Tham Quan Đặc Sắc</h3>
                  <p>{{ tour()?.poiIds?.length }} địa điểm du lịch tiêu biểu.</p>
                  <span class="badge">Vé vào cổng hoàn tất</span>
                </div>
              </div>
            </div>
          </div>

          <!-- AI Suggestions -->
          <div class="ai-block glass-effect" *ngIf="tour()?.aiSuggestions">
            <div class="ai-header">
              <span class="ai-icon">🤖</span>
              <h2 class="luxury-font">Gợi Ý Từ Trợ Lý AI</h2>
            </div>
            <div class="ai-content">
                <p>{{ tour()?.aiSuggestions }}</p>
            </div>
          </div>

          <!-- 📍 Vị Trí & Khám Phá Địa Phương -->
          <div class="location-wrapper glass-effect animate-slide-up" *ngIf="hasCoordinates()">
            <div class="location-header">
              <div class="title-with-icon">
                <i class="fas fa-map-marked-alt text-gold"></i>
                <h2 class="luxury-font">Vị Trí & Khám Phá</h2>
              </div>
              <a [href]="getGoogleMapsUrl()" target="_blank" rel="noopener" class="btn-maps-gold">
                <span>📍</span> Mở trong Google Maps
              </a>
            </div>
            <p class="location-address-pro">{{ tour()?.location }}</p>
            <div class="map-frame-pro">
              <iframe 
                [src]="getMapEmbedUrl()"
                class="full-map-iframe"
                allowfullscreen
                loading="lazy">
              </iframe>
              <div class="map-floating-label">
                <i class="fas fa-street-view mr-2"></i>
                <span>Quan sát thực địa điểm đến của chuyến hành trình</span>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-wrapper" *ngIf="tour()?.id">
            <app-reviews [serviceId]="tour()!.id" serviceType="TOUR"></app-reviews>
          </div>
        </div>

        <div class="sticky-sidebar">
          <div class="booking-summary glass-effect">
            <h3 class="luxury-font">Thông Tin Tour</h3>
            
            <div class="price-box">
                <div class="price-label">Giá trọn gói từ</div>
                <div class="price-value">{{ tour()?.price | number }} VNĐ</div>
                <div class="price-sub">mỗi khách · Combo Full</div>
            </div>

            <div class="summary-details">
              <div class="summary-item">
                <span>Thời gian</span>
                <span>{{ tour()?.durationDays }} ngày</span>
              </div>
              <div class="summary-item">
                <span>Vị trí</span>
                <span>{{ tour()?.location }}</span>
              </div>
            </div>

            <!-- Date Picker Section -->
            <div class="date-picker-section">
              <label class="date-label">📅 Ngày Khởi Hành</label>
              <input 
                type="date" 
                class="date-input"
                [(ngModel)]="departureDate"
                [min]="today"
                (change)="onDepartureDateChange()">
              
              <div class="return-date-preview" *ngIf="returnDate">
                <span class="return-label">🏠 Ngày về dự kiến</span>
                <span class="return-value">{{ returnDate | date:'dd/MM/yyyy' }}</span>
              </div>
            </div>

            <button (click)="onBook()" class="btn-gold w-full mt-4" [disabled]="!departureDate">
              {{ departureDate ? 'Đặt Ngay Combo Này' : 'Chọn Ngày Xuất Phát' }}
            </button>
            <p class="disclaimer">Giá trọn gói đã bao gồm toàn bộ dịch vụ trong combo cao cấp.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .detail-page { padding-bottom: 100px; }
    .hero-header { height: 60vh; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding-bottom: 80px; }
    .overlay { position: absolute; inset: 0; background: linear-gradient(transparent, var(--bg-primary)); }
    .hero-content { position: relative; z-index: 1; }
    .hero-content h1 { font-size: 4rem; color: var(--text-primary); margin-bottom: 10px; }
    .rating { color: var(--gold-primary); letter-spacing: 2px; text-transform: uppercase; font-size: 0.9rem; margin-bottom: 15px; }
    .address { color: var(--text-secondary); font-size: 1.1rem; }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .main-grid { display: grid; grid-template-columns: 1fr 380px; gap: 40px; margin-top: -40px; position: relative; z-index: 10; }
    
    .description-block, .highlights-block, .ai-block { padding: 40px; margin-bottom: 40px; line-height: 1.8; }
    .description-block h2, .highlights-block h2, .section-title { font-size: 2rem; margin-bottom: 20px; color: var(--gold-primary); }
    
    .highlights-list { list-style: none; padding: 0; }
    .highlights-list li { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; font-size: 1.1rem; color: var(--text-secondary); }
    .highlights-list .icon { color: var(--gold-primary); }

    .combo-section { margin-bottom: 40px; }
    .combo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
    .combo-card { padding: 25px; display: flex; gap: 20px; align-items: flex-start; }
    .card-icon { font-size: 2rem; }
    .card-info h3 { font-size: 1.1rem; margin-bottom: 5px; color: var(--text-primary); }
    .card-info p { font-size: 0.9rem; color: var(--text-muted); margin-bottom: 10px; }
    .badge { font-size: 0.7rem; text-transform: uppercase; background: var(--gold-primary); color: black; padding: 4px 10px; border-radius: 4px; font-weight: 700; }

    .ai-header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
    .ai-icon { font-size: 2.5rem; }
    .ai-content { border-left: 3px solid var(--gold-primary); padding-left: 20px; font-style: italic; color: var(--text-secondary); }

    /* Location & Map Enhancements */
    .location-wrapper { padding: 40px; margin-bottom: 40px; border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 20px; }
    .location-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 25px; }
    .title-with-icon { display: flex; align-items: center; gap: 15px; }
    .title-with-icon i { font-size: 1.8rem; color: var(--gold-primary); }
    .title-with-icon h2 { margin: 0; font-size: 1.8rem; color: var(--gold-primary); }
    .location-address-pro { color: var(--text-secondary); margin-bottom: 20px; font-size: 0.95rem; }
    .btn-maps-gold { display: flex; align-items: center; gap: 10px; background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); border: 1px solid var(--gold-primary); padding: 10px 20px; border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 700; transition: 0.3s; }
    .btn-maps-gold:hover { background: var(--gold-primary); color: #000; box-shadow: 0 5px 20px rgba(212, 175, 55, 0.3); }
    .map-frame-pro { position: relative; height: 450px; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .full-map-iframe { width: 100%; height: 100%; border:0; }
    .map-floating-label { position: absolute; top: 20px; right: 20px; background: rgba(5, 10, 20, 0.8); backdrop-filter: blur(10px); padding: 8px 16px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 0.75rem; pointer-events: none; }

    .sticky-sidebar { position: sticky; top: 120px; height: fit-content; }
    .booking-summary { padding: 40px; border-radius: 20px; }
    .booking-summary h3 { font-size: 1.8rem; margin-bottom: 30px; color: var(--gold-primary); text-align: center; }
    
    .price-box { background: rgba(255,255,255,0.05); padding: 25px; border-radius: 12px; border: 1px solid var(--glass-border); text-align: center; margin-bottom: 30px; }
    .price-label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px; }
    .price-value { font-size: 2rem; font-weight: 800; color: var(--gold-primary); }
    .price-sub { font-size: 0.85rem; color: var(--text-muted); }

    .summary-item { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--glass-border); font-size: 0.95rem; }

    /* Date Picker */
    .date-picker-section { margin: 24px 0; }
    .date-label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--gold-primary); letter-spacing: 1px; margin-bottom: 10px; }
    .date-input { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); color: var(--text-primary); padding: 12px 14px; border-radius: 8px; font-size: 0.95rem; cursor: pointer; transition: border-color 0.3s; box-sizing: border-box; }
    .date-input:focus { outline: none; border-color: var(--gold-primary); }
    .date-input::-webkit-calendar-picker-indicator { filter: invert(1) brightness(0.7); cursor: pointer; }
    .return-date-preview { display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding: 10px 14px; background: rgba(201, 168, 76, 0.08); border-radius: 8px; border: 1px solid rgba(201, 168, 76, 0.3); }
    .return-label { font-size: 0.8rem; color: var(--text-secondary); }
    .return-value { font-size: 0.9rem; font-weight: 600; color: var(--gold-primary); }

    .w-full { width: 100%; }
    .mt-4 { margin-top: 20px; }
    .disclaimer { font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 20px; line-height: 1.4; }
  `]
})
export class TourDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private bookingService = inject(BookingService);
  private sanitizer = inject(DomSanitizer);

  tour = signal<any | null>(null);
  departureDate: string = '';
  returnDate: Date | null = null;
  today = new Date().toISOString().split('T')[0];

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.catalogService.getTour(id).subscribe({
      next: (res) => {
        if (res.success) this.tour.set(res.data);
      }
    });
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
          checkInDate: this.departureDate,   // ngày đi - backend sẽ tự tính ngày về
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
