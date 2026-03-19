import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Social Proof / Trusted By -->
    <section class="trusted-by">
      <div class="container trusted-container">
        <span class="trusted-logo">Aman Resorts</span>
        <span class="trusted-logo">Four Seasons</span>
        <span class="trusted-logo luxury-font font-italic">Michelin Guide</span>
        <span class="trusted-logo">Relais & Châteaux</span>
        <span class="trusted-logo">CNN Travel</span>
      </div>
    </section>

    <footer class="footer luxury-bg animate-fade-in">
      <div class="container footer-grid">
        <div class="brand-col">
          <h2 class="luxury-font gold-text">TravelWithMe</h2>
          <p class="font-light">Kiến tạo những hành trình phi thường cho những lữ khách sành điệu nhất từ năm 2026.</p>
        </div>
        
        <div class="links-col">
          <h4 class="font-light tracking-wide">Trải Nghiệm</h4>
          <ul class="font-light">
            <li><a>Khách Sạn Sang Trọng</a></li>
            <li><a>Biệt Thự Riêng Tư</a></li>
            <li><a>Tour Độc Bản</a></li>
            <li><a>Tour Ẩm Thực</a></li>
            <li><a>Du Thuyền Riêng</a></li>
          </ul>
        </div>

        <div class="links-col">
          <h4 class="font-light tracking-wide">Công Ty</h4>
          <ul class="font-light">
            <li><a>Câu Chuyện Của Chúng Tôi</a></li>
            <li><a>Quy Trình Tuyển Chọn</a></li>
            <li><a>Liên Hệ</a></li>
          </ul>
        </div>

        <div class="newsletter-col">
          <h4 class="font-light tracking-wide">Bản Tin</h4>
          <p class="font-light">Đăng ký để nhận những thông tin du lịch độc quyền và ưu đãi sớm nhất.</p>
          <div class="input-group">
            <!-- Đổi chữ placeholder và đổi class the input style -->
            <input type="email" class="minimal-input font-light" placeholder="Điền Email để nhận ưu đãi xa xỉ đầu tiên">
            <button class="btn-gold-text">ĐĂNG KÝ NGAY</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container font-light">
          <p>&copy; 2026 TravelWithMe Premium. Bảo lưu mọi quyền.</p>
          <div class="social-links">
            <a>Instagram</a> · <a>LinkedIn</a> · <a>Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    :host {
      display: block;
      /* Typography Updates cho Footer */
      font-family: "Helvetica Neue", Arial, sans-serif;
    }
    .luxury-font {
      font-family: "Playfair Display", "Times New Roman", serif;
      letter-spacing: 0.05em;
    }
    .font-light {
      font-weight: 300;
    }
    .tracking-wide {
      letter-spacing: 2px;
    }
    .font-italic {
      font-style: italic;
    }
    /* Trusted By Section */
    .trusted-by {
      padding: 60px 0;
      border-top: 1px solid rgba(255,255,255,0.05);
      background: rgba(5,10,20, 0.3);
    }
    .trusted-container {
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-wrap: wrap;
      gap: 30px;
      opacity: 0.5;
    }
    .trusted-logo {
      color: #e0e0e0;
      font-size: 1.1rem;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-weight: 300;
      transition: opacity 0.3s ease, color 0.3s ease;
    }
    .trusted-logo:hover {
      opacity: 1;
      color: #d4af37;
    }

    /* Footer core */
    .footer { padding: 80px 0 40px; border-top: 1px solid rgba(255,255,255,0.08); background: #050a14; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 60px; margin-bottom: 80px; }
    
    .gold-text { color: #d4af37; margin-bottom: 20px; font-size: 1.8rem; }
    .footer p { color: rgba(255,255,255,0.6); font-size: 0.95rem; line-height: 1.8; }
    
    h4 { color: #fff; margin-bottom: 25px; font-size: 0.85rem; text-transform: uppercase; }
    ul { list-style: none; padding: 0; }
    ul li { margin-bottom: 15px; }
    ul li a { color: rgba(255,255,255,0.5); text-decoration: none; font-size: 0.95rem; transition: color 0.3s ease; cursor: pointer; }
    ul li a:hover { color: #d4af37; }

    .newsletter-col h4 { margin-bottom: 25px; }
    .input-group { 
      position: relative;
      display: flex; 
      gap: 15px; 
      margin-top: 25px; 
      align-items: flex-end;
    }
    /* Minimalist input: chỉ có border-bottom */
    .minimal-input {
      flex: 1;
      background: transparent;
      border: none;
      border-bottom: 1px solid rgba(255,255,255,0.2);
      padding: 10px 0;
      color: #fff;
      outline: none;
      font-size: 0.95rem;
      transition: border-bottom-color 0.4s ease;
      /* Animation line on focus */
      position: relative;
    }
    .minimal-input::placeholder {
      color: rgba(255,255,255,0.4);
    }
    /* Pseudo element for animating center-to-edge border */
    .input-group::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      height: 1px;
      width: 0;
      background-color: #d4af37;
      transition: width 0.4s ease, left 0.4s ease;
      pointer-events: none;
    }
    /* Kích hoạt ::after khi input focus trong input-group */
    .input-group:focus-within::after {
      width: 100%;
      left: 0;
    }

    /* Đổi nút thành text link đơn giản và thanh lịch hơn */
    .btn-gold-text { 
      background: transparent;
      border: none;
      color: #d4af37; 
      font-weight: 400;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 10px 0;
      position: relative;
    }
    .btn-gold-text::after {
      content: '';
      position: absolute;
      bottom: 5px;
      left: 0;
      height: 1px;
      width: 100%;
      background-color: #d4af37;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.4s ease;
    }
    .btn-gold-text:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }

    .footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 40px; font-size: 0.85rem; color: rgba(255,255,255,0.4); }
    .footer-bottom .container { display: flex; justify-content: space-between; align-items: center; }
    .social-links a { margin-left: 20px; color: rgba(255,255,255,0.4); text-decoration: none; transition: color 0.3s ease; cursor: pointer; }
    .social-links a:hover { color: #fff; }

    @media (max-width: 1024px) {
      .footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .footer-grid { grid-template-columns: 1fr; }
      .footer-bottom .container { flex-direction: column; gap: 20px; text-align: center; }
    }
  `]
})
export class FooterComponent { }
