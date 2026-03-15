import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HotelService, Hotel } from '../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <section class="catalog-page animate-fade-in">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font animate-slide-up">Điểm Đến Thượng Lưu</h1>
          <p class="animate-slide-up-delayed">Tìm kiếm nơi nghỉ dưỡng hoàn hảo tại những điểm đến danh tiếng nhất thế giới.</p>
        </div>

        <div class="filter-wrapper glass-effect animate-slide-up-delayed">
          <div class="filters-grid">
            <!-- City Filter -->
            <div class="filter-group">
              <label><span class="icon">📍</span> ĐỊA ĐIỂM</label>
              <select [(ngModel)]="selectedCity" (change)="onFilterChange()">
                <option value="">Tất cả thành phố</option>
                <option *ngFor="let city of cities()" [value]="city">{{ city }}</option>
              </select>
            </div>

            <!-- Stars Filter -->
            <div class="filter-group">
              <label><span class="icon">⭐</span> XẾP HẠNG</label>
              <select [(ngModel)]="starRating" (change)="onFilterChange()">
                <option [value]="0">Tất cả hạng sao</option>
                <option [value]="5">5 Sao (Luxury)</option>
                <option [value]="4">4 Sao (Premium)</option>
                <option [value]="3">3 Sao (Standard)</option>
              </select>
            </div>

            <!-- Price Filter -->
            <div class="filter-group price-range">
              <label><span class="icon">💰</span> KHOẢNG GIÁ (VNĐ)</label>
              <div class="range-inputs">
                <input type="number" [(ngModel)]="minPrice" placeholder="Từ" (input)="onFilterChange()">
                <span class="divider">-</span>
                <input type="number" [(ngModel)]="maxPrice" placeholder="Đến" (input)="onFilterChange()">
              </div>
            </div>

            <div class="filter-actions">
               <button class="btn-reset" (click)="resetFilters()">Đặt lại</button>
            </div>
          </div>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="spinner"></div>
          <p>Đang chuẩn bị danh sách dành riêng cho bạn...</p>
        </div>

        <div *ngIf="!loading() && filteredHotels().length === 0" class="empty-state animate-fade-in">
          <div class="empty-icon">🏨</div>
          <h3>Không tìm thấy kết quả</h3>
          <p>Rất tiếc, không có khách sạn nào phù hợp với các tiêu chí lọc của bạn. Hãy thử thay đổi lựa chọn khác.</p>
          <button class="btn-gold-outline" (click)="resetFilters()">Xem tất cả khách sạn</button>
        </div>

        <div class="hotel-grid" *ngIf="!loading() && filteredHotels().length > 0">
          <div *ngFor="let hotel of filteredHotels()" class="hotel-card glass-effect hover-up">
            <div class="card-img" [style.backgroundImage]="'url(' + (hotel.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=600') + ')'">
              <div class="rating-badge">★ {{ hotel.rating }}</div>
              <div class="stars-badge">{{ hotel.starRating }}★</div>
            </div>
            <div class="card-body">
              <div class="meta-info">
                <span class="city-tag">{{ hotel.city }}</span>
              </div>
              <h3>{{ hotel.name }}</h3>
              <p class="description">{{ hotel.description | slice:0:100 }}...</p>
              
              <div class="card-footer">
                <div class="price-info">
                  <span class="price-label">Giá chỉ từ</span>
                  <span class="amount">{{ getMinPrice(hotel) | number }} <small>VNĐ/đêm</small></span>
                </div>
                <a [routerLink]="['/hotels', hotel.id]" class="btn-view">Chi tiết</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .catalog-page { padding: 140px 0 100px; min-height: 100vh; background: radial-gradient(circle at top right, #1a1a2e, #050a14); }
    .container { max-width: 1300px; margin: 0 auto; padding: 0 25px; }
    
    .page-header { text-align: center; margin-bottom: 60px; }
    .page-header h1 { font-size: 3.5rem; margin-bottom: 15px; background: linear-gradient(to right, #fff, #d4af37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .page-header p { color: #94a3b8; font-size: 1.1rem; max-width: 600px; margin: 0 auto; }

    .filter-wrapper { padding: 30px; border-radius: 24px; margin-bottom: 60px; border: 1px solid rgba(212, 175, 55, 0.2); }
    .filters-grid { display: grid; grid-template-columns: 1fr 1fr 1.5fr auto; gap: 30px; align-items: flex-end; }
    
    .filter-group { display: flex; flex-direction: column; gap: 10px; }
    .filter-group label { font-size: 0.75rem; font-weight: 800; color: #d4af37; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px; }
    .filter-group .icon { font-style: normal; }
    
    select, input { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; color: white; outline: none; transition: all 0.3s; font-size: 0.9rem; }
    select:focus, input:focus { border-color: #d4af37; background: rgba(255,255,255,0.08); box-shadow: 0 0 15px rgba(212, 175, 55, 0.1); }
    select option { background: #1a1a2e; color: white; }

    .range-inputs { display: flex; align-items: center; gap: 10px; }
    .range-inputs input { width: 100%; }
    .divider { color: #475569; }

    .btn-reset { background: none; border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; padding: 12px 20px; border-radius: 12px; cursor: pointer; transition: all 0.2s; font-size: 0.85rem; height: 48px; }
    .btn-reset:hover { border-color: #d4af37; color: white; }

    /* Hotel Grid */
    .hotel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 40px; }
    .hotel-card { border-radius: 24px; overflow: hidden; height: 100%; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.05); }
    
    .card-img { height: 260px; background-size: cover; background-position: center; position: relative; transition: transform 0.5s ease; }
    .hotel-card:hover .card-img { transform: scale(1.05); }
    
    .rating-badge { position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.7); padding: 6px 14px; border-radius: 30px; font-size: 0.85rem; color: #ffd700; backdrop-filter: blur(8px); font-weight: 700; border: 1px solid rgba(255,255,255,0.1); }
    .stars-badge { position: absolute; top: 20px; left: 20px; background: rgba(212, 175, 55, 0.9); padding: 4px 10px; border-radius: 8px; font-size: 0.75rem; color: #000; font-weight: 800; }

    .card-body { padding: 30px; flex: 1; display: flex; flex-direction: column; background: linear-gradient(to bottom, rgba(255,255,255,0.02), transparent); }
    .city-tag { font-size: 0.7rem; text-transform: uppercase; color: #d4af37; font-weight: 800; letter-spacing: 2px; }
    
    .card-body h3 { font-size: 1.6rem; margin: 12px 0; color: #fff; font-family: 'Playfair Display', serif; }
    .description { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; margin-bottom: 30px; }
    
    .card-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); }
    .price-info { display: flex; flex-direction: column; }
    .price-label { font-size: 0.75rem; color: #475569; text-transform: uppercase; letter-spacing: 1px; }
    .amount { font-size: 1.3rem; font-weight: 800; color: #fff; }
    .amount small { font-size: 0.7rem; color: #94a3b8; font-weight: 400; }

    .btn-view { background: #d4af37; color: #000; text-decoration: none; padding: 12px 24px; border-radius: 12px; font-weight: 700; font-size: 0.85rem; transition: all 0.3s; }
    .btn-view:hover { background: #fff; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); }

    .empty-state { text-align: center; padding: 100px 40px; }
    .empty-icon { font-size: 4rem; margin-bottom: 20px; opacity: 0.5; }
    .empty-state h3 { font-size: 1.8rem; margin-bottom: 15px; color: #fff; }
    .empty-state p { color: #64748b; margin-bottom: 30px; }
    .btn-gold-outline { background: none; border: 1px solid #d4af37; color: #d4af37; padding: 12px 30px; border-radius: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; }
    .btn-gold-outline:hover { background: #d4af37; color: #000; }

    .spinner { width: 50px; height: 50px; border: 4px solid rgba(212, 175, 55, 0.1); border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .animate-slide-up { animation: slideUp 0.8s ease backwards; }
    .animate-slide-up-delayed { animation: slideUp 0.8s 0.2s ease backwards; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);

  hotels = signal<Hotel[]>([]);
  loading = signal<boolean>(true);

  // Filter signals
  selectedCity = signal<string>('');
  starRating = signal<number>(0);
  minPrice = signal<number | null>(null);
  maxPrice = signal<number | null>(null);

  // Computed unique cities from hotels list
  cities = computed(() => {
    const allCities = this.hotels().map(h => h.city);
    return [...new Set(allCities)].sort();
  });

  // Computed filtered list
  filteredHotels = computed(() => {
    return this.hotels().filter(hotel => {
      // City filter
      if (this.selectedCity() && hotel.city !== this.selectedCity()) return false;

      // Star Rating filter
      if (this.starRating() > 0 && hotel.starRating !== Number(this.starRating())) return false;

      // Price filter (check against min price of hotel rooms)
      const hotelMinPrice = this.getMinPrice(hotel);
      if (this.minPrice() !== null && hotelMinPrice < this.minPrice()!) return false;
      if (this.maxPrice() !== null && hotelMinPrice > this.maxPrice()!) return false;

      return true;
    });
  });

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.loading.set(true);
    // We load all hotels and filter client-side for better UX in this demo
    this.hotelService.getHotels().subscribe({
      next: (res) => {
        if (res.success) this.hotels.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onFilterChange() {
    // Computed logic will handle this automatically
  }

  resetFilters() {
    this.selectedCity.set('');
    this.starRating.set(0);
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }

  getMinPrice(hotel: Hotel): number {
    if (!hotel.rooms || hotel.rooms.length === 0) return 0;
    return Math.min(...hotel.rooms.map(r => r.pricePerNight));
  }
}
