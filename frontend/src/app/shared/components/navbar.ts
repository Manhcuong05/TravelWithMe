import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="glass-effect navbar">
      <div class="container">
        <a routerLink="/" class="logo luxury-font">TravelWithMe</a>
        
        <ul class="nav-links">
          <li><a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Khám Phá</a></li>
          <li><a routerLink="/itinerary" routerLinkActive="active">Lên Kế Hoạch AI</a></li>
          <li><a routerLink="/hotels" routerLinkActive="active">Khách Sạn</a></li>
          <li><a routerLink="/tours" routerLinkActive="active">Tour Du Lịch</a></li>
          
          <li class="dropdown" (mouseenter)="showDropdown = true" (mouseleave)="showDropdown = false">
            <a href="javascript:void(0)" class="dropdown-toggle" [class.active]="showDropdown">
              Khác <span class="chevron">▾</span>
            </a>
            <ul class="luxury-dropdown" *ngIf="showDropdown">
              <li><a routerLink="/flights" routerLinkActive="active"><i class="icon">✈️</i> Vé Máy Bay</a></li>
              <li><a routerLink="/pois" routerLinkActive="active"><i class="icon">📍</i> Địa Điểm (POI)</a></li>
            </ul>
          </li>
          
          <li *ngIf="authService.currentUser()?.role === 'ADMIN' || authService.currentUser()?.role === 'CTV'">
            <a routerLink="/management" class="mgmt-link">Admin ⚡</a>
          </li>
        </ul>

        <div class="auth-actions">
          <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
            <div class="user-menu-wrapper">
              <div class="user-avatar-btn" (click)="toggleUserMenu($event)">
                <img [src]="authService.currentUser()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + authService.currentUser()?.fullName + '&background=D4AF37&color=fff'" 
                     [alt]="authService.currentUser()?.fullName"
                     class="avatar-img">
                <span class="user-name-scroll">{{ authService.currentUser()?.fullName }}</span>
              </div>
              
              <ul class="user-dropdown-menu" *ngIf="showUserMenu" (click)="$event.stopPropagation()">
                <li class="menu-header">
                  <span class="user-email">{{ authService.currentUser()?.email }}</span>
                </li>
                <div class="divider"></div>
                <li><a routerLink="/profile"><i class="icon">👤</i> Thông tin cá nhân</a></li>
                <li><a routerLink="/favorites"><i class="icon">⭐</i> Chuyến đi yêu thích</a></li>
                <li><a routerLink="/bookings"><i class="icon">📦</i> Đơn hàng của tôi</a></li>
                <div class="divider"></div>
                <li><a (click)="logout()" class="logout-item"><i class="icon">🚪</i> Đăng xuất</a></li>
              </ul>
            </div>
          </ng-container>
          <ng-template #authButtons>
            <a routerLink="/auth/login" class="login-link">Đăng Nhập</a>
            <a routerLink="/auth/register" class="btn-gold">Đăng Ký Ngay</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 1200px;
      z-index: 1000;
      padding: 15px 30px;
      display: flex;
      justify-content: center;
    }
    .container {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--gold-primary);
      text-decoration: none;
      letter-spacing: 1px;
    }
    .nav-links {
      display: flex;
      list-style: none;
      gap: 30px;
    }
    .nav-links a {
      color: var(--text-secondary);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: var(--transition-smooth);
    }
    .nav-links a:hover, .nav-links a.active {
      color: var(--gold-primary);
    }
    .auth-actions {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .login-link {
      color: var(--text-primary);
      text-decoration: none;
      font-size: 0.9rem;
    }
    .mgmt-link {
        color: var(--gold-secondary) !important;
        font-weight: 700 !important;
        border: 1.5px solid rgba(212,175,55,0.4);
        padding: 6px 14px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05));
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 0.85rem;
        display: flex;
        align-items: center;
        gap: 5px;
    }
    .mgmt-link:hover {
        background: rgba(212,175,55,0.2);
        border-color: var(--gold-primary);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(212,175,55,0.2);
    }

    /* Fix Dropdown Positioning */
    .dropdown, .user-menu-wrapper { 
      position: relative !important;
      display: inline-block;
    }

    /* Common Luxury Dropdown Styles */
    .luxury-dropdown, .user-dropdown-menu {
      position: absolute !important;
      top: 100%;
      left: 0 !important;
      right: auto !important;
      background: rgba(10, 10, 12, 0.95);
      backdrop-filter: blur(25px);
      border: 1px solid rgba(212, 175, 55, 0.3);
      border-radius: 18px;
      padding: 10px 0;
      min-width: 220px;
      list-style: none;
      box-shadow: 0 25px 60px rgba(0,0,0,0.8);
      animation: dropdownEntry 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      z-index: 1100;
    }

    .luxury-dropdown { left: 0; right: auto; }

    .luxury-dropdown a, .user-dropdown-menu a {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 12px 22px;
      color: var(--text-secondary);
      font-size: 0.9rem;
      text-decoration: none;
      transition: all 0.25s ease;
      cursor: pointer;
      position: relative;
    }

    .luxury-dropdown a:hover, .user-dropdown-menu a:hover {
      background: rgba(212,175,55,0.12);
      color: var(--gold-primary);
      padding-left: 28px;
    }

    .luxury-dropdown a::before, .user-dropdown-menu a::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 3px;
      height: 0;
      background: var(--gold-primary);
      transition: height 0.3s ease;
    }

    .luxury-dropdown a:hover::before, .user-dropdown-menu a:hover::before {
      height: 60%;
    }

    /* User Menu Styles */
    .user-avatar-btn {
      display: flex; align-items: center; gap: 12px; cursor: pointer;
      padding: 6px 16px; border-radius: 35px; background: rgba(255,255,255,0.03);
      border: 1px solid rgba(212, 175, 55, 0.2); transition: all 0.3s ease;
    }
    .user-avatar-btn:hover { 
      background: rgba(255,255,255,0.07); 
      border-color: var(--gold-primary);
      box-shadow: 0 0 15px rgba(212, 175, 55, 0.1);
    }
    .avatar-img { 
      width: 34px; height: 34px; border-radius: 50%; 
      object-fit: cover; border: 2px solid var(--gold-primary);
      box-shadow: 0 0 10px rgba(212, 175, 55, 0.3);
    }
    .user-name-scroll { font-size: 0.9rem; font-weight: 600; color: var(--text-primary); }

    .menu-header { padding: 10px 22px 14px; }
    .user-email { font-size: 0.8rem; color: var(--gold-secondary); opacity: 0.8; }
    .divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,55,0.2), transparent); margin: 8px 0; }
    
    .logout-item:hover { color: #ff5555 !important; background: rgba(255, 85, 85, 0.08) !important; }
    .icon { font-style: normal; font-size: 1.2rem; filter: sepia(1) saturate(2) hue-rotate(10deg); }

    @keyframes dropdownEntry { 
      from { opacity: 0; transform: translateY(15px) scale(0.95); } 
      to { opacity: 1; transform: translateY(0) scale(1); } 
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  showDropdown = false;
  showUserMenu = false;

  toggleUserMenu(event: Event) {
    event.stopPropagation();
    this.showUserMenu = !this.showUserMenu;
  }

  @HostListener('document:click')
  closeUserMenu() {
    this.showUserMenu = false;
  }

  logout() {
    this.authService.logout();
    this.showUserMenu = false;
  }
}
