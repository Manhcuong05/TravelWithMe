import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../../core/services/catalog.service';
import { AdminService } from '../../../core/services/admin.service';
import { BookingService } from '../../../core/services/booking.service';
import { HotelService } from '../../../core/services/hotel.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="dashboard-container">
      <h1 class="luxury-font">Tổng Quan Hệ Thống</h1>
      
      <div class="stats-grid">
        <div class="stat-card glass-effect">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h3>Người dùng</h3>
            <p class="value">{{ stats().users }}</p>
          </div>
        </div>

        <div class="stat-card glass-effect">
          <div class="stat-icon">🗺️</div>
          <div class="stat-info">
            <h3>Tours đang chạy</h3>
            <p class="value">{{ stats().tours }}</p>
          </div>
        </div>

        <div class="stat-card glass-effect">
          <div class="stat-icon">🏨</div>
          <div class="stat-info">
            <h3>Khách sạn</h3>
            <p class="value">{{ stats().hotels }}</p>
          </div>
        </div>

        <div class="stat-card glass-effect">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <h3>Đơn hàng</h3>
            <p class="value">{{ stats().bookings }}</p>
          </div>
        </div>
      </div>

      <div class="actions-section mt-12">
        <h2 class="luxury-font mb-6">Thao tác nhanh</h2>
        <div class="quick-actions">
          <button class="btn-gold">Tạo báo cáo tháng</button>
          <button class="btn-outline">Kiểm tra log hệ thống</button>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container { padding: 20px; }
    h1 { color: var(--gold-primary); margin-bottom: 40px; }
    
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; }
    .stat-card { padding: 30px; border-radius: 24px; display: flex; align-items: center; gap: 20px; border: 1px solid var(--glass-border); }
    .stat-icon { font-size: 2.5rem; }
    .stat-info h3 { font-size: 0.9rem; color: #94a3b8; margin-bottom: 4px; }
    .stat-info .value { font-size: 1.8rem; font-weight: 700; color: white; }

    .quick-actions { display: flex; gap: 15px; }
    .btn-gold, .btn-outline { padding: 12px 24px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .mt-12 { margin-top: 48px; }
    .mb-6 { margin-bottom: 24px; }
  `]
})
export class DashboardComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private hotelService = inject(HotelService);
    private adminService = inject(AdminService);
    private bookingService = inject(BookingService);

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
