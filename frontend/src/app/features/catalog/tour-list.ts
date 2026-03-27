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
      <!-- Hero Section: Titles now inside Hero for focus -->
      <div class="hero-header">
        <div class="hero-content animate-slide-up">
          <span class="pro-label-hero">BEST TOUR DU LỊCH</span>
          <h1 class="luxury-font main-title-hero">Hành Trình Độc Bản</h1>
          <p class="subtitle-hero">Khám phá những điểm đến thượng lưu được thiết kế riêng cho bạn</p>
        </div>
      </div>

      <div class="container main-content">
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
    
    /* Hero Section: Titles Focus */
    .hero-header { 
      height: 550px; 
      background: linear-gradient(rgba(0,0,0,0.5), rgba(5,10,20,1)), 
                  url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1600');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: -60px; /* Overlap effect */
    }
    .hero-content { width: 100%; max-width: 900px; padding: 0 20px; text-align: center; }
    
    .pro-label-hero { font-size: 0.9rem; font-weight: 800; color: var(--gold-primary); letter-spacing: 6px; text-transform: uppercase; margin-bottom: 25px; display: block; opacity: 0.9; }
    .main-title-hero { font-size: 4.5rem; margin-bottom: 25px; background: var(--gold-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .subtitle-hero { color: #e2e8f0; font-size: 1.35rem; opacity: 0.8; max-width: 700px; margin: 0 auto; line-height: 1.6; }

    .search-box { 
      background: rgba(255,255,255,0.04); border: 1px solid rgba(212,175,55,0.25); border-radius: 60px; padding: 8px 8px 8px 30px; 
      display: flex; align-items: center; gap: 15px; box-shadow: 0 25px 50px rgba(0,0,0,0.5);
      backdrop-filter: blur(20px); transition: 0.3s;
    }
    .search-box:focus-within { border-color: var(--gold-primary); box-shadow: 0 0 30px rgba(212,175,55,0.15); }
    .search-icon { color: var(--gold-primary); font-size: 1.2rem; }
    .search-box input { flex: 1; border: none; outline: none; font-size: 1.1rem; color: #fff; padding: 12px 0; background: transparent; }
    .search-box input::placeholder { color: rgba(255,255,255,0.35); }
    .btn-search { background: var(--gold-gradient); color: #000; border: none; padding: 12px 40px; border-radius: 50px; font-weight: 800; cursor: pointer; transition: 0.3s; letter-spacing: 1px; }
    .btn-search:hover { transform: scale(1.05); box-shadow: 0 0 25px rgba(212, 175, 55, 0.5); }

    .container { max-width: 1400px; margin: 0 auto; padding: 0 30px; position: relative; z-index: 10; }
    .main-content { min-height: 500px; }
    .mt-60 { margin-top: 80px; }
    .mb-30 { margin-bottom: 30px; }
    .mb-40 { margin-bottom: 50px; }
    .mb-50 { margin-bottom: 70px; }

    /* Location Banner */
    .location-banner { display: flex; justify-content: space-between; align-items: center; }
    .loc-info { display: flex; align-items: center; gap: 12px; font-size: 0.95rem; }
    .loc-icon { color: #000; background: #fff; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; border-radius: 50%; font-size: 0.7rem; }
    .label { color: #94a3b8; font-weight: 600; }
    .loc-val { color: #fff; font-weight: 700; border: 1px solid #fff; padding: 4px 12px; border-radius: 8px; margin: 0 8px; }
    .change-loc { color: #ef4444; font-weight: 600; text-decoration: none; border: 1px solid #ef4444; padding: 4px 12px; border-radius: 20px; font-size: 0.85rem; }
    
    .btn-activity-pro { background: #c2410c; color: #fff; border: none; padding: 8px 15px; border-radius: 20px; font-size: 0.85rem; font-weight: 600; cursor: pointer; }

    /* Titles Alignment */
    .section-title-row { text-align: center; max-width: 800px; margin-left: auto; margin-right: auto; }
    .section-title { font-size: 3.2rem; letter-spacing: 2px; margin-bottom: 15px; background: var(--gold-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-family: 'Playfair Display', serif; }
    .pro-label { font-size: 0.85rem; font-weight: 800; color: var(--gold-primary); letter-spacing: 5px; text-transform: uppercase; margin-bottom: 20px; display: block; }
    .subtitle-pro { color: #94a3b8; font-size: 1.2rem; opacity: 0.8; line-height: 1.6; }

    /* Categories CSS from Reference */
    .category-filters { display: flex; gap: 18px; justify-content: center; overflow-x: auto; padding-bottom: 15px; }
    .cat-chip { 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.7); 
      padding: 12px 35px; border-radius: 50px; font-weight: 600; cursor: pointer; 
      transition: 0.4s; white-space: nowrap; font-size: 0.95rem; letter-spacing: 1px;
    }
    .cat-chip:hover { border-color: rgba(212, 175, 55, 0.4); color: #fff; transform: translateY(-3px); }
    .cat-chip.active { background: var(--gold-gradient); color: #000; border-color: transparent; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.35); }

    /* Tour Card CSS from Reference */
    .tour-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 40px; }
    .tour-card { background: rgba(255,255,255,0.02); border-radius: 30px; overflow: hidden; border: 1px solid rgba(255,255,255,0.06); transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1); display: flex; flex-direction: column; }
    .tour-card:hover { transform: translateY(-15px); border-color: rgba(212, 175, 55, 0.4); background: rgba(255,255,255,0.05); box-shadow: 0 30px 60px rgba(0,0,0,0.6); }
    
    .card-media { position: relative; height: 260px; overflow: hidden; }
    .card-media img { width: 100%; height: 100%; object-fit: cover; transition: 1s cubic-bezier(0.4, 0, 0.2, 1); }
    .tour-card:hover .card-media img { transform: scale(1.1); }
    
    .btn-wishlist { position: absolute; top: 20px; right: 20px; background: rgba(255,255,255,0.15); border: none; color: #fff; width: 38px; height: 38px; border-radius: 10px; cursor: pointer; backdrop-filter: blur(10px); transition: 0.3s; z-index: 10; }
    .btn-wishlist:hover { background: #fff; color: #000; }
    .card-badge { position: absolute; top: 20px; left: 20px; background: var(--gold-gradient); color: #000; padding: 6px 16px; border-radius: 10px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; z-index: 10; }

    .card-info { padding: 35px; flex: 1; display: flex; flex-direction: column; }
    .tour-title { font-size: 1.4rem; font-weight: 700; margin-bottom: 20px; line-height: 1.4; color: #fff; min-height: 2.8em; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; font-family: 'Playfair Display', serif; }
    .tour-meta { display: flex; gap: 20px; color: #94a3b8; font-size: 0.9rem; margin-bottom: 25px; }
    .tour-meta i { margin-right: 8px; color: var(--gold-primary); }

    .price-box { margin-bottom: 30px; }
    .old-price { color: #64748b; text-decoration: line-through; font-size: 0.85rem; margin-bottom: 2px; }
    .current-price { color: var(--gold-primary); font-size: 1.8rem; font-weight: 800; font-family: 'Playfair Display', serif; }

    .btn-view-pro { 
      width: 100%; background: transparent; border: 2px solid rgba(212, 175, 55, 0.4); color: var(--gold-primary); 
      padding: 16px; border-radius: 16px; font-weight: 700; letter-spacing: 2px; transition: 0.4s; 
      cursor: pointer; font-size: 0.9rem; margin-top: auto;
    }
    .btn-view-pro:hover { background: var(--gold-gradient); color: #000; border-color: transparent; box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3); transform: scale(1.02); }

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
