import { Component, inject, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar-pro" [class.scrolled]="isScrolled">
      <div class="navbar-glass"></div>
      <div class="container-pro">
        <a routerLink="/" class="logo-pro luxury-font">
          <span class="logo-text">TravelWithMe</span>
          <div class="logo-underline"></div>
        </a>
        
        <ul class="nav-links-pro">
          <li>
            <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              Khám Phá
              <div class="indicator"></div>
            </a>
          </li>
          <li>
            <a routerLink="/itinerary" routerLinkActive="active">
              Lên Kế Hoạch AI
              <div class="indicator"></div>
            </a>
          </li>
          <li>
            <a routerLink="/hotels" routerLinkActive="active">
              Khách Sạn
              <div class="indicator"></div>
            </a>
          </li>
          <li>
            <a routerLink="/tours" routerLinkActive="active">
              Tour Du Lịch
              <div class="indicator"></div>
            </a>
          </li>
          
          <li class="dropdown-pro" 
              (mouseenter)="onKhacEnter()" 
              (mouseleave)="onKhacLeave()">
            <a href="javascript:void(0)" 
               class="dropdown-toggle-pro" 
               (click)="toggleKhacPin($event)" 
               [class.active]="showDropdown"
               [class.pinned]="isKhacPinned">
              Khác <i class="fas fa-chevron-down chevron-pro"></i>
            </a>
            <ul class="luxury-dropdown-pro" *ngIf="showDropdown" (click)="$event.stopPropagation()">
              <li><a routerLink="/flights" (click)="closeMenus()"><i class="fas fa-plane"></i> Chuyến Bay</a></li>
              <li><a routerLink="/pois" (click)="closeMenus()"><i class="fas fa-map-marker-alt"></i> Điểm Đến</a></li>
            </ul>
          </li>
        </ul>

        <div class="actions-pro">
          <ng-container *ngIf="authService.currentUser()?.role === 'ADMIN' || authService.currentUser()?.role === 'CTV'">
            <a routerLink="/management" class="btn-mgmt-pro">
              Admin <i class="fas fa-bolt-lightning bolt-pro"></i>
            </a>
          </ng-container>

          <div class="divider-vertical"></div>

          <ng-container *ngIf="authService.isAuthenticated(); else authButtons">
            <div class="user-menu-pro" 
                 (mouseenter)="onUserEnter()" 
                 (mouseleave)="onUserLeave()">
              <div class="avatar-pedestal" 
                   (click)="toggleUserPin($event)"
                   [class.pinned]="isUserPinned">
                <div class="avatar-ring">
                  <img [src]="authService.currentUser()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + authService.currentUser()?.fullName + '&background=D4AF37&color=fff'" 
                       [alt]="authService.currentUser()?.fullName"
                       class="avatar-pro">
                </div>
                <div class="name-badge">{{ authService.currentUser()?.fullName }}</div>
              </div>
              
              <ul class="menu-dropdown-pro" *ngIf="showUserMenu" (click)="$event.stopPropagation()">
                <li class="user-header">
                  <span class="email-muted">{{ authService.currentUser()?.email }}</span>
                </li>
                <div class="menu-divider"></div>
                <li><a routerLink="/profile" (click)="closeMenus()"><i class="fas fa-user-circle"></i> Hồ sơ của tôi</a></li>
                <li><a routerLink="/favorites" (click)="closeMenus()"><i class="fas fa-heart"></i> Yêu thích</a></li>
                <li><a routerLink="/bookings" (click)="closeMenus()"><i class="fas fa-shopping-bag"></i> Đơn hàng</a></li>
                <div class="menu-divider"></div>
                <li><a (click)="logout()" class="logout-pro"><i class="fas fa-power-off"></i> Đăng xuất</a></li>
              </ul>
            </div>
          </ng-container>
          <ng-template #authButtons>
            <a routerLink="/auth/login" class="link-login-pro">Đăng Nhập</a>
            <a routerLink="/auth/register" class="btn-gold-pro">Đăng Ký</a>
          </ng-template>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    :host { --nav-h: 80px; --gold: #D4AF37; --gold-light: #FFD700; --bg-glass: rgba(2, 6, 23, 0.7); }
    
    .navbar-pro {
      position: fixed; top: 25px; left: 50%; transform: translateX(-50%);
      width: 95%; max-width: 1400px; height: var(--nav-h); z-index: 2000;
      transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .navbar-glass { 
      position: absolute; inset: 0; border-radius: 40px;
      background: var(--bg-glass); backdrop-filter: blur(30px) saturate(180%);
      border: 1px solid rgba(212, 175, 55, 0.2);
      box-shadow: 0 15px 35px rgba(0,0,0,0.5), inset 0 0 20px rgba(255,255,255,0.02);
      z-index: -1;
    }
    .navbar-pro.scrolled { top: 0; width: 100%; max-width: none; border-radius: 0; }
    .navbar-pro.scrolled .navbar-glass { border-radius: 0; border-top: none; border-left: none; border-right: none; }

    .container-pro { height: 100%; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }

    .logo-pro { text-decoration: none; position: relative; display: flex; flex-direction: column; }
    .logo-text { font-size: 1.6rem; color: var(--gold); letter-spacing: 2px; font-weight: 800; text-shadow: 0 0 15px rgba(212,175,55,0.3); }
    .logo-underline { height: 2px; width: 40%; background: linear-gradient(90deg, var(--gold), transparent); margin-top: -2px; }

    .nav-links-pro { display: flex; list-style: none; gap: 35px; align-items: center; }
    .nav-links-pro a { 
      color: rgba(255,255,255,0.7); text-decoration: none; font-size: 0.95rem; font-weight: 600; 
      position: relative; padding: 10px 0; transition: all 0.3s;
      text-shadow: 0 2px 4px rgba(0,0,0,0.5);
    }
    .nav-links-pro a:hover, .nav-links-pro a.active { color: #fff; }
    .indicator { position: absolute; bottom: 0; left: 50%; width: 0; height: 3px; background: var(--gold); transform: translateX(-50%); border-radius: 10px; transition: 0.3s; box-shadow: 0 0 10px var(--gold); }
    .nav-links-pro a:hover .indicator, .nav-links-pro a.active .indicator { width: 100%; }

    .dropdown-pro { position: relative; }
    .dropdown-toggle-pro { display: flex; align-items: center; gap: 8px; }
    .chevron-pro { font-size: 0.7rem; color: var(--gold); transition: 0.3s; }
    .dropdown-toggle-pro:hover .chevron-pro { transform: rotate(180deg); }

    .luxury-dropdown-pro {
      position: absolute; top: 120%; left: 0; background: rgba(10, 10, 12, 0.98); 
      backdrop-filter: blur(20px); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 18px;
      min-width: 220px; padding: 12px 0; box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      animation: floatIn 0.4s ease forwards; list-style: none; margin: 0;
    }
    .luxury-dropdown-pro a { display: flex; align-items: center; gap: 12px; padding: 12px 25px; color: #94a3b8; font-size: 0.9rem; }
    .luxury-dropdown-pro a:hover { background: rgba(212,175,55,0.1); color: var(--gold); padding-left: 30px; }

    .actions-pro { display: flex; align-items: center; gap: 25px; }
    .btn-mgmt-pro { 
      padding: 8px 18px; border-radius: 30px; border: 1px solid rgba(212,175,55,0.3);
      background: linear-gradient(135deg, rgba(212,175,55,0.15), transparent);
      color: var(--gold); font-weight: 800; font-size: 0.85rem; text-decoration: none;
      display: flex; align-items: center; gap: 8px; transition: 0.3s;
      animation: goldBreath 3s infinite;
    }
    .btn-mgmt-pro:hover { background: var(--gold); color: #000; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(212,175,55,0.2); }
    
    .divider-vertical { width: 1px; height: 30px; background: rgba(255,255,255,0.1); }

    .avatar-pedestal { 
      display: flex; align-items: center; gap: 12px; cursor: pointer;
      background: rgba(255,255,255,0.03); padding: 5px 15px 5px 5px; border-radius: 40px;
      border: 1px solid rgba(255,255,255,0.05); transition: 0.3s;
    }
    .avatar-pedestal:hover { background: rgba(255,255,255,0.08); border-color: var(--gold); }
    .avatar-ring { 
      width: 42px; height: 42px; border-radius: 50%; padding: 2px;
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      box-shadow: 0 0 15px rgba(212,175,55,0.4);
    }
    .avatar-pro { width: 100%; height: 100%; border-radius: 50%; border: 2px solid #000; object-fit: cover; }
    .name-badge { color: #fff; font-weight: 700; font-size: 0.9rem; }

    .menu-dropdown-pro {
      position: absolute; top: 120%; right: 0; background: rgba(10, 10, 12, 0.98);
      backdrop-filter: blur(25px); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 20px;
      min-width: 260px; padding: 15px 0; box-shadow: 0 30px 60px rgba(0,0,0,0.9);
      animation: floatIn 0.4s ease forwards; list-style: none; margin: 0;
    }
    .user-header { padding: 0 25px 10px; }
    .email-muted { font-size: 0.75rem; color: #64748b; font-family: 'JetBrains Mono', monospace; }
    .menu-divider { height: 1px; background: rgba(255,255,255,0.05); margin: 10px 0; }
    .menu-dropdown-pro a { 
      display: flex; align-items: center; gap: 15px; padding: 12px 25px;
      color: #94a3b8; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: 0.3s;
    }
    .menu-dropdown-pro a:hover { color: #fff; background: rgba(255,255,255,0.03); }
    .menu-dropdown-pro a i { color: var(--gold); font-size: 1.1rem; }
    .logout-pro:hover { color: #f43f5e !important; }

    .link-login-pro { color: #fff; text-decoration: none; font-weight: 600; font-size: 0.9rem; transition: 0.3s; }
    .link-login-pro:hover { color: var(--gold); }

    .btn-gold-pro {
      background: var(--gold); color: #000; padding: 12px 25px; border-radius: 30px;
      font-weight: 800; text-decoration: none; font-size: 0.85rem; letter-spacing: 1px;
      transition: 0.3s; box-shadow: 0 10px 20px rgba(212,175,55,0.2);
    }
    .btn-gold-pro:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(212,175,55,0.4); background: var(--gold-light); }

    .dropdown-toggle-pro.pinned, .avatar-pedestal.pinned { 
      border-color: var(--gold) !important; 
      background: rgba(212,175,55,0.1) !important;
      filter: brightness(1.2);
    }

    @keyframes floatIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes goldBreath { 0%, 100% { box-shadow: 0 0 5px rgba(212,175,55,0.2); } 50% { box-shadow: 0 0 20px rgba(212,175,55,0.4); } }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);
  isScrolled = false;

  // Dropdown States
  showDropdown = false;
  isKhacPinned = false;
  
  showUserMenu = false;
  isUserPinned = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  // Khác Dropdown Logic
  onKhacEnter() {
    this.showDropdown = true;
  }

  onKhacLeave() {
    if (!this.isKhacPinned) {
      this.showDropdown = false;
    }
  }

  toggleKhacPin(event: Event) {
    event.stopPropagation();
    this.isKhacPinned = !this.isKhacPinned;
    this.showDropdown = true;
    this.showUserMenu = false;
    this.isUserPinned = false;
  }

  // User Menu Logic
  onUserEnter() {
    this.showUserMenu = true;
  }

  onUserLeave() {
    if (!this.isUserPinned) {
      this.showUserMenu = false;
    }
  }

  toggleUserPin(event: Event) {
    event.stopPropagation();
    this.isUserPinned = !this.isUserPinned;
    this.showUserMenu = true;
    this.showDropdown = false;
    this.isKhacPinned = false;
  }

  @HostListener('document:click')
  closeMenus() {
    this.showUserMenu = false;
    this.isUserPinned = false;
    this.showDropdown = false;
    this.isKhacPinned = false;
  }

  logout() {
    this.authService.logout();
    this.closeMenus();
  }
}
