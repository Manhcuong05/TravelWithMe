import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <footer class="footer luxury-bg animate-fade-in">
      <div class="container footer-grid">
        <div class="brand-col">
          <h2 class="luxury-font gold-text">TravelWithMe</h2>
          <p>Kiến tạo những hành trình phi thường cho những lữ khách sành điệu nhất từ năm 2026.</p>
        </div>
        
        <div class="links-col">
          <h4>Trải Nghiệm</h4>
          <ul>
            <li><a>Khách Sạn Sang Trọng</a></li>
            <li><a>Biệt Thự Riêng Tư</a></li>
            <li><a>Tour Độc Bản</a></li>
            <li><a>Quản Gia AI</a></li>
          </ul>
        </div>

        <div class="links-col">
          <h4>Công Ty</h4>
          <ul>
            <li><a>Câu Chuyện Của Chúng Tôi</a></li>
            <li><a>Quy Trình Tuyển Chọn</a></li>
            <li><a>Liên Hệ</a></li>
          </ul>
        </div>

        <div class="newsletter-col">
          <h4>Bản Tin</h4>
          <p>Đăng ký để nhận những thông tin du lịch độc quyền và ưu đãi sớm nhất.</p>
          <div class="input-group">
            <input type="email" placeholder="Email của bạn">
            <button class="btn-gold">Tham gia</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2026 TravelWithMe Premium. Bảo lưu mọi quyền.</p>
          <div class="social-links">
            <a>Instagram</a> · <a>LinkedIn</a> · <a>Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer { padding: 100px 0 40px; border-top: 1px solid var(--glass-border); margin-top: 100px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 60px; margin-bottom: 80px; }
    
    .gold-text { color: var(--gold-primary); margin-bottom: 20px; }
    .footer p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
    
    h4 { color: var(--text-primary); margin-bottom: 25px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }
    ul { list-style: none; }
    ul li { margin-bottom: 15px; }
    ul li a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: var(--transition-smooth); cursor: pointer; }
    ul li a:hover { color: var(--gold-secondary); }

    .newsletter-col h4 { margin-bottom: 25px; }
    .input-group { display: flex; gap: 10px; margin-top: 20px; }
    .input-group input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 10px 15px; border-radius: 8px; color: var(--text-primary); outline: none; }
    .btn-gold { padding: 10px 20px; }

    .footer-bottom { border-top: 1px solid var(--glass-border); padding-top: 40px; font-size: 0.8rem; color: var(--text-muted); }
    .footer-bottom .container { display: flex; justify-content: space-between; align-items: center; }
    .social-links a { margin-left: 20px; color: var(--text-muted); text-decoration: none; }
  `]
})
export class FooterComponent { }
