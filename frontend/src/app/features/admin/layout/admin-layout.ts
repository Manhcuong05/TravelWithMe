import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-admin-layout',
    standalone: true,
    imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
    template: `
    <div class="admin-container">
      <aside class="sidebar glass-effect">
        <div class="sidebar-header">
          <div class="logo-area">
            <h2 class="luxury-font gold-text">TravelWithMe</h2>
            <span class="sub-logo">MANAGEMENT</span>
          </div>
        </div>
        
        <nav class="sidebar-nav">
          <a routerLink="/management" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
            <span class="icon">📊</span> <span>Tổng quan</span>
          </a>
          
          <div class="nav-group">
            <div class="group-label">Dịch Vụ</div>
            <a routerLink="/management/tours" routerLinkActive="active">
              <span class="icon">🗺️</span> <span>Quản lý Tour</span>
            </a>
            <a routerLink="/management/hotels" routerLinkActive="active">
              <span class="icon">🏨</span> <span>Khách sạn</span>
            </a>
            <a routerLink="/management/hotel-rooms" routerLinkActive="active">
              <span class="icon">🛏️</span> <span>Phòng khách sạn</span>
            </a>
            <a routerLink="/management/flights" routerLinkActive="active">
              <span class="icon">✈️</span> <span>Vé máy bay</span>
            </a>
            <a routerLink="/management/pois" routerLinkActive="active">
              <span class="icon">📍</span> <span>Địa điểm (POI)</span>
            </a>
          </div>
 
          <div class="nav-group">
            <div class="group-label">Giao Dịch</div>
            <a routerLink="/management/bookings" routerLinkActive="active">
              <span class="icon">📅</span> <span>Đơn đặt chỗ</span>
            </a>
            
            <div class="nav-section">TÀI CHÍNH</div>
            <a routerLink="/management/promotions" routerLinkActive="active">
              <span class="icon">🎟️</span> <span>Mã khuyến mãi</span>
            </a>
            <a routerLink="/management/transactions" routerLinkActive="active">
              <span class="icon">💸</span> <span>Lịch sử giao dịch</span>
            </a>
          </div>
 
          <div class="nav-group" *ngIf="user()?.role === 'ADMIN'">
            <div class="group-label">Hệ Thống</div>
            <a routerLink="/management/users" routerLinkActive="active">
              <span class="icon">👥</span> <span>Người dùng & CTV</span>
            </a>
          </div>
        </nav>
 
        <div class="sidebar-footer">
          <a routerLink="/" class="btn-back glass-button">
            <span>←</span> Trang chủ
          </a>
        </div>
      </aside>
 
      <div class="main-wrapper">
        <header class="top-bar">
          <div class="search-bar">
             <!-- Placeholder for future search -->
             <span class="search-icon">🔍</span>
             <input type="text" placeholder="Tìm kiếm nhanh...">
          </div>
          <div class="user-meta">
            <div class="user-info-text text-right mr-4">
               <div class="user-name font-bold">{{ user()?.fullName }}</div>
               <div class="user-role">{{ user()?.role }}</div>
            </div>
            <div class="user-avatar-circle gold-border">
               {{ user()?.fullName?.charAt(0) }}
            </div>
            <button class="logout-btn" (click)="logout()">🚪</button>
          </div>
        </header>
        
        <main class="admin-content">
          <div class="content-viewport">
            <router-outlet></router-outlet>
          </div>
        </main>
      </div>
    </div>
  `,
    styles: [`
    :host { --sidebar-width: 280px; --top-bar-height: 70px; }
    .admin-container {
      display: flex;
      height: 100vh;
      background: #050505;
      color: #e2e8f0;
      overflow: hidden;
    }
 
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      border-right: 1px solid rgba(255,255,255,0.05);
      padding: 30px 15px;
      display: flex;
      flex-direction: column;
      background: rgba(10, 10, 12, 0.95);
      z-index: 100;
    }
 
    .sidebar-header { margin-bottom: 40px; padding: 0 15px; }
    .logo-area { display: flex; flex-direction: column; }
    .logo-area h2 { font-size: 1.4rem; margin: 0; line-height: 1; letter-spacing: 1px; }
    .sub-logo { font-size: 0.65rem; color: #475569; letter-spacing: 4px; font-weight: 800; margin-top: 5px; }
 
    .sidebar-nav { flex: 1; overflow-y: auto; padding-right: 5px; }
    .sidebar-nav::-webkit-scrollbar { width: 4px; }
    .sidebar-nav::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
 
    .sidebar-nav a {
      display: flex;
      align-items: center;
      padding: 12px 18px;
      color: #64748b;
      text-decoration: none;
      border-radius: 14px;
      margin-bottom: 4px;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-size: 0.9rem;
      font-weight: 500;
    }
 
    .sidebar-nav a:hover { color: #f8fafc; background: rgba(255,255,255,0.03); }
    .sidebar-nav a.active {
      background: linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 100%);
      color: var(--gold-primary);
      box-shadow: inset 0 0 0 1px rgba(212, 175, 55, 0.2);
    }
 
    .sidebar-nav .icon { margin-right: 14px; font-size: 1.2rem; filter: grayscale(1); transition: filter 0.3s; }
    .sidebar-nav a.active .icon { filter: none; }
 
    .nav-group { margin-top: 28px; }
    .group-label { font-size: 0.65rem; text-transform: uppercase; color: #475569; margin: 0 0 12px 18px; letter-spacing: 2px; font-weight: 700; }
 
    .sidebar-footer { margin-top: auto; padding-top: 20px; }
    .btn-back {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 12px;
      border-radius: 12px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      border: 1px solid rgba(255,255,255,0.05);
      transition: all 0.2s;
    }
    .btn-back:hover { border-color: var(--gold-primary); color: var(--gold-primary); }
 
    .main-wrapper { flex: 1; display: flex; flex-direction: column; height: 100vh; position: relative; }
    
    .top-bar {
      height: var(--top-bar-height);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 40px;
      background: rgba(5, 5, 5, 0.8);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      z-index: 90;
    }
 
    .search-bar { display: flex; align-items: center; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 8px 16px; width: 300px; }
    .search-bar input { background: none; border: none; color: white; margin-left: 10px; width: 100%; outline: none; font-size: 0.9rem; }
 
    .user-meta { display: flex; align-items: center; gap: 15px; }
    .user-info-text { display: flex; flex-direction: column; align-items: flex-end; }
    .user-name { font-size: 0.9rem; color: #f8fafc; }
    .user-role { font-size: 0.7rem; color: var(--gold-secondary); text-transform: uppercase; font-weight: 700; }
    .user-avatar-circle {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
      color: black;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      border: 2px solid rgba(0,0,0,0.2);
    }
 
    .logout-btn { background: rgba(255,255,255,0.05); border: none; cursor: pointer; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
    .logout-btn:hover { background: rgba(239, 68, 68, 0.2); transform: translateY(-2px); }
 
    .admin-content { flex: 1; overflow-y: auto; padding: 40px; scroll-behavior: smooth; }
    .content-viewport { max-width: 1400px; margin: 0 auto; }
 
    .gold-text { color: var(--gold-primary); }
    .mr-4 { margin-right: 1rem; }
    .font-bold { font-weight: 700; }
    .text-right { text-align: right; }
  `]
})
export class AdminLayoutComponent {
    private authService = inject(AuthService);
    user = this.authService.currentUser;

    logout() {
        this.authService.logout();
    }
}
