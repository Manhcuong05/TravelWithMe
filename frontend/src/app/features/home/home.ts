import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section">
      <div class="hero-content animate-fade-in">
        <h1 class="luxury-font">Khám Phá Những Hành Trình<br>Phi Thường Cùng Chúng Tôi</h1>
        <p class="subtitle">Trải nghiệm sự sang trọng được định nghĩa lại. Những hành trình được thiết kế riêng vượt xa mọi mong đợi.</p>
        
        <div class="search-box glass-effect">
          <div class="search-item">
            <label>Điểm đến</label>
            <input type="text" placeholder="Bạn muốn đi đâu?">
          </div>
          <div class="search-item">
            <label>Ngày nhận phòng</label>
            <input type="date">
          </div>
          <div class="search-item">
            <label>Khách</label>
            <input type="number" value="2">
          </div>
          <button class="btn-gold">Khám Phá</button>
        </div>
      </div>
    </section>

    <section class="featured-sections container">
      <div class="section-header">
        <h2 class="luxury-font">Bộ Sưu Tập Tuyển Chọn</h2>
        <p>Những điểm lưu trú và trải nghiệm được chọn lọc kỹ lưỡng cho những lữ khách tinh tế.</p>
      </div>
      
      <div class="grid">
        <div class="card glass-effect animate-fade-in" style="animation-delay: 0.2s">
          <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600')"></div>
          <div class="card-body">
            <h3>Khách Sạn Boutique</h3>
            <p>Những không gian độc đáo với dịch vụ xuất sắc.</p>
            <a routerLink="/hotels" class="link-gold">Xem Khách Sạn →</a>
          </div>
        </div>
        
        <div class="card glass-effect animate-fade-in" style="animation-delay: 0.4s">
          <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600')"></div>
          <div class="card-body">
            <h3>Tour Riêng Tư</h3>
            <p>Đặc quyền khám phá những kỳ quan thế giới.</p>
            <a routerLink="/tours" class="link-gold">Xem Tour →</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero-section {
      height: 100vh;
      background: linear-gradient(rgba(5, 10, 20, 0.6), rgba(5, 10, 20, 0.9)), url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920');
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
    }
    .hero-content h1 {
      font-size: 4.5rem;
      margin-bottom: 20px;
      line-height: 1.1;
      color: var(--text-primary);
    }
    .subtitle {
      font-size: 1.2rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 50px;
    }
    .search-box {
      display: flex;
      align-items: center;
      padding: 10px 20px;
      gap: 20px;
      margin: 0 auto;
      max-width: 1000px;
    }
    .search-item {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding-right: 20px;
      border-right: 1px solid var(--glass-border);
    }
    .search-item:last-of-type { border-right: none; }
    .search-item label {
      font-size: 0.75rem;
      text-transform: uppercase;
      color: var(--gold-primary);
      margin-bottom: 5px;
    }
    .search-item input {
      background: transparent;
      border: none;
      color: var(--text-primary);
      outline: none;
    }
    .container {
      max-width: 1200px;
      margin: 100px auto;
      padding: 0 20px;
    }
    .section-header {
      text-align: center;
      margin-bottom: 60px;
    }
    .section-header h2 { font-size: 2.5rem; margin-bottom: 10px; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
      gap: 40px;
    }
    .card {
      overflow: hidden;
      transition: var(--transition-smooth);
    }
    .card:hover { transform: scale(1.02); }
    .card-img {
      height: 300px;
      background-size: cover;
      background-position: center;
    }
    .card-body { padding: 30px; }
    .card-body h3 { margin-bottom: 15px; font-size: 1.5rem; }
    .card-body p { color: var(--text-secondary); margin-bottom: 20px; }
    .link-gold {
      color: var(--gold-primary);
      text-decoration: none;
      font-weight: 500;
      transition: var(--transition-smooth);
    }
    .link-gold:hover { letter-spacing: 1px; }
  `]
})
export class HomeComponent { }
