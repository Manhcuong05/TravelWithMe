import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HotelService, Hotel } from '../../core/services/hotel.service';
import { BookingService } from '../../core/services/booking.service';
import { ReviewsComponent } from '../review/review';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReviewsComponent],
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
            <h2 class="luxury-font">Về Khách Sạn</h2>
            <p>{{ hotel()?.description }}</p>
          </div>

          <div class="rooms-block">
            <h2 class="luxury-font">Hạng Phòng Khả Dụng</h2>
            <div class="room-grid">
              <div *ngFor="let room of hotel()?.rooms; let i = index; let last = last" 
                   class="room-card glass-effect hover-up"
                   [class.selected]="selectedRoomId() === room.id"
                   (click)="selectedRoomId.set(room.id)">
                <div class="room-badge" [ngClass]="getBadgeClass(room.classification)" *ngIf="room.classification && room.classification !== 'STANDARD'">
                  {{ getClassificationLabel(room.classification) }}
                </div>

                <div class="room-info">
                  <h3>{{ room.roomType }}</h3>
                  <p class="capacity-info">
                    <span class="icon">👥</span> Sức chứa: {{ room.capacity }} khách 
                    <span class="separator">|</span> 
                    <span class="icon">🛏️</span> Còn lại: {{ room.totalRooms }} phòng
                  </p>
                  <div class="features">
                    <span class="amenity-tag" *ngFor="let amenity of room.amenities">{{ amenity }}</span>
                  </div>
                </div>
                <div class="room-price-action">
                  <div class="price">
                    <span class="amount">{{ room.pricePerNight | number }} VNĐ</span>
                    <span class="per-night">mỗi đêm</span>
                  </div>
                  <div class="select-btn" [class.is-selected]="selectedRoomId() === room.id">
                    {{ selectedRoomId() === room.id ? 'Đã chọn' : 'Chọn phòng' }}
                  </div>
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
            <h3 class="luxury-font">Đặt Phòng</h3>
            
            <div class="date-selection">
              <div class="date-group">
                <label>Ngày nhận phòng</label>
                <input type="date" [(ngModel)]="checkIn" (change)="calculateNights()">
              </div>
              <div class="date-group">
                <label>Ngày trả phòng</label>
                <input type="date" [(ngModel)]="checkOut" (change)="calculateNights()">
              </div>
            </div>

            <div class="summary-details" *ngIf="nights() > 0 && selectedRoom()">
              <div class="summary-item">
                <span>Loại phòng</span>
                <span>{{ selectedRoom()?.roomType }}</span>
              </div>
              <div class="summary-item">
                <span>Số đêm nghỉ</span>
                <span>{{ nights() }} đêm</span>
              </div>
              <div class="summary-item total">
                <span>Tổng số tiền</span>
                <span>{{ (selectedRoom()?.pricePerNight || 0) * nights() | number }} VNĐ</span>
              </div>
            </div>

            <button (click)="onBook()" class="btn-gold w-full" [disabled]="nights() <= 0 || !selectedRoomId()">
              Xác nhận Đặt phòng
            </button>
            <p class="disclaimer">Chính sách hủy phòng miễn phí lên đến 24 giờ trước khi nhận phòng.</p>
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
    
    .date-selection { margin-bottom: 30px; }
    .date-group { margin-bottom: 15px; }
    .date-group label { display: block; font-size: 0.7rem; text-transform: uppercase; color: var(--gold-primary); margin-bottom: 5px; }
    .date-group input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 10px; border-radius: 8px; color: var(--text-primary); }

    .summary-item { display: flex; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid var(--glass-border); margin-bottom: 15px; font-style: 0.95rem; }
    .summary-item.total { border-bottom: none; font-weight: 700; font-size: 1.2rem; color: var(--text-primary); margin-top: 30px; margin-bottom: 30px; }
    .w-full { width: 100%; }
    .disclaimer { font-size: 0.75rem; color: var(--text-muted); text-align: center; margin-top: 20px; line-height: 1.4; }
    .room-card.selected { border: 2px solid var(--gold-primary); background: rgba(184, 134, 11, 0.15); box-shadow: 0 0 30px rgba(184, 134, 11, 0.2); }
    .room-badge { position: absolute; top: -12px; left: 20px; background: #2e7d32; color: white; padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; z-index: 2; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
    .room-badge.premium { background: var(--bg-accent); color: var(--gold-secondary); border: 1px solid rgba(212, 175, 55, 0.3); }
    .room-badge.luxury { background: var(--gold-gradient); color: var(--bg-primary); }

    .capacity-info { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 15px; }
    .separator { color: var(--glass-border); padding: 0 5px; }
    
    .amenity-tag { margin-right: 8px; margin-bottom: 8px; display: inline-block; padding: 4px 10px; background: rgba(255,255,255,0.08); border: 1px solid var(--glass-border); border-radius: 6px; font-size: 0.75rem; transition: var(--transition-smooth); }
    .room-card:hover .amenity-tag { border-color: var(--gold-secondary); }

    .select-btn { margin-top: 15px; padding: 8px 20px; border-radius: 6px; border: 1px solid var(--gold-primary); color: var(--gold-primary); font-size: 0.85rem; font-weight: 600; text-align: center; transition: var(--transition-smooth); }
    .select-btn.is-selected { background: var(--gold-primary); color: var(--bg-primary); }
    .room-card:not(.selected):hover .select-btn { background: rgba(184, 134, 11, 0.1); }
  `]
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);
  private bookingService = inject(BookingService);

  hotel = signal<Hotel | null>(null);
  selectedRoomId = signal<string | null>(null);
  checkIn: string = '';
  checkOut: string = '';
  nights = signal<number>(0);

  selectedRoom = () => {
    return this.hotel()?.rooms?.find(r => r.id === this.selectedRoomId());
  };

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.hotelService.getHotel(id).subscribe({
      next: (res) => {
        if (res.success) this.hotel.set(res.data);
      }
    });
  }

  calculateNights() {
    if (this.checkIn && this.checkOut) {
      const start = new Date(this.checkIn);
      const end = new Date(this.checkOut);
      const diff = end.getTime() - start.getTime();
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
      this.nights.set(days > 0 ? days : 0);
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
      default: return ''; // BEST_VALUE uses default green
    }
  }
}
