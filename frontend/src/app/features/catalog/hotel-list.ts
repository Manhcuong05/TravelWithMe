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
      
      <!-- Hero Section -->
      <div class="hero-section">
         <div class="hero-bg" style="background-image: url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=1920')"></div>
         <div class="hero-overlay"></div>
         <div class="hero-content">
            <h2 class="sub-heading animate-slide-up">B E S T  P R E M I U M  S T A Y S</h2>
            <h1 class="luxury-font main-heading animate-slide-up" style="animation-delay: 0.1s">Điểm Đến Thượng Lưu</h1>
            <p class="animate-slide-up" style="animation-delay: 0.2s">Tìm kiếm nơi nghỉ dưỡng hoàn hảo tại những điểm đến danh tiếng nhất thế giới</p>
         </div>
      </div>

      <div class="container relative-z">
        <div class="filter-wrapper glass-effect animate-slide-up-delayed" style="animation-delay: 0.4s">
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
          <div *ngFor="let hotel of filteredHotels(); let i = index" class="hotel-card glass-effect animate-slide-up" [style.animation-delay]="(0.3 + i*0.1) + 's'">
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
    .catalog-page { min-height: 100vh; background: #020617; padding-bottom: 100px; }
    
    /* Hero Section */
    .hero-section { position: relative; height: 500px; display: flex; align-items: center; justify-content: center; text-align: center; margin-bottom: -70px; z-index: 1; overflow: hidden; }
    .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; background-attachment: fixed; }
    .hero-bg::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(2,6,23,0.3) 0%, rgba(2,6,23,0.8) 70%, rgba(2,6,23,1) 100%); }
    .hero-overlay { position: absolute; inset: 0; background: radial-gradient(circle at center, transparent 0%, rgba(2, 6, 23, 0.4) 100%); }
    .hero-content { position: relative; z-index: 2; padding: 0 20px; max-width: 900px; margin-top: 40px; }
    
    .sub-heading { font-size: 0.8rem; letter-spacing: 8px; text-transform: uppercase; margin-bottom: 25px; font-weight: 800; color: #d4af37; }
    .main-heading { font-size: 5rem; color: #fff; margin-bottom: 25px; text-shadow: 0 10px 40px rgba(0,0,0,0.6); font-family: 'Playfair Display', serif; }
    .hero-content p { color: #cbd5e1; font-size: 1.25rem; line-height: 1.8; opacity: 0.9; max-width: 700px; margin: 0 auto; }

    .container { max-width: 1400px; margin: 0 auto; padding: 0 40px; }
    .relative-z { position: relative; z-index: 10; }
    
    /* Filter Wrapper */
    .filter-wrapper { padding: 40px; border-radius: 30px; margin-bottom: 80px; border: 1px solid rgba(212, 175, 55, 0.2); background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(25px); box-shadow: 0 30px 60px -15px rgba(0, 0, 0, 0.6); }
    .search-title { font-size: 0.8rem; font-weight: 800; color: #d4af37; letter-spacing: 4px; margin-bottom: 25px; display: flex; align-items: center; gap: 12px; }
    .filters-grid { display: grid; grid-template-columns: 1fr 1fr 1.5fr auto; gap: 24px; align-items: flex-end; }
    
    .filter-group { display: flex; flex-direction: column; gap: 12px; }
    .filter-group label { font-size: 0.7rem; font-weight: 700; color: #64748b; letter-spacing: 2px; padding-left: 4px; }
    
    .input-with-icon { position: relative; display: flex; align-items: center; }
    .field-icon { position: absolute; left: 16px; color: #d4af37; font-size: 0.9rem; pointer-events: none; opacity: 0.8; }
    
    select, input { width: 100%; background: rgba(7, 12, 24, 0.6); border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 16px; padding: 14px 16px 14px 44px; color: white; outline: none; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); font-size: 0.95rem; }
    select:focus, input:focus { border-color: #d4af37; background: rgba(255, 255, 255, 0.05); box-shadow: 0 0 20px rgba(212, 175, 55, 0.15); transform: translateY(-2px); }
    select option { background: #0f172a; color: white; }

    .price-range .input-with-icon .field-icon { font-size: 0.65rem; text-transform: uppercase; font-weight: 800; opacity: 0.5; left: 12px; }
    .price-range input { padding-left: 48px; }

    .range-inputs { display: flex; align-items: center; gap: 12px; }
    .divider { color: rgba(212, 175, 55, 0.3); font-weight: 300; }

    .btn-search-reset { background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.2); color: #d4af37; width: 52px; height: 52px; border-radius: 16px; cursor: pointer; transition: all 0.3s; display: flex; align-items: center; justify-content: center; }
    .btn-search-reset:hover { background: #d4af37; color: #000; transform: rotate(180deg) scale(1.1); }

    /* Hotel Grid */
    .hotel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 40px; }
    .hotel-card { border-radius: 32px; overflow: hidden; height: 100%; display: flex; flex-direction: column; border: 1px solid rgba(255,255,255,0.05); transition: all 0.5s ease; position: relative; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(10px); }
    .hotel-card:hover { border-color: rgba(212, 175, 55, 0.3); transform: translateY(-15px); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.6), 0 0 30px rgba(212, 175, 55, 0.1); }
    
    .card-img { height: 260px; background-size: cover; background-position: center; position: relative; overflow: hidden; }
    .card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(to top, rgba(2, 6, 23, 1), transparent 70%); }
    
    .luxury-badge { position: absolute; top: 24px; left: 24px; z-index: 10; background: #d4af37; color: #000; padding: 6px 14px; border-radius: 12px; font-size: 0.8rem; font-weight: 900; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }

    .btn-bookmark { 
      position: absolute; top: 24px; right: 24px; 
      background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255,255,255,0.1); 
      color: rgba(255,255,255,0.8); width: 42px; height: 42px; border-radius: 12px; 
      cursor: pointer; backdrop-filter: blur(12px); transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); z-index: 10;
      display: flex; align-items: center; justify-content: center; font-size: 1.1rem;
    }
    .btn-bookmark:hover { transform: scale(1.1) rotate(5deg); background: rgba(212, 175, 55, 0.2); border-color: #d4af37; color: #d4af37; }
    .btn-bookmark.active { background: linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%); color: #000; border-color: transparent; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.4); }

    .card-body { padding: 30px; flex: 1; display: flex; flex-direction: column; }
    .meta-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
    .city-tag { font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px; }
    .city-tag .icon { color: #d4af37; }
    .user-rating { background: rgba(212, 175, 55, 0.1); color: #d4af37; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 800; display: flex; align-items: center; gap: 5px; }

    .card-body h3 { font-size: 1.6rem; margin: 10px 0 15px; color: #fff; font-family: 'Playfair Display', serif; line-height: 1.3; }
    .description { color: #64748b; font-size: 0.95rem; line-height: 1.7; margin-bottom: 30px; }
    
    .card-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); }
    .price-info { display: flex; flex-direction: column; }
    .price-label { font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; font-weight: 700; }
    .amount { font-size: 1.5rem; font-weight: 800; color: #fff; }
    .amount small { font-size: 0.8rem; color: #64748b; font-weight: 500; }

    .btn-view { background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); color: #000; text-decoration: none; padding: 14px 28px; border-radius: 16px; font-weight: 800; font-size: 0.9rem; transition: all 0.4s; }
    .btn-view:hover { filter: brightness(1.2); transform: scale(1.05); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }

    .loading-state, .empty-state { text-align: center; padding: 100px 40px; }
    .spinner { width: 60px; height: 60px; border: 4px solid rgba(212, 175, 55, 0.1); border-top-color: #d4af37; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .animate-slide-up { animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) both; }
    .animate-slide-up-delayed { animation: slideUp 1s cubic-bezier(0.23, 1, 0.32, 1) both; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
    
    @media (max-width: 768px) {
       .main-heading { font-size: 3.5rem; }
       .hero-section { height: 450px; }
       .filters-grid { grid-template-columns: 1fr; gap: 15px; }
       .container { padding: 0 20px; }
       .filter-wrapper { padding: 25px; }
    }
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
