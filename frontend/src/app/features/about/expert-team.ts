import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="expert-team-page animate-fade-in">
      <div class="hero-section text-center">
        <div class="container">
          <span class="pro-tag">Đội Ngũ Chuyên Gia</span>
          <h1 class="luxury-font main-title">Những Người Kiến Tạo Giấc Mơ</h1>
          <p class="subtitle">Hội tụ những chuyên gia thiết kế hành trình hàng đầu, những người biến mỗi ý tưởng thành kỳ quan du lịch.</p>
        </div>
      </div>

      <div class="container team-grid">
        <div class="expert-card glass-card animate-slide-up">
          <div class="expert-image-wrapper">
             <div class="image-placeholder luxury-font">CEO</div>
          </div>
          <div class="expert-info">
            <h3 class="luxury-font gold-text">Adam Nguyen</h3>
            <span class="expert-title">Founder & Visionary</span>
            <p class="expert-desc">Với hơn 15 năm kinh nghiệm trong ngành du lịch xa xỉ, Adam là người đặt nền móng cho triết lý "Độc bản" tại TravelWithMe.</p>
            <div class="social-links">
              <i class="fab fa-linkedin-in"></i>
              <i class="fab fa-twitter"></i>
            </div>
          </div>
        </div>

        <div class="expert-card glass-card animate-slide-up" style="animation-delay: 0.1s">
          <div class="expert-image-wrapper">
             <div class="image-placeholder luxury-font">CTO</div>
          </div>
          <div class="expert-info">
            <h3 class="luxury-font gold-text">Elena Vo</h3>
            <span class="expert-title">Chief Travel Architect</span>
            <p class="expert-desc"> Elena là "phù thủy" đứng sau hệ thống AI Itinerary, kết hợp hoàn hảo giữa công nghệ và cảm xúc con người.</p>
            <div class="social-links">
              <i class="fab fa-linkedin-in"></i>
              <i class="fab fa-behance"></i>
            </div>
          </div>
        </div>

        <div class="expert-card glass-card animate-slide-up" style="animation-delay: 0.2s">
          <div class="expert-image-wrapper">
             <div class="image-placeholder luxury-font">EXP</div>
          </div>
          <div class="expert-info">
            <h3 class="luxury-font gold-text">Marco Rossi</h3>
            <span class="expert-title">Global Experience Director</span>
            <p class="expert-desc">Cựu quản lý tại các resort 6 sao tại Italy, Marco đảm bảo mỗi điểm đến đều đạt tiêu chuẩn phục vụ hoàng gia.</p>
            <div class="social-links">
              <i class="fab fa-linkedin-in"></i>
              <i class="fab fa-instagram"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="container joining-section mt-100 text-center">
        <div class="glass-card promo-box">
          <h2 class="luxury-font">Bạn Muốn Trở Thành Một Chuyên Gia?</h2>
          <p>Chúng tôi luôn chào đón những tâm hồn đam mê xê dịch và am hiểu về sự xa xỉ.</p>
          <button class="btn-gold mt-20">XEM VỊ TRÍ TUYỂN DỤNG</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .expert-team-page { padding: 120px 0 100px; background: var(--bg-primary); }
    .hero-section { padding: 80px 0; background: linear-gradient(to top, rgba(212, 175, 55, 0.05), transparent); margin-bottom: 60px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mt-100 { margin-top: 100px; }
    .mt-20 { margin-top: 20px; }
    
    .pro-tag { display: inline-block; background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .main-title { font-size: 3.5rem; margin-bottom: 25px; }
    .subtitle { color: var(--text-secondary); font-size: 1.15rem; max-width: 700px; margin: 0 auto; }

    .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
    .expert-card { padding: 0; overflow: hidden; height: 100%; display: flex; flex-direction: column; }
    
    .expert-image-wrapper { height: 350px; background: rgba(255,255,255,0.02); overflow: hidden; position: relative; }
    .image-placeholder { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 4rem; color: rgba(212, 175, 55, 0.2); }
    
    .expert-info { padding: 30px; flex: 1; display: flex; flex-direction: column; }
    .expert-info h3 { font-size: 1.8rem; margin-bottom: 5px; }
    .expert-title { color: var(--text-secondary); font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 20px; display: block; }
    .expert-desc { color: rgba(255,255,255,0.7); line-height: 1.7; font-size: 0.95rem; margin-bottom: 25px; }
    
    .social-links { display: flex; gap: 20px; margin-top: auto; color: var(--text-muted); font-size: 1.2rem; }
    .social-links i:hover { color: var(--gold-primary); cursor: pointer; transition: 0.3s; }

    .promo-box { padding: 60px; border-radius: 30px; }
    .promo-box h2 { font-size: 2.5rem; margin-bottom: 20px; }

    @media (max-width: 1024px) {
      .team-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .team-grid { grid-template-columns: 1fr; }
      .main-title { font-size: 2.5rem; }
      .expert-image-wrapper { height: 300px; }
    }

    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-up { animation: slideUp 0.8s ease-out forwards; opacity: 0; }
  `]
})
export class ExpertTeamComponent {}
