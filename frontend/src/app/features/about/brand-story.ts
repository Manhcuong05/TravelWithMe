import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-story',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="brand-story-page animate-fade-in">
      <div class="hero-section text-center" style="background-image: url('/images/brand_story_hero.png');">
        <div class="overlay"></div>
        <div class="container hero-content">
          <span class="pro-tag">Kể Từ 2026</span>
          <h1 class="luxury-font main-title">Câu Chuyện Thương Hiệu</h1>
          <p class="subtitle text-reveal">Chúng tôi không chỉ xây dựng một website, chúng tôi kiến tạo tương lai của du lịch thông minh.</p>
        </div>
      </div>

      <div class="container main-content-section">
        <div class="story-grid">
          <div class="story-text glass-card animate-slide-up" style="--delay: 0.1s">
            <h2 class="luxury-font gold-text section-title">Khát Vọng Từ CMC University</h2>
            <p class="lead">Hành trình của <strong>TravelWithMe</strong> bắt đầu từ một giảng đường tại trường Đại học CMC, nơi 5 sinh viên với niềm đam mê công nghệ cháy bỏng đã cùng nhau mơ về một cuộc cách mạng trong ngành du lịch.</p>
            <p>Chúng tôi nhận ra rằng, vẻ đẹp của thế giới vẫn chưa được khai phá hết bởi những rào cản về ngôn ngữ, khoảng cách và sự thiếu hụt thông tin cá nhân hóa. Với kiến thức về <strong>Trí Tuệ Nhân Tạo (AI)</strong> và <strong>Dữ liệu lớn</strong>, nhóm đã quyết tâm xây dựng một nền tảng không chỉ cung cấp dịch vụ, mà còn thấu hiểu tâm hồn mỗi lữ khách.</p>
            <div class="stats-row">
              <div class="stat-item">
                <span class="stat-num luxury-font">05</span>
                <span class="stat-label">Thành viên sáng lập</span>
              </div>
              <div class="stat-item">
                <span class="stat-num luxury-font">01</span>
                <span class="stat-label">Tầm nhìn chung</span>
              </div>
            </div>
          </div>
          <div class="story-image-box animate-slide-up" style="--delay: 0.3s">
            <div class="image-wrapper glass-card">
              <img src="/images/team_cmc.png" alt="Đội ngũ sáng lập CMC">
              <div class="image-overlay"></div>
              <div class="image-badge">Founding Team</div>
            </div>
          </div>
        </div>

        <div class="mission-section glass-card mt-80 animate-fade-in">
           <div class="mission-content text-center">
              <h2 class="luxury-font mb-20 italic-text">"Biến mỗi chuyến đi thành một tác phẩm nghệ thuật cá nhân."</h2>
              <p class="mission-desc">Đó là lời hứa của chúng tôi. Tại TravelWithMe, mỗi hành trình đều được đo ni đóng giày bởi sự tinh tế của con người và sức mạnh của công nghệ đỉnh cao.</p>
           </div>
        </div>

        <div class="timeline-pro-section mt-100">
          <h2 class="luxury-font text-center mb-60 gold-text">Hành Trình Kiến Tạo</h2>
          <div class="timeline-pro">
            <div class="timeline-line"></div>
            <div class="timeline-item-pro animate-slide-up" style="--delay: 0.1s">
              <div class="dot"></div>
              <div class="content glass-card">
                <span class="year luxury-font">2026</span>
                <h3>Điểm Khởi Đầu</h3>
                <p>Dự án được phôi thai từ cuộc thi khởi nghiệp tại Đại học CMC.</p>
              </div>
            </div>
            <div class="timeline-item-pro animate-slide-up" style="--delay: 0.3s">
              <div class="dot"></div>
              <div class="content glass-card">
                <span class="year luxury-font">2027</span>
                <h3>Đột Phá Công Nghệ</h3>
                <p>Hệ thống AI đầu tiên được tích hợp, cá nhân hóa 90% lịch trình khách hàng.</p>
              </div>
            </div>
            <div class="timeline-item-pro animate-slide-up" style="--delay: 0.5s">
              <div class="dot"></div>
              <div class="content glass-card">
                <span class="year luxury-font">Tương Lai</span>
                <h3>Tầm Nhìn Toàn Cầu</h3>
                <p>Trở thành biểu tượng của du lịch xa xỉ kết hợp công nghệ tại Việt Nam.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="values-grid-pro mt-100">
          <div class="value-item-pro glass-card text-center">
            <div class="icon-circle"><i class="fas fa-microchip"></i></div>
            <h3 class="luxury-font">Công Nghệ AI</h3>
            <p>Trái tim của hệ thống, giúp tối ưu hóa mọi trải nghiệm.</p>
          </div>
          <div class="value-item-pro glass-card text-center">
            <div class="icon-circle"><i class="fas fa-user-friends"></i></div>
            <h3 class="luxury-font">Kết Nối Thực</h3>
            <p>Xây dựng cộng đồng lữ khách cùng chung đẳng cấp.</p>
          </div>
          <div class="value-item-pro glass-card text-center">
            <div class="icon-circle"><i class="fas fa-award"></i></div>
            <h3 class="luxury-font">Chất Lượng Pro</h3>
            <p>Tiêu chuẩn khắt khe cho từng dịch vụ được niêm yết.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #AA8A2E; --bg-dark: #0a0a0b; --glass-bg: rgba(255, 255, 255, 0.025); --glass-border: rgba(255, 255, 255, 0.07); }
    
    .brand-story-page { background: var(--bg-dark); color: #fff; min-height: 100vh; padding-bottom: 120px; }
    
    .hero-section { 
      position: relative; height: 55vh; min-height: 400px; 
      background-size: cover; background-position: center; 
      display: flex; align-items: center; justify-content: center;
      margin-bottom: -50px;
    }
    .overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, rgba(10,10,11,0.5), var(--bg-dark)); }
    .hero-content { position: relative; z-index: 2; padding-top: 40px; }
    
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mb-60 { margin-bottom: 60px; }
    .mb-20 { margin-bottom: 20px; }
    .mt-80 { margin-top: 80px; }
    .mt-100 { margin-top: 100px; }

    .pro-tag { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 6px 18px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; 
      text-transform: uppercase; letter-spacing: 3px; margin-bottom: 25px;
      backdrop-filter: blur(5px); border: 1px solid rgba(212, 175, 55, 0.3);
    }
    
    .main-title { font-size: clamp(2.5rem, 5vw, 3.8rem); margin-bottom: 20px; letter-spacing: -1px; }
    .subtitle { color: rgba(255,255,255,0.7); font-size: 1.25rem; max-width: 700px; margin: 0 auto; line-height: 1.6; font-weight: 300; }

    .glass-card { 
      background: var(--glass-bg); backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
      border: 1px solid var(--glass-border); border-radius: 28px; transition: 0.4s;
    }
    .glass-card:hover { border-color: rgba(212, 175, 55, 0.25); transform: translateY(-5px); }

    .story-grid { display: grid; grid-template-columns: 1.1fr 1fr; gap: 50px; align-items: center; margin-top: 80px; }
    
    .story-text { padding: 50px; }
    .section-title { font-size: 2.2rem; margin-bottom: 30px; }
    .lead { font-size: 1.2rem; line-height: 1.8; margin-bottom: 20px; color: #fff; }
    .story-text p { font-size: 1.05rem; line-height: 1.8; color: rgba(255,255,255,0.7); margin-bottom: 25px; }

    .stats-row { display: flex; gap: 40px; margin-top: 10px; }
    .stat-num { font-size: 2.5rem; color: var(--gold-primary); display: block; border-bottom: 1px solid var(--glass-border); margin-bottom: 8px; }
    .stat-label { font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; color: rgba(255,255,255,0.4); }

    .story-image-box { position: relative; }
    .image-wrapper { padding: 12px; overflow: hidden; position: relative; }
    .image-wrapper img { width: 100%; border-radius: 20px; display: block; filter: saturate(0.8) contrast(1.1); transition: 0.5s; }
    .story-image-box:hover img { transform: scale(1.05); filter: saturate(1); }
    .image-overlay { position: absolute; top: 12px; left: 12px; right: 12px; bottom: 12px; background: linear-gradient(to top, rgba(0,0,0,0.6), transparent); border-radius: 20px; pointer-events: none; }
    .image-badge { position: absolute; bottom: 30px; right: 30px; background: var(--gold-primary); color: #000; padding: 6px 15px; border-radius: 30px; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 1px; }

    .mission-section { padding: 80px; border-style: dashed; }
    .italic-text { font-style: italic; font-size: 2rem; color: #ddd; }
    .mission-desc { font-size: 1.2rem; color: rgba(255,255,255,0.6); max-width: 800px; margin: 0 auto; }

    .timeline-pro-section { position: relative; }
    .timeline-pro { display: flex; justify-content: space-between; gap: 30px; position: relative; padding-top: 40px; }
    .timeline-line { position: absolute; top: 15px; left: 0; width: 100%; height: 2px; background: linear-gradient(to right, transparent, var(--glass-border), transparent); }
    .timeline-item-pro { width: 30%; position: relative; }
    .dot { width: 30px; height: 30px; background: var(--bg-dark); border: 2px solid var(--gold-primary); border-radius: 50%; position: absolute; top: -50px; left: 50%; transform: translateX(-50%); z-index: 2; box-shadow: 0 0 15px rgba(212, 175, 55, 0.4); }
    .timeline-item-pro .content { padding: 30px; margin-top: 20px; }
    .timeline-item-pro .year { font-size: 1.8rem; color: var(--gold-primary); display: block; margin-bottom: 10px; }
    .timeline-item-pro h3 { margin-bottom: 12px; font-size: 1.2rem; }
    .timeline-item-pro p { font-size: 0.95rem; color: rgba(255,255,255,0.6); line-height: 1.6; }

    .values-grid-pro { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    .value-item-pro { padding: 40px; }
    .icon-circle { width: 70px; height: 70px; background: rgba(212, 175, 55, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; color: var(--gold-primary); margin: 0 auto 25px; border: 1px solid rgba(212, 175, 55, 0.2); transition: 0.3s; }
    .value-item-pro:hover .icon-circle { background: var(--gold-primary); color: #000; box-shadow: 0 0 20px rgba(212, 175, 55, 0.3); }
    .value-item-pro h3 { margin-bottom: 15px; font-size: 1.3rem; }
    .value-item-pro p { color: rgba(255,255,255,0.6); font-size: 0.95rem; line-height: 1.6; }

    /* Animations */
    .animate-slide-up { animation: slideUp 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; animation-delay: var(--delay); }
    @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    @media (max-width: 1024px) {
      .story-grid { grid-template-columns: 1fr; }
      .timeline-pro { flex-direction: column; padding-top: 0; gap: 50px; }
      .timeline-line { display: none; }
      .timeline-item-pro { width: 100%; }
      .dot { left: -15px; top: 50%; transform: translateY(-50%); }
    }
    @media (max-width: 768px) {
      .mission-section { padding: 40px 24px; }
      .values-grid-pro { grid-template-columns: 1fr; }
      .main-title { font-size: 2.8rem; }
    }
  `]
})
export class BrandStoryComponent {}
