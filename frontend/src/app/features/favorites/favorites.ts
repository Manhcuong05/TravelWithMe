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
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Chuyến Đi Yêu Thích</h1>
          <p>Bộ sưu tập những hành trình độc bản dành riêng cho bạn.</p>
        </div>

        <div *ngIf="loading()" class="loading-state">
          <div class="luxury-spinner"></div>
        </div>

        <div *ngIf="!loading() && itineraries().length === 0" class="empty-state glass-effect">
          <h2 class="luxury-font">Chưa Có Hành Trình Nào</h2>
          <p>Hãy để AI của chúng tôi kiến tạo hành trình đầu tiên cho bạn.</p>
          <a routerLink="/itinerary" class="btn-gold">Thiết Kế Ngay</a>
        </div>

        <div class="itinerary-grid" *ngIf="!loading()">
          <div *ngFor="let item of itineraries()" class="itinerary-card glass-effect">
            <div class="card-badge">Saved</div>
            <h2 class="luxury-font">{{ item.title }}</h2>
            <p class="dest">📍 {{ item.destination }}</p>
            <div class="details">
              <span>{{ item.durationDays }} Ngày</span>
              <span>•</span>
              <span>AI Optimized</span>
            </div>
            
            <div class="plan-preview">
                <div *ngFor="let day of item.days | slice:0:1" class="day-preview">
                    <strong>Ngày 1:</strong> {{ day.activities[0]?.activity }}
                </div>
            </div>

            <div class="card-footer">
              <button class="btn-gold-outline" [routerLink]="['/itinerary']">Xem chi tiết</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .favorites-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }

    .itinerary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 30px; }
    .itinerary-card { padding: 35px; border-radius: 24px; position: relative; transition: 0.3s; }
    .itinerary-card:hover { transform: translateY(-10px); border-color: var(--gold-primary); }
    
    .card-badge { 
      position: absolute; top: 20px; right: 20px; font-size: 0.65rem; 
      font-weight: 800; text-transform: uppercase; background: var(--gold-primary);
      color: var(--bg-primary); padding: 4px 10px; border-radius: 4px;
    }

    h2 { font-size: 1.6rem; color: var(--gold-primary); margin-bottom: 12px; line-height: 1.2; }
    .dest { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 15px; }
    .details { display: flex; gap: 10px; font-size: 0.75rem; color: var(--text-muted); margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px; }

    .plan-preview { padding: 15px; background: rgba(255,255,255,0.03); border-radius: 12px; margin-bottom: 25px; border-left: 2px solid var(--gold-secondary); }
    .day-preview { font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; }

    .btn-gold-outline { width: 100%; }
    .empty-state { text-align: center; padding: 100px 40px; border-radius: 30px; }
    
    .luxury-spinner { width: 50px; height: 50px; border: 2px solid var(--glass-border); border-top: 2px solid var(--gold-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 100px auto; }
    @keyframes spin { to { transform: rotate(360deg); } }
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
