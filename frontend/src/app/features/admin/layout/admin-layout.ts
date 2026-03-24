import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="admin-wrapper prose-max-ui">
      <!-- Floating Sidebar -->
      <aside class="sidebar-pro">
        <div class="sidebar-glass"></div>
        <div class="sidebar-content">
          <div class="brand-zone">
            <div class="brand-logo">
              <i class="fas fa-paper-plane gold-glow"></i>
            </div>
            <div class="brand-text">
              <h2 class="luxury-font gold-text">TravelWithMe</h2>
              <span class="brand-tag">ELITE MANAGEMENT</span>
            </div>
          </div>

          <nav class="nav-container">
            <div class="nav-section-label">BÀN LÀM VIỆC</div>
            <a routerLink="/management" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link-pro">
              <i class="fas fa-chart-line"></i> <span>Tổng quan hệ thống</span>
            </a>

            <div class="nav-section-label">DỊCH VỤ DU LỊCH</div>
            <div class="nav-group-pro">
              <a routerLink="/management/tours" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-map-marked-alt"></i> <span>Quản lý Tour</span>
              </a>
              <a routerLink="/management/hotels" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-h-square"></i> <span>Khách sạn</span>
              </a>
              <a routerLink="/management/hotel-rooms" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-bed"></i> <span>Phòng khách sạn</span>
              </a>
              <a routerLink="/management/flights" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-plane-departure"></i> <span>Vé máy bay</span>
              </a>
              <a routerLink="/management/pois" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-map-pin"></i> <span>Địa điểm (POI)</span>
              </a>
            </div>

            <div class="nav-section-label">GIAO DỊCH & TÀI CHÍNH</div>
            <div class="nav-group-pro">
              <a routerLink="/management/bookings" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-calendar-check"></i> <span>Đơn đặt chỗ</span>
              </a>
              <a routerLink="/management/promotions" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-tags"></i> <span>Mã khuyến mãi</span>
              </a>
              <a routerLink="/management/transactions" routerLinkActive="active" class="nav-link-pro">
                 <i class="fas fa-wallet"></i> <span>Lịch sử giao dịch</span>
              </a>
            </div>

            <div class="nav-section-label" *ngIf="user()?.role === 'ADMIN'">HỆ THỐNG</div>
            <a routerLink="/management/users" routerLinkActive="active" *ngIf="user()?.role === 'ADMIN'" class="nav-link-pro">
               <i class="fas fa-user-shield"></i> <span>Người dùng & CTV</span>
            </a>
          </nav>

          <div class="sidebar-footer-pro">
            <a routerLink="/" class="btn-exit-pro">
              <i class="fas fa-sign-out-alt"></i> <span>Thoát về trang khách</span>
            </a>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <div class="main-viewport">
        <!-- Modern Topbar -->
        <header class="header-pro">
          <div class="header-left">
            <div class="search-box-pro">
              <i class="fas fa-search"></i>
              <input type="text" placeholder="Tìm kiếm tài liệu, đơn hàng...">
            </div>
          </div>
          
          <div class="header-right">
            <div class="notification-trigger">
              <i class="far fa-bell"></i>
              <span class="pulse-dot"></span>
            </div>
            
            <div class="profile-card-pro">
              <div class="profile-text text-right">
                <span class="p-name">{{ user()?.fullName }}</span>
                <span class="p-role">{{ user()?.role }}</span>
              </div>
              <div class="p-avatar-wrap">
                <div class="p-avatar">
                   {{ user()?.fullName?.charAt(0) }}
                </div>
                <div class="status-indicator"></div>
              </div>
              <button class="btn-logout-minimal" (click)="logout()" title="Đăng xuất">
                <i class="fas fa-power-off"></i>
              </button>
            </div>
          </div>
        </header>

        <!-- Page Viewport -->
        <div class="scroll-container">
          <div class="page-content-pro">
            <router-outlet></router-outlet>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    :host { --sidebar-pro-width: 320px; --top-bar-pro-height: 85px; --gold-elite: #D4AF37; --accent-indigo: #818cf8; }
    
    .admin-wrapper { display: flex; height: 100vh; background: #020617; color: #f1f5f9; overflow: hidden; font-family: 'Inter', sans-serif; }

    /* Sidebar Pro Design */
    .sidebar-pro { width: var(--sidebar-pro-width); height: 100%; position: relative; padding: 25px; display: flex; flex-direction: column; }
    .sidebar-glass { position: absolute; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(25px); border-right: 1px solid rgba(212, 175, 55, 0.1); z-index: 1; }
    .sidebar-content { position: relative; z-index: 5; height: 100%; display: flex; flex-direction: column; }

    .brand-zone { display: flex; align-items: center; gap: 15px; padding: 10px 10px 40px; }
    .brand-logo { width: 45px; height: 45px; background: rgba(212,175,55,0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; border: 1px solid rgba(212,175,55,0.3); }
    .gold-glow { color: var(--gold-elite); font-size: 1.2rem; filter: drop-shadow(0 0 8px rgba(212,175,55,0.5)); }
    .brand-text h2 { font-size: 1.25rem; margin: 0; font-family: 'Playfair Display', serif; }
    .brand-tag { font-size: 0.6rem; color: #64748b; letter-spacing: 3px; font-weight: 800; }

    .nav-container { flex: 1; overflow-y: auto; padding-right: 5px; }
    .nav-container::-webkit-scrollbar { width: 2px; }
    .nav-section-label { font-size: 0.65rem; font-weight: 800; color: #475569; letter-spacing: 2px; margin: 30px 0 15px 15px; opacity: 0.7; }

    .nav-link-pro { 
      display: flex; align-items: center; gap: 15px; padding: 14px 20px; margin-bottom: 5px;
      color: #94a3b8; text-decoration: none; border-radius: 12px; transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
      font-size: 0.95rem; font-weight: 500;
    }
    .nav-link-pro i { font-size: 1rem; width: 20px; transition: 0.3s; color: #475569; }
    .nav-link-pro:hover { color: #fff; background: rgba(255,255,255,0.03); }
    .nav-link-pro:hover i { color: #fff; transform: scale(1.1); }
    
    .nav-link-pro.active { 
       background: linear-gradient(135deg, rgba(212,175,55,0.15) 0%, rgba(212,175,55,0.05) 100%);
       color: var(--gold-elite); font-weight: 700; border-left: 3px solid var(--gold-elite);
    }
    .nav-link-pro.active i { color: var(--gold-elite); }

    .sidebar-footer-pro { margin-top: auto; padding-top: 20px; }
    .btn-exit-pro { 
      display: flex; align-items: center; justify-content: center; gap: 12px; padding: 15px; border-radius: 14px;
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
      color: #64748b; text-decoration: none; font-size: 0.85rem; font-weight: 700; transition: 0.3s;
    }
    .btn-exit-pro:hover { background: rgba(212,175,55,0.05); color: var(--gold-elite); border-color: var(--gold-elite); }

    /* Main Viewport Pro */
    .main-viewport { flex: 1; display: flex; flex-direction: column; position: relative; }
    .scroll-container { flex: 1; overflow-y: auto; scroll-behavior: smooth; background: #020617; }
    .page-content-pro { padding: 40px 60px; max-width: 1600px; margin: 0 auto; }

    /* Header Pro */
    .header-pro { 
      height: var(--top-bar-pro-height); display: flex; align-items: center; justify-content: space-between;
      padding: 0 60px; background: rgba(2, 6, 23, 0.7); backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255,255,255,0.03); z-index: 100;
    }

    .search-box-pro { 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
      padding: 10px 20px; border-radius: 12px; width: 400px; display: flex; align-items: center; gap: 12px;
    }
    .search-box-pro i { color: #475569; font-size: 0.9rem; }
    .search-box-pro input { background: none; border: none; color: white; outline: none; flex: 1; font-size: 0.9rem; }

    .header-right { display: flex; align-items: center; gap: 35px; }
    .notification-trigger { color: #64748b; font-size: 1.3rem; position: relative; cursor: pointer; transition: 0.3s; }
    .notification-trigger:hover { color: #fff; }
    .pulse-dot { position: absolute; top: 2px; right: 2px; width: 8px; height: 8px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; }

    .profile-card-pro { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.02); padding: 6px 6px 6px 20px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.05); }
    .p-name { display: block; font-size: 0.9rem; font-weight: 700; color: #f8fafc; }
    .p-role { display: block; font-size: 0.65rem; color: var(--gold-elite); text-transform: uppercase; letter-spacing: 1px; }
    
    .p-avatar-wrap { position: relative; }
    .p-avatar { 
      width: 38px; height: 38px; border-radius: 50%; background: linear-gradient(135deg, #FFD700, #D4AF37);
      color: #000; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.9rem;
    }
    .status-indicator { position: absolute; bottom: 0; right: 0; width: 10px; height: 10px; background: #22c55e; border-radius: 50%; border: 2px solid #0f172a; }

    .btn-logout-minimal { 
      background: none; border: none; color: #475569; cursor: pointer; padding: 10px; 
      transition: all 0.3s; font-size: 1rem; 
    }
    .btn-logout-minimal:hover { color: #ef4444; transform: rotate(90deg); }

    .gold-text { color: var(--gold-elite); }
    .text-right { text-align: right; }

    /* Universal Fix for Admin Select Options */
    select option { background-color: #1e293b !important; color: #f1f5f9 !important; padding: 12px; }
  `]
})
export class AdminLayoutComponent {
    private authService = inject(AuthService);
    user = this.authService.currentUser;

    logout() {
        this.authService.logout();
    }
}
