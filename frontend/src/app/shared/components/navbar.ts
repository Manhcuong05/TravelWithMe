import { Component, inject } from '@angular/core';
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
          
          <!-- Dropdown cho các mục thêm sau -->
          <li class="dropdown" (mouseenter)="showDropdown = true" (mouseleave)="showDropdown = false">
            <a href="javascript:void(0)" class="dropdown-toggle" [class.active]="showDropdown">Khác ☰</a>
            <ul class="dropdown-menu" *ngIf="showDropdown">
              <li><a routerLink="/flights" routerLinkActive="active">Vé Máy Bay</a></li>
              <li><a routerLink="/pois" routerLinkActive="active">Địa Điểm (POI)</a></li>
            </ul>
          </li>
          
          <li *ngIf="authService.currentUser()?.role === 'ADMIN' || authService.currentUser()?.role === 'CTV'">
            <a routerLink="/management" class="mgmt-link">Quản Trị</a>
          </li>
        </ul>

        <div class="auth-actions">
          <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
            <span class="welcome-text">Chào mừng, {{ authService.currentUser()?.fullName }}</span>
            <button (click)="logout()" class="btn-logout">Đăng xuất</button>
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
    .welcome-text {
      font-size: 0.85rem;
      color: var(--text-secondary);
    }
    .mgmt-link {
        color: var(--gold-secondary) !important;
        font-weight: 700 !important;
        border: 1px solid rgba(212,175,55,0.3);
        padding: 5px 12px;
        border-radius: 15px;
        background: rgba(212,175,55,0.05);
    }
    .mgmt-link:hover {
        background: rgba(212,175,55,0.15);
        border-color: var(--gold-primary);
    }
    .btn-logout {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.8rem;
    }

    /* Dropdown Styles */
    .dropdown { position: relative; }
    .dropdown-toggle { display: flex; align-items: center; gap: 5px; cursor: pointer; }
    .dropdown-menu {
      position: absolute;
      top: 120%;
      right: -20px;
      background: rgba(10, 10, 12, 0.95);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(212, 175, 55, 0.2);
      border-radius: 12px;
      padding: 10px 0;
      min-width: 180px;
      list-style: none;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      animation: fadeInDown 0.2s ease forwards;
    }
    .dropdown-menu::before {
      content: ''; position: absolute; top: -6px; right: 30px;
      width: 12px; height: 12px; background: rgba(10, 10, 12, 0.95);
      border-top: 1px solid rgba(212, 175, 55, 0.2);
      border-left: 1px solid rgba(212, 175, 55, 0.2);
      transform: rotate(45deg);
    }
    .dropdown-menu li { padding: 0; }
    .dropdown-menu a { display: block; padding: 12px 20px; color: var(--text-secondary); font-size: 0.85rem; }
    .dropdown-menu a:hover, .dropdown-menu a.active { background: rgba(255,255,255,0.03); color: var(--gold-primary); padding-left: 25px; }
    @keyframes fadeInDown { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  showDropdown = false;

  logout() {
    this.authService.logout();
  }
}
