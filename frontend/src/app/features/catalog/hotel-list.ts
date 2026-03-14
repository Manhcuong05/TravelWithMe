import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotelService, Hotel } from '../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="catalog-page animate-fade-in">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Điểm Đến Thượng Lưu</h1>
          <p>Tìm kiếm nơi nghỉ dưỡng hoàn hảo tại những điểm đến danh tiếng nhất thế giới.</p>
        </div>

        <div class="filters-bar glass-effect">
          <div class="filter-item">
            <span class="label">Điểm đến</span>
            <select (change)="onCityChange($event)">
              <option value="">Tất cả thành phố</option>
              <option value="Da Nang">Đà Nẵng</option>
              <option value="Hanoi">Hà Nội</option>
              <option value="HCM City">TP. Hồ Chí Minh</option>
            </select>
          </div>
          <div class="filter-item">
            <span class="label">Mức giá</span>
            <select>
              <option value="">Tất cả mức giá</option>
              <option value="0-2000000">Dưới 2,000,000 VNĐ</option>
              <option value="2000000+">Trên 2,000,000 VNĐ</option>
            </select>
          </div>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="spinner"></div>
          <p>Đang chuẩn bị danh sách dành riêng cho bạn...</p>
        </div>

        <div *ngIf="!loading() && hotels().length === 0" class="empty-state">
          <p>Không tìm thấy khách sạn nào phù hợp với lựa chọn của bạn.</p>
        </div>

        <div class="grid" *ngIf="!loading()">
          <div *ngFor="let hotel of hotels()" class="hotel-card glass-effect hover-up">
            <div class="card-img" [style.backgroundImage]="'url(' + (hotel.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600') + ')'">
              <div class="rating-badge">★ {{ hotel.rating }}</div>
            </div>
            <div class="card-body">
              <div class="city-tag">{{ hotel.city }}</div>
              <h3>{{ hotel.name }}</h3>
              <p class="description">{{ hotel.description | slice:0:80 }}...</p>
              <div class="card-footer">
                <div class="price">
                  <span class="label">Giá chỉ từ</span>
                  <span class="amount">{{ getMinPrice(hotel) | number }} VNĐ</span>
                </div>
                <a [routerLink]="['/hotels', hotel.id]" class="btn-gold">Xem chi tiết</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .catalog-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
    
    .filters-bar { display: flex; gap: 40px; padding: 20px 40px; margin-bottom: 50px; justify-content: center; }
    .filter-item { display: flex; flex-direction: column; gap: 5px; }
    .filter-item .label { font-size: 0.7rem; text-transform: uppercase; color: var(--gold-primary); letter-spacing: 0.5px; }
    .filter-item select { background: transparent; border: none; color: var(--text-primary); cursor: pointer; outline: none; font-size: 0.95rem; }
    .filter-item select option { background: var(--bg-secondary); }

    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
    .hotel-card { overflow: hidden; height: 100%; display: flex; flex-direction: column; }
    .card-img { height: 240px; background-size: cover; background-position: center; position: relative; }
    .rating-badge { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.6); padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; color: var(--gold-secondary); backdrop-filter: blur(5px); }
    .card-body { padding: 25px; flex: 1; display: flex; flex-direction: column; }
    .city-tag { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 10px; letter-spacing: 1px; }
    .card-body h3 { font-size: 1.4rem; margin-bottom: 12px; color: var(--text-primary); font-family: 'Playfair Display', serif; }
    .description { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 25px; line-height: 1.5; }
    .card-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--glass-border); padding-top: 20px; }
    .price .label { display: block; font-size: 0.75rem; color: var(--text-muted); }
    .price .amount { font-weight: 600; color: var(--gold-primary); font-size: 1.1rem; }
    .btn-gold { padding: 10px 20px; font-size: 0.75rem; }

    .loading-state, .empty-state { text-align: center; padding: 100px 0; color: var(--text-secondary); }
    .spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--gold-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);

  hotels = signal<Hotel[]>([]);
  loading = signal<boolean>(true);

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels(city?: string) {
    this.loading.set(true);
    this.hotelService.getHotels(city).subscribe({
      next: (res) => {
        if (res.success) this.hotels.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onCityChange(event: any) {
    const city = event.target.value;
    this.loadHotels(city);
  }

  getMinPrice(hotel: Hotel): number {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;
    return Math.min(...hotel.rooms.map(r => r.pricePerNight));
  }
}
