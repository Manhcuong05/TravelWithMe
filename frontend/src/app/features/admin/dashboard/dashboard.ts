import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { AdminService } from '../../../core/services/admin.service';
import { BookingService } from '../../../core/services/booking.service';
import { HotelService } from '../../../core/services/hotel.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule],
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

      <!-- Revenue Report Section -->
      <div class="revenue-reporting-card mt-10">
        <div class="card-glass shadow-lg"></div>
        <div class="card-content block">
          <div class="flex items-center gap-3 mb-6">
            <div class="icon-wrap bg-gold-soft h-10 w-10 text-lg">
              <i class="fas fa-file-invoice-dollar"></i>
            </div>
            <h3 class="text-xl font-bold text-white tracking-wide">Báo Cáo & Sao Kê Doanh Thu</h3>
          </div>
          
          <div class="filter-controls">
            <div class="control-group">
              <label>Từ ngày</label>
              <input type="date" [(ngModel)]="reportFilter.startDate" class="pro-input">
            </div>
            
            <div class="control-group">
              <label>Đến ngày</label>
              <input type="date" [(ngModel)]="reportFilter.endDate" class="pro-input">
            </div>

            <div class="control-group">
              <label>Loại dịch vụ</label>
              <select [(ngModel)]="reportFilter.serviceType" class="pro-input select-custom">
                <option value="ALL">Tất cả dịch vụ</option>
                <option value="HOTEL">🏨 Khách sạn</option>
                <option value="TOUR">🏞️ Tour du lịch</option>
                <option value="FLIGHT">✈️ Vé máy bay</option>
              </select>
            </div>

            <button (click)="exportRevenue()" 
                    [disabled]="isExporting()"
                    class="export-btn btn-luxury">
              <i class="fas" [class.fa-download]="!isExporting()" [class.fa-spinner]="isExporting()" [class.fa-spin]="isExporting()"></i>
              {{ isExporting() ? 'Đang xuất...' : 'Xuất Sao Kê PDF' }}
            </button>
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

    /* Revenue Reporting Styles */
    .revenue-reporting-card { position: relative; border-radius: 24px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .filter-controls { display: flex; flex-wrap: wrap; gap: 20px; align-items: flex-end; }
    
    .control-group { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 200px; }
    .control-group label { font-size: 0.75rem; color: #94a3b8; font-weight: 600; text-transform: uppercase; }
    
    .pro-input { 
      background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(255,255,255,0.1); 
      color: #fff; padding: 12px 16px; border-radius: 12px; font-size: 0.9rem; transition: all 0.3s;
    }
    .pro-input:focus { border-color: #d4af37; outline: none; box-shadow: 0 0 15px rgba(212,175,55,0.1); }
    
    .select-custom { cursor: pointer; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1rem center; background-size: 1rem; }

    .btn-luxury {
      background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%); color: #000; font-weight: 700;
      padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer; transition: all 0.3s;
      display: flex; align-items: center; gap: 10px; height: 48px;
    }
    .btn-luxury:hover:not(:disabled) { transform: scale(1.02); filter: brightness(1.1); box-shadow: 0 10px 20px rgba(212,175,55,0.2); }
    .btn-luxury:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .export-btn i { font-size: 1rem; }
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

    reportFilter = {
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        serviceType: 'ALL'
    };

    isExporting = signal(false);

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

    exportRevenue() {
        this.isExporting.set(true);
        this.adminService.exportRevenueReport(
            this.reportFilter.startDate,
            this.reportFilter.endDate,
            this.reportFilter.serviceType
        ).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `SaoKe_DoanhThu_${this.reportFilter.startDate}_${this.reportFilter.endDate}.pdf`;
                a.click();
                window.URL.revokeObjectURL(url);
                this.isExporting.set(false);
            },
            error: (err) => {
                console.error('Export failed', err);
                this.isExporting.set(false);
            }
        });
    }
}
