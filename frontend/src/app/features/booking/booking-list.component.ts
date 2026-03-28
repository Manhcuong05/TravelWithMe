import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService, BookingResponse } from '../../core/services/booking.service';
import { gsap } from 'gsap';

@Component({
  selector: 'app-booking-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="booking-page animate-fade-in">
      <!-- Decorative Background Elements -->
      <div class="bg-decoration">
        <div class="glow-orb orb-1"></div>
        <div class="glow-orb orb-2"></div>
      </div>

      <div class="container relative-z">
        <div class="page-header">
          <span class="page-tag animate-slide-up">Hành Trình Cá Nhân</span>
          <h1 class="luxury-font main-title animate-slide-up" style="animation-delay: 0.1s">Bộ Sưu Tập Đơn Hàng</h1>
          <div class="decorative-line animate-slide-up" style="animation-delay: 0.2s"></div>
          <p class="subtitle animate-slide-up" style="animation-delay: 0.3s">Hệ thống quản lý các danh mục đặt chỗ thượng hạng của bạn.</p>
        </div>

        <!-- Category Filter Tabs Pro Max -->
        <div class="tabs-container-pro animate-slide-up" style="animation-delay: 0.4s" *ngIf="!loading()">
          <div class="tabs-glass">
             <button *ngFor="let tab of tabs" 
                     class="tab-pill" 
                     [class.active]="activeTab() === tab.id"
                     (click)="setActiveTab(tab.id)">
                <i [class]="tab.icon"></i>
                <span class="tab-name">{{ tab.name }}</span>
                <span class="count-badge" *ngIf="getTabCount(tab.id) > 0">{{ getTabCount(tab.id) }}</span>
             </button>
          </div>
        </div>

        <div *ngIf="loading()" class="loading-state">
           <div class="luxury-spinner-wrap">
            <div class="luxury-spinner"></div>
          </div>
        </div>

        <div *ngIf="!loading() && bookings().length === 0" class="empty-state glass-pro animate-pop">
          <div class="empty-icon"><i class="fas fa-box-open"></i></div>
          <h2 class="luxury-font">Chưa Có Giao Dịch Nào</h2>
          <p>Bộ sưu tập những chuyến đi xa hoa của bạn vẫn đang chờ được kiến tạo.</p>
          <a routerLink="/" class="btn-gold-pro">Bắt Đầu Khám Phá</a>
        </div>
        
        <div *ngIf="!loading() && bookings().length > 0 && filteredBookings().length === 0" class="empty-state glass-pro animate-pop">
          <div class="empty-icon"><i class="fas fa-search"></i></div>
          <h2 class="luxury-font">Trống</h2>
          <p>Bạn chưa có chuyến đi nào thuộc danh mục này.</p>
        </div>

        <div class="booking-grid" *ngIf="!loading()">
          <div *ngFor="let booking of filteredBookings(); let i = index" 
               class="booking-card glass-premium animate-stagger" 
               [style.--index]="i">
            
            <div class="card-hero" [attr.data-type]="getPrimaryServiceInfo(booking).type">
              <div class="hero-overlay"></div>
              
              <div class="type-badge shadow-luxury">
                 <i [class]="getPrimaryServiceInfo(booking).icon" [style.color]="getPrimaryServiceInfo(booking).color"></i>
                 {{ getPrimaryServiceInfo(booking).typeLabel }}
              </div>
              
              <div class="status-indicator" [attr.data-status]="booking.status">
                 <i class="fas fa-circle-notch fa-spin mr-2" *ngIf="booking.status === 'AWAITING_PAYMENT'"></i>
                 <i class="fas fa-check-circle mr-2" *ngIf="booking.status === 'CONFIRMED'"></i>
                 {{ getStatusText(booking.status) }}
              </div>
            </div>

            <div class="card-content">
              <div class="date-tag mb-10"><i class="far fa-clock mr-2"></i> {{ booking.createdAt | date:'dd/MM/yyyy • HH:mm' }}</div>
              
              <h3 class="luxury-font service-title text-truncate" [title]="getPrimaryServiceInfo(booking).name">{{ getPrimaryServiceInfo(booking).name }}</h3>
              <div class="booking-id">Mã Code: <span class="id-hlt">#{{ booking.id.substring(0, 8) | uppercase }}</span></div>
              
              <div class="divider-lux"></div>

              <div class="amount-wrap">
                <span class="label">TỔNG GIÁ TRỊ TÀI SẢN</span>
                <div class="amount-display">
                  <span class="val">{{ booking.totalAmount | number }}</span>
                  <span class="currency">VNĐ</span>
                </div>
              </div>
            </div>

            <div class="card-footer">
              <a [routerLink]="['/bookings', booking.id]" class="btn-detail-pro">
                <span>Xem chi tiết</span>
                <i class="fas fa-long-arrow-alt-right ml-2"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #FFD700; --bg-card: rgba(10, 15, 25, 0.7); }

    .booking-page { padding: 180px 0 120px; min-height: 100vh; position: relative; overflow-x: hidden; background: #020617; color: #fff; }
    .container { max-width: 1300px; margin: 0 auto; padding: 0 30px; }
    .relative-z { position: relative; z-index: 10; }

    /* Background Decoration */
    .bg-decoration { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
    .glow-orb { position: absolute; border-radius: 50%; filter: blur(150px); opacity: 0.15; }
    .orb-1 { width: 500px; height: 500px; background: var(--gold-primary); top: -150px; left: -100px; }
    .orb-2 { width: 600px; height: 600px; background: #3b82f6; bottom: -200px; right: -150px; }

    .page-header { text-align: center; margin-bottom: 50px; }
    .page-tag { font-size: 0.7rem; letter-spacing: 5px; text-transform: uppercase; color: var(--gold-primary); font-weight: 800; margin-bottom: 25px; display: inline-block; padding: 8px 20px; border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 30px; background: rgba(212, 175, 55, 0.05); }
    .main-title { font-size: 4.5rem; margin-bottom: 25px; color: #fff; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .decorative-line { width: 100px; height: 2px; background: var(--gold-gradient); margin: 0 auto 30px; box-shadow: 0 0 15px rgba(212, 175, 55, 0.5); }
    .subtitle { color: #94a3b8; font-size: 1.15rem; max-width: 600px; margin: 0 auto; line-height: 1.8; letter-spacing: 0.5px; }

    /* Tabs Pro Max (Horizontal Scrollable) */
    .tabs-container-pro { display: flex; justify-content: center; margin-bottom: 60px; width: 100%; overflow: hidden; }
    .tabs-glass { 
      padding: 10px; background: rgba(255,255,255,0.03); backdrop-filter: blur(20px); 
      border-radius: 24px; border: 1px solid rgba(255,255,255,0.08); display: flex; gap: 8px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.4);
      width: max-content;
      max-width: 100%;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; /* Hide scrollbar Firefox */
    }
    .tabs-glass::-webkit-scrollbar { display: none; } /* Hide scrollbar Safari and Chrome */

    .tab-pill { 
      flex-shrink: 0; /* Prevent squishing */
      border: none; background: transparent; color: #64748b; padding: 14px 30px; 
      border-radius: 18px; cursor: pointer; display: flex; align-items: center; gap: 12px;
      font-weight: 700; font-size: 0.85rem; letter-spacing: 1px; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      position: relative; white-space: nowrap;
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

    /* Grid & Cards - Smaller size */
    .booking-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
    
    .glass-premium { 
      background: var(--bg-card); backdrop-filter: blur(30px); 
      border: 1px solid rgba(255,255,255,0.06); border-radius: 28px; 
      transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
      position: relative; overflow: hidden; display: flex; flex-direction: column;
    }

    .booking-card:hover { 
      transform: translateY(-10px); 
      border-color: rgba(212, 175, 55, 0.3);
      box-shadow: 0 30px 60px -20px rgba(0,0,0,0.7), 0 0 30px rgba(212, 175, 55, 0.1);
    }

    /* Card Hero section based on Type */
    .card-hero { height: 110px; position: relative; display: flex; justify-content: space-between; padding: 20px; align-items: flex-start; overflow: hidden; }
    .hero-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 0%, var(--bg-card) 100%); z-index: 1; }
    
    .card-hero[data-type="HOTEL"] { background: linear-gradient(135deg, #1e3a8a, #172554); border-bottom: 2px solid #3b82f6; }
    .card-hero[data-type="TOUR"] { background: linear-gradient(135deg, #064e3b, #022c22); border-bottom: 2px solid #10b981; }
    .card-hero[data-type="FLIGHT"] { background: linear-gradient(135deg, #4c1d95, #2e1065); border-bottom: 2px solid #8b5cf6; }
    .card-hero[data-type="ITINERARY"] { background: linear-gradient(135deg, #b45309, #78350f); border-bottom: 2px solid #d97706; }
    .card-hero[data-type="COMBO"], .card-hero[data-type="OTHER"] { background: linear-gradient(135deg, #374151, #111827); border-bottom: 2px solid var(--gold-primary); }

    .type-badge { background: rgba(5, 10, 20, 0.6); backdrop-filter: blur(15px); padding: 6px 14px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.15); font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; display: flex; align-items: center; gap: 8px; color: #fff; z-index: 10;}
    .shadow-luxury { box-shadow: 0 10px 20px rgba(0,0,0,0.3); }

    .status-indicator { 
      font-size: 0.6rem; font-weight: 900; padding: 6px 12px; border-radius: 20px; 
      text-transform: uppercase; letter-spacing: 1px; display: flex; align-items: center; z-index: 10;
      box-shadow: 0 10px 20px rgba(0,0,0,0.3); backdrop-filter: blur(10px);
    }
    .status-indicator[data-status="CONFIRMED"] { background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
    .status-indicator[data-status="AWAITING_PAYMENT"] { background: rgba(251, 191, 36, 0.15); color: #fbbf24; border: 1px solid rgba(251, 191, 36, 0.3); }
    .status-indicator[data-status="CANCELLED"] { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
    
    .card-content { padding: 25px; flex-grow: 1; display: flex; flex-direction: column; }
    .date-tag { font-size: 0.75rem; color: #94a3b8; font-weight: 600; letter-spacing: 1px; }
    .service-title { font-size: 1.35rem; color: #fff; margin-bottom: 12px; line-height: 1.3; font-family: 'Playfair Display', serif; }
    .text-truncate { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    
    .booking-id { font-size: 0.8rem; color: #cbd5e1; font-weight: 500; letter-spacing: 1px; }
    .id-hlt { color: var(--gold-primary); font-family: monospace; font-size: 0.9rem; font-weight: 700; background: rgba(212,175,55,0.1); padding: 2px 6px; border-radius: 6px; }

    .divider-lux { width: 100%; height: 1px; background: linear-gradient(90deg, rgba(255,255,255,0.05), rgba(255,255,255,0.1), rgba(255,255,255,0.05)); margin: 20px 0; }

    .amount-wrap { background: rgba(0,0,0,0.3); padding: 18px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.04); margin-top: auto; }
    .label { font-size: 0.65rem; text-transform: uppercase; color: #64748b; letter-spacing: 2px; display: block; margin-bottom: 6px; font-weight: 900; }
    .amount-display { display: flex; align-items: baseline; gap: 8px; }
    .amount-display .val { font-size: 1.6rem; font-weight: 800; color: var(--gold-primary); text-shadow: 0 5px 15px rgba(212, 175, 55, 0.3); font-family: monospace; letter-spacing: -1px; }
    .amount-display .currency { font-size: 0.8rem; color: var(--gold-secondary); font-weight: 800; letter-spacing: 1px; }

    .card-footer { padding: 0 25px 25px; }
    .btn-detail-pro { 
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 14px; width: 100%; border-radius: 16px; background: rgba(255,255,255,0.04); 
      border: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 800; font-size: 0.85rem; 
      text-decoration: none; transition: 0.4s; letter-spacing: 1px;
    }
    .booking-card:hover .btn-detail-pro { background: var(--gold-gradient); color: #000; border-color: transparent; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3); }
    .btn-detail-pro i { transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .booking-card:hover .btn-detail-pro i { transform: translateX(5px); }

    /* Empty State */
    .empty-state { text-align: center; padding: 100px 30px; }
    .empty-icon { font-size: 4rem; color: var(--gold-primary); margin-bottom: 25px; opacity: 0.5; filter: drop-shadow(0 0 20px rgba(212, 175, 55, 0.3)); }
    .empty-state h2 { font-size: 2rem; margin-bottom: 15px; }
    .empty-state p { color: #94a3b8; font-size: 1rem; margin-bottom: 30px; }
    .btn-gold-pro { 
      display: inline-block; background: var(--gold-gradient); color: #000; padding: 18px 40px; 
      border-radius: 30px; font-weight: 900; text-decoration: none; box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3); 
      letter-spacing: 2px; transition: 0.4s; font-size: 0.9rem;
    }
    .btn-gold-pro:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4); }
    
    /* Loading */
    .loading-state { height: 40vh; display: flex; align-items: center; justify-content: center; }
    .luxury-spinner { width: 60px; height: 60px; border: 3px solid rgba(212, 175, 55, 0.1); border-top: 3px solid var(--gold-primary); border-radius: 50%; animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Animations */
    .animate-stagger { 
       opacity: 0; transform: translateY(30px);
       animation: fadeInUp 0.8s cubic-bezier(0.165, 0.84, 0.44, 1) forwards;
       animation-delay: calc(var(--index) * 0.1s);
    }
    @keyframes fadeInUp { to { opacity: 1; transform: translateY(0); } }

    .animate-slide-up { animation: slideUpFade 1s cubic-bezier(0.165, 0.84, 0.44, 1) both; }
    @keyframes slideUpFade { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

    .mb-10 { margin-bottom: 10px; }
    .mr-2 { margin-right: 8px; }
    .ml-2 { margin-left: 8px; }

    @media (max-width: 768px) {
      .main-title { font-size: 2.5rem; }
      .booking-grid { grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 20px; }
      
      .tabs-container-pro { justify-content: flex-start; padding: 0 5px; }
      .tabs-glass { padding: 8px; border-radius: 20px; gap: 6px; }
      .tab-pill { padding: 12px 20px; font-size: 0.8rem; border-radius: 14px; }
    }
  `]
})
export class BookingListComponent implements OnInit {
  private service = inject(BookingService);

  bookings = signal<BookingResponse[]>([]);
  loading = signal<boolean>(true);
  
  activeTab = signal<string>('ALL');
  
  tabs = [
    { id: 'ALL', name: 'Tất Cả', icon: 'fas fa-layer-group' },
    { id: 'TOUR', name: 'Tour Du Lịch', icon: 'fas fa-map-marked-alt' },
    { id: 'HOTEL', name: 'Khách Sạn', icon: 'fas fa-hotel' },
    { id: 'FLIGHT', name: 'Vé Máy Bay', icon: 'fas fa-plane' }
  ];

  filteredBookings = computed(() => {
    const currentTab = this.activeTab();
    if (currentTab === 'ALL') return this.bookings();
    
    return this.bookings().filter(b => {
       const type = this.getPrimaryServiceInfo(b).type;
       return type === currentTab;
    });
  });

  ngOnInit() {
    this.service.getMyBookings().subscribe({
      next: (res) => {
        if (res.success) this.bookings.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setActiveTab(tabId: string) {
    this.activeTab.set(tabId);
    // Restart stagger animation by tricking DOM
    setTimeout(() => {
        gsap.from('.animate-stagger', {
           opacity: 0, 
           y: 40,
           duration: 0.6,
           stagger: 0.1,
           ease: 'power3.out',
           clearProps: 'all'
        });
    }, 10);
  }

  getTabCount(tabId: string): number {
    if (tabId === 'ALL') return this.bookings().length;
    return this.bookings().filter(b => {
       const type = this.getPrimaryServiceInfo(b).type;
       return type === tabId;
    }).length;
  }

  getPrimaryServiceInfo(booking: BookingResponse): { name: string, icon: string, color: string, type: string, typeLabel: string } {
    if (!booking.items || booking.items.length === 0) {
      return { name: `Đơn Hàng Tổng Hợp #${booking.id.substring(0,6).toUpperCase()}`, icon: 'fas fa-box', color: '#cbd5e1', type: 'OTHER', typeLabel: 'Khác' };
    }
    
    // Check if combo
    const types = new Set(booking.items.map(i => i.type || i.serviceType));
    if (types.size > 1) {
       return { name: 'Gói Trải Nghiệm Kết Hợp', icon: 'fas fa-layer-group', color: '#D4AF37', type: 'COMBO', typeLabel: 'Combo' };
    }
    
    const primaryItem = booking.items[0];
    const rawType = primaryItem.type || primaryItem.serviceType || 'OTHER';
    let type = rawType.toUpperCase();
    let name = primaryItem.serviceName || primaryItem.subServiceName || `Dịch vụ ${type}`;
    let icon = 'fas fa-box';
    let typeLabel = 'Khác';
    let color = '#cbd5e1';

    switch (type) {
      case 'HOTEL':
        icon = 'fas fa-hotel';
        typeLabel = 'Khách Sạn';
        color = '#60a5fa'; // Blue
        break;
      case 'TOUR':
        icon = 'fas fa-map-marked-alt';
        typeLabel = 'Tour Du Lịch';
        color = '#34d399'; // Green
        break;
      case 'FLIGHT':
        icon = 'fas fa-plane';
        typeLabel = 'Vé Máy Bay';
        color = '#a78bfa'; // Purple
        break;
      case 'POI':
        icon = 'fas fa-location-dot';
        typeLabel = 'Địa Điểm';
        color = '#f472b6'; // Pink
        break;
      case 'ITINERARY':
        icon = 'fas fa-magic';
        typeLabel = 'Hành Trình AI';
        color = '#D4AF37'; // Gold
        break;
    }

    if (!primaryItem.serviceName && primaryItem.subServiceName) {
        name = primaryItem.subServiceName;
    }

    return { name, icon, color, type, typeLabel };
  }

  getStatusText(status: string): string {
    switch (status) {
      case 'CONFIRMED': return 'Đã xác nhận';
      case 'AWAITING_PAYMENT': return 'Chờ thanh toán';
      case 'CANCELLED': return 'Đã hủy';
      default: return status;
    }
  }
}
