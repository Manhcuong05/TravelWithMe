import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-brand-story',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="brand-story-page animate-fade-in">
      <div class="hero-section">
        <div class="container text-center">
          <span class="pro-tag">Kể Từ 2026</span>
          <h1 class="luxury-font main-title">Câu Chuyện Thương Hiệu</h1>
          <p class="subtitle">Kiến tạo những chuẩn mực mới trong làng du lịch xa xỉ toàn cầu.</p>
        </div>
      </div>

      <div class="container content-grid">
        <div class="glass-card main-story">
          <h2 class="luxury-font gold-text">Triết Lý Độc Bản</h2>
          <p>Tại TravelWithMe, chúng tôi không chỉ bán những chuyến đi. Chúng tôi kiến tạo những <strong>trải nghiệm độc bản</strong>, nơi mỗi chi tiết nhỏ nhất đều được đo ni đóng giày cho tâm hồn của lữ khách.</p>
          <p>Khởi nguồn từ khao khát mang đến sự thuần khiết trong từng hành trình, chúng tôi đã kết hợp trí tuệ nhân tạo tối tân cùng sự tinh tế của những chuyên gia hàng đầu để định nghĩa lại khái niệm "Nghỉ dưỡng".</p>
        </div>

        <div class="timeline-container">
          <h2 class="luxury-font text-center mb-50">Hành Trình Kiến Tạo</h2>
          <div class="timeline">
            <div class="timeline-item animate-slide-up">
              <div class="year gold-text luxury-font">2026</div>
              <div class="milestone glass-card">
                <h3>Khởi Đầu Hoài Bão</h3>
                <p>TravelWithMe chính thức ra mắt, đặt viên gạch đầu tiên cho đế chế du lịch công nghệ cao cấp.</p>
              </div>
            </div>
            <div class="timeline-item animate-slide-up">
              <div class="year gold-text luxury-font">2027</div>
              <div class="milestone glass-card">
                <h3>Đột Phá AI</h3>
                <p>Ra mắt trợ lý AI Itinerary, giúp hàng ngàn khách hàng cá nhân hóa hành trình trong tích tắc.</p>
              </div>
            </div>
            <div class="timeline-item animate-slide-up">
              <div class="year gold-text luxury-font">Tương Lai</div>
              <div class="milestone glass-card">
                <h3>Hệ Sinh Thái Toàn Cầu</h3>
                <p>Mở rộng mạng lưới đối tác độc quyền tại hơn 100 quốc gia, mang thế giới đến gần hơn với sự xa xỉ.</p>
              </div>
            </div>
          </div>
        </div>

        <div class="values-section mt-100">
          <div class="value-card glass-card text-center">
            <i class="fas fa-gem gold-text mb-20 text-3xl"></i>
            <h3 class="luxury-font">Tinh Hoa</h3>
            <p>Chỉ tuyển chọn những điểm đến và dịch vụ xuất sắc nhất thế giới.</p>
          </div>
          <div class="value-card glass-card text-center">
            <i class="fas fa-heart gold-text mb-20 text-3xl"></i>
            <h3 class="luxury-font">Tận Tâm</h3>
            <p>Phục vụ bằng trái tim và sự thấu hiểu sâu sắc nhu cầu khách hàng.</p>
          </div>
          <div class="value-card glass-card text-center">
            <i class="fas fa-shield-alt gold-text mb-20 text-3xl"></i>
            <h3 class="luxury-font">Bảo Mật</h3>
            <p>Sự riêng tư của bạn là ưu tiên hàng đầu trong mọi giao dịch.</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .brand-story-page { padding: 120px 0 100px; min-height: 100vh; background: var(--bg-primary); }
    .hero-section { padding: 80px 0; background: linear-gradient(to bottom, rgba(212, 175, 55, 0.05), transparent); margin-bottom: 60px; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mb-50 { margin-bottom: 50px; }
    .mt-100 { margin-top: 100px; }
    .mb-20 { margin-bottom: 20px; }
    .text-3xl { font-size: 2rem; }
    
    .pro-tag { display: inline-block; background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .main-title { font-size: 3.5rem; margin-bottom: 20px; }
    .subtitle { color: var(--text-secondary); font-size: 1.1rem; max-width: 600px; margin: 0 auto; }
    
    .glass-card { background: var(--glass-bg); backdrop-filter: blur(10px); border: 1px solid var(--glass-border); padding: 40px; border-radius: 20px; box-shadow: var(--glass-shadow); transition: transform 0.3s ease; }
    .glass-card:hover { transform: translateY(-5px); border-color: var(--gold-primary); }
    .gold-text { color: var(--gold-primary); }
    
    .main-story { margin-bottom: 80px; line-height: 1.8; font-size: 1.1rem; }
    .main-story h2 { font-size: 2.22rem; margin-bottom: 25px; }
    .main-story p { margin-bottom: 20px; color: rgba(255,255,255,0.8); }

    .timeline { position: relative; padding: 40px 0; }
    .timeline::before { content: ''; position: absolute; left: 50%; width: 1px; height: 100%; background: var(--glass-border); transform: translateX(-50%); }
    
    .timeline-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 60px; position: relative; }
    .timeline-item:nth-child(even) { flex-direction: row-reverse; }
    
    .year { font-size: 2rem; width: 45%; text-align: right; }
    .timeline-item:nth-child(even) .year { text-align: left; }
    .milestone { width: 45%; }
    .milestone h3 { margin-bottom: 10px; font-family: 'Playfair Display', serif; }

    .values-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
    
    @media (max-width: 768px) {
      .main-title { font-size: 2.5rem; }
      .timeline::before { left: 20px; }
      .timeline-item { flex-direction: column !important; align-items: flex-start; padding-left: 50px; }
      .year { width: 100%; text-align: left; margin-bottom: 10px; font-size: 1.5rem; }
      .milestone { width: 100%; }
      .values-section { grid-template-columns: 1fr; }
    }

    @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-up { animation: slideUp 0.8s ease-out forwards; }
  `]
})
export class BrandStoryComponent {}
