import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-expert-team',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="expert-team-page animate-fade-in">
      <div class="hero-section text-center">
        <div class="overlay"></div>
        <div class="container hero-content">
          <span class="pro-tag">Đội Ngũ Sáng Lập</span>
          <h1 class="luxury-font main-title">Những Người Kiến Tạo Giấc Mơ</h1>
          <p class="subtitle text-reveal">Chúng tôi là nhóm 5 sinh viên từ Đại học CMC, kết hợp sức trẻ và công nghệ để định nghĩa lại hành trình du lịch của bạn.</p>
        </div>
      </div>

      <div class="container team-grid">
        <!-- Thành viên 1: Nhóm trưởng -->
        <div class="expert-card-pro glass-card animate-slide-up" style="--delay: 0.1s">
          <div class="expert-image-wrapper-pro">
             <div class="image-placeholder-pro">
                <i class="fas fa-user-tie"></i>
                <span class="placeholder-text luxury-font">LEADER</span>
             </div>
          </div>
          <div class="expert-info-pro">
            <h3 class="luxury-font gold-text">Nguyễn Mạnh Cường</h3>
            <span class="expert-role">Nhóm Trưởng / Fullstack Developer</span>
            <p class="expert-bio">Người dẫn dắt tầm nhìn và chịu trách nhiệm chính về kiến trúc hệ thống của dự án.</p>
            <div class="social-links-pro">
              <a href="#"><i class="fab fa-github"></i></a>
              <a href="#"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
        </div>

        <!-- Thành viên 2: Frontend -->
        <div class="expert-card-pro glass-card animate-slide-up" style="--delay: 0.2s">
          <div class="expert-image-wrapper-pro">
             <div class="image-placeholder-pro">
                <i class="fas fa-code"></i>
                <span class="placeholder-text luxury-font">FRONTEND</span>
             </div>
          </div>
          <div class="expert-info-pro">
            <h3 class="luxury-font gold-text">Thành viên 02</h3>
            <span class="expert-role">Phát triển Giao diện</span>
            <p class="expert-bio">Chuyên gia về UI components, đảm bảo mỗi pixel đều mang lại cảm giác sang trọng.</p>
            <div class="social-links-pro">
              <a href="#"><i class="fab fa-github"></i></a>
              <a href="#"><i class="fab fa-behance"></i></a>
            </div>
          </div>
        </div>

        <!-- Thành viên 3: Backend -->
        <div class="expert-card-pro glass-card animate-slide-up" style="--delay: 0.3s">
          <div class="expert-image-wrapper-pro">
             <div class="image-placeholder-pro">
                <i class="fas fa-database"></i>
                <span class="placeholder-text luxury-font">BACKEND</span>
             </div>
          </div>
          <div class="expert-info-pro">
            <h3 class="luxury-font gold-text">Thành viên 03</h3>
            <span class="expert-role">Xây dựng Hệ thống</span>
            <p class="expert-bio">Tối ưu hóa dữ liệu và đảm bảo tính ổn định của toàn bộ nền tảng TravelWithMe.</p>
            <div class="social-links-pro">
              <a href="#"><i class="fab fa-github"></i></a>
              <a href="#"><i class="fab fa-docker"></i></a>
            </div>
          </div>
        </div>

        <!-- Thành viên 4: UI/UX -->
        <div class="expert-card-pro glass-card animate-slide-up" style="--delay: 0.4s">
          <div class="expert-image-wrapper-pro">
             <div class="image-placeholder-pro">
                <i class="fas fa-paint-brush"></i>
                <span class="placeholder-text luxury-font">UI/UX</span>
             </div>
          </div>
          <div class="expert-info-pro">
            <h3 class="luxury-font gold-text">Thành viên 04</h3>
            <span class="expert-role">Thiết kế Trải nghiệm</span>
            <p class="expert-bio">Kiến tạo những đường nét tinh tế và quy trình tương tác mượt mà cho người dùng.</p>
            <div class="social-links-pro">
               <a href="#"><i class="fab fa-dribbble"></i></a>
               <a href="#"><i class="fab fa-figma"></i></a>
            </div>
          </div>
        </div>

        <!-- Thành viên 5: AI -->
        <div class="expert-card-pro glass-card animate-slide-up" style="--delay: 0.5s">
          <div class="expert-image-wrapper-pro">
             <div class="image-placeholder-pro">
                <i class="fas fa-brain"></i>
                <span class="placeholder-text luxury-font">AI/DATA</span>
             </div>
          </div>
          <div class="expert-info-pro">
            <h3 class="luxury-font gold-text">Thành viên 05</h3>
            <span class="expert-role">Nghiên cứu AI & Algorithm</span>
            <p class="expert-bio">Người thổi hồn AI vào các tính năng gợi ý hành trình thông minh độc quyền.</p>
            <div class="social-links-pro">
              <a href="#"><i class="fab fa-github"></i></a>
              <a href="#"><i class="fab fa-python"></i></a>
            </div>
          </div>
        </div>
      </div>

      <div class="container joining-section mt-100 text-center">
        <div class="glass-card promo-box-pro">
          <h2 class="luxury-font section-title">Cùng Chúng Tôi Chinh Phục Thế Giới</h2>
          <p>Dự án đang trong giai đoạn phát triển bùng nổ bởi tâm huyết của những sinh viên CMC.</p>
          <button class="btn-gold-pro mt-30">LIÊN HỆ HỢP TÁC</button>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #AA8A2E; --bg-dark: #0a0a0b; --glass-bg: rgba(255, 255, 255, 0.02); --glass-border: rgba(255, 255, 255, 0.08); }
    
    .expert-team-page { padding: 120px 0 100px; background: var(--bg-dark); min-height: 100vh; color: #fff; }
    
    .hero-section { 
      position: relative; padding: 100px 0; 
      background: radial-gradient(circle at center, rgba(212, 175, 55, 0.05) 0%, transparent 70%);
      margin-bottom: 80px;
    }
    .hero-content { position: relative; z-index: 2; }
    
    .container { max-width: 1300px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mt-100 { margin-top: 100px; }
    .mt-30 { margin-top: 30px; }
    
    .pro-tag { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 6px 18px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; 
      text-transform: uppercase; letter-spacing: 3px; margin-bottom: 25px;
      border: 1px solid rgba(212, 175, 55, 0.3);
    }
    .main-title { font-size: clamp(2.5rem, 5vw, 3.5rem); margin-bottom: 25px; }
    .subtitle { color: rgba(255,255,255,0.7); font-size: 1.2rem; max-width: 800px; margin: 0 auto; line-height: 1.6; }

    .team-grid { 
      display: grid; 
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); 
      gap: 30px; 
      justify-content: center;
    }
    
    .glass-card { 
      background: var(--glass-bg); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--glass-border); border-radius: 24px; transition: 0.4s;
    }
    .glass-card:hover { border-color: rgba(212, 175, 55, 0.4); transform: translateY(-10px); background: rgba(255,255,255,0.04); }

    .expert-card-pro { display: flex; flex-direction: column; overflow: hidden; position: relative; }
    
    .expert-image-wrapper-pro { 
      height: 320px; position: relative; background: rgba(0,0,0,0.2); 
      display: flex; align-items: center; justify-content: center;
      border-bottom: 1px solid var(--glass-border);
    }
    .image-placeholder-pro { 
      text-align: center; display: flex; flex-direction: column; align-items: center; gap: 15px; 
      transition: 0.3s; color: rgba(212, 175, 55, 0.15); 
    }
    .expert-card-pro:hover .image-placeholder-pro { color: var(--gold-primary); transform: scale(1.1); }
    .image-placeholder-pro i { font-size: 5rem; }
    .placeholder-text { font-size: 1.2rem; letter-spacing: 4px; opacity: 0.5; }
    
    .expert-info-pro { padding: 35px; flex: 1; display: flex; flex-direction: column; }
    .expert-info-pro h3 { font-size: 1.6rem; margin-bottom: 8px; transition: 0.3s; }
    .expert-card-pro:hover h3 { color: #fff; text-shadow: 0 0 10px rgba(212, 175, 55, 0.3); }
    
    .expert-role { color: var(--gold-primary); font-size: 0.85rem; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; display: block; }
    .expert-bio { color: rgba(255,255,255,0.6); line-height: 1.7; font-size: 0.95rem; margin-bottom: 25px; flex: 1; }
    
    .social-links-pro { display: flex; gap: 18px; margin-top: auto; }
    .social-links-pro a { color: rgba(255,255,255,0.3); font-size: 1.3rem; transition: 0.3s; }
    .social-links-pro a:hover { color: var(--gold-primary); transform: translateY(-3px); }

    .promo-box-pro { padding: 80px 40px; border-style: dashed; }
    .section-title { font-size: 2.22rem; margin-bottom: 20px; color: var(--gold-primary); }

    .btn-gold-pro {
      background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
      color: #000; border: none; padding: 18px 40px; border-radius: 12px;
      font-weight: 800; font-size: 0.9rem; letter-spacing: 2px;
      cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
    }
    .btn-gold-pro:hover { transform: scale(1.05); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }

    /* Animations */
    .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: var(--delay); }
    @keyframes slideUp { from { transform: translateY(40px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 1200px) {
      .team-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .team-grid { grid-template-columns: 1fr; }
      .main-title { font-size: 2.5rem; }
      .promo-box-pro { padding: 50px 24px; }
      .expert-image-wrapper-pro { height: 280px; }
    }
  `]
})
export class ExpertTeamComponent {}
