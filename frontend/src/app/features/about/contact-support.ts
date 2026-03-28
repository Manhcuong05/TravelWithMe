import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-page animate-fade-in">
      <div class="hero-section text-center" style="background-image: url('/images/luxury_travel_contact_hero.png');">
        <div class="overlay"></div>
        <div class="container hero-content">
          <span class="pro-tag">Hỗ Trợ 24/7</span>
          <h1 class="luxury-font main-title">Kết Nối Với Chúng Tôi</h1>
          <p class="subtitle text-reveal">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và hiện thực hóa mọi ý tưởng du lịch của bạn.</p>
        </div>
      </div>

      <div class="container contact-grid">
        <div class="contact-form-section glass-card">
          <h2 class="luxury-font mb-30 section-title">Gửi Yêu Cầu Tư Vấn</h2>
          <form class="pro-form">
            <div class="form-row">
               <div class="form-group floating-label">
                 <input type="text" id="fullname" placeholder=" " required>
                 <label for="fullname">Họ và Tên</label>
               </div>
               <div class="form-group floating-label">
                 <input type="email" id="email" placeholder=" " required>
                 <label for="email">Email</label>
               </div>
            </div>
            <div class="form-group floating-label">
               <select id="service">
                 <option disabled selected hidden value=""> </option>
                 <option>Hành Trình AI cá nhân</option>
                 <option>Tour Độc Bản</option>
                 <option>Khách Sạn & Villa Luxury</option>
                 <option>Hợp tác kinh doanh</option>
               </select>
               <label for="service">Dịch Vụ Quan Tâm</label>
            </div>
            <div class="form-group floating-label">
               <textarea id="message" rows="4" placeholder=" " required></textarea>
               <label for="message">Lời Nhắn Của Bạn</label>
            </div>
            <button class="btn-gold-pro">
              <span>GỬI YÊU CẦU NGAY</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>

        <div class="contact-info-section">
          <div class="info-card-pro glass-card mb-20 animate-slide-up" style="--delay: 0.1s">
              <div class="icon-box">
                <i class="fas fa-phone-alt"></i>
              </div>
              <div class="info-content">
                <h3 class="luxury-font">Hotline Premium</h3>
                <p>0378460679</p>
                <span class="availability">Luôn sẵn sàng 24/7</span>
              </div>
          </div>
          <div class="info-card-pro glass-card mb-20 animate-slide-up" style="--delay: 0.2s">
              <div class="icon-box">
                <i class="fas fa-envelope"></i>
              </div>
              <div class="info-content">
                <h3 class="luxury-font">Email Phản Hồi</h3>
                <p>Ngmanhcuong2011@gmail.com</p>
                <span class="availability">Phản hồi trong 2h</span>
              </div>
          </div>
          <div class="info-card-pro glass-card animate-slide-up" style="--delay: 0.3s">
              <div class="icon-box">
                <i class="fas fa-map-marker-alt"></i>
              </div>
              <div class="info-content">
                <h3 class="luxury-font">Văn Phòng Đại Diện</h3>
                <p>CMC cơ sở 2 - Vạn Phúc Building</p>
                <span class="availability">Hà Nội, Việt Nam</span>
              </div>
          </div>
        </div>
      </div>

      <div class="container map-section mt-80">
         <div class="map-placeholder-pro glass-card" style="padding: 0; overflow: hidden; height: 400px;">
            <iframe 
              src="https://www.google.com/maps?q=20.9833795,105.7700553&z=17&output=embed" 
              width="100%" 
              height="100%" 
              style="border:0; filter: grayscale(1) invert(0.9) contrast(1.2);" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
         </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #AA8A2E; --bg-dark: #0a0a0b; --glass-bg: rgba(255, 255, 255, 0.03); --glass-border: rgba(255, 255, 255, 0.08); }
    
    .contact-page { background: var(--bg-dark); color: #fff; min-height: 100vh; padding-bottom: 100px; }
    
    .hero-section { 
      position: relative; height: 60vh; min-height: 450px; 
      background-size: cover; background-position: center; 
      display: flex; align-items: center; justify-content: center;
      margin-bottom: -80px;
    }
    .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(10,10,11,0.4), var(--bg-dark)); }
    .hero-content { position: relative; z-index: 2; padding-top: 40px; }
    
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mb-30 { margin-bottom: 30px; }
    .mb-20 { margin-bottom: 20px; }
    .mt-80 { margin-top: 80px; }

    .pro-tag { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 6px 18px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; 
      text-transform: uppercase; letter-spacing: 3px; margin-bottom: 25px;
      backdrop-filter: blur(5px); border: 1px solid rgba(212, 175, 55, 0.3);
    }
    
    .main-title { font-size: clamp(2.5rem, 5vw, 4rem); margin-bottom: 20px; letter-spacing: -1px; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
    .subtitle { color: rgba(255,255,255,0.7); font-size: 1.2rem; max-width: 650px; margin: 0 auto; line-height: 1.6; }

    .contact-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 30px; position: relative; z-index: 3; }
    
    .glass-card { 
      background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border); border-radius: 24px; transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), border-color 0.3s;
    }
    .glass-card:hover { border-color: rgba(212, 175, 55, 0.3); }

    .contact-form-section { padding: 60px; }
    .section-title { font-size: 2rem; color: var(--gold-primary); }

    .pro-form { display: flex; flex-direction: column; gap: 30px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    
    .floating-label { position: relative; }
    .floating-label input, .floating-label select, .floating-label textarea {
      width: 100%; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); 
      padding: 16px 20px; border-radius: 12px; color: #fff; font-size: 1rem; outline: none; transition: 0.3s;
    }
    .floating-label label {
      position: absolute; left: 20px; top: 16px; color: rgba(255,255,255,0.4); 
      pointer-events: none; transition: 0.3s; font-size: 1rem;
    }
    .floating-label input:focus ~ label, .floating-label input:not(:placeholder-shown) ~ label,
    .floating-label select:focus ~ label, .floating-label select:not([value=""]) ~ label,
    .floating-label textarea:focus ~ label, .floating-label textarea:not(:placeholder-shown) ~ label {
      top: -12px; left: 15px; font-size: 0.75rem; color: var(--gold-primary); 
      background: var(--bg-dark); padding: 0 8px; border-radius: 4px;
    }
    .floating-label input:focus, .floating-label select:focus, .floating-label textarea:focus {
      border-color: var(--gold-primary); box-shadow: 0 0 15px rgba(212, 175, 55, 0.1); background: rgba(255,255,255,0.08);
    }

    .btn-gold-pro {
      background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
      color: #000; border: none; padding: 18px 30px; border-radius: 14px;
      font-weight: 800; font-size: 0.9rem; letter-spacing: 1.5px;
      cursor: pointer; transition: 0.4s; display: flex; align-items: center; justify-content: center; gap: 12px;
      box-shadow: 0 10px 25px rgba(212, 175, 55, 0.3);
    }
    .btn-gold-pro:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(212, 175, 55, 0.4); filter: brightness(1.1); }
    .btn-gold-pro:active { transform: translateY(-1px); }

    .info-card-pro { 
      padding: 30px; display: flex; align-items: center; gap: 20px; text-decoration: none; 
      border-left: 4px solid transparent;
    }
    .info-card-pro:hover { border-left-color: var(--gold-primary); background: rgba(255,255,255,0.05); transform: translateX(10px); }
    .icon-box { 
      width: 60px; height: 60px; background: rgba(212, 175, 55, 0.1); border-radius: 16px; 
      display: flex; align-items: center; justify-content: center; color: var(--gold-primary); font-size: 1.5rem;
      transition: 0.3s;
    }
    .info-card-pro:hover .icon-box { background: var(--gold-primary); color: #000; transform: rotate(10deg); }
    .info-content h3 { font-size: 1.1rem; margin-bottom: 5px; }
    .info-content p { color: #fff; font-size: 1rem; margin-bottom: 4px; font-weight: 500; }
    .availability { font-size: 0.75rem; color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 1px; }

    .map-placeholder-pro { 
      position: relative; padding: 100px 0; overflow: hidden; display: flex; align-items: center; justify-content: center;
      border: 1px dashed rgba(212, 175, 55, 0.2);
    }
    .map-content { position: relative; z-index: 2; text-align: center; }
    .map-content i { font-size: 3rem; margin-bottom: 20px; display: block; filter: drop-shadow(0 0 15px var(--gold-primary)); }
    .map-bg-effect { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%); }

    /* Animations */
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: var(--delay); }
    @keyframes slideUp { from { transform: translateY(30px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    
    .animate-bounce-slow { animation: bounceSlow 3s infinite ease-in-out; }
    @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-15px); } }

    @media (max-width: 1024px) {
      .contact-grid { grid-template-columns: 1fr; }
      .hero-section { height: 50vh; }
    }
    @media (max-width: 768px) {
      .contact-form-section { padding: 40px 24px; }
      .form-row { grid-template-columns: 1fr; }
      .main-title { font-size: 2.5rem; }
    }
  `]
})
export class ContactSupportComponent {}
