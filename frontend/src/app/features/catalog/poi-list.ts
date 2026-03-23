import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, POI } from '../../core/services/catalog.service';

@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Feature Hero Section -->
    <section class="guide-hero animate-fade-in" *ngIf="featuredPoi()">
      <div class="hero-bg" [style.backgroundImage]="'url(' + extractImage(featuredPoi()!) + ')'"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <span class="trend-tag">Điểm đến nổi bật</span>
        <h1 class="luxury-font">{{ featuredPoi()?.name }}</h1>
        <p class="hero-desc">{{ truncateDesc(featuredPoi()?.description, 180) }}</p>
        <div class="hero-meta" *ngIf="featuredPoi() as p">
          <span *ngIf="p.bestTimeToVisit"><i class="fas fa-calendar-alt"></i> {{ p.bestTimeToVisit }}</span>
          <span *ngIf="p.rating"><i class="fas fa-star text-gold"></i> {{ p.rating }} / 5.0</span>
          <span><i class="fas fa-map-marker-alt"></i> {{ p.city }}</span>
        </div>
        <button class="btn-gold mt-30" (click)="openDetail(featuredPoi()!)">Khám Phá Bài Viết</button>
      </div>
    </section>

    <section class="guide-body container animate-fade-in">
      <div class="page-header text-center mt-50 mb-40">
        <h2 class="luxury-font text-3xl">Cẩm Nang Du Lịch Nội Địa</h2>
        <p class="text-gray mt-2">Tuyển tập những vùng đất mang đậm bản sắc văn hoá và thiên nhiên hùng vĩ.</p>
      </div>

      <!-- Region Navigation -->
      <div class="guide-nav mb-40">
        <button class="nav-btn" [class.active]="selectedRegion() === 'ALL'" (click)="selectedRegion.set('ALL')">Tất cả</button>
        <button class="nav-btn" [class.active]="selectedRegion() === 'NORTH'" (click)="selectedRegion.set('NORTH')">Miền Bắc</button>
        <button class="nav-btn" [class.active]="selectedRegion() === 'CENTRAL'" (click)="selectedRegion.set('CENTRAL')">Miền Trung</button>
        <button class="nav-btn" [class.active]="selectedRegion() === 'SOUTH'" (click)="selectedRegion.set('SOUTH')">Miền Nam</button>
      </div>

      <!-- Guide Grid -->
      <div class="grid" *ngIf="!loading()">
        <div *ngFor="let poi of filteredPois()" class="guide-card glass-effect hover-up">
          <div class="card-img" [style.backgroundImage]="'url(' + extractImage(poi) + ')'">
            <div class="cat-tag">{{ poi.category }}</div>
            <div class="rating-badge" *ngIf="poi.rating"><i class="fas fa-star text-gold"></i> {{ poi.rating }}</div>
          </div>
          <div class="card-body">
            <div class="meta-tags mb-3">
              <span class="city-tag"><i class="fas fa-map-marker-alt"></i> {{ poi.city }}</span>
              <span class="time-tag" *ngIf="poi.bestTimeToVisit"><i class="fas fa-sun"></i> {{ poi.bestTimeToVisit }}</span>
            </div>
            <h3 class="luxury-font card-title">{{ poi.name }}</h3>
            <p class="desc">{{ truncateDesc(poi.description, 110) }}</p>
            
            <div class="card-footer mt-4">
              <button class="btn-read-more" (click)="openDetail(poi)">Đọc tiếp <i class="fas fa-arrow-right ml-1"></i></button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-50" *ngIf="!loading() && filteredPois().length === 0">
        <i class="fas fa-compass text-gray text-5xl mb-3"></i>
        <h3 class="luxury-font text-xl text-gold">Chưa có cẩm nang nào</h3>
        <p class="text-gray">Không tìm thấy địa điểm nào trong khu vực này. Trở lại sau nhé!</p>
      </div>
    </section>

    <!-- Story Detail Modal -->
    <div class="guide-modal-overlay" *ngIf="selectedPoi() as detailPoi" (click)="closeDetail()">
      <div class="guide-modal-content animate-slide-up" (click)="$event.stopPropagation()">
        <button class="btn-close" (click)="closeDetail()"><i class="fas fa-times"></i></button>
        
        <div class="modal-hero" [style.backgroundImage]="'url(' + extractImage(detailPoi) + ')'">
          <div class="modal-hero-overlay"></div>
          <div class="modal-hero-text">
            <span class="cat-tag">{{ detailPoi.category }}</span>
            <h2 class="luxury-font">{{ detailPoi.name }}</h2>
            <div class="meta-tags mt-3">
              <span><i class="fas fa-map-marker-alt"></i> {{ detailPoi.city }}</span>
              <span *ngIf="detailPoi.rating"><i class="fas fa-star text-gold"></i> {{ detailPoi.rating }} / 5.0</span>
            </div>
          </div>
        </div>
        
        <div class="modal-body">
          <div class="modal-grid">
            <div class="modal-main-col">
              <h3 class="luxury-font text-2xl mb-3 text-gold">Về Điểm Chân Này</h3>
              <p class="article-text">{{ detailPoi.description }}</p>

              <div *ngIf="detailPoi.tips" class="tips-box mt-40">
                <h4 class="luxury-font text-xl text-gold mb-3"><i class="fas fa-lightbulb"></i> Kinh nghiệm & Lưu ý</h4>
                <div class="article-text" [innerHTML]="detailPoi.tips"></div>
              </div>
            </div>
            
            <div class="modal-side-col">
              <div class="info-card glass-effect">
                <h4 class="luxury-font text-gold mb-3 text-lg">Thông tin nhanh</h4>
                <ul class="info-list">
                  <li *ngIf="detailPoi.bestTimeToVisit">
                    <i class="fas fa-calendar-check text-gold"></i>
                    <div>
                      <strong>Mùa đẹp nhất</strong>
                      <span>{{ detailPoi.bestTimeToVisit }}</span>
                    </div>
                  </li>
                  <li *ngIf="detailPoi.averageSpend">
                    <i class="fas fa-wallet text-gold"></i>
                    <div>
                      <strong>Chi phí tham khảo</strong>
                      <span>{{ detailPoi.averageSpend | number }}đ</span>
                    </div>
                  </li>
                  <li *ngIf="detailPoi.address">
                    <i class="fas fa-map text-gold"></i>
                    <div>
                      <strong>Địa chỉ cụ thể</strong>
                      <span>{{ detailPoi.address }}</span>
                    </div>
                  </li>
                </ul>
                <button class="btn-gold w-full mt-30 shadow-gold" (click)="closeDetail()">Tìm Tour Gần Đây</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* Hero Section */
    .guide-hero { position: relative; height: 75vh; min-height: 600px; display: flex; align-items: center; overflow: hidden; margin-top: -80px; } /* Pull under navbar */
    .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 10s ease-out; }
    .guide-hero:hover .hero-bg { transform: scale(1.05); }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to right, rgba(11, 15, 25, 0.95) 0%, rgba(11, 15, 25, 0.6) 50%, rgba(11, 15, 25, 0.2) 100%); }
    .hero-content { position: relative; z-index: 10; max-width: 800px; padding: 0 40px; }
    
    .trend-tag { display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); padding: 6px 16px; border-radius: 30px; border: 1px solid rgba(212, 175, 55, 0.3); font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 24px; }
    .hero-content h1 { font-size: 4rem; line-height: 1.1; margin-bottom: 24px; color: white; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .hero-desc { font-size: 1.15rem; color: #cbd5e1; line-height: 1.8; margin-bottom: 30px; text-shadow: 0 4px 10px rgba(0,0,0,0.5); max-width: 600px; }
    
    .hero-meta { display: flex; gap: 24px; color: white; margin-bottom: 30px; font-size: 0.95rem; }
    .hero-meta span { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); padding: 8px 16px; border-radius: 12px; backdrop-filter: blur(4px); }
    
    /* Navigation */
    .guide-nav { display: flex; justify-content: center; gap: 12px; flex-wrap: wrap; }
    .nav-btn { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; padding: 12px 30px; border-radius: 30px; font-weight: 600; cursor: pointer; transition: all 0.3s; text-transform: uppercase; letter-spacing: 1px; font-size: 0.85rem; }
    .nav-btn:hover { background: rgba(255,255,255,0.1); color: white; }
    .nav-btn.active { background: rgba(212, 175, 55, 0.15); border-color: var(--gold-primary); color: var(--gold-primary); box-shadow: 0 0 20px rgba(212,175,55,0.15); }
    
    /* Grid & Cards */
    .guide-body { padding-bottom: 100px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(360px, 1fr)); gap: 32px; }
    
    .guide-card { display: flex; flex-direction: column; overflow: hidden; border-radius: 20px; transition: transform 0.4s, box-shadow 0.4s; border: 1px solid rgba(255,255,255,0.05); }
    .guide-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); border-color: rgba(212,175,55,0.3); }
    .guide-card:hover .card-img { background-size: 110%; }
    
    .card-img { height: 260px; background-size: cover; background-position: center; position: relative; transition: background-size 0.6s ease; }
    .cat-tag { position: absolute; top: 20px; left: 20px; background: rgba(11, 15, 25, 0.85); color: white; padding: 6px 14px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; backdrop-filter: blur(4px); border: 1px solid rgba(255,255,255,0.1); }
    .rating-badge { position: absolute; top: 20px; right: 20px; background: rgba(11,15,25,0.85); padding: 6px 12px; border-radius: 6px; font-weight: 700; color: white; font-size: 0.85rem; border: 1px solid rgba(212,175,55,0.3); }
    
    .card-body { padding: 32px; display: flex; flex-direction: column; flex-grow: 1; }
    .meta-tags { display: flex; gap: 16px; font-size: 0.8rem; color: var(--gold-secondary); text-transform: uppercase; letter-spacing: 1px; }
    .time-tag { color: #94a3b8; }
    .card-title { font-size: 1.6rem; margin-bottom: 16px; color: white; line-height: 1.3; }
    .desc { color: #cbd5e1; line-height: 1.6; font-size: 0.95rem; flex-grow: 1; }
    
    .card-footer { display: flex; justify-content: space-between; align-items: flex-end; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
    .price { font-size: 0.85rem; color: #94a3b8; }
    .price span { font-size: 1.25rem; display: block; margin-top: 4px; }
    .btn-read-more { background: transparent; border: none; color: var(--gold-primary); font-weight: 600; cursor: pointer; transition: all 0.2s; font-size: 0.95rem; display: flex; align-items: center; }
    .btn-read-more:hover { color: white; transform: translateX(5px); }
    
    /* Utils */
    .mt-30 { margin-top: 30px; } .mt-40 { margin-top: 40px; } .mt-50 { margin-top: 50px; }
    .mb-3 { margin-bottom: 12px; } .mb-40 { margin-bottom: 40px; }
    .py-50 { padding: 50px 0; }
    .text-3xl { font-size: 2.2rem; margin-bottom: 10px; color: var(--gold-primary); }
    .text-gray { color: #94a3b8; } .text-gold { color: var(--gold-primary); } .font-bold { font-weight: bold; }
    .ml-1 { margin-left: 6px; } .w-full { width: 100%; }

    /* Guide Modal */
    .guide-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); z-index: 9999; display: flex; justify-content: center; align-items: flex-end; padding: 20px 0 0 0; }
    .guide-modal-content { background: var(--bg-primary); width: 100%; max-width: 1100px; height: 90vh; border-radius: 24px 24px 0 0; overflow-y: auto; position: relative; border-top: 1px solid rgba(212,175,55,0.3); box-shadow: 0 -20px 50px rgba(0,0,0,0.8); }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes slideUp { from { transform: translateY(100vh); } to { transform: translateY(0); } }
    
    .btn-close { position: absolute; top: 20px; right: 20px; z-index: 20; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.2); color: white; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px); }
    .btn-close:hover { background: var(--gold-primary); color: black; transform: rotate(90deg); }
    
    .modal-hero { height: 420px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 50px; }
    .modal-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,10,20,1) 0%, rgba(5,10,20,0) 100%); }
    .modal-hero-text { position: relative; z-index: 10; width: 100%; }
    .modal-hero-text h2 { font-size: 3.5rem; color: white; margin: 15px 0; line-height: 1.1; text-shadow: 0 5px 20px rgba(0,0,0,0.6); }
    .modal-hero-text .cat-tag { position: relative; top: auto; left: auto; display: inline-block; margin-bottom: 5px; }
    
    .modal-body { padding: 50px; }
    .modal-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 50px; }
    @media (max-width: 800px) { .modal-grid { grid-template-columns: 1fr; } }
    
    .article-text { color: #cbd5e1; font-size: 1.1rem; line-height: 1.8; white-space: pre-wrap; }
    .tips-box { background: rgba(212,175,55,0.05); border: 1px solid rgba(212,175,55,0.2); padding: 35px; border-radius: 16px; position: relative; }
    .tips-box::before { content: ''; position: absolute; left: 0; top: 20px; bottom: 20px; width: 4px; background: var(--gold-primary); border-radius: 0 4px 4px 0; }
    
    .text-2xl { font-size: 1.8rem; } .text-xl { font-size: 1.4rem; } .text-lg { font-size: 1.2rem; }
    
    .info-card { padding: 35px; border-radius: 20px; position: sticky; top: 20px; }
    .info-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 24px; }
    .info-list li { display: flex; gap: 16px; align-items: flex-start; }
    .info-list i { font-size: 1.4rem; margin-top: 4px; opacity: 0.8; }
    .info-list strong { display: block; color: white; margin-bottom: 6px; font-size: 0.95rem; }
    .info-list span { color: #94a3b8; font-size: 0.95rem; line-height: 1.4; display: block; }
    .shadow-gold { box-shadow: 0 10px 20px rgba(212,175,55,0.15); }
  `]
})
export class PoiListComponent implements OnInit {
  private service = inject(CatalogService);
  pois = signal<POI[]>([]);
  loading = signal(true);
  selectedRegion = signal<string>('ALL');
  selectedPoi = signal<POI | null>(null);

  // Compute filtered POIs based on region
  filteredPois = computed(() => {
    const list = this.pois();
    const region = this.selectedRegion();
    if (region === 'ALL') return list;
    return list.filter(p => p.region === region);
  });

  // Decide the featured POI (First HIGH RATING one, or just the first)
  featuredPoi = computed(() => {
    const list = this.pois();
    if (list.length === 0) return null;
    return list.find(p => p.rating && p.rating >= 4.8) || list[0];
  });

  ngOnInit() {
    this.service.getPOIs().subscribe({
      next: (res) => {
        if (res.success) this.pois.set(res.data);
        this.loading.set(false);
      }
    });
  }

  extractImage(poi: POI): string {
    const fallback = 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200';
    if (!poi.imagesJson || poi.imagesJson === 'null' || poi.imagesJson === '[]') {
      return fallback;
    }
    try {
      const imgs = JSON.parse(poi.imagesJson);
      return imgs && imgs.length > 0 ? imgs[0] : fallback;
    } catch (e) {
      return fallback;
    }
  }

  truncateDesc(desc?: string, length: number = 100): string {
    if (!desc) return '';
    if (desc.length <= length) return desc;
    return desc.substring(0, length).trim() + '...';
  }

  openDetail(poi: POI) {
    this.selectedPoi.set(poi);
    document.body.style.overflow = 'hidden';
  }

  closeDetail() {
    this.selectedPoi.set(null);
    document.body.style.overflow = '';
  }
}

