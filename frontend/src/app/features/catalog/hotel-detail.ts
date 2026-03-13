import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HotelService, Hotel } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewsComponent } from '../review/review';

@Component({
    selector: 'app-hotel-detail',
    standalone: true,
    imports: [CommonModule, RouterLink, ReviewsComponent],
    template: `
    <section class="detail-page animate-fade-in" *ngIf="hotel()">
      <div class="hero-header" [style.backgroundImage]="'url(' + (hotel()?.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=1920') + ')'">
        <div class="overlay"></div>
        <div class="container hero-content">
          <div class="rating luxury-font">★ {{ hotel()?.rating }} · {{ hotel()?.city }}</div>
          <h1 class="luxury-font">{{ hotel()?.name }}</h1>
          <p class="address">📍 {{ hotel()?.address }}</p>
        </div>
      </div>

      <div class="container main-grid">
        <div class="content-side">
          <div class="description-block glass-effect">
            <h2 class="luxury-font">About the Property</h2>
            <p>{{ hotel()?.description }}</p>
          </div>

          <div class="rooms-block">
            <h2 class="luxury-font">Available Accommodations</h2>
            <div class="room-grid">
              <div class="room-card glass-effect hover-up">
                <div class="room-info">
                  <h3>Deluxe Executive Room</h3>
                  <p>Panoramic city views, king-size bed, luxury amenities.</p>
                  <div class="features">
                    <span>Free WiFi</span> · <span>Breakfast Included</span> · <span>Spa Access</span>
                  </div>
                </div>
                <div class="room-price-action">
                  <div class="price">
                    <span class="amount">{{ hotel()?.basePrice | number }} VNĐ</span>
                    <span class="per-night">per night</span>
                  </div>
                  <button (click)="onBook()" class="btn-gold">Reserve Now</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-wrapper" *ngIf="hotel()?.id">
            <app-reviews [serviceId]="hotel()!.id" serviceType="HOTEL"></app-reviews>
          </div>
        </div>

        <div class="sticky-sidebar">
          <div class="booking-summary glass-effect">
            <h3 class="luxury-font">Summary</h3>
            <div class="summary-item">
              <span>Nights</span>
              <span>1 Night</span>
            </div>
            <div class="summary-item total">
              <span>Total Amount</span>
              <span>{{ hotel()?.basePrice | number }} VNĐ</span>
            </div>
            <button (click)="onBook()" class="btn-gold w-full">Confirm Order</button>
            <p class="disclaimer">Complimentary cancellation up to 24 hours before check-in.</p>
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
    
    .description-block { padding: 40px; margin-bottom: 40px; line-height: 1.8; }
    .description-block h2 { font-size: 2rem; margin-bottom: 20px; color: var(--gold-primary); }
    
    .rooms-block h2 { font-size: 2rem; margin-bottom: 30px; }
    .room-card { padding: 30px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; transition: var(--transition-smooth); }
    .room-info h3 { font-size: 1.3rem; margin-bottom: 8px; font-family: 'Playfair Display', serif; }
    .room-info p { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: 15px; }
    .features { font-size: 0.8rem; color: var(--text-muted); }

    .room-price-action { text-align: right; }
    .room-price-action .amount { display: block; font-size: 1.4rem; font-weight: 700; color: var(--gold-primary); }
    .room-price-action .per-night { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; display: block; }

    .sticky-sidebar { position: sticky; top: 120px; height: fit-content; }
    .booking-summary { padding: 40px; }
    .booking-summary h3 { font-size: 1.8rem; margin-bottom: 30px; color: var(--gold-primary); text-align: center; }
    .summary-item { display: flex; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid var(--glass-border); margin-bottom: 15px; font-style: 0.95rem; }
    .summary-item.total { border-bottom: none; font-weight: 700; font-size: 1.2rem; color: var(--text-primary); margin-top: 30px; margin-bottom: 30px; }
    .w-full { width: 100%; }
    .disclaimer { font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 20px; line-height: 1.4; }
  `]
})
export class HotelDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private hotelService = inject(HotelService);
    private bookingService = inject(BookingService);

    hotel = signal<Hotel | null>(null);

    ngOnInit() {
        const id = this.route.snapshot.params['id'];
        this.hotelService.getHotel(id).subscribe({
            next: (res) => {
                if (res.success) this.hotel.set(res.data);
            }
        });
    }

    onBook() {
        if (!this.hotel()) return;

        const request = {
            items: [{
                type: 'HOTEL',
                serviceId: this.hotel()!.id,
                quantity: 1
            }]
        };

        this.bookingService.createBooking(request).subscribe({
            next: (res) => {
                if (res.success) {
                    this.router.navigate(['/bookings', res.data.id]);
                }
            }
        });
    }
}
