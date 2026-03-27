import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="contact-page animate-fade-in">
      <div class="hero-section text-center">
        <div class="container">
          <span class="pro-tag">Hỗ Trợ 24/7</span>
          <h1 class="luxury-font main-title">Kết Nối Với Đẳng Cấp</h1>
          <p class="subtitle">Đội ngũ chuyên gia của chúng tôi luôn sẵn sàng lắng nghe và hiện thực hóa mọi ý tưởng du lịch của bạn.</p>
        </div>
      </div>

      <div class="container contact-grid">
        <div class="contact-form-section glass-card">
          <h2 class="luxury-font mb-30">Gửi Yêu Cầu Tư Vấn</h2>
          <form class="pro-form">
            <div class="form-row">
               <div class="form-group">
                 <label>Họ và Tên</label>
                 <input type="text" placeholder="Nguyễn Văn A">
               </div>
               <div class="form-group">
                 <label>Email</label>
                 <input type="email" placeholder="example@gmail.com">
               </div>
            </div>
            <div class="form-group">
               <label>Dịch Vụ Quan Tâm</label>
               <select>
                 <option>Hành Trình AI cá nhân</option>
                 <option>Tour Độc Bản</option>
                 <option>Khách Sạn & Villa Luxury</option>
                 <option>Hợp tác kinh doanh</option>
               </select>
            </div>
            <div class="form-group">
               <label>Lời Nhắn Của Bạn</label>
               <textarea rows="5" placeholder="Bạn đang mơ ước về một chuyến đi như thế nào?"></textarea>
            </div>
            <button class="btn-gold w-full">GỬI YÊU CẦU NGAY</button>
          </form>
        </div>

        <div class="contact-info-section">
          <div class="info-card glass-card mb-30">
             <i class="fas fa-phone-alt gold-text mb-15"></i>
             <h3 class="luxury-font">Hotline Premium</h3>
             <p>0378460679 (Phục vụ 24/7)</p>
          </div>
          <div class="info-card glass-card mb-30">
             <i class="fas fa-envelope gold-text mb-15"></i>
             <h3 class="luxury-font">Email Phản Hồi</h3>
             <p>Ngmanhcuong2011@gmail.com</p>
          </div>
          <div class="info-card glass-card">
             <i class="fas fa-map-marker-alt gold-text mb-15"></i>
             <h3 class="luxury-font">Văn Phòng Đại Diện</h3>
             <p>Đại học CMC cơ sở vạn phúc Building</p>
          </div>
        </div>
      </div>

      <div class="container map-section mt-100">
         <div class="map-placeholder glass-card text-center">
            <i class="fas fa-map gold-text text-3xl mb-20"></i>
            <h3 class="luxury-font">Bản Đồ Chỉ Đường</h3>
            <p>Đang tải bản đồ tương tác...</p>
         </div>
      </div>
    </section>
  `,
  styles: [`
    .contact-page { padding: 120px 0 100px; background: var(--bg-primary); }
    .hero-section { padding: 80px 0; background: linear-gradient(to bottom, rgba(212, 175, 55, 0.05), transparent); margin-bottom: 60px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mb-30 { margin-bottom: 30px; }
    .mb-15 { margin-bottom: 15px; }
    .mt-100 { margin-top: 100px; }
    .w-full { width: 100%; }
    .gold-text { color: var(--gold-primary); font-size: 1.5rem; }

    .pro-tag { display: inline-block; background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); padding: 5px 15px; border-radius: 20px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 20px; }
    .main-title { font-size: 3.5rem; margin-bottom: 25px; }
    .subtitle { color: var(--text-secondary); font-size: 1.15rem; max-width: 700px; margin: 0 auto; }

    .contact-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 40px; }
    .contact-form-section { padding: 50px; }
    
    .pro-form { display: flex; flex-direction: column; gap: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .form-group label { color: var(--text-secondary); font-size: 0.85rem; font-weight: 500; }
    
    input, select, textarea { 
      background: rgba(255,255,255,0.03); border: 1px solid var(--glass-border); 
      padding: 12px 15px; border-radius: 10px; color: #fff; outline: none; transition: 0.3s;
    }
    input:focus, select:focus, textarea:focus { border-color: var(--gold-primary); background: rgba(255,255,255,0.06); }
    
    .info-card { text-align: center; padding: 35px; }
    .info-card h3 { font-size: 1.2rem; }
    .info-card p { color: rgba(255,255,255,0.7); font-size: 0.95rem; }

    .map-placeholder { padding: 100px 0; border: 1px dashed var(--glass-border); }

    @media (max-width: 1024px) {
      .contact-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 768px) {
      .main-title { font-size: 2.5rem; }
      .contact-form-section { padding: 30px; }
      .form-row { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactSupportComponent {}
