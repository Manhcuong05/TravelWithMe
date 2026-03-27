import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="legal-page animate-fade-in">
      <div class="container">
        <div class="header-section text-center mb-80">
          <h1 class="luxury-font main-title">Chính Sách Bảo Mật</h1>
          <p class="subtitle gold-text">Cập nhật lần cuối: 28 tháng 03, 2026</p>
        </div>

        <div class="legal-content glass-card pro-shadow">
          <div class="section">
            <h2 class="luxury-font mb-20 section-title">1. Giới Thiệu</h2>
            <p>Tại TravelWithMe, sự riêng tư và bảo mật thông tin của khách hàng là ưu tiên hàng đầu. Chính sách này mô tả cách chúng tôi thu thập, sử dụng và bảo vệ thông tin cá nhân của bạn khi bạn sử dụng dịch vụ của chúng tôi.</p>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">2. Thông Tin Thu Thập</h2>
             <p>Chúng tôi chỉ thu thập những thông tin cần thiết để cung cấp dịch vụ tốt nhất cho bạn:</p>
             <ul class="legal-list">
               <li>Thông tin định danh: Họ tên, hộ chiếu, ngày sinh.</li>
               <li>Thông tin liên lạc: Email, số điện thoại, địa chỉ.</li>
               <li>Thông tin hành trình: Sở thích du lịch, lịch sử tìm kiếm từ AI.</li>
               <li>Thông tin thanh toán: Được mã hóa và xử lý qua các cổng thanh toán quốc tế an toàn.</li>
             </ul>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">3. Cách Chúng Tôi Sử Dụng Thông Tin</h2>
             <p>Thông tin của bạn được sử dụng để:</p>
             <ul class="legal-list">
                <li>Xử lý đặt phòng, đặt tour và dịch vụ hàng không.</li>
                <li>Cá nhân hóa các gợi ý từ hệ thống trí tuệ nhân tạo (AI).</li>
                <li>Gửi thông báo về hành trình và các ưu đãi độc quyền.</li>
                <li>Cải thiện chất lượng dịch vụ và bảo mật hệ thống.</li>
             </ul>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">4. Cam Kết Bảo Mật</h2>
             <p>Chúng tôi áp dụng các tiêu chuẩn bảo mật tiên tiến nhất (SSL/TLS mã hóa 256-bit) để đảm bảo dữ liệu của bạn không bao giờ bị rò rỉ hoặc truy cập trái phép. TravelWithMe <strong>không bao giờ</strong> bán thông tin cá nhân của bạn cho bên thứ ba.</p>
          </div>

          <div class="section contact-box text-center mt-50">
             <p>Nếu có bất kỳ thắc mắc nào về chính sách này, vui lòng liên hệ:</p>
             <p class="gold-text font-bold">Ngmanhcuong2011@gmail.com</p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .legal-page { padding: 150px 0 100px; background: var(--bg-primary); min-height: 100vh; }
    .container { max-width: 900px; margin: 0 auto; padding: 0 24px; }
    .text-center { text-align: center; }
    .mb-80 { margin-bottom: 80px; }
    .mb-20 { margin-bottom: 20px; }
    .mt-50 { margin-top: 50px; }
    .gold-text { color: var(--gold-primary); }
    
    .main-title { font-size: 3.5rem; margin-bottom: 10px; }
    .subtitle { font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase; }

    .legal-content { padding: 60px; line-height: 1.8; color: rgba(255,255,255,0.8); }
    .section { margin-bottom: 50px; }
    .section-title { font-size: 2rem; border-bottom: 1px solid rgba(212, 175, 55, 0.2); display: inline-block; padding-bottom: 5px; margin-bottom: 25px !important; }
    
    .legal-list { list-style: none; padding-left: 0; margin-top: 15px; }
    .legal-list li { margin-bottom: 12px; position: relative; padding-left: 25px; }
    .legal-list li::before { content: '•'; position: absolute; left: 0; color: var(--gold-primary); font-size: 1.5rem; line-height: 1; }

    .contact-box { background: rgba(255,255,255,0.02); padding: 30px; border-radius: 15px; border: 1px dashed rgba(212, 175, 55, 0.3); }

    @media (max-width: 768px) {
      .main-title { font-size: 2.5rem; }
      .legal-content { padding: 30px; }
      .section-title { font-size: 1.5rem; }
    }
  `]
})
export class PrivacyPolicyComponent { }
