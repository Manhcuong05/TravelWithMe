import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { AdminService } from '../../../core/services/admin.service';
import { BookingService } from '../../../core/services/booking.service';
import { HotelService } from '../../../core/services/hotel.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-wrapper">
      <div class="welcome-banner">
        <h1 class="luxury-font main-title">Tổng Quan Hệ Thống</h1>
        <p class="subtitle text-slate-400">Dữ liệu thời gian thực từ toàn bộ nền tảng TravelWithMe</p>
      </div>
      
      <div class="stats-grid-pro">
        <!-- Users Card -->
        <div class="stat-card-pro">
          <div class="card-glass"></div>
          <div class="card-content">
            <div class="icon-wrap bg-indigo-soft">
              <i class="fas fa-users-viewfinder"></i>
            </div>
            <div class="stat-meta">
              <span class="label">Tổng người dùng</span>
              <h2 class="counter">{{ stats().users }}</h2>
              <div class="status-up"><i class="fas fa-arrow-up"></i> +2.4%</div>
            </div>
          </div>
        </div>

        <!-- Tours Card -->
        <div class="stat-card-pro">
          <div class="card-glass"></div>
          <div class="card-content">
            <div class="icon-wrap bg-gold-soft">
              <i class="fas fa-map-location-dot"></i>
            </div>
            <div class="stat-meta">
              <span class="label">Tour đang chạy</span>
              <h2 class="counter">{{ stats().tours }}</h2>
              <div class="status-up"><i class="fas fa-arrow-up"></i> +12%</div>
            </div>
          </div>
        </div>

        <!-- Hotels Card -->
        <div class="stat-card-pro">
          <div class="card-glass"></div>
          <div class="card-content">
            <div class="icon-wrap bg-emerald-soft">
              <i class="fas fa-hotel"></i>
            </div>
            <div class="stat-meta">
              <span class="label">Cơ sở lưu trú</span>
              <h2 class="counter">{{ stats().hotels }}</h2>
              <div class="status-neutral"><i class="fas fa-minus"></i> Ổn định</div>
            </div>
          </div>
        </div>

        <!-- Bookings Card -->
        <div class="stat-card-pro">
          <div class="card-glass"></div>
          <div class="card-content">
            <div class="icon-wrap bg-rose-soft">
              <i class="fas fa-chart-pie"></i>
            </div>
            <div class="stat-meta">
              <span class="label">Tổng đơn hàng</span>
              <h2 class="counter">{{ stats().bookings }}</h2>
              <div class="status-up"><i class="fas fa-arrow-up"></i> +5.7%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  `,
    styles: [`
    .dashboard-wrapper { animation: fadeIn 0.8s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

    .welcome-banner { margin-bottom: 50px; }
    .main-title { font-size: 2.2rem; margin: 0; color: #fff; text-shadow: 0 0 20px rgba(255,255,255,0.05); }
    .subtitle { font-size: 0.95rem; color: #64748b; margin-top: 5px; }

    /* Stats Grid Pro */
    .stats-grid-pro { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; }
    
    .stat-card-pro { position: relative; height: 160px; border-radius: 24px; overflow: hidden; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1); border: 1px solid rgba(255,255,255,0.05); }
    .stat-card-pro:hover { transform: translateY(-8px); border-color: rgba(212, 175, 55, 0.3); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    
    .card-glass { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.3); backdrop-filter: blur(15px); }
    .card-content { position: relative; z-index: 5; padding: 25px; display: flex; align-items: center; gap: 20px; height: 100%; }

    .icon-wrap { 
      width: 65px; height: 65px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;
      box-shadow: inset 0 0 15px rgba(255,255,255,0.05);
    }
    
    .bg-indigo-soft { background: rgba(99, 102, 241, 0.1); color: #818cf8; }
    .bg-gold-soft { background: rgba(212, 175, 55, 0.1); color: #d4af37; }
    .bg-emerald-soft { background: rgba(16, 185, 129, 0.1); color: #34d399; }
    .bg-rose-soft { background: rgba(244, 63, 94, 0.1); color: #fb7185; }

    .stat-meta { flex: 1; }
    .label { font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }
    .counter { font-size: 2.2rem; font-weight: 800; color: #fff; margin: 2px 0; font-family: 'Playfair Display', serif; }
    
    .status-up { font-size: 0.7rem; color: #22c55e; font-weight: 700; display: flex; align-items: center; gap: 4px; }
    .status-neutral { font-size: 0.7rem; color: #94a3b8; font-weight: 700; display: flex; align-items: center; gap: 4px; }

    .mt-10 { margin-top: 40px; }
    .mr-2 { margin-right: 8px; }
  `]
})
export class DashboardComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private hotelService = inject(HotelService);
    private adminService = inject(AdminService);
    private bookingService = inject(BookingService);
    public authService = inject(AuthService);
    private router = inject(Router);

    stats = signal({
        users: 0,
        tours: 0,
        hotels: 0,
        bookings: 0
    });

    ngOnInit() {
        this.loadStats();
    }

    loadStats() {
        forkJoin({
            users: this.adminService.getAllUsers(),
            tours: this.catalogService.getTours(),
            hotels: this.hotelService.getHotels(),
            bookings: this.bookingService.getMyBookings()
        }).subscribe({
            next: (res) => {
                this.stats.set({
                    users: res.users.data?.length || 0,
                    tours: res.tours.data?.length || 0,
                    hotels: res.hotels.data?.length || 0,
                    bookings: res.bookings.data?.length || 0
                });
            },
            error: (err) => console.error('Error loading dashboard stats:', err)
        });
    }
}
