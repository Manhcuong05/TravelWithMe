import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-of-service',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="legal-page animate-fade-in">
      <div class="container">
        <div class="header-section text-center mb-80">
          <h1 class="luxury-font main-title">Điều Khoản Dịch Vụ</h1>
          <p class="subtitle gold-text">Hiệu lực từ: 28 tháng 03, 2026</p>
        </div>

        <div class="legal-content glass-card pro-shadow">
          <div class="section">
            <h2 class="luxury-font mb-20 section-title">1. Chấp Thuận Điều Khoản</h2>
            <p>Bằng việc truy cập và sử dụng dịch vụ của TravelWithMe, bạn đồng ý tuân thủ các điều khoản và điều kiện được nêu tại đây. Nếu bạn không đồng ý với bất kỳ phần nào của các điều khoản này, vui lòng không sử dụng dịch vụ của chúng tôi.</p>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">2. Dịch Vụ Của Chúng Tôi</h2>
             <p>TravelWithMe cung cấp nền tảng lập kế hoạch du lịch bằng AI, đặt tour, khách sạn và các dịch vụ liên quan. Chúng tôi cam kết cung cấp thông tin chính xác nhất nhưng không chịu trách nhiệm cho các thay đổi đột xuất từ phía nhà cung cấp thứ ba (hãng hàng không, khách sạn) nằm ngoài tầm kiểm soát của chúng tôi.</p>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">3. Trách Nhiệm Của Khách Hàng</h2>
             <ul class="legal-list">
                <li>Cung cấp thông tin cá nhân và hộ chiếu chính xác cho việc đặt chỗ.</li>
                <li>Tuân thủ các quy định về visa và nhập cảnh của nước sở tại.</li>
                <li>Thanh toán đúng hạn cho các dịch vụ đã đặt để đảm bảo giữ chỗ.</li>
                <li>Sử dụng hệ thống AI một cách văn minh, không spam hoặc khai thác lỗ hổng kỹ thuật.</li>
             </ul>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">4. Chính Sách Hủy Và Hoàn Tiền</h2>
             <p>Việc hủy và hoàn tiền phụ thuộc vào chính sách riêng của từng nhà cung cấp dịch vụ. TravelWithMe sẽ hỗ trợ khách hàng tối đa trong việc đàm phán hoàn tiền theo quy định pháp luật và hợp đồng đã ký kết.</p>
             <p><em>*Lưu ý: Các khoản phí dịch vụ AI và phí tư vấn chuyên gia thường không được hoàn lại.</em></p>
          </div>

          <div class="section">
             <h2 class="luxury-font mb-20 section-title">5. Giới Hạn Trách Nhiệm</h2>
             <p>TravelWithMe sẽ không chịu trách nhiệm cho bất kỳ thiệt hại gián tiếp, ngẫu nhiên hoặc do hậu quả phát sinh từ việc sử dụng dịch vụ, ngoại trừ các trường hợp được quy định rõ trong luật pháp Việt Nam và quốc tế.</p>
          </div>

           <div class="section contact-box text-center mt-50">
             <p>Mọi tranh chấp phát sinh sẽ được giải quyết hòa giải hoặc tại Tòa án có thẩm quyền theo Luật pháp Việt Nam.</p>
             <p class="gold-text font-bold">legal@travelwithme.luxury</p>
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
export class TermsOfServiceComponent {}
