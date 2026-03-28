import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="legal-page animate-fade-in">
      <div class="hero-section text-center" style="background-image: url('/images/legal_hero.png');">
        <div class="overlay-glow"></div>
        <div class="container hero-content">
          <span class="pro-tag">TravelWithMe Legal</span>
          <h1 class="luxury-font main-title">Chính Sách Bảo Mật</h1>
          <p class="subtitle gold-text">Cập nhật lần cuối: 28 tháng 03, 2026</p>
        </div>
      </div>

      <div class="container main-legal-content">
        <!-- Section 1: Giới thiệu -->
        <div class="legal-row animate-slide-up" style="--delay: 0.1s">
          <div class="text-block glass-card">
            <div class="card-icon"><i class="fas fa-shield-alt"></i></div>
            <h2 class="luxury-font section-title">1. Giới Thiệu</h2>
            <p>Tại <strong>TravelWithMe</strong>, sự riêng tư của bạn không chỉ là một điều khoản pháp lý, mà là nền tảng của niềm tin. Chúng tôi cam kết bảo vệ dữ liệu của bạn với tiêu chuẩn cao nhất trong ngành du lịch xa xỉ, đảm bảo mỗi chi tiết về hành trình của bạn luôn được giữ kín tuyệt đối.</p>
          </div>
          <div class="visual-placeholder glass-card empty-visual">
             <i class="fas fa-fingerprint gold-icon"></i>
          </div>
        </div>

        <!-- Section 2: Thông tin thu thập (Có ảnh) -->
        <div class="legal-row reverse animate-slide-up" style="--delay: 0.2s">
          <div class="text-block glass-card">
            <div class="card-icon"><i class="fas fa-user-lock"></i></div>
            <h2 class="luxury-font section-title">2. Thông Tin Thu Thập</h2>
            <ul class="pro-list">
               <li><span class="dot"></span> <strong>Định danh:</strong> Họ tên, hộ chiếu, ngày sinh.</li>
               <li><span class="dot"></span> <strong>Liên lạc:</strong> Email và số điện thoại 24/7.</li>
               <li><span class="dot"></span> <strong>Hành trình:</strong> Sở thích và lịch sử tìm kiếm từ AI.</li>
               <li><span class="dot"></span> <strong>Thanh toán:</strong> Mã hóa 256-bit chuẩn quốc tế.</li>
            </ul>
          </div>
          <div class="visual-block glass-card">
            <img src="/images/privacy_visual.png" alt="Bảo mật dữ liệu TravelWithMe">
            <div class="img-overlay"></div>
          </div>
        </div>

        <!-- Section 3 & 4 Grid -->
        <div class="legal-grid-boxes mt-60">
           <div class="legal-box glass-card animate-slide-up" style="--delay: 0.3s">
              <div class="card-icon"><i class="fas fa-magic"></i></div>
              <h2 class="luxury-font section-title">3. Cách Chúng Tôi Sử Dụng</h2>
              <p>Mọi thông tin đều được dùng để cá nhân hóa hành trình AI, đảm bảo dịch vụ "đo ni đóng giày" cho riêng bạn.</p>
           </div>
           <div class="legal-box glass-card animate-slide-up" style="--delay: 0.4s">
              <div class="card-icon"><i class="fas fa-user-shield"></i></div>
              <h2 class="luxury-font section-title">4. Cam Kết Tuyệt Đối</h2>
              <p>Dữ liệu của bạn được lưu trữ trên hệ thống đám mây bảo mật quân sự. Chúng tôi <strong>không bao giờ</strong> bán thông tin khách hàng.</p>
           </div>
        </div>

        <div class="contact-footer glass-card text-center animate-fade-in mt-100">
           <h3 class="luxury-font gold-text mb-20">Bạn Cần Hỗ Trợ Pháp Lý?</h3>
           <p class="mb-20">Đội ngũ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc về quyền riêng tư của bạn.</p>
           <a href="mailto:Ngmanhcuong2011@gmail.com" class="gold-link">Ngmanhcuong2011@gmail.com</a>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --bg-dark: #0a0a0b; --glass-bg: rgba(255, 255, 255, 0.02); --glass-border: rgba(255, 255, 255, 0.08); }
    
    .legal-page { padding-bottom: 120px; background: var(--bg-dark); min-height: 100vh; color: #fff; }
    
    .hero-section { 
      position: relative; height: 50vh; min-height: 400px;
      background-size: cover; background-position: center;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: -50px;
    }
    .overlay-glow { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(10,10,11,0.5), var(--bg-dark)); }
    .hero-content { position: relative; z-index: 2; }
    
    .pro-tag { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 6px 18px; border-radius: 30px; font-size: 0.7rem; font-weight: 700; 
      text-transform: uppercase; letter-spacing: 4px; margin-bottom: 25px;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }
    .main-title { font-size: clamp(2.8rem, 6vw, 4.5rem); margin-bottom: 10px; }
    .gold-text { color: var(--gold-primary); }

    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mt-60 { margin-top: 60px; }
    .mt-100 { margin-top: 100px; }
    .mb-20 { margin-bottom: 20px; }

    .main-legal-content { display: flex; flex-direction: column; gap: 40px; position: relative; z-index: 3; }

    .legal-row { display: grid; grid-template-columns: 1.2fr 1fr; gap: 40px; align-items: stretch; }
    .legal-row.reverse { grid-template-columns: 1fr 1.2fr; }
    .legal-row.reverse .text-block { order: 2; }
    .legal-row.reverse .visual-block { order: 1; }

    .glass-card { 
      background: var(--glass-bg); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
      border: 1px solid var(--glass-border); border-radius: 32px; transition: 0.4s;
    }
    .glass-card:hover { border-color: rgba(212, 175, 55, 0.25); transform: translateY(-5px); }

    .text-block { padding: 50px; display: flex; flex-direction: column; justify-content: center; }
    .card-icon { width: 50px; height: 50px; background: rgba(212, 175, 55, 0.1); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--gold-primary); font-size: 1.4rem; margin-bottom: 25px; }

    .section-title { font-size: 2rem; margin-bottom: 25px; color: #fff; }
    .text-block p { line-height: 1.8; color: rgba(255,255,255,0.7); font-size: 1.1rem; }

    .visual-block { position: relative; overflow: hidden; border-radius: 32px; padding: 15px; }
    .visual-block img { width: 100%; height: 100%; object-fit: cover; border-radius: 20px; filter: contrast(1.1) saturate(0.9); transition: 0.5s; }
    .visual-block:hover img { transform: scale(1.05); filter: contrast(1.2) saturate(1); }
    .img-overlay { position: absolute; top: 15px; left: 15px; right: 15px; bottom: 15px; background: linear-gradient(to top, rgba(0,0,0,0.5), transparent); border-radius: 20px; pointer-events: none; }

    .empty-visual { display: flex; align-items: center; justify-content: center; }
    .gold-icon { font-size: 8rem; color: rgba(212, 175, 55, 0.05); }

    .pro-list { list-style: none; padding: 0; margin-top: 10px; }
    .pro-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 15px; color: rgba(255,255,255,0.65); font-size: 1.05rem; }
    .pro-list .dot { width: 6px; height: 6px; background: var(--gold-primary); border-radius: 50%; display: block; margin-top: 10px; flex-shrink: 0; }
    .pro-list strong { color: #fff; }

    .legal-grid-boxes { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
    .legal-box { padding: 40px; }

    .contact-footer { padding: 80px 40px; border-style: dashed; }
    .gold-link { color: var(--gold-primary); text-decoration: none; font-weight: 700; font-size: 1.4rem; transition: 0.3s; }
    .gold-link:hover { color: #fff; text-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }

    /* Animations */
    .animate-slide-up { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: var(--delay); }
    @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 1024px) {
      .legal-row { grid-template-columns: 1fr; }
      .legal-row.reverse { grid-template-columns: 1fr; }
      .visual-block { height: 400px; }
    }
    @media (max-width: 768px) {
      .legal-grid-boxes { grid-template-columns: 1fr; }
      .text-block { padding: 35px; }
      .main-title { font-size: 3rem; }
      .section-title { font-size: 1.6rem; }
    }
  `]
})
export class PrivacyPolicyComponent { }
