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
    .btn-logout {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-muted);
      padding: 8px 16px;
      border-radius: 20px;
      cursor: pointer;
      font-size: 0.8rem;
    }
  `]
})
export class NavbarComponent {
  authService = inject(AuthService);

  logout() {
    this.authService.logout();
  }
}
