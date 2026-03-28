import { Component, inject, OnInit, signal, computed, effect, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoriteService } from '../../core/services/favorite.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="favorites-page animate-fade-in">
      <!-- Premium Background -->
      <div class="bg-luxury">
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
      </div>

      <div class="container relative-z">
        <div class="page-header text-center">
          <span class="collection-badge">Personal Curated Collections</span>
          <h1 class="luxury-font main-title">Bộ Sưu Tập Của Bạn</h1>
          <div class="gold-gradient-line"></div>
          <p class="subtitle">Những hành trình và điểm đến được tinh tuyển, sẵn sàng cho trải nghiệm kế tiếp của bạn.</p>
        </div>

        <!-- Custom Tabs Pro Max -->
        <div class="tabs-container-pro">
          <div class="tabs-glass">
            <button *ngFor="let tab of tabs" 
                    class="tab-pill" 
                    [class.active]="activeTab() === tab.id"
                    (click)="setTab(tab.id)">
              <i [class]="tab.icon"></i>
              <span>{{ tab.label }}</span>
              <span class="count-badge" *ngIf="getCount(tab.id) > 0">{{ getCount(tab.id) }}</span>
            </button>
          </div>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="luxury-loader"></div>
          <p>Đang chuẩn bị không gian riêng cho bạn...</p>
        </div>

        <!-- Empty State -->
        <div *ngIf="!loading() && isEmpty()" class="empty-state-pro glass-luxury animate-pop-in">
          <div class="empty-visual">
            <i class="fas fa-layer-group"></i>
          </div>
          <h2 class="luxury-font">Không Gian Còn Trống</h2>
          <p>Hãy bắt đầu khám phá và lưu lại những điều tuyệt vời nhất cho chuyến đi sắp tới.</p>
          <div class="empty-actions">
            <a routerLink="/itinerary" class="btn-gold-luxury">Gợi ý AI</a>
            <a routerLink="/tours" class="btn-outline-luxury">Xem Tour</a>
          </div>
        </div>

        <!-- Favorites Content Grid -->
        <div class="content-wrapper" *ngIf="!loading() && !isEmpty()">
          
          <!-- AI Itineraries Grid -->
          <div class="fav-grid" *ngIf="activeTab() === 'itineraries'">
            <div *ngFor="let item of favoritesData().itineraries; let i = index" 
                 class="fav-card-pro itinerary-card glass-luxury reveal-item"
                 [style.animation-delay]="i * 0.1 + 's'">
              <div class="card-tag-premium"><i class="fas fa-sparkles"></i> AI Generated</div>
              <div class="card-inner">
                <h3 class="luxury-font card-title">{{ item.title }}</h3>
                <p class="card-loc"><i class="fas fa-map-marker-alt"></i> {{ item.destination }}</p>
                <div class="card-meta">
                  <span><i class="far fa-calendar"></i> {{ item.durationDays }} Ngày</span>
                </div>
                <div class="card-footer">
                  <button class="btn-detail-luxury" [routerLink]="['/itinerary', item.id]">
                    Chi tiết hành trình <i class="fas fa-arrow-right"></i>
                  </button>
                  <button class="btn-remove-mini" (click)="toggleFav('ITINERARY', item.id)">
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Tours Grid -->
          <div class="fav-grid" *ngIf="activeTab() === 'tours'">
            <div *ngFor="let item of favoritesData().tours; let i = index" 
                 class="fav-card-pro image-card glass-luxury reveal-item"
                 [style.animation-delay]="i * 0.1 + 's'">
              <div class="card-image" [style.backgroundImage]="'url(' + item.imageUrl + ')'">
                <div class="overlay"></div>
                <div class="card-price">{{ item.price | number }}đ</div>
              </div>
              <div class="card-inner">
                <h3 class="luxury-font card-title">{{ item.title }}</h3>
                <p class="card-loc"><i class="fas fa-location-dot"></i> {{ item.location }}</p>
                <div class="card-footer">
                  <button class="btn-detail-luxury" [routerLink]="['/tours']">Xem chi tiết</button>
                  <button class="btn-remove-mini" (click)="toggleFav('TOUR', item.id)">
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Hotels Grid -->
          <div class="fav-grid" *ngIf="activeTab() === 'hotels'">
            <div *ngFor="let item of favoritesData().hotels; let i = index" 
                 class="fav-card-pro image-card glass-luxury reveal-item"
                 [style.animation-delay]="i * 0.1 + 's'">
              <div class="card-image" [style.backgroundImage]="'url(' + (item.imageUrl || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb') + ')'">
                <div class="overlay"></div>
                <div class="card-rating">⭐ {{ item.rating }}</div>
              </div>
              <div class="card-inner">
                <h3 class="luxury-font card-title">{{ item.name }}</h3>
                <p class="card-loc"><i class="fas fa-hotel"></i> {{ item.city }}</p>
                <div class="card-footer">
                  <button class="btn-detail-luxury" [routerLink]="['/hotels', item.id]">Khám phá</button>
                  <button class="btn-remove-mini" (click)="toggleFav('HOTEL', item.id)">
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- POIs Grid -->
          <div class="fav-grid" *ngIf="activeTab() === 'pois'">
            <div *ngFor="let item of favoritesData().pois; let i = index" 
                 class="fav-card-pro image-card glass-luxury reveal-item"
                 [style.animation-delay]="i * 0.1 + 's'">
              <div class="card-image" [style.backgroundImage]="'url(' + extractPOIImage(item) + ')'">
                <div class="overlay"></div>
                <div class="card-category">{{ item.category }}</div>
              </div>
              <div class="card-inner">
                <h3 class="luxury-font card-title">{{ item.name }}</h3>
                <p class="card-loc"><i class="fas fa-compass"></i> {{ item.city }}</p>
                <div class="card-footer">
                  <button class="btn-detail-luxury" [routerLink]="['/pois']">Tìm hiểu</button>
                  <button class="btn-remove-mini" (click)="toggleFav('POI', item.id)">
                    <i class="fas fa-heart"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-gradient: linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%); --glass-bg: rgba(15, 23, 42, 0.6); }

    .favorites-page { padding: 160px 0 120px; min-height: 100vh; position: relative; overflow: hidden; background: #050a14; color: #fff; }
    .relative-z { position: relative; z-index: 10; }
    
    .bg-luxury { position: absolute; inset: 0; pointer-events: none; }
    .glow-orb { position: absolute; border-radius: 50%; filter: blur(150px); opacity: 0.15; }
    .orb-1 { width: 600px; height: 600px; background: var(--gold-primary); top: -200px; right: -200px; }
    .orb-2 { width: 500px; height: 500px; background: #3b82f6; bottom: -150px; left: -150px; }

    .container { max-width: 1300px; margin: 0 auto; padding: 0 40px; }
    
    .page-header { margin-bottom: 70px; }
    .collection-badge { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 8px 24px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; 
      letter-spacing: 3px; text-transform: uppercase; margin-bottom: 25px;
    }
    .main-title { font-size: 4.5rem; margin-bottom: 20px; background: linear-gradient(to bottom, #fff 30%, #a5a5a5 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .gold-gradient-line { width: 120px; height: 3px; background: var(--gold-gradient); margin: 0 auto 30px; border-radius: 3px; }
    .subtitle { color: #94a3b8; font-size: 1.15rem; max-width: 700px; margin: 0 auto; line-height: 1.7; font-weight: 300; }

    /* Tabs Pro Max */
    .tabs-container-pro { display: flex; justify-content: center; margin-bottom: 60px; }
    .tabs-glass { 
      padding: 10px; background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); 
      border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); display: flex; gap: 8px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
    }
    .tab-pill { 
      border: none; background: transparent; color: #64748b; padding: 14px 30px; 
      border-radius: 18px; cursor: pointer; display: flex; align-items: center; gap: 12px;
      font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative;
    }
    .tab-pill i { font-size: 1.1rem; transition: 0.3s; }
    .tab-pill:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .tab-pill.active { background: var(--gold-gradient); color: #000; box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3); }
    .tab-pill.active i { color: #000; }
    
    .count-badge { 
      background: rgba(255,255,255,0.15); padding: 2px 8px; border-radius: 8px; 
      font-size: 0.7rem; font-weight: 800;
    }
    .active .count-badge { background: rgba(0,0,0,0.1); }

    /* Content Grid */
    .fav-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 40px; }
    
    .fav-card-pro { 
      border-radius: 32px; overflow: hidden; display: flex; flex-direction: column; 
      height: 100%; transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .fav-card-pro:hover { transform: translateY(-12px); border-color: rgba(212,175,55,0.4); box-shadow: 0 30px 60px rgba(0,0,0,0.5); }
    
    .glass-luxury { background: var(--glass-bg); border: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(25px); }
    
    .image-card .card-image { height: 240px; background-size: cover; background-position: center; position: relative; }
    .image-card .overlay { position: absolute; inset: 0; background: linear-gradient(to top, var(--glass-bg), transparent); }
    
    .card-price, .card-rating, .card-category { 
      position: absolute; top: 20px; right: 20px; background: rgba(0,0,0,0.6); 
      backdrop-filter: blur(10px); color: var(--gold-primary); padding: 8px 16px; 
      border-radius: 12px; font-weight: 800; font-size: 0.85rem; border: 1px solid rgba(212,175,55,0.3);
    }

    .card-inner { padding: 35px; flex: 1; display: flex; flex-direction: column; }
    .card-title { font-size: 1.7rem; color: #fff; margin-bottom: 12px; line-height: 1.3; }
    .card-loc { color: #94a3b8; margin-bottom: 20px; font-size: 0.95rem; font-weight: 500; }
    .card-loc i { color: var(--gold-primary); margin-right: 8px; }
    
    .card-meta { display: flex; gap: 20px; color: #64748b; font-size: 0.85rem; margin-bottom: 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }

    .card-footer { margin-top: auto; display: flex; gap: 15px; }
    .btn-detail-luxury { 
      flex: 1; background: transparent; border: 1px solid rgba(255,255,255,0.1); 
      padding: 14px; border-radius: 16px; color: #fff; font-weight: 700; 
      cursor: pointer; transition: 0.4s; font-size: 0.9rem;
    }
    .btn-detail-luxury:hover { background: var(--gold-gradient); color: #000; border-color: transparent; box-shadow: 0 8px 20px rgba(212,175,55,0.3); }

    .btn-remove-mini { 
      width: 50px; height: 50px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 16px; color: #64748b; cursor: pointer; transition: 0.3s; font-size: 1rem;
    }
    .btn-remove-mini:hover { color: #ef4444; border-color: #ef4444; background: rgba(239, 68, 68, 0.1); }

    .itinerary-card { border-left: 4px solid var(--gold-primary); }
    .card-tag-premium { 
      margin: 30px 35px -10px; font-size: 0.65rem; color: var(--gold-primary); 
      font-weight: 800; letter-spacing: 2px; text-transform: uppercase;
    }

    /* Empty State */
    .empty-state-pro { text-align: center; padding: 100px 60px; max-width: 700px; margin: 40px auto; border-radius: 40px; }
    .empty-visual { font-size: 5rem; color: var(--gold-primary); margin-bottom: 35px; opacity: 0.3; }
    .empty-actions { display: flex; gap: 20px; justify-content: center; margin-top: 40px; }
    .btn-gold-luxury { background: var(--gold-gradient); color: #000; padding: 16px 40px; border-radius: 50px; font-weight: 800; text-decoration: none; transition: 0.4s; }
    .btn-outline-luxury { border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 16px 40px; border-radius: 50px; font-weight: 700; text-decoration: none; transition: 0.4s; }
    .btn-gold-luxury:hover { transform: scale(1.05); box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4); }
    .btn-outline-luxury:hover { background: rgba(255,255,255,0.05); color: var(--gold-primary); border-color: var(--gold-primary); }

    /* Loading */
    .loading-state { text-align: center; padding: 120px 0; }
    .luxury-loader { width: 60px; height: 60px; border: 3px solid rgba(212, 175, 55, 0.1); border-top: 3px solid var(--gold-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 30px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .reveal-item { opacity: 0; transform: translateY(30px); animation: reveal 1s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
    @keyframes reveal { to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .main-title { font-size: 3rem; }
      .tabs-glass { flex-direction: column; width: 100%; padding: 15px; }
      .tab-pill { width: 100%; justify-content: center; }
      .fav-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  private favoriteService = inject(FavoriteService);
  private el = inject(ElementRef);

  loading = signal(true);
  activeTab = signal('itineraries');
  favoritesData = signal<any>({ tours: [], hotels: [], pois: [], itineraries: [] });

  tabs = [
    { id: 'itineraries', label: 'Gợi ý AI', icon: 'fas fa-wand-magic-sparkles' },
    { id: 'tours', label: 'Tour Du Lịch', icon: 'fas fa-map-marked-alt' },
    { id: 'hotels', label: 'Khách Sạn', icon: 'fas fa-hotel' },
    { id: 'pois', label: 'Địa Điểm', icon: 'fas fa-compass' }
  ];

  constructor() {
    // Effect for tab animation
    effect(() => {
      const tab = this.activeTab();
      this.animateContent();
    });
  }

  ngOnInit() {
    this.refreshData();
  }

  refreshData() {
    this.loading.set(true);
    this.favoriteService.getAllFavorites().subscribe({
      next: (res) => {
        if (res.success) {
          this.favoritesData.set(res.data);
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setTab(tabId: string) {
    this.activeTab.set(tabId);
  }

  getCount(tabId: string): number {
    const data = this.favoritesData();
    switch (tabId) {
      case 'itineraries': return data.itineraries?.length || 0;
      case 'tours': return data.tours?.length || 0;
      case 'hotels': return data.hotels?.length || 0;
      case 'pois': return data.pois?.length || 0;
      default: return 0;
    }
  }

  isEmpty(): boolean {
    const tabId = this.activeTab();
    return this.getCount(tabId) === 0;
  }

  toggleFav(type: string, id: string) {
    this.favoriteService.toggleFavorite({ itemType: type as any, itemId: id }).subscribe(res => {
      if (res.success) {
        this.refreshData();
      }
    });
  }

  extractPOIImage(poi: any): string {
    const fallback = 'https://images.unsplash.com/photo-1518173946687-a4c8a3b7784e?auto=format&fit=crop&q=80&w=600';
    if (!poi.imagesJson || poi.imagesJson === 'null') return fallback;
    try {
      const imgs = JSON.parse(poi.imagesJson);
      return imgs && imgs.length > 0 ? imgs[0] : fallback;
    } catch { return fallback; }
  }

  private animateContent() {
    setTimeout(() => {
      gsap.from('.reveal-item', {
        opacity: 0,
        y: 50,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power4.out',
        clearProps: 'all'
      });
    }, 0);
  }
}
