import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, Tour } from '../../core/services/catalog.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tour-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <section class="tour-list-page animate-fade-in">
      <!-- Hero Section from Image 1 -->
      <div class="hero-header">
        <div class="hero-content">
          <div class="search-box-wrapper animate-slide-up">
            <div class="search-box">
              <i class="fas fa-search search-icon"></i>
              <input type="text" [(ngModel)]="searchQuery" placeholder="Bạn có ý tưởng gì cho chuyến đi tiếp theo không?">
              <button class="btn-search">Tìm kiếm</button>
            </div>
          </div>
        </div>
      </div>

      <div class="container main-content mt-60">
        <div class="section-title-row mb-40 text-center">
           <span class="pro-label">BST TOUR DU LỊCH</span>
           <h2 class="section-title luxury-font">Hành Trình Độc Bản</h2>
           <p class="subtitle-pro">Khám phá những điểm đến thượng lưu được thiết kế riêng cho bạn</p>
        </div>

        <!-- Reference Style Categories -->
        <div class="category-filters mb-50">
           <button 
             *ngFor="let cat of categories" 
             class="cat-chip" 
             [class.active]="selectedCategory() === cat"
             (click)="selectCategory(cat)">
             {{ cat }}
           </button>
        </div>

        <!-- Tour Grid with Reference Card Style -->
        <div class="tour-grid" *ngIf="!loading()">
          <div *ngFor="let tour of filteredTours()" class="tour-card animate-fade-in">
            <div class="card-media">
               <img [src]="tour.imageUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600'" [alt]="tour.title">
               <button class="btn-wishlist"><i class="far fa-bookmark"></i></button>
               <div class="card-badge" *ngIf="tour.tourType">{{ tour.tourType }}</div>
            </div>
            
            <div class="card-info">
              <h3 class="tour-title">{{ tour.title }}</h3>
              <div class="tour-meta">
                 <span class="duration"><i class="far fa-clock"></i> {{ tour.durationDays }} ngày</span>
                 <span class="location"><i class="fas fa-map-marker-alt"></i> {{ tour.location }}</span>
              </div>
              
              <div class="price-box">
                 <div class="current-price">{{ tour.price | number }} VND</div>
              </div>
              
              <button class="btn-view-pro" [routerLink]="['/tours', tour.id]">XEM CHI TIẾT</button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div *ngIf="filteredTours().length === 0 && !loading()" class="empty-state text-center mt-100">
           <i class="fas fa-search-minus gold-text text-5xl mb-20"></i>
           <h3 class="luxury-font">Không tìm thấy Tour nào</h3>
           <p>Hãy thử lọc theo hạng mục khác hoặc tìm kiếm với từ khóa khác.</p>
        </div>

        <!-- Loading -->
        <div class="loading-state text-center mt-100" *ngIf="loading()">
           <div class="spinner-pro"></div>
           <p class="mt-20">Đang khởi tạo hành trình...</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .tour-list-page { background: #050a14; color: #fff; min-height: 100vh; padding-bottom: 100px; }
    
    /* Hero Section from Reference */
    .hero-header { 
      height: 450px; 
      background: linear-gradient(rgba(0,0,0,0.3), rgba(5,10,20,1)), 
                  url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1600');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .hero-content { width: 100%; max-width: 800px; padding: 0 20px; }
    
    .search-box { 
      background: rgba(255,255,255,0.05); border: 1px solid rgba(212,175,55,0.3); border-radius: 50px; padding: 10px 10px 10px 30px; 
      display: flex; align-items: center; gap: 15px; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
      backdrop-filter: blur(15px);
    }
    .search-icon { color: var(--gold-primary); font-size: 1.1rem; }
    .search-box input { flex: 1; border: none; outline: none; font-size: 1rem; color: #fff; padding: 10px 0; background: transparent; }
    .search-box input::placeholder { color: rgba(255,255,255,0.4); }
    .btn-search { background: var(--gold-gradient); color: #000; border: none; padding: 12px 35px; border-radius: 50px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-search:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }

    .container { max-width: 1300px; margin: 0 auto; padding: 0 25px; }
    .mt-40 { margin-top: 40px; }
    .mb-30 { margin-bottom: 30px; }
    .mb-40 { margin-bottom: 40px; }

    /* Location Banner */
    .location-banner { display: flex; justify-content: space-between; align-items: center; }
    .loc-info { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
    .loc-icon { color: #000; background: #fff; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.7rem; }
    .label { color: #94a3b8; font-weight: 600; }
    .loc-val { color: #fff; font-weight: 700; border: 1px solid #fff; padding: 4px 12px; border-radius: 8px; margin: 0 8px; }
    .change-loc { color: #ef4444; font-weight: 600; text-decoration: none; border: 1px solid #ef4444; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; }
    
    .btn-activity-pro { background: #c2410c; color: #fff; border: none; padding: 8px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; }

    .section-title { font-size: 2.8rem; letter-spacing: 2px; margin-bottom: 10px; background: var(--gold-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .pro-label { font-size: 0.8rem; font-weight: 700; color: var(--gold-primary); letter-spacing: 4px; text-transform: uppercase; margin-bottom: 15px; display: block; }
    .subtitle-pro { color: #94a3b8; font-size: 1.1rem; opacity: 0.8; }

    /* Categories CSS from Reference */
    .category-filters { display: flex; gap: 15px; justify-content: center; overflow-x: auto; padding-bottom: 10px; }
    .cat-chip { 
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: #fff; 
      padding: 10px 30px; border-radius: 50px; font-weight: 600; cursor: pointer; 
      transition: 0.3s; white-space: nowrap; font-size: 0.9rem;
    }
    .cat-chip:hover { border-color: var(--gold-primary); transform: translateY(-3px); }
    .cat-chip.active { background: var(--gold-gradient); color: #000; border-color: transparent; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); }

    /* Tour Card CSS from Reference */
    .tour-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
    .tour-card { background: rgba(255,255,255,0.03); border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); transition: 0.4s; }
    .tour-card:hover { transform: translateY(-10px); border-color: rgba(212, 175, 55, 0.3); background: rgba(255,255,255,0.06); }
    
    .card-media { position: relative; height: 220px; }
    .card-media img { width: 100%; height: 100%; object-fit: cover; }
    .btn-wishlist { position: absolute; top: 15px; right: 15px; background: rgba(255,255,255,0.2); border: none; color: #fff; width: 32px; height: 32px; border-radius: 5px; cursor: pointer; backdrop-filter: blur(5px); }
    .card-badge { position: absolute; top: 15px; left: 15px; background: var(--gold-gradient); color: #000; padding: 4px 12px; border-radius: 5px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; }

    .card-info { padding: 25px; }
    .tour-title { font-size: 1.15rem; font-weight: 700; margin-bottom: 15px; line-height: 1.4; height: 3.2em; overflow: hidden; }
    .tour-meta { display: flex; gap: 15px; color: #94a3b8; font-size: 0.85rem; margin-bottom: 20px; }
    .tour-meta i { margin-right: 5px; }

    .price-box { margin-bottom: 25px; }
    .old-price { color: #64748b; text-decoration: line-through; font-size: 0.85rem; margin-bottom: 2px; }
    .current-price { color: #f97316; font-size: 1.4rem; font-weight: 800; font-family: 'Playfair Display', serif; }

    .btn-view-pro { width: 100%; background: transparent; border: 1px solid rgba(212, 175, 55, 0.5); color: #d4af37; padding: 12px; border-radius: 12px; font-weight: 700; letter-spacing: 1px; transition: 0.3s; cursor: pointer; font-size: 0.85rem; }
    .btn-view-pro:hover { background: var(--gold-primary); color: #000; border-color: transparent; }

    .spinner-pro { width: 40px; height: 40px; border: 3px solid rgba(212, 175, 55, 0.1); border-top-color: var(--gold-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 768px) {
      .hero-header { height: 300px; }
      .location-banner { flex-direction: column; align-items: flex-start; gap: 20px; }
      .tour-grid { grid-template-columns: 1fr; }
      .main-title { font-size: 2.2rem; }
    }
  `]
})
export class TourListComponent implements OnInit {
  private service = inject(CatalogService);
  
  tours = signal<Tour[]>([]);
  loading = signal(true);
  searchQuery = '';
  
  categories = ['Tất cả', 'Gia Đình', 'Sinh Viên', 'Cặp Đôi', 'Luxury', 'Mạo Hiểm'];
  selectedCategory = signal('Tất cả');

  filteredTours = computed(() => {
    let list = this.tours();
    const cat = this.selectedCategory();
    const query = this.searchQuery.toLowerCase().trim();

    if (cat !== 'Tất cả') {
      list = list.filter(t => t.tourType === cat);
    }

    if (query) {
      list = list.filter(t => 
        t.title.toLowerCase().includes(query) || 
        t.location.toLowerCase().includes(query)
      );
    }
    
    return list;
  });

  ngOnInit() {
    this.loadTours();
  }

  loadTours() {
    this.loading.set(true);
    this.service.getTours().subscribe({
      next: (res) => {
        if (res.success) this.tours.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  selectCategory(cat: string) {
    this.selectedCategory.set(cat);
  }
}
