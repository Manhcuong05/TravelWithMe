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
            </div>
            
            <div class="widget-body">
              <div class="search-inputs">
                <div class="input-group flex-2">
                  <div class="input-label-row"><i class="fas fa-plane-departure mr-2 text-gold"></i> Từ</div>
                  <input type="text" placeholder="Thành phố đi..." [(ngModel)]="searchDeparture" class="luxury-input">
                </div>
                <div class="swap-icon-container">
                  <div class="swap-icon" (click)="swapLocations()">⇄</div>
                </div>
                <div class="input-group flex-2">
                  <div class="input-label-row"><i class="fas fa-plane-arrival mr-2 text-gold"></i> Đến</div>
                  <input type="text" placeholder="Thành phố đến..." [(ngModel)]="searchArrival" class="luxury-input">
                </div>
                <div class="input-group flex-1">
                  <div class="input-label-row"><i class="fas fa-calendar-alt mr-2 text-gold"></i> Ngày đi</div>
                  <input type="date" [(ngModel)]="searchDate" class="luxury-input">
                </div>
                
                <!-- Passenger & Class Integrated -->
                <div class="input-group flex-2 relative passenger-trigger" (click)="showPassengerDropdown.set(!showPassengerDropdown())">
                  <div class="input-label-row"><i class="fas fa-user-friends mr-2 text-gold"></i> Khách & Hạng ghế</div>
                  <div class="display-value luxury-input flex items-center justify-between">
                    <span class="truncate">
                      <strong>{{ adults() + children() + infants() }} Khách</strong>, {{ seatClass() === 'ECONOMY' ? 'Phổ thông' : 'Thương gia' }}
                    </span>
                    <i class="fas fa-chevron-down text-xs ml-2"></i>
                  </div>
                  
                  <!-- Pax Dropdown -->
                  <div class="pax-dropdown-menu luxury-pax-dropdown" *ngIf="showPassengerDropdown()" (click)="$event.stopPropagation()">
                     <div class="pax-header border-bottom mb-4 pb-2">
                       <h4 class="luxury-font">Số lượng hành khách</h4>
                       <div class="text-dim">Cấu hình tìm kiếm cho chuyến bay</div>
                     </div>
                     
                     <div class="pax-row">
                        <div class="pax-info">
                          <strong>Người lớn</strong>
                          <div class="text-dim">Từ 12 tuổi</div>
                        </div>
                        <div class="pax-controls">
                          <button class="p-btn" (click)="adults.set(Math.max(1, adults() - 1))" [disabled]="adults() <= 1" title="Giảm">-</button>
                          <span class="pax-val">{{ adults() }}</span>
                          <button class="p-btn" (click)="adults.set(adults() + 1)" title="Tăng">+</button>
                        </div>
                     </div>
                     <div class="pax-row mt-4">
                        <div class="pax-info">
                          <strong>Trẻ em</strong>
                          <div class="text-dim">Hành khách từ 2 - 11 tuổi</div>
                        </div>
                        <div class="pax-controls">
                          <button class="p-btn" (click)="children.set(Math.max(0, children() - 1))" [disabled]="children() <= 0" title="Giảm">-</button>
                          <span class="pax-val">{{ children() }}</span>
                          <button class="p-btn" (click)="children.set(children() + 1)" title="Tăng">+</button>
                        </div>
                     </div>
                     <div class="pax-row mt-4">
                        <div class="pax-info">
                          <strong>Em bé</strong>
                          <div class="text-dim">Dưới 2 tuổi</div>
                        </div>
                        <div class="pax-controls">
                          <button class="p-btn" (click)="infants.set(Math.max(0, infants() - 1))" [disabled]="infants() <= 0" title="Giảm">-</button>
                          <span class="pax-val">{{ infants() }}</span>
                          <button class="p-btn" (click)="infants.set(infants() + 1)" title="Tăng">+</button>
                        </div>
                     </div>
                     
                     <div class="class-selector mt-5 pt-4 border-top-dashed">
                        <label class="text-dim mb-3 block">Hàng ghế mong muốn</label>
                        <div class="class-chips">
                          <div class="class-chip" [class.active]="seatClass() === 'ECONOMY'" (click)="seatClass.set('ECONOMY')">Phổ thông</div>
                          <div class="class-chip" [class.active]="seatClass() === 'BUSINESS'" (click)="seatClass.set('BUSINESS')">Thương gia</div>
                        </div>
                     </div>
                     
                     <div class="pax-footer mt-5">
                       <button class="btn-primary w-full py-3 luxury-font" (click)="showPassengerDropdown.set(false); search()">XÁC NHẬN</button>
                     </div>
                  </div>
                </div>

                <div class="search-btn-container">
                   <button class="btn-search luxury-font" (click)="search()">
                     <i class="fas fa-search mr-2"></i> Tìm Kiếm
                   </button>
                </div>
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
                        <div class="fc-price">{{ getLowestPrice(flight) | number }} <small>VNĐ</small></div>
                        <button class="btn-select" (click)="selectFlight(flight)">Chọn</button>
                    </div>
                 </div>
                 <div class="fc-footer">
                    <button class="btn-link">Chi tiết</button>
                    <button class="btn-link">Chính sách hành lý & hoàn hủy</button>
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
                 Thương gia
              </button>
           </div>
         </div>
         
         <div class="drawer-content" *ngIf="selectedFlight()">
            <div class="class-cards-wrapper">
               
               <!-- Dynamic Classes Loop -->
               <ng-container *ngFor="let fc of selectedFlight()?.flightClasses">
                 <div class="cc-card" [class.premium]="fc.className === 'BUSINESS'" [class.gradient-bg]="fc.className === 'BUSINESS'" *ngIf="fc.className === drawerTab()">
                    <div class="cc-header border-bottom">
                       <h3 class="cc-title" [class.text-gold]="fc.className === 'BUSINESS'">{{ drawerTab() === 'ECONOMY' ? 'Hạng Phổ Thông' : 'Hạng Thương Gia' }}</h3>
                       <div class="text-xs text-gray mt-1">Hành lý: {{ fc.baggageAllowanceKg }}kg | Còn: {{ fc.availableSeats }} ghế</div>
                       <div class="cc-price mt-2">{{ calculateClassPrice(fc) | number }} <small>VNĐ</small></div>
                    </div>
                    <ul class="cc-features">
                       <li><span class="cc-icon">💼</span> Hành lý xách tay 7 kg</li>
                       <li><span class="cc-icon">🧳</span> Hành lý ký gửi {{ fc.baggageAllowanceKg }} kg</li>
                       <li *ngIf="fc.className === 'BUSINESS'"><span class="cc-icon">👑</span> Phòng chờ thương gia VIP</li>
                       <li *ngIf="fc.className === 'BUSINESS'"><span class="cc-icon">🍽️</span> Suất ăn miễn phí</li>
                       <li><span class="cc-icon">🔄</span> Đổi lịch theo vé hệ thống</li>
                    </ul>
                    <button class="btn-select-class" [class.primary]="fc.className === 'ECONOMY'" [class.white-btn]="fc.className === 'BUSINESS'" (click)="bookFlight(selectedFlight()!.id, fc.id)">Chọn Vé</button>
                 </div>
               </ng-container>

               <!-- Empty State fallback -->
               <div *ngIf="getClassesByTab(drawerTab()).length === 0" class="text-center w-full py-5 text-gray mt-5">
                 <i class="fas fa-ticket-alt text-4xl mb-3 opacity-50"></i>
                 <p>Hiện tại chuyến bay này chưa cấu hình Hạng vé {{ drawerTab() === 'ECONOMY' ? 'Phổ thông' : 'Thương gia' }} hoặc đã hết chỗ.</p>
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
    
    /* Utilities */
    .flex-1 { flex: 1; }
    .flex-2 { flex: 2; }
    .items-center { align-items: center; }
    .justify-between { justify-content: space-between; }
    .relative { position: relative; }
    .truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .ml-2 { margin-left: 0.5rem; }
    .mr-2 { margin-right: 0.5rem; }
    .mt-4 { margin-top: 1rem; }
    .mt-5 { margin-top: 1.25rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .pb-2 { padding-bottom: 0.5rem; }
    .pt-4 { padding-top: 1rem; }
    .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }

    .search-hero { position: relative; background: var(--bg-dark); z-index: 100; }
    .hero-bg { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1920') center/cover; opacity: 0.3; }
    
    .hero-content {
      padding-top: 140px;
      padding-bottom: 60px;
      max-width: 1400px;
      margin: 0 auto;
      z-index: 110;
    }
    
    .hero-title {
      text-align: center;
      color: white;
      margin-bottom: 40px;
      font-size: 2.8rem;
      letter-spacing: -1px;
      text-shadow: 0 4px 10px rgba(0,0,0,0.5);
    }

    /* Search Widget Professional Redesign */
    .search-widget { 
      background: #0f172a; 
      border-radius: 24px; 
      padding: 0; 
      border: 1px solid rgba(212, 175, 55, 0.2); 
      backdrop-filter: blur(25px);
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: visible;
      z-index: 120;
    }
    .widget-header { 
      padding: 20px 30px;
      border-bottom: 1px solid rgba(255,255,255,0.06); 
      display: flex;
      align-items: center;
    }
    .trip-types { display: flex; gap: 30px; }
    .type-btn { background: none; border: none; font-size: 0.9rem; color: #8b9bb4; cursor: pointer; font-weight: 600; transition: all 0.3s; position: relative; padding: 5px 0; text-transform: uppercase; letter-spacing: 1px; }
    .type-btn.active { color: var(--gold-primary); }
    .type-btn.active::after { content: ''; position: absolute; bottom: -21px; left: 0; width: 100%; height: 3px; background: var(--gold-primary); border-radius: 3px 3px 0 0; }
    .type-btn:hover { color: white; }
    
    .widget-body { padding: 25px 30px 35px 30px; }
    
    .search-inputs { 
      display: flex;
      gap: 12px;
      background: rgba(255,255,255,0.03);
      padding: 10px;
      border-radius: 20px;
      border: 1px solid rgba(255,255,255,0.05);
      align-items: stretch;
    }

    .input-group { 
      display: flex; 
      flex-direction: column; 
      gap: 5px; 
      padding: 10px 15px;
      border-radius: 14px;
      transition: background 0.2s;
    }
    .input-group:hover { background: rgba(255,255,255,0.04); }
    
    .input-label-row { 
      font-size: 0.7rem; 
      color: #8b9bb4; 
      text-transform: uppercase; 
      font-weight: 800; 
      letter-spacing: 1px;
      display: flex;
      align-items: center;
    }

    .luxury-input { 
      width: 100%; 
      background: transparent; 
      border: none; 
      color: white; 
      outline: none; 
      font-size: 1.1rem; 
      font-weight: 700;
      padding: 5px 0;
      cursor: pointer;
    }
    .luxury-input::placeholder { color: #4b5563; }
    
    input[type="date"].luxury-input { color-scheme: dark; }

    .display-value { height: 32px; }

    .swap-icon-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
    }
    .swap-icon { 
      width: 36px; 
      height: 36px; 
      background: rgba(212, 175, 55, 0.1); 
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(212, 175, 55, 0.2);
      color: var(--gold-primary);
      cursor: pointer;
      transition: all 0.3s;
      font-size: 1.2rem;
    }
    .swap-icon:hover { background: var(--gold-primary); color: black; transform: rotate(180deg); }

    .search-btn-container {
      display: flex;
      align-items: stretch;
      padding-left: 10px;
    }
    .btn-search { 
      background: linear-gradient(135deg, #dfc15a 0%, #c49a20 100%); 
      cursor: pointer; 
      color: #0b0f19; 
      border-radius: 16px; 
      padding: 0 35px; 
      font-size: 1.1rem; 
      font-weight: 800; 
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
      border: none; 
      box-shadow: 0 10px 20px rgba(212,175,55,0.25);
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .btn-search:hover { transform: scale(1.02); box-shadow: 0 15px 30px rgba(212,175,55,0.4); }

    /* Luxury Pax Dropdown */
    .passenger-trigger { cursor: pointer; }
    .luxury-pax-dropdown { 
      position: absolute; 
      top: 100%; 
      right: 0;
      width: 320px; 
      background: #111827; 
      border: 1px solid rgba(212, 175, 55, 0.4);
      box-shadow: 0 30px 60px rgba(0,0,0,1);
      z-index: 1000;
      padding: 24px;
      border-radius: 16px;
      margin-top: 12px;
    }

    .pax-header h4 { font-size: 1.1rem; color: white; margin-bottom: 4px; }
    .text-gray { color: #94a3b8; }
    .text-dim { font-size: 0.7rem; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
    
    .pax-row { display: flex; justify-content: space-between; align-items: center; }
    .pax-info strong { display: block; color: white; font-size: 0.95rem; }
    .pax-val { font-size: 1.1rem; font-weight: 700; color: white; min-width: 25px; text-align: center; }
    
    .p-btn { 
      width: 32px; 
      height: 32px; 
      border-radius: 50%; 
      background: rgba(255,255,255,0.05); 
      border: 1px solid rgba(255,255,255,0.1); 
      color: white; 
      cursor: pointer; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      transition: all 0.2s;
    }
    .p-btn:hover:not(:disabled) { background: var(--gold-primary); color: black; border-color: var(--gold-primary); }
    .p-btn:disabled { opacity: 0.2; cursor: not-allowed; }

    .class-chips { display: flex; gap: 10px; }
    .class-chip { 
      flex: 1; 
      padding: 12px; 
      text-align: center; 
      background: rgba(255,255,255,0.03); 
      border: 1px solid rgba(255,255,255,0.08); 
      border-radius: 12px; 
      font-size: 0.85rem; 
      font-weight: 700; 
      cursor: pointer; 
      transition: all 0.3s;
      color: #8b9bb4;
    }
    .class-chip.active { 
       background: rgba(212, 175, 55, 0.1); 
       border-color: var(--gold-primary); 
       color: var(--gold-primary);
       box-shadow: inset 0 0 10px rgba(212,175,55,0.1);
    }
    .class-chip:hover:not(.active) { background: rgba(255,255,255,0.08); color: white; }

    .btn-primary { 
      background: linear-gradient(135deg, #dfc15a 0%, #c49a20 100%); 
      color: #0b0f19; 
      border: none; 
      border-radius: 12px; 
      font-weight: 800; 
      text-transform: uppercase; 
      letter-spacing: 1px; 
      cursor: pointer; 
      transition: all 0.3s;
      box-shadow: 0 10px 20px rgba(212,175,55,0.2);
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(212,175,55,0.4); }
    .btn-primary:active { transform: translateY(0); }
    .w-full { width: 100%; }

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

  // Custom Math helper for template
  Math = Math;

  // Passenger State
  adults = signal(1);
  children = signal(0);
  infants = signal(0);
  seatClass = signal<'ECONOMY' | 'BUSINESS'>('ECONOMY');
  showPassengerDropdown = signal(false);

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
    const requiredSeats = this.adults() + this.children();

    // Filter by available seats and requested class
    result = result.filter(f => {
      if (!f.flightClasses) return false;
      const validClasses = f.flightClasses.filter(c => c.className === this.seatClass() && c.availableSeats >= requiredSeats);
      return validClasses.length > 0;
    });

    if (airlines.size > 0) {
      result = result.filter(f => airlines.has(f.airline));
    }

    if (stops.size > 0) {
      result = result.filter(f => stops.has('DIRECT'));
    }

    // Sorting
    result = [...result].sort((a, b) => {
      if (this.sortOption() === 'PRICE') {
        return this.getLowestPrice(a) - this.getLowestPrice(b);
      } else {
        const da = new Date(a.arrivalTime).getTime() - new Date(a.departureTime).getTime();
        const db = new Date(b.arrivalTime).getTime() - new Date(b.departureTime).getTime();
        return da - db;
      }
    });

    return result;
  });

  getLowestPrice(flight: Flight): number {
    if (!flight.flightClasses || flight.flightClasses.length === 0) return 0;

    // Only look at the currently searched class
    const available = flight.flightClasses.filter(c => c.className === this.seatClass());
    if (available.length === 0) return 0;

    let min = Infinity;
    available.forEach(c => {
      const px = this.calculateClassPrice(c);
      if (px < min) min = px;
    });

    return min === Infinity ? 0 : min;
  }

  calculateClassPrice(fc: any): number {
    return (this.adults() * fc.priceAdult) +
      (this.children() * fc.priceChild) +
      (this.infants() * fc.priceInfant);
  }

  getClassesByTab(tab: string) {
    if (!this.selectedFlight()) return [];
    return this.selectedFlight()!.flightClasses?.filter(c => c.className === tab && c.availableSeats >= (this.adults() + this.children())) || [];
  }

  lowestPrice = computed(() => {
    const f = this.filteredFlights();
    if (!f.length) return 0;
    const minPrices = f.map(x => this.getLowestPrice(x)).filter(p => p > 0);
    return minPrices.length ? Math.min(...minPrices) : 0;
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
    this.drawerTab.set(this.seatClass()); // Sync drawer tab with searched class initially
  }

  bookFlight(flightId: string, flightClassId: string) {
    this.router.navigate(['/flights/checkout'], {
      queryParams: {
        flightId,
        classId: flightClassId,
        adults: this.adults(),
        children: this.children(),
        infants: this.infants()
      }
    });
  }
}

