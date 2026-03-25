import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ItineraryService, ItineraryResponse } from '../../core/services/itinerary.service';

@Component({
    selector: 'app-favorites',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <section class="favorites-page animate-fade-in">
      <!-- Decorative Background -->
      <div class="bg-decorative">
        <div class="glow-sphere sphere-1"></div>
        <div class="glow-sphere sphere-2"></div>
      </div>

      <div class="container relative-z">
        <div class="page-header">
          <span class="collection-tag">AI Powered Collections</span>
          <h1 class="luxury-font main-title">Chuyến Đi Yêu Thích</h1>
          <div class="decorative-line"></div>
          <p class="subtitle">Khám phá những hành trình độc bản được tinh tuyển dành riêng cho phong cách của bạn.</p>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="luxury-spinner-outer">
            <div class="luxury-spinner-inner"></div>
          </div>
        </div>

        <div *ngIf="!loading() && itineraries().length === 0" class="empty-state glass-pro animate-pop">
          <div class="empty-icon-wrap">
             <i class="fas fa-map-marked-alt"></i>
          </div>
          <h2 class="luxury-font">Hành Trình Đang Chờ Đợi</h2>
          <p>Hãy để trí tuệ nhân tạo của chúng tôi kiến tạo kỳ nghỉ trong mơ cho bạn ngay hôm nay.</p>
          <a routerLink="/itinerary" class="btn-gold-pro">Khám Phá Ngay</a>
        </div>

        <div class="itinerary-grid" *ngIf="!loading()">
          <div *ngFor="let item of itineraries(); let i = index" 
               class="itinerary-card glass-pro animate-stagger"
               [style.--index]="i">
            <div class="premium-badge">
              <i class="fas fa-crown"></i> Premium
            </div>
            
            <div class="card-content">
                <h2 class="luxury-font item-title">{{ item.title }}</h2>
                <div class="destination-tag">
                    <i class="fas fa-location-dot"></i>
                    <span>{{ item.destination }}</span>
                </div>

                <div class="meta-info">
                    <div class="info-item">
                        <i class="far fa-calendar-alt"></i>
                        <span>{{ item.durationDays }} Ngày</span>
                    </div>
                    <div class="info-item">
                        <i class="fas fa-sparkles"></i>
                        <span>AI Crafted</span>
                    </div>
                </div>
                
                <div class="plan-preview-pro">
                    <div class="preview-label">Journey Insight</div>
                    <div *ngFor="let day of item.days | slice:0:1" class="day-preview">
                        <span class="day-num">Ngày 1:</span> {{ day.activities[0]?.activity }}
                    </div>
                </div>
            </div>

            <div class="card-footer-pro">
              <button class="btn-action-pro" [routerLink]="['/itinerary', item.id]">
                <span>Xem Chi Tiết</span>
                <i class="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #FFD700; --bg-card: rgba(15, 23, 42, 0.7); }

    .favorites-page { padding: 180px 0 120px; min-height: 100vh; position: relative; overflow: hidden; background: #020617; }
    .relative-z { position: relative; z-index: 10; }
    
    /* Background Elements */
    .bg-decorative { position: absolute; inset: 0; pointer-events: none; }
    .glow-sphere { position: absolute; border-radius: 50%; filter: blur(120px); opacity: 0.15; }
    .sphere-1 { width: 400px; height: 400px; background: var(--gold-primary); top: -100px; right: -100px; }
    .sphere-2 { width: 500px; height: 500px; background: #3b82f6; bottom: -150px; left: -150px; }

    .container { max-width: 1100px; margin: 0 auto; padding: 0 30px; }
    
    .page-header { text-align: center; margin-bottom: 80px; }
    .collection-tag { font-size: 0.7rem; letter-spacing: 4px; text-transform: uppercase; color: var(--gold-primary); font-weight: 800; margin-bottom: 20px; display: block; }
    .main-title { font-size: 4rem; margin-bottom: 20px; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .decorative-line { width: 80px; height: 3px; background: linear-gradient(90deg, transparent, var(--gold-primary), transparent); margin: 0 auto 30px; }
    .subtitle { color: #94a3b8; font-size: 1.1rem; max-width: 600px; margin: 0 auto; line-height: 1.6; }

    /* Grid & Cards */
    .itinerary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 40px; }
    
    .glass-pro { 
      background: var(--bg-card); backdrop-filter: blur(25px); 
      border: 1px solid rgba(255,255,255,0.08); border-radius: 32px; 
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative; overflow: hidden;
    }

    .itinerary-card { display: flex; flex-direction: column; height: 100%; }
    .itinerary-card:hover { 
      transform: translateY(-15px) scale(1.02); 
      border-color: rgba(212, 175, 55, 0.4);
      box-shadow: 0 30px 60px -12px rgba(0,0,0,0.5), 0 0 40px rgba(212, 175, 55, 0.1); 
    }

    .premium-badge { 
      position: absolute; top: 25px; right: 25px; background: rgba(212, 175, 55, 0.15);
      color: var(--gold-primary); padding: 6px 14px; border-radius: 12px;
      font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
      border: 1px solid rgba(212, 175, 55, 0.3); backdrop-filter: blur(5px);
      display: flex; align-items: center; gap: 6px; z-index: 5;
    }

    .card-content { padding: 40px 35px 20px; flex: 1; }
    .item-title { font-size: 1.8rem; color: #fff; margin-bottom: 15px; line-height: 1.25; transition: color 0.3s; }
    .itinerary-card:hover .item-title { color: var(--gold-secondary); }

    .destination-tag { display: flex; align-items: center; gap: 10px; color: #94a3b8; font-size: 0.95rem; margin-bottom: 25px; }
    .destination-tag i { color: var(--gold-primary); font-size: 0.8rem; }

    .meta-info { display: flex; gap: 20px; margin-bottom: 30px; }
    .info-item { display: flex; align-items: center; gap: 10px; font-size: 0.75rem; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
    .info-item i { font-size: 0.9rem; color: #475569; }

    .plan-preview-pro { 
      padding: 20px; background: rgba(0,0,0,0.3); border-radius: 20px; 
      border-left: 3px solid var(--gold-primary); margin-bottom: 10px;
    }
    .preview-label { font-size: 0.6rem; text-transform: uppercase; letter-spacing: 2px; color: #475569; margin-bottom: 10px; font-weight: 800; }
    .day-preview { font-size: 0.95rem; color: #cbd5e1; line-height: 1.6; }
    .day-num { color: var(--gold-primary); font-weight: 700; margin-right: 5px; }

    .card-footer-pro { padding: 0 35px 40px; }
    .btn-action-pro { 
      width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
      padding: 16px; border-radius: 18px; color: #fff; font-weight: 700; font-size: 0.9rem;
      display: flex; align-items: center; justify-content: center; gap: 12px;
      cursor: pointer; transition: all 0.3s;
    }
    .btn-action-pro:hover { background: var(--gold-primary); color: #000; border-color: var(--gold-primary); }
    .btn-action-pro i { transition: transform 0.3s; }
    .btn-action-pro:hover i { transform: translateX(5px); }

    /* Empty State */
    .empty-state { text-align: center; padding: 100px 50px; max-width: 600px; margin: 0 auto; }
    .empty-icon-wrap { font-size: 4rem; color: var(--gold-primary); margin-bottom: 30px; opacity: 0.5; }
    .empty-state h2 { font-size: 2.2rem; color: #fff; margin-bottom: 15px; }
    .empty-state p { color: #94a3b8; margin-bottom: 40px; }
    .btn-gold-pro { 
      display: inline-block; background: var(--gold-gradient); color: #000; 
      padding: 18px 45px; border-radius: 16px; font-weight: 800; text-decoration: none;
      box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); transition: 0.3s;
    }
    .btn-gold-pro:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4); }

    /* Loading */
    .luxury-spinner-outer { width: 80px; height: 80px; border: 1px solid rgba(212, 175, 55, 0.1); border-radius: 50%; margin: 100px auto; display: flex; align-items: center; justify-content: center; }
    .luxury-spinner-inner { width: 50px; height: 50px; border: 2px solid transparent; border-top: 2px solid var(--gold-primary); border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

    /* Animations */
    .animate-stagger { 
       opacity: 0; transform: translateY(30px);
       animation: fadeInUp 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards;
       animation-delay: calc(var(--index) * 0.15s);
    }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

    @media (max-width: 768px) {
      .main-title { font-size: 2.8rem; }
      .itinerary-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class FavoritesComponent implements OnInit {
    private service = inject(ItineraryService);

    itineraries = signal<ItineraryResponse[]>([]);
    loading = signal<boolean>(true);

    ngOnInit() {
        this.service.getMyItineraries().subscribe({
            next: (res) => {
                if (res.success) this.itineraries.set(res.data);
                this.loading.set(false);
            },
            error: () => this.loading.set(false)
        });
    }
}
