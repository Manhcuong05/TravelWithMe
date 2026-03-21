import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CatalogService, Flight } from '../../core/services/catalog.service';
import { BookingService } from '../../core/services/booking.service';

@Component({
  selector: 'app-flight-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="flight-page">
      <!-- Hero & Search Widget -->
      <div class="search-hero">
        <div class="hero-bg"></div>
        <div class="container hero-content relative z-10">
          <h1 class="hero-title luxury-font">Tìm & Đặt Vé Máy Bay Hạng Thượng Lưu</h1>
          
          <!-- Search Widget -->
          <div class="search-widget glass-effect">
            <div class="widget-header">
              <div class="trip-types">
                <button class="type-btn active">Một chiều</button>
                <button class="type-btn">Khứ hồi</button>
                <button class="type-btn">Nhiều thành phố</button>
              </div>
              <div class="passenger-class">
                <span class="pc-divider">|</span>
                <span>Phổ thông</span>
              </div>
            </div>
            
            <div class="widget-body">
              <div class="search-inputs">
                <div class="input-group">
                  <label>Từ</label>
                  <input type="text" placeholder="Thành phố đi..." [(ngModel)]="searchDeparture">
                </div>
                <div class="swap-icon" (click)="swapLocations()">⇄</div>
                <div class="input-group">
                  <label>Đến</label>
                  <input type="text" placeholder="Thành phố đến..." [(ngModel)]="searchArrival">
                </div>
                <div class="input-group">
                  <label>Ngày khởi hành</label>
                  <input type="date" [(ngModel)]="searchDate">
                </div>
                <button class="btn-search luxury-font" (click)="search()">Tìm Kiếm</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content: Filters & Results -->
      <div class="container main-layout">
        <!-- Left Sidebar: Filters -->
        <aside class="filters-sidebar">
          <div class="filter-card glass-effect">
            <div class="filter-header">
              <h3 class="luxury-font">Bộ Lọc</h3>
              <button class="btn-clear text-gold">Đặt lại</button>
            </div>
            
            <div class="filter-section border-bottom">
              <h4>Số điểm dừng</h4>
              <label class="checkbox-container">
                <input type="checkbox" [checked]="selectedStops().has('DIRECT')" (change)="toggleStop('DIRECT')">
                <span class="checkmark"></span>
                Bay thẳng
              </label>
              <label class="checkbox-container">
                <input type="checkbox" [checked]="selectedStops().has('1_STOP')" (change)="toggleStop('1_STOP')">
                <span class="checkmark"></span>
                1 điểm dừng
              </label>
            </div>

            <div class="filter-section border-bottom" *ngIf="availableAirlines().length > 0">
              <h4>Hãng hàng không</h4>
              <label class="checkbox-container" *ngFor="let airline of availableAirlines()">
                <input type="checkbox" [checked]="selectedAirlines().has(airline)" (change)="toggleAirline(airline)">
                <span class="checkmark"></span>
                {{ airline }}
              </label>
            </div>
          </div>
        </aside>

        <!-- Right Side: Flight Results -->
        <main class="flight-results">
            <div *ngIf="loading()" class="loading-text luxury-font">Đang tìm kiếm những hành trình tuyệt mỹ...</div>
            
            <!-- Sorting bar -->
            <div class="sorting-bar glass-effect" *ngIf="!loading()">
                <div class="sort-option" [class.active]="sortOption() === 'PRICE'" (click)="setSort('PRICE')">
                  <span class="label">Giá thấp nhất</span>
                  <span class="val text-gold">{{ lowestPrice() | number }} VNĐ</span>
                </div>
                <div class="sort-option" [class.active]="sortOption() === 'DURATION'" (click)="setSort('DURATION')">
                  <span class="label">Thời gian bay ngắn nhất</span>
                  <span class="val text-gold">{{ shortestDuration() }}</span>
                </div>
            </div>

            <div class="flight-list" *ngIf="!loading()">
              <div *ngFor="let flight of filteredFlights()" class="flight-card glass-effect hover-up">
                 <div class="flight-card-inner">
                    <div class="fc-airline">
                        <div class="logo luxury-font">{{ flight.airline[0] }}</div>
                        <div>
                          <div class="fc-airline-name">{{ flight.airline }}</div>
                          <div class="fc-flight-num">{{ flight.flightNumber }}</div>
                        </div>
                    </div>
                    
                    <div class="fc-timeline">
                        <div class="fc-time-block">
                            <div class="fc-time">{{ flight.departureTime | date:'HH:mm' }}</div>
                            <div class="fc-city">{{ flight.departureCity }}</div>
                        </div>
                        <div class="fc-duration-block">
                            <div class="fc-duration">{{ getDuration(flight) }}</div>
                            <div class="fc-line">
                               <span class="fc-plane-icon">✈</span>
                            </div>
                            <div class="fc-stop-type">Bay thẳng</div>
                        </div>
                        <div class="fc-time-block left">
                            <div class="fc-time">{{ flight.arrivalTime | date:'HH:mm' }}</div>
                            <div class="fc-city">{{ flight.arrivalCity }}</div>
                        </div>
                    </div>
                    
                    <div class="fc-action">
                        <div class="fc-price">{{ flight.basePrice | number }} <small>VNĐ</small></div>
                        <button class="btn-select" (click)="selectFlight(flight)">Chọn</button>
                    </div>
                 </div>
                 <div class="fc-footer">
                    <button class="btn-link">Chi tiết</button>
                    <button class="btn-link">Các lợi ích đi kèm</button>
                    <button class="btn-link">Hoàn vé</button>
                    <button class="btn-link">Đổi lịch</button>
                 </div>
              </div>
            </div>
        </main>
      </div>

      <!-- Ticket Class Selection Drawer -->
      <div class="drawer-overlay" *ngIf="selectedFlight()" (click)="closeDrawer()"></div>
      <div class="ticket-drawer glass-effect" *ngIf="selectedFlight()">
         <div class="drawer-header">
           <div class="drawer-header-inner">
             <h2 class="luxury-font text-gold title-drawer">Chọn loại vé</h2>
             <button class="btn-close" (click)="closeDrawer()">✕</button>
           </div>
           
           <div class="drawer-flight-summary" *ngIf="selectedFlight()">
              <div class="summary-top">
                 <span class="text-gold">Khởi hành:</span>
                 <strong style="margin-left: 8px">{{ selectedFlight()?.departureCity }}</strong>
                 <span class="summary-arrow">→</span>
                 <strong>{{ selectedFlight()?.arrivalCity }}</strong>
              </div>
              
              <div class="summary-details">
                 <div class="sd-airline">
                    <div class="logo luxury-font">{{ selectedFlight()?.airline?.charAt(0) }}</div>
                    <div>
                      <div class="sd-airline-name">{{ selectedFlight()?.airline }}</div>
                      <small class="text-gold">{{ selectedFlight()?.flightNumber }}</small>
                    </div>
                 </div>
                 
                 <div class="sd-timeline">
                    <div class="sd-time-col text-right">
                       <strong>{{ selectedFlight()?.departureTime | date:'HH:mm' }}</strong>
                       <small>Điểm đi</small>
                    </div>
                    
                    <div class="sd-dur-col">
                       <span class="sd-dur">{{ getDuration(selectedFlight()!) }}</span>
                       <div class="sd-line">Bay thẳng</div>
                    </div>
                    
                    <div class="sd-time-col">
                       <strong>{{ selectedFlight()?.arrivalTime | date:'HH:mm' }}</strong>
                       <small>Điểm đến</small>
                    </div>
                 </div>
              </div>
           </div>
           
           <!-- Tabs (Phổ thông / Thương gia) -->
           <div class="drawer-tabs">
              <button class="tab-btn" [class.active]="drawerTab() === 'ECONOMY'" (click)="drawerTab.set('ECONOMY')">Phổ thông</button>
              <button class="tab-btn text-gold" [class.active]="drawerTab() === 'BUSINESS'" (click)="drawerTab.set('BUSINESS')">
                 Thương gia <small *ngIf="selectedFlight()">(Từ {{ (selectedFlight()!.basePrice * 2.8) | number }} VNĐ)</small>
              </button>
           </div>
         </div>
         
         <div class="drawer-content" *ngIf="selectedFlight()">
            <!-- ECONOMY TIER CARDS -->
            <div class="class-cards-wrapper" *ngIf="drawerTab() === 'ECONOMY'">
               
               <!-- Economy Basic -->
               <div class="cc-card">
                  <div class="cc-header border-bottom">
                     <h3 class="cc-title">Phổ thông (Basic)</h3>
                     <div class="cc-price">{{ selectedFlight()?.basePrice | number }} <small>VNĐ</small></div>
                  </div>
                  <ul class="cc-features">
                     <li><span class="cc-icon">💼</span> Hành lý xách tay 7 kg</li>
                     <li class="disabled"><span class="cc-icon">🧳</span> Không hành lý ký gửi</li>
                     <li class="disabled"><span class="cc-icon">🔄</span> Không được đổi vé</li>
                     <li class="disabled"><span class="cc-icon">❌</span> Không áp dụng hoàn vé</li>
                     <li><span class="cc-icon">📄</span> Có thể cung cấp hóa đơn VAT</li>
                  </ul>
                  <button class="btn-select-class secondary" (click)="bookFlight(selectedFlight()!.id)">Chọn</button>
                  <button class="btn-link text-center mt-3 text-sm">Tìm hiểu thêm</button>
               </div>
               
               <!-- Economy Flex -->
               <div class="cc-card highlight shadow-gold">
                  <div class="cc-badge">BÁN CHẠY NHẤT</div>
                  <div class="cc-header border-bottom">
                     <h3 class="cc-title text-gold">Phổ thông linh hoạt</h3>
                     <div class="cc-price text-gold">{{ (selectedFlight()!.basePrice * 1.3) | number }} <small>VNĐ</small></div>
                  </div>
                  <ul class="cc-features">
                     <li><span class="cc-icon">💼</span> Hành lý xách tay 7 kg</li>
                     <li><span class="cc-icon">🧳</span> Hành lý ký gửi 20 kg</li>
                     <li><span class="cc-icon">🔄</span> Phí đổi lịch dự kiến từ 400.000 VNĐ</li>
                     <li><span class="cc-icon">✅</span> Hoàn vé mất phí</li>
                     <li><span class="cc-icon">📄</span> Có thể cung cấp hóa đơn VAT</li>
                  </ul>
                  <button class="btn-select-class primary" (click)="bookFlight(selectedFlight()!.id, 'ECONOMY_FLEX')">Chọn</button>
                  <button class="btn-link text-center mt-3 text-sm">Tìm hiểu thêm</button>
               </div>
               
               <!-- Economy Premium (Deluxe) -->
               <div class="cc-card">
                  <div class="cc-header border-bottom">
                     <h3 class="cc-title text-gold">Phổ thông Deluxe</h3>
                     <div class="cc-price text-gold">{{ (selectedFlight()!.basePrice * 1.8) | number }} <small>VNĐ</small></div>
                  </div>
                  <ul class="cc-features">
                     <li><span class="cc-icon">💼</span> Hành lý xách tay 7 kg</li>
                     <li><span class="cc-icon">🧳</span> Hành lý ký gửi 30 kg</li>
                     <li><span class="cc-icon">💺</span> Ghế tiêu chuẩn (khoảng cách ghế 28 inch)</li>
                     <li><span class="cc-icon">🔄</span> Miễn phí đổi vé 1 lần (trước 24h)</li>
                     <li><span class="cc-icon">✅</span> Hoàn vé linh hoạt một phần</li>
                  </ul>
                  <button class="btn-select-class secondary" (click)="bookFlight(selectedFlight()!.id, 'ECONOMY_DELUXE')">Chọn</button>
                  <button class="btn-link text-center mt-3 text-sm">Tìm hiểu thêm</button>
               </div>

            </div>

            <!-- BUSINESS TIER CARDS -->
            <div class="class-cards-wrapper" *ngIf="drawerTab() === 'BUSINESS'">
               <!-- Business Class -->
               <div class="cc-card premium gradient-bg">
                  <div class="cc-header border-bottom">
                     <h3 class="cc-title">Thương gia</h3>
                     <div class="cc-price">{{ (selectedFlight()!.basePrice * 2.8) | number }} <small>VNĐ</small></div>
                  </div>
                  <ul class="cc-features">
                     <li><span class="cc-icon">💼</span> Hành lý xách tay 14 kg</li>
                     <li><span class="cc-icon">🧳</span> Hành lý ký gửi 40 kg</li>
                     <li><span class="cc-icon">👑</span> Phòng chờ thương gia</li>
                     <li><span class="cc-icon">🔄</span> Đổi lịch miễn phí</li>
                     <li><span class="cc-icon">✅</span> Hoàn vé linh hoạt 100%</li>
                  </ul>
                  <button class="btn-select-class white-btn" (click)="bookFlight(selectedFlight()!.id, 'BUSINESS')">Chọn</button>
               </div>
               
               <!-- Premium Business SkyBoss -->
               <div class="cc-card premium gradient-bg-gold">
                  <div class="cc-badge">ĐẶC QUYỀN VIP</div>
                  <div class="cc-header border-bottom">
                     <h3 class="cc-title text-dark">Thương gia SkyBoss</h3>
                     <div class="cc-price text-dark">{{ (selectedFlight()!.basePrice * 4.5) | number }} <small>VNĐ</small></div>
                  </div>
                  <ul class="cc-features text-dark" style="color: #222 !important">
                     <li style="color: #333"><span class="cc-icon">💼</span> Hành lý xách tay 18 kg</li>
                     <li style="color: #333"><span class="cc-icon">🧳</span> Hành lý ký gửi 50 kg + Dụng cụ Golf</li>
                     <li style="color: #333"><span class="cc-icon">🍽️</span> Suất ăn nóng miễn phí trên máy bay</li>
                     <li style="color: #333"><span class="cc-icon">👑</span> Sử dụng phòng chờ thương gia toàn cầu</li>
                     <li style="color: #333"><span class="cc-icon">🚗</span> Xe đưa đón sân bay riêng</li>
                  </ul>
                  <button class="btn-select-class bg-dark text-gold border-none" (click)="bookFlight(selectedFlight()!.id, 'BUSINESS_SKYBOSS')">Chọn thẻ VIP</button>
               </div>
            </div>
         </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      --bg-dark: #0B0F19;
      --gold-primary: #d4af37;
      --gold-light: #f3e5ab;
    }
    
    .text-gold { color: var(--gold-primary); }
    
    .search-hero { position: relative; background: var(--bg-dark); }
    .hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1920') center/cover; opacity: 0.3; }
    
    .hero-content {
      padding-top: 150px;
      padding-bottom: 80px;
    }
    
    .hero-title {
      text-align: center;
      color: white;
      margin-bottom: 40px;
      font-size: 2.5rem;
    }

    /* Search Widget */
    .search-widget { 
      background: rgba(15, 20, 30, 0.85); 
      border-radius: 20px; 
      padding: 30px; 
      border: 1px solid rgba(255,255,255,0.1); 
      backdrop-filter: blur(10px); 
    }
    .widget-header { 
      display: flex; 
      justify-content: space-between; 
      align-items: center; 
      border-bottom: 1px solid rgba(255,255,255,0.1); 
      padding-bottom: 20px; 
      margin-bottom: 20px; 
    }
    .trip-types { display: flex; gap: 20px; }
    .type-btn { background: none; border: none; font-size: 1rem; color: #888; cursor: pointer; font-weight: 500; transition: color 0.3s; position: relative; }
    .type-btn.active { color: white; }
    .type-btn.active::after { content: ''; position: absolute; bottom: -21px; left: 0; width: 100%; height: 2px; background: var(--gold-primary); }
    .type-btn:hover { color: white; }
    
    .passenger-class { font-size: 0.85rem; color: #ccc; }
    .pc-divider { margin: 0 15px; color: #555; }
    
    .search-inputs { 
      display: grid; 
      grid-template-columns: 1fr auto 1fr 1fr auto; 
      gap: 20px; 
      align-items: flex-end; 
    }
    .input-group label { display: block; font-size: 0.85rem; color: #aaa; margin-bottom: 8px; text-transform: uppercase; }
    .input-group input { width: 100%; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 15px 20px; color: white; outline: none; transition: border-color 0.3s; font-size: 1rem; box-sizing: border-box;}
    .input-group input:focus { border-color: var(--gold-primary); }
    .swap-icon { font-size: 1.5rem; padding-bottom: 12px; cursor: pointer; color: var(--gold-primary);}
    .btn-search { background: var(--gold-primary); cursor: pointer; color: black; border-radius: 10px; padding: 15px 30px; font-size: 1.1rem; font-weight: 700; transition: transform 0.2s, box-shadow 0.2s; border: none; box-shadow: 0 5px 15px rgba(212,175,55,0.3); }
    .btn-search:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(212,175,55,0.4); }

    /* Page Layout */
    .main-layout { 
      display: grid; 
      grid-template-columns: 280px 1fr; 
      gap: 40px; 
      align-items: start; 
      margin-top: 40px;
      margin-bottom: 80px;
    }
    
    /* Filters */
    .filter-card { padding: 25px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
    .filter-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    .filter-header h3 { font-size: 1.25rem; margin: 0; color: var(--gold-primary); }
    .btn-clear { background: none; border: none; font-size: 0.85rem; cursor: pointer; }
    .btn-clear:hover { text-decoration: underline; }
    
    .border-bottom { border-bottom: 1px solid #222; padding-bottom: 24px; margin-bottom: 24px; }
    .filter-section h4 { font-size: 0.85rem; color: #888; text-transform: uppercase; margin-bottom: 16px; }
    
    .checkbox-container { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; cursor: pointer; color: #ddd; font-size: 0.95rem; }
    .checkbox-container input { width: 18px; height: 18px; accent-color: var(--gold-primary); cursor: pointer; }
    
    .loading-text { text-align: center; padding: 80px 0; font-size: 1.5rem; color: var(--gold-primary); }

    /* Sorting Bar */
    .sorting-bar { display: grid; grid-template-columns: 1fr 1fr; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px; }
    .sort-option { padding: 20px; display: flex; flex-direction: column; justify-content: center; text-align: center; cursor: pointer; transition: background 0.2s; }
    .sort-option:hover { background: rgba(255,255,255,0.02); }
    .sort-option.active { background: rgba(212,175,55,0.05); border-bottom: 2px solid var(--gold-primary); }
    .sort-option .label { font-size: 0.85rem; color: #888; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 1px; }
    .sort-option .val { font-size: 1.1rem; font-weight: bold; }
    
    /* Flight Cards */
    .flight-list { display: flex; flex-direction: column; gap: 20px; }
    .flight-card { border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s, border-color 0.3s; }
    .flight-card:hover { transform: translateY(-3px); border-color: rgba(212,175,55,0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }
    .flight-card-inner { display: flex; align-items: center; justify-content: space-between; padding: 24px; }
    
    .fc-airline { display: flex; align-items: center; gap: 16px; width: 25%; }
    .fc-airline-name { font-weight: bold; font-size: 1.1rem; }
    .fc-flight-num { font-size: 0.75rem; color: #888; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .logo { width: 45px; height: 45px; background: rgba(255,255,255,0.1); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; border-radius: 10px; font-size: 1.5rem; }
    
    .fc-timeline { display: flex; align-items: center; gap: 30px; width: 50%; justify-content: center; }
    .fc-time-block { text-align: right; }
    .fc-time-block.left { text-align: left; }
    .fc-time { font-size: 1.5rem; font-weight: bold; }
    .fc-city { font-size: 0.85rem; color: var(--gold-primary); margin-top: 4px; }
    
    .fc-duration-block { text-align: center; display: flex; flex-direction: column; align-items: center; }
    .fc-duration { font-size: 0.75rem; color: #aaa; margin-bottom: 4px; }
    .fc-line { width: 120px; height: 1px; background-color: #555; position: relative; }
    .fc-plane-icon { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: rgba(15,20,30,0.9); padding: 0 8px; color: var(--gold-primary); font-size: 0.9rem;}
    .fc-stop-type { font-size: 0.75rem; color: var(--gold-primary); margin-top: 4px; }
    
    .fc-action { width: 25%; text-align: right; }
    .fc-price { color: var(--gold-primary); font-size: 1.5rem; font-weight: bold; margin-bottom: 12px; }
    .fc-price small { font-size: 0.85rem; font-weight: normal; }
    
    .btn-select { background: var(--gold-primary); border: none; cursor: pointer; color: black; border-radius: 8px; padding: 10px 30px; font-weight: 700; transition: background 0.2s; width: 100%; display:inline-block;}
    .btn-select:hover { background: var(--gold-light); }

    .fc-footer { background: rgba(0,0,0,0.3); padding: 12px 24px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 24px; font-size: 0.85rem; color: #aaa; }
    .btn-link { background: none; border: none; font-size: inherit; color: inherit; cursor: pointer; transition: color 0.2s; padding: 0; }
    .btn-link:hover { color: var(--gold-primary); }
    
    /* Ticket Drawer Redesign */
    .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(5px); z-index: 9998; animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    .ticket-drawer { position: fixed; bottom: 0; left: 0; width: 100%; height: 90vh; display: flex; flex-direction: column; background: #0B0F19; z-index: 9999; border-radius: 20px 20px 0 0; border-top: 1px solid rgba(212,175,55,0.3); box-shadow: 0 -10px 40px rgba(0,0,0,0.8); overflow: hidden; animation: slideUpDrawer 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes slideUpDrawer { from { transform: translateY(100vh); } to { transform: translateY(0); } }
    
    .drawer-header { padding: 20px 30px 0 30px; border-bottom: 2px solid rgba(255,255,255,0.05); flex-shrink: 0; background: rgba(255,255,255,0.02); }
    .drawer-header-inner { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .title-drawer { font-size: 1.5rem; margin: 0; }
    .btn-close { background: none; border: none; font-size: 1.5rem; color: #aaa; cursor: pointer; }
    
    .drawer-flight-summary { background: rgba(15,20,30,0.9); border-radius: 12px; padding: 16px; border: 1px solid rgba(255,255,255,0.05); margin-bottom: 20px; }
    .summary-top { font-size: 0.95rem; margin-bottom: 16px; border-bottom: 1px dashed rgba(255,255,255,0.1); padding-bottom: 12px; }
    .summary-arrow { color: var(--gold-primary); margin: 0 10px; }
    
    .summary-details { display: flex; align-items: center; justify-content: space-between; }
    .sd-airline { display: flex; align-items: center; gap: 16px; width: 30%; }
    .sd-airline-name { font-weight: bold; font-size: 1rem; }
    
    .sd-timeline { display: flex; align-items: center; gap: 20px; width: 40%; justify-content: center; }
    .sd-time-col { display: flex; flex-direction: column; }
    .sd-time-col strong { font-size: 1.25rem; }
    .sd-time-col small { font-size: 0.75rem; color: #888; margin-top: 2px; }
    .text-right { text-align: right; }
    .sd-dur-col { display: flex; flex-direction: column; align-items: center; }
    .sd-dur { font-size: 0.75rem; color: #aaa; margin-bottom: 4px; }
    .sd-line { width: 100px; height: 1px; background-color: #555; position: relative; font-size: 0.65rem; color: var(--gold-primary); display: flex; align-items: center; justify-content: center; top: 8px;}
    .sd-action { width: 30%; text-align: right; }
    
    .drawer-tabs { display: flex; border-bottom: 2px solid rgba(255,255,255,0.1); gap: 20px;}
    .tab-btn { background: none; border: none; padding: 12px 10px; font-size: 1rem; color: #888; cursor: pointer; position: relative; transition: color 0.3s; font-weight: bold; }
    .tab-btn.active { color: white; }
    .tab-btn.active::after { content: ''; position: absolute; bottom: -2px; left: 0; width: 100%; height: 3px; background: var(--gold-primary); }
    
    .drawer-content { flex-grow: 1; padding: 30px; overflow-y: auto; background: var(--bg-dark); }
    .class-cards-wrapper { display: flex; gap: 24px; overflow-x: auto; padding-bottom: 20px; scrollbar-width: thin; }
    
    .cc-card { flex: 0 0 350px; background: rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 24px; display: flex; flex-direction: column; position: relative; }
    .cc-card.highlight { background: rgba(0,0,0,0.6); border-color: rgba(212,175,55,0.4); box-shadow: 0 5px 20px rgba(212,175,55,0.15); }
    .cc-card.premium { background: linear-gradient(135deg, #1a1a24 0%, #0d0d14 100%); border-color: rgba(255,255,255,0.2); }
    .cc-card.premium.gradient-bg-gold { background: linear-gradient(135deg, var(--gold-light) 0%, #c49625 100%); border-color: var(--gold-primary); color: #222 !important; }
    .bg-dark { background: #111; }
    .border-none { border: none; }
    .text-dark { color: #222 !important; }
    .mt-3 { margin-top: 12px; }
    .text-sm { font-size: 0.85rem; }
    
    .cc-badge { position: absolute; top: 0; right: 0; background: var(--gold-primary); color: black; font-size: 0.7rem; font-weight: bold; padding: 5px 15px; border-bottom-left-radius: 12px; letter-spacing: 0.5px;}
    
    .cc-header { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px dashed rgba(255,255,255,0.1); }
    .cc-title { font-size: 1.15rem; margin-bottom: 8px; font-weight: bold; }
    .cc-price { font-size: 1.5rem; color: white; font-weight: bold; }
    .cc-card.gradient-bg-gold .cc-price { color: #111; }
    
    .cc-features { list-style: none; padding: 0; margin: 0; flex-grow: 1; margin-bottom: 24px; }
    .cc-features li { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 14px; font-size: 0.85rem; color: #ccc; line-height: 1.4; }
    .cc-features li.disabled { color: #666; }
    .cc-icon { width: 20px; font-size: 1.1rem; flex-shrink: 0; }
    
    .btn-select-class { padding: 14px; border-radius: 8px; font-weight: bold; cursor: pointer; text-align: center; border: none; transition: 0.2s; font-size: 1rem; }
    .btn-select-class.secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; }
    .btn-select-class.secondary:hover { background: rgba(255,255,255,0.1); }
    .btn-select-class.primary { background: var(--gold-primary); color: black; box-shadow: 0 4px 15px rgba(212,175,55,0.3); }
    .btn-select-class.primary:hover { background: var(--gold-light); transform: translateY(-2px); box-shadow: 0 6px 20px rgba(212,175,55,0.4); }
    .btn-select-class.white-btn { background: white; color: black; }
    .btn-select-class.white-btn:hover { background: #f0f0f0; }
    .btn-select-class.bg-dark:hover { background: black; color: var(--gold-primary); }
  `]
})
export class FlightListComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private bookingService = inject(BookingService);
  private router = inject(Router);

  flights = signal<Flight[]>([]);
  loading = signal(true);
  selectedFlight = signal<Flight | null>(null);
  drawerTab = signal<'ECONOMY' | 'BUSINESS'>('ECONOMY');

  // Search State
  searchDeparture = signal('');
  searchArrival = signal('');
  searchDate = signal('');

  // Filter State
  selectedAirlines = signal<Set<string>>(new Set());
  selectedStops = signal<Set<string>>(new Set());

  // Sort State
  sortOption = signal<'PRICE' | 'DURATION'>('PRICE');

  // Computed Derived Data
  availableAirlines = computed(() => {
    const lines = new Set<string>();
    this.flights().forEach(f => lines.add(f.airline));
    return Array.from(lines).sort();
  });

  filteredFlights = computed(() => {
    let result = this.flights();
    const airlines = this.selectedAirlines();
    const stops = this.selectedStops();

    if (airlines.size > 0) {
      result = result.filter(f => airlines.has(f.airline));
    }

    if (stops.size > 0) {
      // For now, all mocked data is direct.
      // E.g 'DIRECT' vs '1_STOP'
      result = result.filter(f => stops.has('DIRECT'));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (this.sortOption() === 'PRICE') {
        return a.basePrice - b.basePrice;
      } else {
        const da = new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime();
        const db = new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime();
        return da - db;
      }
    });

    return result;
  });

  lowestPrice = computed(() => {
    const f = this.filteredFlights();
    return f.length ? Math.min(...f.map((x: Flight) => x.basePrice)) : 0;
  });

  shortestDuration = computed(() => {
    const f = this.filteredFlights();
    if (!f.length) return '0h 0m';
    let minD = Infinity;
    f.forEach((x: Flight) => {
      const d = new Date(x.arrivalTime).getTime() - new Date(x.departureTime).getTime();
      if (d < minD) minD = d;
    });
    const m = Math.floor(minD / 60000);
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  });

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.loading.set(true);
    this.catalogService.getFlights(this.searchDeparture(), this.searchArrival()).subscribe({
      next: (res) => {
        if (res.success) this.flights.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  search() {
    this.loadFlights();
  }

  swapLocations() {
    const temp = this.searchDeparture();
    this.searchDeparture.set(this.searchArrival());
    this.searchArrival.set(temp);
  }

  toggleAirline(airline: string) {
    const set = new Set(this.selectedAirlines());
    if (set.has(airline)) set.delete(airline);
    else set.add(airline);
    this.selectedAirlines.set(set);
  }

  toggleStop(stopType: string) {
    const set = new Set(this.selectedStops());
    if (set.has(stopType)) set.delete(stopType);
    else set.add(stopType);
    this.selectedStops.set(set);
  }

  setSort(option: 'PRICE' | 'DURATION') {
    this.sortOption.set(option);
  }

  getDuration(flight: Flight): string {
    const d = new Date(flight.arrivalTime).getTime() - new Date(flight.departureTime).getTime();
    const m = Math.floor(d / 60000);
    return `${Math.floor(m / 60)}h ${m % 60}m`;
  }

  selectFlight(flight: Flight) {
    this.selectedFlight.set(flight);
  }

  closeDrawer() {
    this.selectedFlight.set(null);
    this.drawerTab.set('ECONOMY');
  }

  bookFlight(flightId: string, ticketClass: string = 'ECONOMY') {
    this.router.navigate(['/flights/checkout'], { queryParams: { flightId, class: ticketClass } });
  }
}

