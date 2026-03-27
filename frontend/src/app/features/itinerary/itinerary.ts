import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ItineraryService, ItineraryResponse } from '../../core/services/itinerary.service';

@Component({
  selector: 'app-itinerary',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="itinerary-page animate-fade-in">
      <div class="container">
        <div class="page-header" *ngIf="!isViewingSaved()">
          <h1 class="luxury-font">Lập Kế Hoạch Du Lịch AI</h1>
          <p>Để trợ lý thông minh của chúng tôi kiến tạo hành trình tuyệt mỹ cho bạn.</p>
        </div>

        <div class="page-header" *ngIf="isViewingSaved()">
          <h1 class="luxury-font">Hành Trình Của Bạn</h1>
          <p>Khám phá lại những khoảnh khắc đáng nhớ đã được lưu lại.</p>
          <a routerLink="/favorites" class="btn-back"><i class="fas fa-arrow-left"></i> Quay lại danh sách</a>
        </div>

        <div class="planner-form glass-effect" *ngIf="!isViewingSaved()">
          <div class="form-row">
            <div class="form-group">
              <label>Điểm đến</label>
              <input type="text" [(ngModel)]="request.destination" placeholder="VD: Phú Quốc, Việt Nam">
            </div>
            <div class="form-group">
              <label>Số ngày</label>
              <input type="number" [(ngModel)]="request.days" min="1" max="14">
            </div>
          </div>
          <div class="form-group">
            <label>Sở thích cá nhân (Tùy chọn)</label>
            <textarea [(ngModel)]="request.preferences" placeholder="VD: Nghỉ dưỡng cao cấp, ẩm thực địa phương, không gian lãng mạn..."></textarea>
          </div>
          <button (click)="generate()" class="btn-gold w-full" [disabled]="loading()">
            {{ loading() ? 'Đang kiến tạo hành trình...' : 'Tạo lịch trình' }}
          </button>
          
          <div class="alert alert-error glass-effect mt-15 animate-fade-in" *ngIf="errorMessage()">
            <i class="fas fa-exclamation-triangle mr-2"></i> {{ errorMessage() }}
          </div>
        </div>

        <div *ngIf="loading()" class="loading-container">
          <div class="luxury-spinner"></div>
          <p class="luxury-font">Đang thiết lập trải nghiệm độc bản dành riêng cho bạn...</p>
        </div>

        <div *ngIf="itinerary()" class="itinerary-result animate-fade-in">
          <div class="result-header glass-effect animate-slide-up">
            <div class="luxury-seal">✨ AI Optimized</div>
            <h2 class="luxury-font">{{ itinerary()?.title }}</h2>
            <p class="dest-tag">{{ itinerary()?.destination }}</p>
            <div class="actions">
               <button *ngIf="!itinerary()?.saved" class="btn-gold-outline" (click)="saveSuccess()">Lưu vào tài khoản</button>
               <button class="btn-gold-outline" (click)="print()">Xuất PDF</button>
            </div>
          </div>

          <div class="timeline">
            <div *ngFor="let day of itinerary()?.days" class="day-block">
              <div class="day-badge luxury-font">Ngày {{ day.day }}</div>
              <div class="activities">
                <div *ngFor="let act of day.activities" class="activity-card glass-effect">
                  <span class="time">{{ act.time }}</span>
                  <div class="act-details">
                    <h3>{{ act.activity }}</h3>
                    <p class="loc">📍 {{ act.location }}</p>
                    <p *ngIf="act.notes" class="notes">{{ act.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- AI Recommendations Section -->
          <div class="recommendations-section mt-60 animate-fade-in" *ngIf="itinerary()?.recommendations?.length">
            <div class="section-title-pro">
              <span class="pro-tag">SẢN PHẨM GỢI Ý</span>
              <h2 class="luxury-font">Dành Riêng Cho Hành Trình Của Bạn</h2>
              <p>Các lựa chọn tour và khách sạn thực tế phù hợp nhất với kế hoạch này.</p>
            </div>
            
            <div class="recommendations-grid" *ngIf="itinerary()?.recommendations?.length; else noRecs">
              <div *ngFor="let rec of itinerary()?.recommendations" class="rec-card glass-effect hover-up">
                <div class="rec-type-badge">{{ rec.type }}</div>
                <div class="rec-icon">
                  <i class="fas" [class.fa-hotel]="rec.type === 'HOTEL'" [class.fa-map-marked-alt]="rec.type === 'TOUR'" [class.fa-monument]="rec.type === 'POI'"></i>
                </div>
                <div class="rec-content">
                  <h3>{{ rec.name }}</h3>
                  <button class="btn-view-rec" [routerLink]="getRecLink(rec)">
                    Xem chi tiết <i class="fas fa-external-link-alt ml-2"></i>
                  </button>
                </div>
              </div>
            </div>
            
            <ng-template #noRecs>
              <div class="no-recommendations glass-effect p-40">
                <i class="fas fa-info-circle mb-15"></i>
                <p>Hiện tại hệ thống chưa có dữ liệu Tour hoặc Khách sạn thực tế tại khu vực này trong cơ sở dữ liệu.</p>
                <span class="sub-text">Bạn vẫn có thể tham khảo lịch trình AI gợi ý phía trên!</span>
              </div>
            </ng-template>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .itinerary-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 50px; }
    .page-header h1 { font-size: 3.5rem; margin-bottom: 10px; }
    .btn-back { display: inline-flex; align-items: center; gap: 8px; color: var(--gold-primary); text-decoration: none; font-size: 0.9rem; margin-top: 15px; transition: 0.3s; }
    .btn-back:hover { color: #fff; transform: translateX(-5px); }

    .planner-form { padding: 40px; margin-bottom: 60px; }
    .form-row { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-bottom: 20px; }
    .form-group { margin-bottom: 20px; text-align: left; }
    .form-group label { display: block; font-size: 0.75rem; text-transform: uppercase; color: var(--gold-primary); margin-bottom: 8px; letter-spacing: 0.5px; }
    .form-group input, .form-group textarea {
      width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border);
      padding: 12px 15px; border-radius: 8px; color: var(--text-primary); outline: none; transition: var(--transition-smooth);
    }
    .form-group textarea { height: 100px; resize: none; }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--gold-primary); background: rgba(255, 255, 255, 0.08); }
    .w-full { width: 100%; }

    .loading-container { text-align: center; padding: 50px 0; }
    .luxury-spinner { width: 60px; height: 60px; border: 2px solid var(--glass-border); border-top: 2px solid var(--gold-primary); border-radius: 50%; animation: spin 1.5s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; margin: 0 auto 30px; }
    @keyframes spin { to { transform: rotate(360deg); } }

    .result-header { padding: 40px; text-align: center; margin-bottom: 50px; border-radius: 24px; position: relative; overflow: hidden; }
    .luxury-seal { background: var(--gold-primary); color: var(--bg-primary); font-size: 0.65rem; font-weight: 800; padding: 4px 12px; border-radius: 4px; display: inline-block; margin-bottom: 15px; text-transform: uppercase; }
    .result-header h2 { font-size: 2.5rem; margin-bottom: 15px; color: var(--gold-primary); }
    .dest-tag { text-transform: uppercase; letter-spacing: 3px; color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 25px; }
    .actions { display: flex; gap: 15px; justify-content: center; }
    .btn-gold-outline { background: transparent; border: 1px solid var(--gold-primary); color: var(--gold-primary); padding: 8px 20px; border-radius: 6px; font-size: 0.8rem; transition: var(--transition-smooth); cursor: pointer; }
    .btn-gold-outline:hover { background: var(--gold-primary); color: var(--bg-primary); }

    .timeline { position: relative; padding-left: 30px; }
    .timeline::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 1px; background: var(--glass-border); }
    
    .day-block { margin-bottom: 60px; position: relative; }
    .day-badge { 
      position: absolute; left: -60px; top: 0; background: var(--gold-gradient); color: var(--bg-primary); 
      padding: 5px 15px; border-radius: 4px; font-weight: 700; font-size: 0.9rem; transform: rotate(-90deg); transform-origin: top right;
    }
    
    .activity-card { padding: 25px; margin-bottom: 15px; display: flex; gap: 30px; transition: var(--transition-smooth); border-radius: 12px; }
    .activity-card:hover { border-color: var(--gold-primary); transform: translateX(10px); }
    .time { font-weight: 600; color: var(--gold-secondary); min-width: 80px; }
    .act-details h3 { font-size: 1.2rem; margin-bottom: 8px; font-family: 'Playfair Display', serif; }
    .loc { font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 8px; }
    .notes { font-size: 0.85rem; color: var(--text-muted); font-style: italic; }

    /* Recommendations Styling */
    .mt-60 { margin-top: 60px; }
    .section-title-pro { text-align: center; margin-bottom: 40px; }
    .pro-tag { display: inline-block; background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); padding: 5px 15px; border-radius: 20px; font-size: 0.65rem; font-weight: 800; letter-spacing: 2px; margin-bottom: 15px; }
    .section-title-pro h2 { font-size: 2.2rem; margin-bottom: 10px; }
    .section-title-pro p { color: var(--text-secondary); font-size: 0.95rem; }

    .recommendations-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 25px; }
    .rec-card { padding: 30px; position: relative; display: flex; align-items: center; gap: 20px; overflow: hidden; }
    .rec-type-badge { position: absolute; top: 12px; right: 12px; font-size: 0.6rem; font-weight: 800; color: var(--gold-primary); opacity: 0.5; }
    .rec-icon { width: 50px; height: 50px; border-radius: 50%; background: rgba(212, 175, 55, 0.1); display: flex; align-items: center; justify-content: center; color: var(--gold-primary); font-size: 1.2rem; }
    .rec-content h3 { font-size: 1.1rem; margin-bottom: 10px; color: #fff; font-family: 'Playfair Display', serif; }
    .btn-view-rec { background: transparent; border: none; color: var(--gold-primary); font-size: 0.8rem; font-weight: 700; cursor: pointer; padding: 0; display: flex; align-items: center; }
    .btn-view-rec:hover { color: #fff; }
    .ml-2 { margin-left: 8px; }
    .hover-up:hover { transform: translateY(-10px); border-color: var(--gold-primary); }

    .no-recommendations { text-align: center; color: var(--text-secondary); border: 1px dashed rgba(255,255,255,0.1); border-radius: 15px; }
    .no-recommendations i { font-size: 2rem; color: var(--gold-primary); opacity: 0.5; }
    .p-40 { padding: 40px; }
    .mb-15 { margin-bottom: 15px; }
    .mt-15 { margin-top: 15px; }
    .mr-2 { margin-right: 8px; }
    .sub-text { font-size: 0.8rem; opacity: 0.7; display: block; margin-top: 10px; }
    .alert-error { background: rgba(255, 68, 68, 0.1); color: #ff4444; border: 1px solid rgba(255, 68, 68, 0.2); padding: 15px; border-radius: 8px; font-size: 0.9rem; }
  `]
})
export class ItineraryComponent implements OnInit {
  private service = inject(ItineraryService);
  private route = inject(ActivatedRoute);

  request = { destination: '', days: 3, preferences: '' };
  itinerary = signal<ItineraryResponse | null>(null);
  loading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  isViewingSaved = signal<boolean>(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isViewingSaved.set(true);
        this.loadItinerary(id);
      }
    });
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
    this.service.generate(this.request).subscribe({
      next: (res) => {
        if (res.success) {
          this.itinerary.set(res.data);
        } else {
          this.errorMessage.set(res.message || 'Không thể tạo lịch trình.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set('Rất tiếc, hệ thống AI đang bận hoặc gặp sự cố. Vui lòng thử lại sau giây lát.');
        this.loading.set(false);
      }
    });
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
    } else {
      alert('Không thể lưu lịch trình này.');
    }
  }

  print() {
    window.print();
  }

  getRecLink(rec: any): string {
    if (rec.type === 'HOTEL') return `/hotels/${rec.id}`;
    if (rec.type === 'TOUR') return `/tours/${rec.id}`;
    if (rec.type === 'POI') return `/pois`; // POI doesn't have a single-page detail usually, opens list
    return '/';
  }
}
