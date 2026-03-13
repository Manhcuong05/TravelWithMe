import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card glass-effect animate-fade-in">
        <h2 class="luxury-font">Welcome Back</h2>
        <p class="subtitle">Please enter your details to sign in</p>
        
        <form (ngSubmit)="onLogin()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              [(ngModel)]="credentials.email" 
              required 
              placeholder="your@email.com">
          </div>
          
          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              name="password" 
              [(ngModel)]="credentials.password" 
              required 
              placeholder="••••••••">
          </div>
          
          <div *ngIf="errorMessage" class="error-msg">
            {{ errorMessage }}
          </div>
          
          <button type="submit" class="btn-gold w-full" [disabled]="loading">
            {{ loading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>
        
        <p class="footer-text">
          Don't have an account? <a routerLink="/auth/register">Join Now</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(rgba(5, 10, 20, 0.8), rgba(5, 10, 20, 0.9)), url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=1920');
      background-size: cover;
      background-position: center;
    }
    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 50px;
      text-align: center;
    }
    .subtitle {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 40px;
    }
    .auth-form {
      text-align: left;
    }
    .form-group {
      margin-bottom: 25px;
    }
    .form-group label {
      display: block;
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--gold-primary);
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    .form-group input {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
      padding: 12px 15px;
      border-radius: 8px;
      color: var(--text-primary);
      outline: none;
      transition: var(--transition-smooth);
    }
    .form-group input:focus {
      border-color: var(--gold-primary);
      background: rgba(255, 255, 255, 0.08);
    }
    .w-full { width: 100%; }
    .footer-text {
      margin-top: 30px;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .footer-text a {
      color: var(--gold-primary);
      text-decoration: none;
      font-weight: 500;
    }
    .error-msg {
      color: #ef4444;
      font-size: 0.85rem;
      margin-bottom: 20px;
      text-align: center;
    }
  `]
})
export class LoginComponent {
  credentials = { email: '', password: '' };
  loading = false;
  errorMessage = '';

  private authService = inject(AuthService);
  private router = inject(Router);

  onLogin() {
    this.loading = true;
    this.errorMessage = '';

    this.authService.login(this.credentials).subscribe({
      next: (res: any) => {
        if (res.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = res.message || 'Login failed. Please try again.';
          this.loading = false;
        }
      },
      error: (err: any) => {
        this.errorMessage = err.error?.message || 'An error occurred during login.';
        this.loading = false;
      }
    });
  }
}
