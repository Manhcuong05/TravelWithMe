import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `

    <footer class="footer luxury-bg animate-fade-in">
      <div class="container footer-grid">
        <div class="brand-col">
          <h2 class="luxury-font gold-text">TravelWithMe</h2>
          <p class="font-light desc-text">Kiến tạo những hành trình phi thường cho những lữ khách sành điệu nhất từ năm 2026. Trải nghiệm đẳng cấp, dịch vụ độc bản.</p>
          <div class="social-icons-wrapper mt-30">
            <a href="https://www.facebook.com/cuong.nguyen.316477/" target="_blank" class="social-icon-pro"><i class="fab fa-facebook-f"></i></a>
            <a href="https://www.instagram.com/ng_cuong05/" target="_blank" class="social-icon-pro"><i class="fab fa-instagram"></i></a>
            <a href="https://www.linkedin.com/in/c%C6%B0%E1%BB%9Dngg-adamm-580a601bb/" target="_blank" class="social-icon-pro"><i class="fab fa-linkedin-in"></i></a>
          </div>
        </div>
        
        <div class="links-col">
          <h4 class="font-light tracking-wide section-title">Dịch Vụ Cao Cấp</h4>
          <ul class="font-light pro-links">
            <li><a routerLink="/hotels"><i class="fas fa-hotel mr-10"></i> Khách Sạn & Villa</a></li>
            <li><a routerLink="/tours"><i class="fas fa-map-marked-alt mr-10"></i> Tour Du Lịch Độc Bản</a></li>
            <li><a routerLink="/flights"><i class="fas fa-plane-departure mr-10"></i> Chuyến Bay Đẳng Cấp</a></li>
            <li><a routerLink="/pois"><i class="fas fa-monument mr-10"></i> Điểm Đến Khám Phá</a></li>
            <li><a routerLink="/itinerary" class="text-gold-gradient"><i class="fas fa-magic mr-10"></i> Hành Trình AI</a></li>
          </ul>
        </div>

        <div class="links-col">
          <h4 class="font-light tracking-wide section-title">Về Chúng Tôi</h4>
          <ul class="font-light pro-links">
            <li><a routerLink="/">Câu Chuyện Thương Hiệu</a></li>
            <li><a routerLink="/">Đội Ngũ Chuyên Gia</a></li>
            <li><a routerLink="/">Chính Sách Bảo Mật</a></li>
            <li><a routerLink="/">Điều Khoản Dịch Vụ</a></li>
            <li><a routerLink="/">Liên Hệ Trợ Giúp</a></li>
          </ul>
        </div>

        <div class="newsletter-col">
          <h4 class="font-light tracking-wide section-title">Đặc Quyền Premium</h4>
          <p class="font-light">Đăng ký để nhận những thông tin du lịch độc quyền và ưu đãi sớm nhất từ CLB TravelWithMe.</p>
          <div class="input-group-pro">
            <input type="email" class="minimal-input font-light" placeholder="Email của bạn">
            <button class="btn-gold-pro">ĐĂNG KÝ</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container font-light bottom-content">
          <p>&copy; 2026 TravelWithMe Premium. Bảo lưu mọi quyền.</p>
          <div class="bottom-links">
             <span>Đẳng Cấp</span> · <span>Độc Bản</span> · <span>Phi Thường</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      font-family: "Inter", "Helvetica Neue", Arial, sans-serif;
    }
    .luxury-font {
      font-family: "Playfair Display", serif;
      letter-spacing: 0.05em;
    }
    .font-light { font-weight: 300; }
    .tracking-wide { letter-spacing: 2px; }
    .mr-10 { margin-right: 10px; }
    .mt-30 { margin-top: 30px; }
    .text-gold-gradient { 
      background: linear-gradient(135deg, #d4af37 0%, #f9e29c 50%, #d4af37 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: 500 !important;
    }
    
    .footer { 
      padding: 100px 0 40px; 
      background: linear-gradient(to bottom, #050a14, #02050a);
      border-top: 1px solid rgba(212, 175, 55, 0.2); 
      color: rgba(255,255,255,0.8);
    }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .footer-grid { display: grid; grid-template-columns: 1.5fr 1fr 1fr 1.2fr; gap: 60px; margin-bottom: 80px; }
    
    .gold-text { color: #d4af37; margin-bottom: 25px; font-size: 2.2rem; }
    .desc-text { line-height: 1.8; color: rgba(255,255,255,0.5); font-size: 0.9rem; }

    .section-title { color: #fff; margin-bottom: 30px; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; }
    .pro-links { list-style: none; padding: 0; }
    .pro-links li { margin-bottom: 18px; }
    .pro-links li a { 
      color: rgba(255,255,255,0.5); 
      text-decoration: none; 
      font-size: 0.9rem; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      display: inline-flex;
      align-items: center;
      cursor: pointer;
    }
    .pro-links li a:hover { color: #d4af37; transform: translateX(8px); }

    .social-icons-wrapper { display: flex; gap: 15px; }
    .social-icon-pro {
      width: 40px; height: 40px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1);
      display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.6);
      transition: all 0.4s ease; text-decoration: none;
    }
    .social-icon-pro:hover {
      background: #d4af37; color: #050a14; border-color: #d4af37;
      transform: translateY(-5px); box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
    }

    .input-group-pro { 
      display: flex; gap: 10px; margin-top: 25px; align-items: center;
      background: rgba(255,255,255,0.03); padding: 5px 5px 5px 15px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.1);
    }
    .minimal-input {
      flex: 1; background: transparent; border: none; color: #fff; outline: none; font-size: 0.85rem;
    }
    .btn-gold-pro {
      background: #d4af37; color: #050a14; border: none; border-radius: 25px; padding: 8px 20px;
      font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: 0.3s;
    }
    .btn-gold-pro:hover { background: #fff; transform: scale(1.05); }

    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px; font-size: 0.8rem; color: rgba(255,255,255,0.3); }
    .bottom-content { display: flex; justify-content: space-between; align-items: center; }
    .bottom-links span { text-transform: uppercase; letter-spacing: 1px; }

    @media (max-width: 1024px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; gap: 40px; }
      .bottom-content { flex-direction: column; gap: 15px; text-align: center; }
    }
  `]
})
export class FooterComponent { }
