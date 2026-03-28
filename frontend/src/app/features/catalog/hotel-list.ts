import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HotelService, Hotel } from '../../core/services/hotel.service';
import { FavoriteService } from '../../core/services/favorite.service';

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
          <div class="search-title">
            <span class="luxury-accent">✨</span> TÌM KIẾM NGHỈ DƯỠNG
          </div>
          <div class="filters-grid">
            <!-- City Filter -->
            <div class="filter-group">
              <label>ĐỊA ĐIỂM</label>
              <div class="input-with-icon">
                <span class="field-icon">📍</span>
                <select [(ngModel)]="selectedCity" (change)="onFilterChange()">
                  <option value="">Tất cả thành phố</option>
                  <option *ngFor="let city of cities()" [value]="city">{{ city }}</option>
                </select>
              </div>
            </div>

            <!-- Stars Filter -->
            <div class="filter-group">
              <label>HẠNG SAO</label>
              <div class="input-with-icon">
                <span class="field-icon">⭐</span>
                <select [(ngModel)]="starRating" (change)="onFilterChange()">
                  <option [value]="0">Tất cả hạng sao</option>
                  <option [value]="5">5 Sao (Luxury)</option>
                  <option [value]="4">4 Sao (Premium)</option>
                  <option [value]="3">3 Sao (Standard)</option>
                </select>
              </div>
            </div>

            <!-- Price Filter -->
            <div class="filter-group price-range">
              <label>KHOẢNG GIÁ (VNĐ)</label>
              <div class="range-inputs">
                <div class="input-with-icon">
                  <span class="field-icon">min</span>
                  <input type="number" [(ngModel)]="minPrice" placeholder="Từ" (input)="onFilterChange()">
                </div>
                <span class="divider">-</span>
                <div class="input-with-icon">
                   <span class="field-icon">max</span>
                  <input type="number" [(ngModel)]="maxPrice" placeholder="Đến" (input)="onFilterChange()">
                </div>
              </div>
            </div>

            <div class="filter-actions">
               <button class="btn-search-reset" (click)="resetFilters()">
                 <span class="icon">🔄</span>
               </button>
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
              <div class="luxury-badge">{{ hotel.starRating }}★</div>
              
              <!-- Bookmark Button -->
              <button class="btn-bookmark" 
                      (click)="toggleFavorite($event, hotel.id)"
                      [class.active]="isFavorite(hotel.id)">
                <i class="fas fa-bookmark"></i>
              </button>
            </div>
            <div class="card-body">
              <div class="meta-row">
                <span class="city-tag"><span class="icon">📍</span> {{ hotel.city }}</span>
                <span class="user-rating"><span class="icon">⭐</span> {{ hotel.rating }}</span>
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
    .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
    
    .page-header { text-align: center; margin-bottom: 60px; }
    .page-header h1 { font-size: 4rem; margin-bottom: 15px; background: linear-gradient(to bottom, #fff 30%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'Playfair Display', serif; }
    .page-header p { color: #94a3b8; font-size: 1.2rem; max-width: 700px; margin: 0 auto; opacity: 0.8; }

    .filter-wrapper { padding: 40px; border-radius: 30px; margin-bottom: 80px; border: 1px solid rgba(212, 175, 55, 0.2); background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(20px); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .search-title { font-size: 0.8rem; font-weight: 800; color: #d4af37; letter-spacing: 4px; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; }
    .filters-grid { display: grid; grid-template-columns: 1fr 1fr 1.5fr auto; gap: 24px; align-items: flex-end; }
    
    .filter-group { display: flex; flex-direction: column; gap: 12px; }
    .filter-group label { font-size: 0.7rem; font-weight: 700; color: #64748b; letter-spacing: 2px; padding-left: 4px; }
    
    .input-with-icon { position: relative; display: flex; align-items: center; }
    .field-icon { position: absolute; left: 16px; color: #d4af37; font-size: 0.9rem; pointer-events: none; opacity: 0.8; }
    
    select, input { width: 100%; background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 16px; padding: 14px 16px 14px 44px; color: white; outline: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-size: 0.95rem; }
    select:focus, input:focus { border-color: #d4af37; background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 20px rgba(212, 175, 55, 0.15); transform: translateY(-2px); }
    select option { background: #0f172a; color: white; }

    .price-range .input-with-icon .field-icon { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; opacity: 0.5; left: 12px; }
    .price-range input { padding-left: 48px; }

    .range-inputs { display: flex; align-items: center; gap: 12px; }
    .divider { color: rgba(212, 175, 55, 0.3); font-weight: 300; }

    .btn-search-reset { background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); color: #d4af37; width: 52px; height: 52px; border-radius: 16px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
    .btn-search-reset:hover { background: #d4af37; color: #000; transform: rotate(180deg) scale(1.1); }

    /* Hotel Grid */
    .hotel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 50px; }
    .hotel-card { border-radius: 32px; overflow: hidden; height: 100%; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.05); transition: all 0.5s ease; position: relative; }
    .hotel-card:hover { border-color: rgba(212, 175, 55, 0.3); transform: translateY(-15px); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6); }
    
    .card-img { height: 280px; background-size: cover; background-position: center; position: relative; overflow: hidden; }
    .card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(5, 10, 20, 0.8), transparent); }
    
    .luxury-badge { position: absolute; top: 24px; left: 24px; z-index: 10; background: #d4af37; color: #000; padding: 6px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 800; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }

    .btn-bookmark { 
      position: absolute; top: 24px; right: 24px; 
      background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); 
      color: rgba(255,255,255,0.8); width: 42px; height: 42px; border-radius: 12px; 
      cursor: pointer; backdrop-filter: blur(12px); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); z-index: 10;
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
    }
    .btn-bookmark:hover { transform: scale(1.1) rotate(5deg); background: rgba(212, 175, 55, 0.2); border-color: #d4af37; color: #d4af37; }
    .btn-bookmark.active { background: linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%); color: #000; border-color: transparent; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4); }

    .card-body { padding: 35px; flex: 1; display: flex; flex-direction: column; background: rgba(255,255,255,0.01); }
    .meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .city-tag { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 600; letter-spacing: 1.5px; display: flex; align-items: center; gap: 6px; }
    .city-tag .icon { color: #d4af37; }
    .user-rating { background: rgba(212, 175, 55, 0.1); color: #d4af37; padding: 4px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 5px; }

    .card-body h3 { font-size: 1.8rem; margin: 15px 0; color: #fff; font-family: 'Playfair Display', serif; line-height: 1.2; }
    .description { color: #64748b; font-size: 1rem; line-height: 1.7; margin-bottom: 35px; }
    
    .card-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.05); }
    .price-info { display: flex; flex-direction: column; }
    .price-label { font-size: 0.7rem; color: #475569; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
    .amount { font-size: 1.5rem; font-weight: 800; color: #fff; }
    .amount small { font-size: 0.75rem; color: #64748b; font-weight: 400; }

    .btn-view { background: #d4af37; color: #000; text-decoration: none; padding: 14px 28px; border-radius: 16px; font-weight: 800; font-size: 0.9rem; transition: all 0.4s; }
    .btn-view:hover { background: #fff; transform: scale(1.05); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }

    .loading-state, .empty-state { text-align: center; padding: 100px 40px; }
    .spinner { width: 60px; height: 60px; border: 4px solid rgba(212, 175, 55, 0.1); border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .animate-slide-up { animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) backwards; }
    .animate-slide-up-delayed { animation: slideUp 1s 0.3s cubic-bezier(0.23, 1, 0.32, 1) backwards; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class HotelListComponent implements OnInit {
  private hotelService = inject(HotelService);
  private favoriteService = inject(FavoriteService);

  hotels = signal<Hotel[]>([]);
  favorites = signal<Set<string>>(new Set());
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
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getAllFavorites().subscribe(res => {
      if (res.success && res.data.hotels) {
        const ids = res.data.hotels.map((h: any) => h.id);
        this.favorites.set(new Set(ids));
      }
    });
  }

  isFavorite(id: string) {
    return this.favorites().has(id);
  }

  toggleFavorite(event: Event, hotelId: string) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite({ itemType: 'HOTEL', itemId: hotelId }).subscribe(res => {
      if (res.success) {
        const newFavs = new Set(this.favorites());
        if (newFavs.has(hotelId)) newFavs.delete(hotelId);
        else newFavs.add(hotelId);
        this.favorites.set(newFavs);
      }
    });
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
