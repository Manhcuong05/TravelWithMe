import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

            <button (click)="onBook()" class="btn-gold w-full mt-4">
              Đặt Ngay Combo Này
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

    .sticky-sidebar { position: sticky; top: 120px; height: fit-content; }
    .booking-summary { padding: 40px; }
    .booking-summary h3 { font-size: 1.8rem; margin-bottom: 30px; color: var(--gold-primary); text-align: center; }
    
    .price-box { background: rgba(255,255,255,0.05); padding: 25px; border-radius: 12px; border: 1px solid var(--glass-border); text-align: center; margin-bottom: 30px; }
    .price-label { font-size: 0.8rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 5px; }
    .price-value { font-size: 2rem; font-weight: 800; color: var(--gold-primary); }
    .price-sub { font-size: 0.85rem; color: var(--text-muted); }

    .summary-item { display: flex; justify-content: space-between; padding: 15px 0; border-bottom: 1px solid var(--glass-border); font-size: 0.95rem; }
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

  tour = signal<any | null>(null);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.catalogService.getTour(id).subscribe({
      next: (res) => {
        if (res.success) this.tour.set(res.data);
      }
    });
  }

  onBook() {
    const currentTour = this.tour();
    if (!currentTour) return;

    this.bookingService.createBooking({
      items: [
        {
          type: 'TOUR',
          serviceId: currentTour.id,
          quantity: 1, // Defaulting to 1 for the combo
        }
      ]
    }).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.router.navigate(['/bookings', res.data.id]);
        }
      },
      error: (err) => {
        console.error('Failed to create tour booking', err);
      }
    });
  }
}
