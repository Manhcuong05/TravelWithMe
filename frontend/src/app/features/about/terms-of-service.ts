import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="legal-page animate-fade-in">
      <div class="hero-section text-center" style="background-image: url('/images/legal_hero.png');">
        <div class="overlay-glow"></div>
        <div class="container hero-content">
          <span class="pro-tag">Agreement Protocol</span>
          <h1 class="luxury-font main-title">Điều Khoản Dịch Vụ</h1>
          <p class="subtitle gold-text">Hiệu lực từ: 28 tháng 03, 2026</p>
        </div>
      </div>

      <div class="container main-legal-content">
        <!-- Section 1: Chấp thuận -->
        <div class="legal-row animate-slide-up" style="--delay: 0.1s">
          <div class="text-block glass-card">
            <div class="card-icon"><i class="fas fa-file-contract"></i></div>
            <h2 class="luxury-font section-title">1. Chấp Thuận Điều Khoản</h2>
            <p>Bằng việc truy cập <strong>TravelWithMe</strong>, bạn chính thức ký kết một thỏa thuận dịch vụ đẳng cấp. Chúng tôi tin rằng sự minh bạch là chìa khóa để xây dựng những hành trình phi thường.</p>
          </div>
          <div class="visual-placeholder glass-card empty-visual">
             <i class="fas fa-signature gold-icon"></i>
          </div>
        </div>

        <!-- Section 2: Dịch vụ (Có ảnh) -->
        <div class="legal-row reverse animate-slide-up" style="--delay: 0.2s">
          <div class="text-block glass-card">
            <div class="card-icon"><i class="fas fa-concierge-bell"></i></div>
            <h2 class="luxury-font section-title">2. Dịch Vụ Độc Bản</h2>
            <p>Từ việc lập kế hoạch bằng AI đến việc điều phối các chuyến bay tư nhân, chúng tôi cam kết mang lại sự chính xác tuyệt đối. Tuy nhiên, các yếu tố khách quan từ đối tác toàn cầu sẽ được chúng tôi xử lý với ưu tiên cao nhất cho khách hàng.</p>
          </div>
          <div class="visual-block glass-card">
            <img src="/images/terms_visual.png" alt="Thỏa thuận dịch vụ cao cấp">
            <div class="img-overlay"></div>
          </div>
        </div>

        <!-- Sections 3, 4, 5 Grid -->
        <div class="legal-grid-boxes mt-60">
           <div class="legal-box glass-card animate-slide-up" style="--delay: 0.3s">
              <div class="card-icon"><i class="fas fa-user-check"></i></div>
              <h2 class="luxury-font section-title">3. Trách Nhiệm</h2>
              <ul class="pro-list">
                 <li><span class="dot"></span> Cung cấp dữ liệu định danh chính xác.</li>
                 <li><span class="dot"></span> Tuân thủ quy tắc ứng xử văn minh.</li>
                 <li><span class="dot"></span> Hoàn tất thủ tục pháp lý cá nhân (Visa).</li>
              </ul>
           </div>
           
           <div class="legal-box glass-card animate-slide-up" style="--delay: 0.4s">
              <div class="card-icon"><i class="fas fa-hand-holding-usd"></i></div>
              <h2 class="luxury-font section-title">4. Hoàn Tiền</h2>
              <p>Quy trình tài chính được thực hiện minh bạch, hỗ trợ tối đa quyền lợi khách hàng theo các điều kiện cụ thể của nhà cung cấp dịch vụ căn bản.</p>
           </div>

           <div class="legal-box glass-card animate-slide-up" style="--delay: 0.5s">
              <div class="card-icon"><i class="fas fa-gavel"></i></div>
              <h2 class="luxury-font section-title">5. Pháp Lý</h2>
              <p>Mọi tranh chấp được giải quyết dựa trên tinh thần thượng tôn pháp luật và quyền lợi của người tiêu dùng trong hệ sinh thái du lịch AI.</p>
           </div>
        </div>

        <div class="contact-footer glass-card text-center animate-fade-in mt-100">
           <h3 class="luxury-font gold-text mb-20">Liên Hệ Ban Quản Trị</h3>
           <p class="mb-20">Chúng tôi luôn lắng nghe để cải thiện chất lượng dịch vụ mỗi ngày.</p>
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
    .pro-list li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; color: rgba(255,255,255,0.65); font-size: 1.05rem; }
    .pro-list .dot { width: 6px; height: 6px; background: var(--gold-primary); border-radius: 50%; display: block; margin-top: 10px; flex-shrink: 0; }
    
    .legal-grid-boxes { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }
    .legal-box { padding: 35px; }

    .contact-footer { padding: 80px 40px; border-style: dashed; }
    .gold-text { color: var(--gold-primary); }
    .gold-link { color: var(--gold-primary); text-decoration: none; font-weight: 700; font-size: 1.4rem; transition: 0.3s; }
    .gold-link:hover { color: #fff; text-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }

    /* Animations */
    .animate-slide-up { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: var(--delay); }
    @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 1024px) {
      .legal-row { grid-template-columns: 1fr; }
      .legal-row.reverse { grid-template-columns: 1fr; }
      .visual-block { height: 400px; }
      .legal-grid-boxes { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 768px) {
      .legal-grid-boxes { grid-template-columns: 1fr; }
      .text-block { padding: 35px; }
      .main-title { font-size: 3rem; }
    }
  `]
})
export class TermsOfServiceComponent {}
