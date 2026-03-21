import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService, Flight } from '../../core/services/catalog.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-flight-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="checkout-page animate-fade-in" *ngIf="flight()">
      <div class="container">
        
        <div class="page-header text-center">
           <p class="text-gold tracking-widest uppercase text-sm font-bold mb-2">Trải Nghiệm Đẳng Cấp</p>
           <h1 class="luxury-font text-white text-4xl m-0">Hoàn Tất Đặt Vé Máy Bay</h1>
           <p class="text-gray mt-3">Sắp xong rồi! Vui lòng điền thông tin để giữ chỗ với mức giá tốt nhất.</p>
        </div>

        <div class="checkout-layout mt-5">
          <!-- Left Column: Forms -->
          <div class="checkout-main">
            
            <!-- Contact Info -->
            <div class="card glass-effect relative">
               <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-id-card text-gold"></i></div>
                 <h2 class="luxury-font">Thông tin liên hệ (Nhận vé/phiếu thanh toán)</h2>
               </div>
               
               <div class="card-body form-grid">
                 <div class="form-group full-width">
                   <label>Họ tên (Như trên CMND/CCCD, không dấu) <span class="text-error">*</span></label>
                   <input type="text" [(ngModel)]="contactName" placeholder="VD: NGUYEN VAN A" class="form-control">
                 </div>
                 
                 <div class="form-group half-width">
                   <label>Điện thoại di động <span class="text-error">*</span></label>
                   <div class="phone-input">
                     <span class="country-code">+84</span>
                     <input type="text" [(ngModel)]="contactPhone" placeholder="901234567" class="form-control pl-2">
                   </div>
                 </div>
                 
                 <div class="form-group half-width">
                   <label>Email <span class="text-error">*</span></label>
                   <input type="email" [(ngModel)]="contactEmail" placeholder="VD: email@example.com" class="form-control">
                 </div>
               </div>
            </div>

            <!-- Passenger Info -->
            <div class="card glass-effect relative">
               <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-user-friends text-gold"></i></div>
                 <h2 class="luxury-font">Thông tin hành khách</h2>
               </div>
               <div class="card-warning flex gap-3">
                  <div class="text-2xl">⚠️</div>
                  <div>
                    <strong class="text-gold">Quan trọng:</strong> Bạn phải điền tên bằng tiếng Anh không dấu, khớp tuyệt đối với giấy tờ tùy thân. Nếu phát hiện sai sót, hãng bay có thể từ chối vận chuyển.
                  </div>
               </div>
               
               <div class="card-body">
                 <ng-container *ngFor="let pax of passengers; let i = index">
                   <div class="pax-header flex items-center gap-2 mb-4 mt-6">
                     <span class="pax-badge">{{ i + 1 }}</span>
                     <h3 class="m-0 text-white font-bold text-lg">
                        {{ pax.type === 'ADULT' ? 'Người Lớn' : (pax.type === 'CHILD' ? 'Trẻ Em' : 'Em Bé') }}
                     </h3>
                   </div>
                   
                   <div class="form-grid">
                     <div class="form-group third-width">
                       <label>Danh xưng <span class="text-error">*</span></label>
                       <select [(ngModel)]="pax.title" class="form-control">
                         <option value="MR" *ngIf="pax.type === 'ADULT'">Ông (Mr)</option>
                         <option value="MRS" *ngIf="pax.type === 'ADULT'">Bà (Mrs)</option>
                         <option value="MISS" *ngIf="pax.type === 'ADULT'">Cô (Miss)</option>
                         <option value="MSTR" *ngIf="pax.type !== 'ADULT'">Bé trai (Mstr)</option>
                         <option value="MISS" *ngIf="pax.type !== 'ADULT'">Bé gái (Miss)</option>
                       </select>
                     </div>
                     
                     <div class="form-group third-width">
                       <label>Họ (VD: NGUYEN) <span class="text-error">*</span></label>
                       <input type="text" [(ngModel)]="pax.lastName" class="form-control uppercase" placeholder="NGUYEN">
                     </div>
                     
                     <div class="form-group third-width">
                       <label>Chữ đệm & Tên <span class="text-error">*</span></label>
                       <input type="text" [(ngModel)]="pax.firstName" class="form-control uppercase" placeholder="VAN A">
                     </div>
                     
                     <div class="form-group half-width">
                       <label>Ngày sinh <span class="text-error">*</span></label>
                       <input type="date" [(ngModel)]="pax.dob" class="form-control">
                     </div>
                     
                     <div class="form-group half-width">
                       <label>Quốc tịch <span class="text-error">*</span></label>
                       <select [(ngModel)]="pax.nationality" class="form-control">
                         <option value="VN">Việt Nam</option>
                         <option value="US">Hoa Kỳ</option>
                         <option value="UK">Vương Quốc Anh</option>
                       </select>
                     </div>
                   </div>
                 </ng-container>
               </div>
            </div>

            <!-- Amenities -->
            <div class="card glass-effect amenities-card">
               <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-suitcase-rolling text-gold"></i></div>
                 <h2 class="luxury-font">Tiện ích chuyến bay</h2>
               </div>
               
               <div class="card-body">
                 <!-- Baggage -->
                 <div class="amenity-item">
                   <div class="am-info">
                     <h4 class="text-lg font-bold text-white mb-1">Hành lý ký gửi</h4>
                     <p class="text-gray text-sm m-0">Mang theo mọi trang phục ưa thích của bạn với dịch vụ hành lý giá cực tốt.</p>
                   </div>
                   <div class="am-action">
                      <select [ngModel]="selectedBaggage()" (ngModelChange)="selectedBaggage.set($event)" class="form-control w-48">
                        <option [ngValue]="0">Không thêm (0 đ)</option>
                        <option [ngValue]="15">15kg - {{ 250000 | number }} đ</option>
                        <option [ngValue]="20">20kg - {{ 320000 | number }} đ</option>
                        <option [ngValue]="30">30kg - {{ 450000 | number }} đ</option>
                      </select>
                   </div>
                 </div>
                 
                 <!-- Meals -->
                 <div class="amenity-item mt-5 pt-5 border-top-dashed">
                   <div class="am-info">
                     <h4 class="text-lg font-bold text-white mb-1">Suất ăn nóng hổi</h4>
                     <p class="text-gray text-sm m-0">Tận hưởng thực đơn trên không đa dạng được chuẩn bị bởi đầu bếp 5 sao.</p>
                   </div>
                   <div class="am-action flex items-center">
                      <span class="text-gold font-bold mr-3">+ {{ 120000 | number }} đ</span>
                      <label class="toggle-switch">
                        <input type="checkbox" [ngModel]="selectedMeals()" (ngModelChange)="selectedMeals.set($event)">
                        <span class="slider"></span>
                      </label>
                   </div>
                 </div>
                 
                 <!-- Seats -->
                 <div class="amenity-item mt-5 pt-5 border-top-dashed border-none">
                   <div class="am-info">
                     <h4 class="text-lg font-bold text-white mb-1">Chọn ghế ngồi trước</h4>
                     <p class="text-gray text-sm m-0">Ngắm bình minh phía chân trời hay chỗ để chân rộng rãi? Bạn hoàn toàn có thể chọn.</p>
                   </div>
                   <div class="am-action flex items-center">
                      <span class="text-gold font-bold mr-3">+ {{ 42000 | number }} đ</span>
                      <label class="toggle-switch">
                        <input type="checkbox" [ngModel]="selectedSeat()" (ngModelChange)="selectedSeat.set($event)">
                        <span class="slider"></span>
                      </label>
                   </div>
                 </div>
               </div>
            </div>

            <!-- Insurance -->
            <div class="card glass-effect relative">
               <div class="card-header flex items-center gap-3">
                 <div class="icon-circle"><i class="fas fa-shield-alt text-gold"></i></div>
                 <h2 class="luxury-font">Bảo hiểm du lịch toàn diện</h2>
               </div>
               
               <div class="card-body">
                 <div class="insurance-item" [class.selected]="selectedInsurance()">
                    <div class="ins-check mt-1">
                      <label class="custom-checkbox">
                        <input type="checkbox" [ngModel]="selectedInsurance()" (ngModelChange)="selectedInsurance.set($event)">
                        <span class="checkmark"></span>
                      </label>
                    </div>
                    <div class="ins-details flex-1">
                      <h4 class="text-lg text-white font-bold mb-2">Gói Bảo Hiểm Trì Hoãn & Hành Lý</h4>
                      <ul class="ins-list text-gray text-sm m-0 p-0" style="list-style: none;">
                         <li><i class="fas fa-check text-gold mr-2"></i>Nhận ngay bồi thường nếu chuyến bay hoãn quá 120 phút.</li>
                         <li><i class="fas fa-check text-gold mr-2"></i>Bồi thường thất lạc/hư hỏng hành lý lên đến 20,000,000 VNĐ.</li>
                         <li><i class="fas fa-check text-gold mr-2"></i>Quy trình xét duyệt tự động, không rườm rà giấy tờ.</li>
                      </ul>
                      <a class="text-gold text-sm font-bold tracking-wide uppercase mt-2 inline-block hover:underline cursor-pointer">Chi Tiết Quyền Lợi</a>
                    </div>
                    <div class="ins-price text-right shrink-0">
                       <div class="text-xl font-bold text-white">60,500 đ</div>
                       <div class="text-xs text-gray uppercase tracking-widest mt-1">/ Hành khách</div>
                    </div>
                 </div>
                 
                 <div class="submit-action mt-8 flex justify-end">
                    <button class="btn-primary w-full md-w-auto px-10 luxury-font flex gap-3 items-center justify-center" [disabled]="submitting()" (click)="submitBooking()">
                      <span>{{ submitting() ? 'Hệ thống đang xử lý...' : 'Tiến Hành Thanh Toán' }}</span>
                      <i class="fas fa-arrow-right" *ngIf="!submitting()"></i>
                      <i class="fas fa-spinner fa-spin" *ngIf="submitting()"></i>
                    </button>
                 </div>
                 
               </div>
            </div>
            
          </div>
          
          <!-- Right Column: Summary -->
          <div class="checkout-sidebar">
             <div class="stick-top-wrapper">
               
               <!-- Flight Summary -->
               <div class="card glass-effect sidebar-card">
                  <div class="card-header border-bottom flex-between py-4 px-5 bg-dark-gradient">
                    <h3 class="luxury-font m-0 text-lg">Hành Trình</h3>
                    <a class="text-gold text-sm uppercase tracking-wide font-bold hover:underline cursor-pointer" (click)="goBack()">Thay Đổi</a>
                  </div>
                  <div class="card-body p-5">
                    
                    <div class="airline-badges flex gap-2 mb-4">
                       <span class="tag-gold shadow-gold-sm"><i class="fas fa-plane mr-1"></i> {{ flight()?.airline }}</span>
                       <span class="tag-outline">{{ ticketClassName() }}</span>
                    </div>

                    <div class="flight-route-detailed p-4 rounded-xl mb-4">
                      <div class="flex-between items-end">
                        <div class="city-node text-left">
                          <div class="text-xs text-gray uppercase tracking-wider mb-1">Khởi hành</div>
                          <div class="text-2xl font-bold luxury-font text-white">{{ flight()?.departureTime | date:'HH:mm' }}</div>
                          <div class="text-sm font-medium mt-1">{{ flight()?.departureCity }}</div>
                          <div class="text-xs text-gray mt-1">{{ flight()?.departureTime | date:'dd/MM/yyyy' }}</div>
                        </div>
                        
                        <div class="flight-duration flex-1 mx-4 text-center pb-6 relative">
                          <div class="text-xs text-gold font-bold bg-dark px-2 inline-block relative z-10">{{ getDuration(flight()!) }}</div>
                          <div class="dashed-line-animated">
                             <div class="airplane-icon"><i class="fas fa-plane"></i></div>
                          </div>
                          <div class="text-[10px] uppercase tracking-widest text-gray mt-1 relative z-10 bg-dark px-1 inline-block" style="font-size: 10px;">Bay Thẳng</div>
                        </div>

                        <div class="city-node text-right">
                          <div class="text-xs text-gray uppercase tracking-wider mb-1">Đến nơi</div>
                          <div class="text-2xl font-bold luxury-font text-white">{{ flight()?.arrivalTime | date:'HH:mm' }}</div>
                          <div class="text-sm font-medium mt-1">{{ flight()?.arrivalCity }}</div>
                          <div class="text-xs text-gray mt-1">{{ flight()?.arrivalTime | date:'dd/MM/yyyy' }}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div class="features-list text-sm text-gray flex flex-col gap-2 mt-4 pt-4 border-top-dashed">
                       <div class="flex items-center gap-2"><i class="fas fa-check-circle text-gold"></i> Đã bao gồm thuế, phí, lệ phí</div>
                       <div class="flex items-center gap-2"><i class="fas fa-check-circle text-gold"></i> Hành lý xách tay 7kg</div>
                       <div class="flex items-center gap-2"><i class="fas fa-exchange-alt text-gold"></i> Được phép hoàn/đổi lịch bay (có phí)</div>
                    </div>
                  </div>
               </div>
               
               <!-- Price Summary -->
               <div class="card glass-effect sidebar-card">
                <div class="card-header border-bottom py-4 px-5 bg-dark-gradient">
                  <h3 class="luxury-font m-0 text-lg">Chi Tiết Giá</h3>
                </div>
                <div class="card-body p-5">
                  <div class="price-breakdown">
                    <div class="price-row" *ngIf="adults > 0">
                       <span class="price-label">Người lớn (x{{ adults }})</span>
                       <span class="price-dotted"></span>
                       <span class="price-value">{{ adults * (flightClass()?.priceAdult || 0) | number }} đ</span>
                    </div>
                    
                    <div class="price-row" *ngIf="children > 0">
                       <span class="price-label">Trẻ em (x{{ children }})</span>
                       <span class="price-dotted"></span>
                       <span class="price-value">{{ children * (flightClass()?.priceChild || 0) | number }} đ</span>
                    </div>

                    <div class="price-row" *ngIf="infants > 0">
                       <span class="price-label">Em bé (x{{ infants }})</span>
                       <span class="price-dotted"></span>
                       <span class="price-value">{{ infants * (flightClass()?.priceInfant || 0) | number }} đ</span>
                    </div>
                    
                    <div class="price-row" *ngIf="baggagePrice() > 0">
                       <span class="price-label text-gold"><i class="fas fa-suitcase mr-1"></i> Hành lý {{ selectedBaggage() }}kg</span>
                       <span class="price-dotted"></span>
                       <span class="price-value text-gold">{{ baggagePrice() | number }} đ</span>
                    </div>
                    
                    <div class="price-row" *ngIf="selectedMeals()">
                       <span class="price-label text-gold"><i class="fas fa-utensils mr-1"></i> Suất ăn nóng</span>
                       <span class="price-dotted"></span>
                       <span class="price-value text-gold">120,000 đ</span>
                    </div>
                    
                    <div class="price-row" *ngIf="selectedSeat()">
                       <span class="price-label text-gold"><i class="fas fa-chair mr-1"></i> Chỗ ngồi ưu tiên</span>
                       <span class="price-dotted"></span>
                       <span class="price-value text-gold">42,000 đ</span>
                    </div>
                    
                    <div class="price-row" *ngIf="selectedInsurance()">
                       <span class="price-label text-gold"><i class="fas fa-shield-alt mr-1"></i> Bảo hiểm Flexi (x{{ adults + children }})</span>
                       <span class="price-dotted"></span>
                       <span class="price-value text-gold">{{ (adults + children) * 60500 | number }} đ</span>
                    </div>
                  </div>
                  
                  <div class="total-block mt-5">
                     <div class="flex-between items-end">
                       <span class="text-sm text-gray uppercase font-bold tracking-widest">Tổng Thanh Toán</span>
                       <span class="text-2xl font-bold luxury-font text-gold text-shadow-gold">{{ totalPrice() | number }} đ</span>
                     </div>
                     <div class="text-right text-gray mt-1 line-height-1" style="font-size: 11px;">Giá cuối cùng đã bao gồm mọi khoản phụ phí.</div>
                  </div>
                 </div>
               </div>
               
             </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Utilities */
    .text-gold { color: var(--gold-primary, #d4af37); }
    .text-white { color: #ffffff; }
    .text-gray { color: #8b9bb4; }
    .text-error { color: #ff4d4f; }
    .tracking-widest { letter-spacing: 0.1em; }
    .tracking-wider { letter-spacing: 0.05em; }
    .tracking-wide { letter-spacing: 0.025em; }
    .uppercase { text-transform: uppercase; }
    .font-bold { font-weight: 700; }
    .font-medium { font-weight: 500; }
    .text-sm { font-size: 0.875rem; }
    .text-xs { font-size: 0.75rem; }
    .text-lg { font-size: 1.125rem; }
    .text-xl { font-size: 1.25rem; }
    .text-2xl { font-size: 1.5rem; }
    .text-4xl { font-size: 2.25rem; }
    .m-0 { margin: 0; }
    .mt-1 { margin-top: 0.25rem; }
    .mt-2 { margin-top: 0.5rem; }
    .mt-3 { margin-top: 0.75rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-5 { margin-top: 1.25rem; }
    .mt-8 { margin-top: 2rem; }
    .mb-1 { margin-bottom: 0.25rem; }
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mr-1 { margin-right: 0.25rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mr-3 { margin-right: 0.75rem; }
    .pl-2 { padding-left: 0.5rem; }
    .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-5 { padding-left: 1.25rem; padding-right: 1.25rem; }
    .px-10 { padding-left: 2.5rem; padding-right: 2.5rem; }
    .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
    .p-4 { padding: 1rem; }
    .p-5 { padding: 1.25rem; }
    .pt-4 { padding-top: 1rem; }
    .pt-5 { padding-top: 1.25rem; }
    .pb-6 { padding-bottom: 1.5rem; }
    .w-48 { width: 12rem; }
    .w-full { width: 100%; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .items-center { align-items: center; }
    .items-end { align-items: flex-end; }
    .justify-center { justify-content: center; }
    .justify-end { justify-content: flex-end; }
    .flex-between { display: flex; justify-content: space-between; align-items: center; }
    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .flex-1 { flex: 1 1 0%; }
    .shrink-0 { flex-shrink: 0; }
    .inline-block { display: inline-block; }
    .relative { position: relative; }
    .z-10 { z-index: 10; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    .text-right { text-align: right; }
    .text-shadow-gold { text-shadow: 0 0 15px rgba(212,175,55,0.4); }
    .shadow-gold-sm { box-shadow: 0 4px 10px rgba(212,175,55,0.2); }
    .rounded-xl { border-radius: 0.75rem; }
    .bg-dark { background-color: #0b0f19; }
    .bg-dark-gradient { background: linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1)); }
    .hover\\:underline:hover { text-decoration: underline; }
    .cursor-pointer { cursor: pointer; }
    .line-height-1 { line-height: 1.2; }

    /* Core Layout */
    .checkout-page { padding: 120px 0 100px 0; background-color: transparent; min-height: 100vh; }
    .checkout-layout { display: flex; gap: 32px; align-items: flex-start; }
    .checkout-main { flex: 1; display: flex; flex-direction: column; gap: 28px; }
    .checkout-sidebar { width: 400px; flex-shrink: 0; }
    .stick-top-wrapper { position: sticky; top: 100px; display: flex; flex-direction: column; gap: 24px; }
    
    /* Premium Cards */
    .card.glass-effect {
      background: linear-gradient(145deg, rgba(26, 31, 44, 0.85) 0%, rgba(15, 19, 28, 0.95) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      overflow: hidden;
      transition: border-color 0.3s ease;
    }
    .card.glass-effect:hover { border-color: rgba(212, 175, 55, 0.3); }
    
    .card-header { padding: 22px 28px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .card-header h2 { font-size: 1.35rem; margin: 0; color: #fff; }
    .card-body { padding: 28px; }
    .border-bottom { border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
    .border-top-dashed { border-top: 1px dashed rgba(255, 255, 255, 0.1); }
    
    .icon-circle { width: 40px; height: 40px; border-radius: 50%; background: rgba(212, 175, 55, 0.1); display: flex; align-items: center; justify-content: center; font-size: 1.1rem; border: 1px solid rgba(212, 175, 55, 0.2); }
    
    /* Alerts */
    .card-warning {
      background: linear-gradient(to right, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.02) 100%);
      border-left: 4px solid var(--gold-primary);
      padding: 16px 28px; font-size: 0.9rem; color: #d1d5db; line-height: 1.5;
    }
    
    /* Forms */
    .form-grid { display: flex; flex-wrap: wrap; gap: 24px; }
    .form-group { display: flex; flex-direction: column; gap: 8px; }
    .full-width { width: 100%; }
    .half-width { width: calc(50% - 12px); }
    .third-width { width: calc(33.333% - 16px); }
    
    .form-group label {
      font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #8b9bb4;
    }
    .form-control {
      background: rgba(8, 11, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px 18px; border-radius: 12px;
      font-size: 1rem; color: #fff; line-height: 1.5;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .form-control::placeholder { color: rgba(255,255,255,0.2); }
    .form-control:focus {
      border-color: var(--gold-primary); background: rgba(0, 0, 0, 0.5);
      box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1); outline: none;
    }
    select.form-control { appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%238b9bb4' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10l-5 5z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 15px center; }
    
    .phone-input { display: flex; gap: 12px; }
    .country-code { background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(255, 255, 255, 0.08); padding: 14px 18px; border-radius: 12px; font-weight: 600; color: #fff; width: 75px; text-align: center; }
    
    .pax-badge { width: 28px; height: 28px; border-radius: 8px; background: var(--gold-primary); color: #000; display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 0.9rem; }
    
    /* Custom Checkbox */
    .custom-checkbox { display: block; position: relative; padding-left: 28px; cursor: pointer; user-select: none; }
    .custom-checkbox input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }
    .checkmark { position: absolute; top: 0; left: 0; height: 22px; width: 22px; background-color: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; transition: all 0.2s; }
    .custom-checkbox:hover input ~ .checkmark { border-color: var(--gold-primary); }
    .custom-checkbox input:checked ~ .checkmark { background-color: var(--gold-primary); border-color: var(--gold-primary); }
    .checkmark:after { content: ""; position: absolute; display: none; }
    .custom-checkbox input:checked ~ .checkmark:after { display: block; }
    .custom-checkbox .checkmark:after { left: 7px; top: 3px; width: 6px; height: 12px; border: solid #000; border-width: 0 2px 2px 0; transform: rotate(45deg); }

    /* Toggle Switch iOS style */
    .toggle-switch { position: relative; display: inline-block; width: 52px; height: 28px; }
    .toggle-switch input { opacity: 0; width: 0; height: 0; }
    .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0,0,0,0.5); transition: .4s; border-radius: 34px; border: 1px solid rgba(255,255,255,0.1); }
    .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 3px; background-color: #8b9bb4; transition: .4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border-radius: 50%; }
    input:checked + .slider { background-color: rgba(212,175,55,0.2); border-color: var(--gold-primary); }
    input:checked + .slider:before { transform: translateX(24px); background-color: var(--gold-primary); box-shadow: 0 2px 8px rgba(212,175,55,0.5); }
    
    /* Interactive Items */
    .amenity-item { display: flex; justify-content: space-between; align-items: flex-start; }
    
    .insurance-item { display: flex; gap: 20px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); padding: 24px; border-radius: 16px; transition: all 0.3s; }
    .insurance-item:hover { border-color: rgba(255,255,255,0.15); background: rgba(0,0,0,0.3); }
    .insurance-item.selected { border-color: var(--gold-primary); background: rgba(212,175,55,0.08); box-shadow: 0 4px 20px rgba(0,0,0,0.2); }
    .ins-list li { padding-bottom: 8px; }
    
    /* Sidebar Details */
    .tag-gold { background: var(--gold-primary); color: #000; border-radius: 6px; padding: 4px 10px; font-weight: 700; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.5px; }
    .tag-outline { border: 1px solid rgba(255,255,255,0.2); color: #fff; border-radius: 6px; padding: 4px 10px; font-weight: 600; font-size: 0.75rem; text-transform: uppercase; background: rgba(255,255,255,0.05); }
    
    .flight-route-detailed { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); box-shadow: inset 0 2px 10px rgba(0,0,0,0.2); }
    .dashed-line-animated { height: 2px; background-image: linear-gradient(to right, rgba(212,175,55,1) 50%, rgba(212,175,55,0) 0%); background-position: bottom; background-size: 10px 2px; background-repeat: repeat-x; width: 100%; position: absolute; bottom: 20px; left: 0; }
    .airplane-icon { position: absolute; right: -8px; top: -14px; color: var(--gold-primary); font-size: 1.2rem; background: #131720; padding-left: 5px; }
    
    /* Price Breakdown */
    .price-row { display: flex; align-items: flex-end; width: 100%; margin-bottom: 14px; }
    .price-label { font-size: 0.95rem; color: #a4b1cd; max-width: 65%; line-height: 1.4; }
    .price-dotted { flex: 1; border-bottom: 1px dotted rgba(255,255,255,0.15); margin: 0 12px 6px 12px; }
    .price-value { font-weight: 600; font-size: 1.05rem; text-align: right; }
    
    .total-block { background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(0,0,0,0.3)); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 16px; padding: 22px; box-shadow: inset 0 0 20px rgba(0,0,0,0.2); }
    
    /* Master Button */
    .btn-primary { 
        background: linear-gradient(135deg, #dfc15a 0%, #c49a20 100%); 
        color: #0b0f19; border: none; padding: 18px 36px; border-radius: 14px; 
        font-size: 1.15rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; 
        cursor: pointer; transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1); 
        box-shadow: 0 6px 20px rgba(212, 175, 55, 0.35), inset 0 1px 0 rgba(255,255,255,0.4); 
    }
    .btn-primary:not(:disabled):hover { transform: translateY(-3px); box-shadow: 0 10px 30px rgba(212, 175, 55, 0.5), inset 0 1px 0 rgba(255,255,255,0.5); }
    .btn-primary:not(:disabled):active { transform: translateY(0); box-shadow: 0 4px 15px rgba(212, 175, 55, 0.4); }
    .btn-primary:disabled { background: #4a4a4a; color: #888; box-shadow: none; cursor: not-allowed; }
    
    .md-w-auto { width: auto; }
    
    @media (max-width: 992px) {
      .checkout-layout { flex-direction: column; }
      .checkout-sidebar { width: 100%; }
      .form-group.half-width { width: 100%; }
      .form-group.third-width { width: 100%; }
      .btn-primary.md-w-auto { width: 100%; }
      .checkout-page { padding: 100px 15px 80px 15px; }
      .card-body, .card-header { padding: 16px; }
    }
  `]
})
export class FlightCheckoutComponent implements OnInit {
  flight = signal<Flight | null>(null);

  flightId = '';
  classId = '';

  adults = 1;
  children = 0;
  infants = 0;

  // Forms
  contactName = '';
  contactPhone = '';
  contactEmail = '';

  passengers: any[] = [];

  // Addons Signals
  selectedBaggage = signal<number>(0);
  selectedMeals = signal<boolean>(false);
  selectedSeat = signal<boolean>(false);
  selectedInsurance = signal<boolean>(true);

  submitting = signal(false);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private catalogService = inject(CatalogService);
  private bookingService = inject(BookingService);

  flightClass = computed(() => {
    const f = this.flight();
    if (!f || !f.flightClasses) return null;
    return f.flightClasses.find(c => c.id === this.classId) || null;
  });

  basePrice = computed(() => {
    const fc = this.flightClass();
    if (!fc) return 0;
    return (this.adults * fc.priceAdult) +
      (this.children * fc.priceChild) +
      (this.infants * fc.priceInfant);
  });

  ticketClassName = computed(() => {
    const fc = this.flightClass();
    return fc ? fc.className : 'Khác';
  });

  baggagePrice = computed(() => {
    const w = this.selectedBaggage();
    if (w === 15) return 250000;
    if (w === 20) return 320000;
    if (w === 30) return 450000;
    return 0;
  });

  totalPrice = computed(() => {
    let total = this.basePrice();
    // applied for the whole booking (simplification for UI)
    total += this.baggagePrice();
    if (this.selectedMeals()) total += 120000;
    if (this.selectedSeat()) total += 42000;
    if (this.selectedInsurance()) total += ((this.adults + this.children) * 60500);
    return total;
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.flightId = params['flightId'];
      this.classId = params['classId'];
      this.adults = parseInt(params['adults'] || '1');
      this.children = parseInt(params['children'] || '0');
      this.infants = parseInt(params['infants'] || '0');

      if (!this.flightId) {
        this.goBack();
        return;
      }

      // Initialize passenger arrays
      this.passengers = [];
      for (let i = 0; i < this.adults; i++) this.passengers.push({ type: 'ADULT', title: 'MR', firstName: '', lastName: '', dob: '', nationality: 'VN' });
      for (let i = 0; i < this.children; i++) this.passengers.push({ type: 'CHILD', title: 'MSTR', firstName: '', lastName: '', dob: '', nationality: 'VN' });
      for (let i = 0; i < this.infants; i++) this.passengers.push({ type: 'INFANT', title: 'MSTR', firstName: '', lastName: '', dob: '', nationality: 'VN' });

      this.catalogService.getFlight(this.flightId).subscribe({
        next: (res) => {
          if (res && res.success && res.data) {
            this.flight.set(res.data);
          } else {
            this.goBack();
          }
        },
        error: (err) => {
          console.error('Lỗi khi tải chuyến bay:', err);
          alert('Chuyến bay không tồn tại hoặc có lỗi kết nối.');
          this.goBack();
        }
      });
    });
  }

  getDuration(f: Flight): string {
    const da = new Date(f.departureTime).getTime();
    const db = new Date(f.arrivalTime).getTime();
    const diff = db - da;
    const h = Math.floor(diff / (1000 * 60 * 60));
    const m = Math.floor((diff / (1000 * 60)) % 60);
    return `${h}h${m > 0 ? ' ' + m + 'm' : ''}`;
  }

  goBack() {
    this.router.navigate(['/flights']);
  }

  submitBooking() {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // Trim values
    this.contactName = this.contactName.trim();
    this.contactPhone = this.contactPhone.trim();
    this.contactEmail = this.contactEmail.trim();

    if (!this.contactName || !this.contactPhone || !this.contactEmail) {
      alert("Vui lòng điền đủ thông tin liên hệ");
      return;
    }

    if (!emailRegex.test(this.contactEmail)) {
      alert("Email không đúng định dạng. VD: travel@example.com");
      return;
    }

    // Check passengers
    for (let p of this.passengers) {
      p.lastName = (p.lastName || "").trim();
      p.firstName = (p.firstName || "").trim();
      if (!p.lastName || !p.firstName || !p.dob) {
        alert("Vui lòng điền đủ Họ tên và Ngày sinh cho tất cả hành khách");
        return;
      }
    }

    this.submitting.set(true);

    const bookingRequest: any = {
      items: [{
        type: 'FLIGHT',
        serviceId: this.flightId,
        subServiceId: this.classId,
        quantity: 1,
        adults: this.adults,
        children: this.children,
        infants: this.infants
      }],
      contact: {
        name: this.contactName,
        phone: this.contactPhone,
        email: this.contactEmail
      },
      passengers: this.passengers.map(p => ({
        title: p.title,
        lastName: p.lastName,
        firstName: p.firstName,
        dob: p.dob || "",
        nationality: p.nationality
      })),
      addons: {
        baggage: this.selectedBaggage(),
        meals: this.selectedMeals(),
        seat: this.selectedSeat(),
        insurance: this.selectedInsurance()
      }
    };

    console.log('Sending Booking Request:', bookingRequest);

    this.bookingService.createBooking(bookingRequest).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.router.navigate(['/bookings', res.data.id]);
        } else {
          alert("Lỗi khi tạo đơn hàng: " + (res.message || "Vui lòng kiểm tra lại thông tin"));
          this.submitting.set(false);
        }
      },
      error: (err) => {
        console.error('Booking Error Details:', err);
        const serverError = err?.error?.message || "Lỗi dữ liệu. Vui lòng kiểm tra lại định dạng email và thông tin hành khách.";
        alert("Thất bại: " + serverError);
        this.submitting.set(false);
      }
    });
  }
}
