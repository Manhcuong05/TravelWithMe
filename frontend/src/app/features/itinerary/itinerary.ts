import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItineraryService, ItineraryResponse } from '../../core/services/itinerary.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="itinerary-page overflow-hidden">
      <!-- Ambient Background -->
      <div class="ai-ambient-bg">
        <img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1920" alt="AI Planner Background">
        <div class="overlay-gradient"></div>
      </div>

      <div class="container relative z-10">
        <!-- Default Header (Init Mode) -->
        <div class="page-header text-center mb-60" *ngIf="!isViewingSaved()">
          <span class="pro-label animate-slide-up">POWERED BY GenZ CMC</span>
          <h1 class="luxury-font animate-slide-up" style="animation-delay: 0.1s">Lập Kế Hoạch Du Lịch AI</h1>
          <p class="animate-slide-up" style="animation-delay: 0.2s">Thiết lập hành trình độc bản dựa trên sở thích cá nhân của bạn.</p>
        </div>

        <!-- Viewing Saved Mode Header -->
        <div class="page-header text-center mb-60" *ngIf="isViewingSaved()">
          <h1 class="luxury-font animate-slide-up">Hành Trình Của Bạn</h1>
          <p class="animate-slide-up" style="animation-delay: 0.1s">Hành trình trải nghiệm xa hoa đã được lưu vào hệ thống của TravelWithMe.</p>
          <a routerLink="/favorites" class="btn-back mt-20 animate-slide-up" style="animation-delay: 0.2s">
            <i class="fas fa-arrow-left"></i> Bộ sưu tập đã lưu
          </a>
        </div>

        <!-- Main Input Form (Hidden when result exists) -->
        <div class="planner-card glass-premium animate-scale-up" *ngIf="!itinerary() && !loading()">
          <div class="form-content">
            <div class="grid-form">
              <div class="floating-group">
                <input type="text" [(ngModel)]="request.destination" placeholder=" " id="dest">
                <label for="dest">BẠN MUỐN ĐI ĐÂU?</label>
                <i class="fas fa-map-marker-alt input-icon"></i>
              </div>
              <div class="floating-group">
                <input type="number" [(ngModel)]="request.days" min="1" max="14" placeholder=" " id="days">
                <label for="days">SỐ NGÀY TRẢI NGHIỆM</label>
                <i class="fas fa-calendar-day input-icon"></i>
              </div>
            </div>
            
            <div class="floating-group mt-30">
              <textarea [(ngModel)]="request.preferences" placeholder=" " id="prefs"></textarea>
              <label for="prefs">SỞ THÍCH & YÊU CẦU ĐẶC BIỆT (TÙY CHỌN)</label>
              <i class="fas fa-sparkles input-icon"></i>
            </div>

            <div class="action-footer mt-40">
              <button (click)="generate()" class="btn-luxury-lg w-full" [disabled]="loading()">
                <span>BẮT ĐẦU KIẾN TẠO HÀNH TRÌNH</span>
              </button>
            </div>
          </div>
        </div>

        <!-- AI Orchestration Loader -->
        <div *ngIf="loading()" class="ai-orchestration-loader">
          <div class="loader-content">
            <div class="luxury-radar-container">
              <div class="radar-circle"></div>
              <div class="radar-circle" style="animation-delay: 0.5s"></div>
              <div class="radar-circle" style="animation-delay: 1s"></div>
              <div class="radar-scanner"></div>
              <i class="fas fa-brain ai-icon"></i>
            </div>
            <div class="loading-status">
              <h3 class="luxury-font">{{ loadingStatus() }}</h3>
              <div class="progress-bar-container">
                <div class="progress-bar" [style.width.%]="loadingProgress()"></div>
              </div>
              <p>Hệ thống đang tích hợp dữ liệu tour & khách sạn theo thời gian thực...</p>
            </div>
          </div>
        </div>

        <!-- Itinerary Result -->
        <div *ngIf="itinerary()" class="itinerary-display animate-fade-in">
          <div class="result-hero-card glass-premium mb-60">
             <div class="hero-top">
                <span class="pro-tag-luxury">ULTIMATE PLAN READY</span>
                <h2 class="luxury-font">{{ itinerary()?.title }}</h2>
                <div class="hero-meta">
                  <span><i class="fas fa-location-dot"></i> {{ itinerary()?.destination }}</span>
                  <span><i class="fas fa-clock"></i> {{ itinerary()?.days?.length }} Ngày</span>
                </div>
             </div>
             <div class="hero-actions">
                <button *ngIf="!itinerary()?.saved" class="btn-gold-glass" (click)="saveSuccess()">
                  <i class="fas fa-bookmark mr-10"></i> Lưu vào Tài Khoản
                </button>
                <button class="btn-gold-glass" (click)="print()">
                  <i class="fas fa-file-pdf mr-10"></i> Xuất PDF
                </button>
             </div>
          </div>

          <!-- Timeline -->
          <div class="timeline-v2">
            <div *ngFor="let day of itinerary()?.days; let i = index" class="day-v2-card animate-slide-up" [style.animation-delay]="(i * 0.1) + 's'">
              <div class="day-sidebar">
                <div class="day-number luxury-font">Day {{ day.day }}</div>
              </div>
              <div class="day-main">
                <div *ngFor="let act of day.activities" class="act-v2-card glass-premium">
                  <div class="act-time luxury-font">{{ act.time }}</div>
                  <div class="act-info">
                    <h3>{{ act.activity }}</h3>
                    <p class="loc">📍 {{ act.location }}</p>
                    <p *ngIf="act.notes" class="notes">{{ act.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- New Recommendations Pro Section -->
          <div class="recommendations-container mt-100 mb-100">
            <div class="section-badge-center">
              <span class="premium-divider"></span>
              <span class="badge-text">KHÁM PHÁ CÁC SẢN PHẨM PHÙ HỢP CÓ SẴN</span>
              <span class="premium-divider"></span>
            </div>
            
            <div class="recommendations-header text-center mt-30 mb-50">
               <h2 class="luxury-font text-5xl">Dành Riêng Cho Bạn</h2>
            </div>

            <div class="itinerary-recommendations-grid" *ngIf="itinerary()?.recommendations?.length; else noRecs">
              <div *ngFor="let rec of itinerary()?.recommendations" class="rec-glass-card hover-lift">
                <div class="rec-type">{{ rec.type }}</div>
                <div class="rec-main">
                  <div class="rec-media">
                    <i class="fas" [class.fa-hotel]="rec.type === 'HOTEL'" [class.fa-map-marked-alt]="rec.type === 'TOUR'" [class.fa-location-dot]="rec.type === 'POI'"></i>
                  </div>
                  <div class="rec-body">
                    <h3>{{ rec.name }}</h3>
                    <p>Khám phá sản phẩm cao cấp phù hợp với lịch trình đã lập.</p>
                    <a [routerLink]="getRecLink(rec)" class="btn-view-premium">Xem Chi Tiết</a>
                  </div>
                </div>
              </div>
            </div>
            
            <ng-template #noRecs>
              <div class="concierge-premium-card glass-premium animate-scale-up">
                <div class="concierge-visual">
                  <div class="glow-orb"></div>
                  <i class="fas fa-concierge-bell concierge-icon"></i>
                </div>
                <div class="concierge-content">
                  <h3 class="luxury-font">Dịch Vụ Quản Gia Độc Bản</h3>
                  <p>Hành trình này yêu cầu sự tinh tuyển vượt trên các lựa chọn hiện có.</p>
                  <div class="concierge-action">
                    <span class="hotline-text">LUXURY HOTLINE 24/7: <strong>1900 888 999</strong></span>
                    <button class="btn-concierge-connect">Kết nối Chuyên gia</button>
                  </div>
                </div>
              </div>
            </ng-template>
          </div>
        </div>

        <!-- Footer Control for Results -->
        <div class="result-footer-nav" *ngIf="itinerary() && !isViewingSaved()">
           <button (click)="resetForm()" class="btn-back-main">
             <i class="fas fa-rotate-left"></i> Tạo lịch trình khác
           </button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { scroll-behavior: smooth; }
    .itinerary-page { padding: 180px 0 120px; min-height: 100vh; position: relative; background: #050505; color: #fff; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 25px; }

    /* Ambient Background Engine */
    .ai-ambient-bg { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; overflow: hidden; }
    .ai-ambient-bg img { width: 100%; height: 100%; object-fit: cover; opacity: 0.5; filter: blur(2px); transform: scale(1.05); }
    .overlay-gradient { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, rgba(5,5,5,0.7) 0%, rgba(5,5,5,0.95) 100%); }

    /* Typography & Elements */
    .pro-label { font-size: 0.7rem; font-weight: 800; letter-spacing: 4px; color: var(--gold-secondary); display: block; margin-bottom: 20px; }
    .mb-60 { margin-bottom: 60px; }
    .mt-100 { margin-top: 100px; }
    .mb-100 { margin-bottom: 100px; }
    
    /* Luxury Form Design */
    .planner-card { padding: 50px; border-radius: 30px; border: 1px solid rgba(212, 175, 55, 0.2); position: relative; }
    .grid-form { display: grid; grid-template-columns: 1.5fr 1fr; gap: 30px; }
    
    .floating-group { position: relative; margin-bottom: 25px; }
    .floating-group input, .floating-group textarea {
      width: 100%; background: rgba(255,255,255,0.03) !important; border: none; 
      border-bottom: 1px solid rgba(255,255,255,0.1); padding: 35px 20px 15px 50px;
      color: #fff; font-size: 1.1rem; outline: none; transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      border-radius: 12px;
    }
    .floating-group textarea { height: 120px; }
    .floating-group label {
      position: absolute; left: 50px; top: 35px; color: rgba(255,255,255,0.4); 
      font-size: 0.75rem; font-weight: 800; letter-spacing: 2px;
      transition: 0.4s cubic-bezier(0.4, 0, 0.2, 1); pointer-events: none;
    }
    .input-icon { position: absolute; left: 20px; top: 40px; color: var(--gold-primary); font-size: 1.2rem; opacity: 0.6; }
    
    .floating-group input:focus, .floating-group textarea:focus { background: rgba(212, 175, 55, 0.05) !important; border-bottom-color: var(--gold-primary); }
    .floating-group input:focus + label, .floating-group input:not(:placeholder-shown) + label,
    .floating-group textarea:focus + label, .floating-group textarea:not(:placeholder-shown) + label {
      top: 12px; font-size: 0.65rem; color: var(--gold-primary);
    }

    .btn-luxury-lg { 
      background: var(--gold-gradient); color: var(--bg-primary); padding: 22px; 
      border-radius: 15px; border: none; font-weight: 800; letter-spacing: 3px;
      font-size: 0.9rem; cursor: pointer; transition: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
    }
    .btn-luxury-lg:hover { transform: translateY(-5px) scale(1.02); box-shadow: 0 15px 40px rgba(212, 175, 55, 0.5); }

    /* AI Loader Experience */
    .ai-orchestration-loader { padding: 100px 0; text-align: center; }
    .luxury-radar-container { width: 140px; height: 140px; margin: 0 auto 40px; position: relative; display: flex; align-items: center; justify-content: center; }
    .radar-circle { position: absolute; border: 1px solid var(--gold-primary); border-radius: 50%; width: 100%; height: 100%; opacity: 0; animation: radarPing 3s infinite linear; }
    .radar-scanner { position: absolute; width: 100%; height: 100%; border-radius: 50%; border-right: 2px solid var(--gold-primary); animation: radarSpin 2s infinite linear; }
    .ai-icon { font-size: 3rem; color: var(--gold-primary); filter: drop-shadow(0 0 15px var(--gold-primary)); }
    @keyframes radarPing { 0% { opacity: 0.5; transform: scale(0.8); } 100% { opacity: 0; transform: scale(2); } }
    @keyframes radarSpin { to { transform: rotate(360deg); } }
    
    .loading-status h3 { font-size: 1.8rem; letter-spacing: 2px; margin-bottom: 20px; color: #fff; }
    .progress-bar-container { width: 300px; height: 4px; background: rgba(255,255,255,0.1); margin: 0 auto 20px; border-radius: 2px; overflow: hidden; }
    .progress-bar { height: 100%; background: var(--gold-gradient); transition: width 0.5s ease; }
    .loading-status p { font-size: 0.9rem; opacity: 0.6; }

    /* Result Layout V2 */
    .result-hero-card { padding: 50px; border-radius: 30px; display: flex; justify-content: space-between; align-items: center; border: 1px solid rgba(255,255,255,0.1); }
    .pro-tag-luxury { background: var(--gold-primary); color: #000; padding: 5px 15px; font-weight: 900; font-size: 0.6rem; letter-spacing: 2px; border-radius: 5px; margin-bottom: 15px; display: inline-block; }
    .result-hero-card h2 { font-size: 2.8rem; margin-bottom: 15px; }
    .hero-meta { display: flex; gap: 25px; opacity: 0.7; font-size: 0.95rem; }
    .hero-meta i { color: var(--gold-primary); margin-right: 8px; }
    
    .hero-actions { display: flex; gap: 15px; }
    .btn-gold-glass { background: rgba(212, 175, 55, 0.1); border: 1px solid var(--gold-primary); color: var(--gold-primary); padding: 12px 25px; border-radius: 10px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-gold-glass:hover { background: var(--gold-primary); color: #000; transform: translateY(-3px); }

    /* Timeline V2 */
    .timeline-v2 { display: flex; flex-direction: column; gap: 40px; position: relative; }
    .timeline-v2::before { content: ''; position: absolute; left: 100px; top: 0; bottom: 0; width: 1px; background: linear-gradient(to bottom, transparent, rgba(212,175,55,0.2), transparent); }
    
    .day-v2-card { display: grid; grid-template-columns: 100px 1fr; gap: 40px; }
    .day-sidebar { display: flex; justify-content: flex-end; }
    .day-number { font-size: 1.5rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 2px; }
    
    .day-main { display: flex; flex-direction: column; gap: 15px; }
    .act-v2-card { padding: 30px; border-radius: 20px; display: flex; gap: 40px; align-items: flex-start; transition: 0.4s; }
    .act-v2-card:hover { border-color: var(--gold-primary); transform: translateX(15px); }
    .act-time { font-size: 1.1rem; color: var(--gold-secondary); min-width: 80px; }
    .act-info h3 { font-size: 1.4rem; margin-bottom: 10px; font-family: 'Playfair Display', serif; }
    .act-info .loc { font-size: 0.9rem; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
    .act-info .notes { font-size: 0.85rem; color: rgba(255,255,255,0.4); font-style: italic; line-height: 1.6; }

    /* Recommendation Section Premium */
    .section-badge-center { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 100px; }
    .premium-divider { height: 1px; width: 50px; background: rgba(212, 175, 55, 0.3); }
    .badge-text { font-size: 0.7rem; font-weight: 800; letter-spacing: 4px; color: var(--gold-secondary); }
    
    .itinerary-recommendations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
    .rec-glass-card { padding: 30px; border-radius: 25px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); position: relative; transition: 0.4s; }
    .rec-type { position: absolute; top: 15px; right: 20px; font-size: 0.6rem; font-weight: 900; color: var(--gold-primary); opacity: 0.4; }
    .rec-media { width: 60px; height: 60px; border-radius: 15px; background: rgba(212, 175, 55, 0.1); display: flex; align-items: center; justify-content: center; color: var(--gold-primary); font-size: 1.6rem; margin-bottom: 25px; }
    .rec-body h3 { font-size: 1.3rem; margin-bottom: 12px; font-family: 'Playfair Display', serif; }
    .rec-body p { font-size: 0.85rem; color: rgba(255,255,255,0.5); margin-bottom: 25px; }
    .btn-view-premium { display: inline-block; color: var(--gold-primary); border-bottom: 1px solid var(--gold-primary); text-decoration: none; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px; transition: 0.3s; }
    .btn-view-premium:hover { letter-spacing: 2px; color: #fff; border-bottom-color: #fff; }

    /* Concierge Premium Experience Styling */
    .concierge-premium-card {
      display: flex; align-items: center; gap: 50px; padding: 60px; border-radius: 40px; margin-top: 30px;
      border: 1px solid rgba(212, 175, 55, 0.3); background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, rgba(255,255,255,0.02) 100%);
      position: relative; overflow: hidden;
    }
    .concierge-visual { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
    .glow-orb { position: absolute; width: 100%; height: 100%; background: radial-gradient(circle, rgba(212, 175, 55, 0.4) 0%, transparent 70%); animation: pulseGlow 4s infinite ease-in-out; }
    .concierge-icon { font-size: 4rem; color: var(--gold-primary); position: relative; z-index: 2; filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5)); }
    
    .concierge-content h3 { font-size: 2.2rem; margin-bottom: 15px; background: var(--gold-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .concierge-content p { font-size: 1.1rem; color: rgba(255,255,255,0.7); margin-bottom: 30px; }
    
    .concierge-action { display: flex; align-items: center; gap: 30px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.05); }
    .hotline-text { font-size: 0.9rem; letter-spacing: 1px; color: rgba(255,255,255,0.5); }
    .hotline-text strong { color: #fff; font-size: 1.1rem; margin-left: 10px; border-bottom: 1px dashed var(--gold-primary); }
    
    .btn-concierge-connect { 
      background: var(--gold-gradient); color: var(--bg-primary); padding: 12px 30px; border-radius: 30px; 
      border: none; font-weight: 800; cursor: pointer; transition: 0.4s; font-size: 0.85rem; letter-spacing: 1px;
    }
    .btn-concierge-connect:hover { transform: scale(1.05); box-shadow: 0 0 20px rgba(212, 175, 55, 0.4); }

    @keyframes pulseGlow { 0%, 100% { transform: scale(1); opacity: 0.4; } 50% { transform: scale(1.3); opacity: 0.7; } }

    @media (max-width: 768px) {
      .concierge-premium-card { flex-direction: column; text-align: center; padding: 40px 20px; gap: 30px; }
      .concierge-action { flex-direction: column; gap: 20px; }
    }

    .hover-lift:hover { transform: translateY(-10px); border-color: rgba(212,175,55,0.3); background: rgba(212,175,55,0.02); }

    .result-footer-nav { text-align: center; margin-top: 50px; }
    .btn-back-main { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 15px 30px; border-radius: 30px; cursor: pointer; transition: 0.3s; }
    .btn-back-main:hover { background: rgba(255,255,255,0.05); color: var(--gold-primary); padding: 15px 40px; }

    /* Native CSS Animations for instant load */
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both; }
    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    
    .animate-scale-up { animation: scaleUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) both; animation-delay: 0.3s; }
    @keyframes scaleUp { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    
    .animate-fade-in { animation: fadeIn 0.8s ease-out both; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* Mobile Responsive */
    @media (max-width: 768px) {
      .grid-form { grid-template-columns: 1fr; }
      .day-v2-card { grid-template-columns: 1fr; gap: 15px; }
      .day-sidebar { justify-content: flex-start; }
      .timeline-v2::before { display: none; }
      .act-v2-card { flex-direction: column; gap: 15px; }
      .result-hero-card { flex-direction: column; gap: 30px; text-align: center; }
      .container { padding: 0 15px; }
    }
  `]
})
export class ItineraryComponent implements OnInit, AfterViewInit, OnDestroy {
  private service = inject(ItineraryService);
  private route = inject(ActivatedRoute);
  private el = inject(ElementRef);

  request = { destination: '', days: 3, preferences: '' };
  itinerary = signal<ItineraryResponse | null>(null);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isViewingSaved = signal<boolean>(false);
  
  // AI Orchestration Stats
  loadingStatus = signal<string>('Đang khởi động AI Engine...');
  loadingProgress = signal<number>(0);
  private statusInterval: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isViewingSaved.set(true);
        this.loadItinerary(id);
      }
    });
  }

  ngAfterViewInit() {
    this.initAnimations();
  }

  ngOnDestroy() {
    if (this.statusInterval) clearInterval(this.statusInterval);
  }

  private initAnimations() {
    // Moved to native CSS animations in styles block for instant trigger on route enter.
  }

  loadItinerary(id: string) {
    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: (res) => {
        if (res.success) this.itinerary.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  generate() {
    if (!this.request.destination || this.loading()) return;
 
    this.loading.set(true);
    this.errorMessage.set(null);
    this.itinerary.set(null);
    this.startLoadingSimulation();

    this.service.generate(this.request).subscribe({
      next: (res) => {
        if (res.success) {
          this.itinerary.set(res.data);
          setTimeout(() => {
            gsap.from('.day-v2-card', {
              duration: 1,
              y: 100,
              opacity: 0,
              stagger: 0.15,
              ease: 'power4.out'
            });
            // Scroll to Top of result
             window.scrollTo({ top: 300, behavior: 'smooth' });
          }, 100);
        } else {
          this.errorMessage.set(res.message || 'Không thể tạo lịch trình.');
        }
        this.stopLoadingSimulation();
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Rất tiếc, hệ thống AI đang bận hoặc gặp sự cố. Vui lòng thử lại sau giây lát.');
        this.stopLoadingSimulation();
      }
    });
  }

  private startLoadingSimulation() {
    const statuses = [
      'Đang khởi động AI Engine...',
      'Đang quét dữ liệu địa danh...',
      'Đang tối ưu hóa tuyến đường di chuyển...',
      'Đang lựa chọn khách sạn phù hợp nhất...',
      'Đang kết nối tour trải nghiệm độc bản...',
      'Đang hoàn thiện lịch trình dành riêng cho bạn...'
    ];
    let i = 0;
    this.loadingProgress.set(5);
    this.loadingStatus.set(statuses[0]);

    this.statusInterval = setInterval(() => {
      if (i < statuses.length - 1) {
        i++;
        this.loadingStatus.set(statuses[i]);
        this.loadingProgress.update(v => Math.min(v + 15, 95));
      }
    }, 1500);
  }

  private stopLoadingSimulation() {
    if (this.statusInterval) clearInterval(this.statusInterval);
    this.loadingProgress.set(100);
    this.loading.set(false);
  }

  resetForm() {
    this.itinerary.set(null);
    this.request = { destination: '', days: 3, preferences: '' };
    setTimeout(() => this.initAnimations(), 50);
  }

  saveSuccess() {
    const current = this.itinerary();
    if (current && current.id) {
      this.service.save(current.id).subscribe({
        next: (res) => {
          if (res.success) {
            alert('Lịch trình đã được lưu vào mục yêu thích của bạn!');
            const current = this.itinerary();
            if (current) {
              this.itinerary.set({ ...current, saved: true });
            }
          }
        }
      });
    }
  }

  print() {
    window.print();
  }

  getRecLink(rec: any): string {
    if (rec.type === 'HOTEL') return `/hotels/${rec.id}`;
    if (rec.type === 'TOUR') return `/tours/${rec.id}`;
    return '/';
  }
}
