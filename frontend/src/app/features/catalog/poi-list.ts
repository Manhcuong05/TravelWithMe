import { Component, inject, OnInit, OnDestroy, signal, computed, effect, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, POI } from '../../core/services/catalog.service';
import { FavoriteService } from '../../core/services/favorite.service';
import { SafePipe } from '../../shared/pipes/safe.pipe';
import { gsap } from 'gsap';

@Component({
  selector: 'app-poi-list',
  standalone: true,
  imports: [CommonModule, SafePipe],
  template: `
    <!-- Feature Hero Carousel - Pro Max Edition -->
    <section class="guide-hero animate-fade-in" *ngIf="featuredPois().length > 0" (mouseenter)="stopTimer()" (mouseleave)="startTimer()">
      <div class="slides-container">
        <div *ngFor="let poi of featuredPois(); let i = index" 
             class="slide" 
             [class.active]="i === activeIndex()">
          <div class="hero-bg" [style.backgroundImage]="'url(' + extractImage(poi) + ')'"></div>
          <div class="hero-overlay-complex"></div>
          
          <div class="hero-content container">
            <div class="text-content">
              <span class="trend-tag">Điểm đến nổi bật</span>
              <h1 class="luxury-font hero-title">{{ poi.name }}</h1>
              <p class="hero-desc">{{ truncateDesc(poi.description, 180) }}</p>
              
              <div class="hero-meta-grid">
                <div class="meta-item">
                  <i class="fas fa-calendar-alt icon-gold"></i>
                  <div>
                    <label>Mùa đẹp nhất</label>
                    <span>{{ poi.bestTimeToVisit || 'Quanh năm' }}</span>
                  </div>
                </div>
                <div class="meta-item">
                  <i class="fas fa-star icon-gold"></i>
                  <div>
                    <label>Đánh giá</label>
                    <span>{{ poi.rating || '5.0' }} / 5.0</span>
                  </div>
                </div>
                <div class="meta-item">
                  <i class="fas fa-map-marker-alt icon-gold"></i>
                  <div>
                    <label>Thành phố</label>
                    <span>{{ poi.city }}</span>
                  </div>
                </div>
              </div>

              <div class="hero-actions mt-40">
                <button class="btn-pro-gold" (click)="openDetail(poi)"> 
                  <span>Khám phá bài viết</span>
                  <i class="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pro Thumbnail Stack -->
      <div class="thumbnail-stack">
        <div *ngFor="let poi of getUpcomingPois(); let i = index" 
             class="thumb-card-pro" 
             (click)="goToSlideByPoi(poi)">
          <div class="thumb-img-pro" [style.backgroundImage]="'url(' + extractImage(poi) + ')'"></div>
          <div class="thumb-glass"></div>
          <div class="thumb-label">
            <span class="city">{{ poi.city }}</span>
            <h4>{{ poi.name }}</h4>
          </div>
        </div>
      </div>

      <!-- Pro Hero Utils -->
      <div class="hero-footer container">
        <div class="indicator-pro">
          <div class="numbers">
            <span class="active-num">{{ padZero(activeIndex() + 1) }}</span>
            <span class="divider">/</span>
            <span class="total-num">{{ padZero(featuredPois().length) }}</span>
          </div>
          <div class="progress-track">
            <div class="progress-bar-pro" [style.width.%]="((activeIndex() + 1) / featuredPois().length) * 100"></div>
          </div>
        </div>
        
        <div class="nav-controls-pro">
          <button class="nav-btn-pro prev" (click)="prevSlide()"><i class="fas fa-chevron-left"></i></button>
          <button class="nav-btn-pro next" (click)="nextSlide()"><i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    </section>

    <!-- Main Content Section -->
    <section class="guide-body container animate-fade-in">
      <div class="section-header-pro text-center">
        <div class="pro-tag">
          <span class="dot"></span>
          <span>DÀNH CHO BẠN</span>
        </div>
        <h2 class="luxury-font pro-main-title">Cẩm Nang Du Lịch Nội Địa</h2>
        <p class="pro-section-desc">Tuyển tập những vùng đất mang đậm bản sắc văn hoá và thiên nhiên hùng vĩ, chắt lọc bởi đội ngũ chuyên gia hàng đầu.</p>
      </div>

      <!-- Region Navigation Pro Max -->
      <div class="pro-nav-container animate-fade-in-up">
        <div class="pro-nav-glass">
          <button class="pro-pill" [class.active]="selectedRegion() === 'ALL'" (click)="selectedRegion.set('ALL')">
            <i class="fas fa-globe-asia"></i>
            <span>Tất cả</span>
          </button>
          <button class="pro-pill" [class.active]="selectedRegion() === 'NORTH'" (click)="selectedRegion.set('NORTH')">
            <i class="fas fa-mountain"></i>
            <span>Miền Bắc</span>
          </button>
          <button class="pro-pill" [class.active]="selectedRegion() === 'CENTRAL'" (click)="selectedRegion.set('CENTRAL')">
            <i class="fas fa-landmark"></i>
            <span>Miền Trung</span>
          </button>
          <button class="pro-pill" [class.active]="selectedRegion() === 'SOUTH'" (click)="selectedRegion.set('SOUTH')">
            <i class="fas fa-umbrella-beach"></i>
            <span>Miền Nam</span>
          </button>
        </div>
      </div>

      <!-- Search & Quick Filters -->
      <div class="search-pro-container">
        <div class="search-wrap">
          <i class="fas fa-search search-icon"></i>
          <input type="text" placeholder="Tìm kiếm địa danh, thành phố hoặc cẩm nang du lịch..." (input)="onSearch($event)" />
        </div>
      </div>

      <!-- Guide Grid Pro -->
      <div class="pro-grid" *ngIf="!loading()">
        <div *ngFor="let poi of filteredPois(); let i = index" 
             class="pro-card reveal-item" 
             [style.animationDelay]="(i % 3) * 0.1 + 's'">
          <div class="pro-card-img" [style.backgroundImage]="'url(' + extractImage(poi) + ')'">
            <div class="overlay-gradient"></div>
            <div class="card-tags">
              <span class="tag-blur">{{ poi.category }}</span>
              <span class="tag-gold-blur" *ngIf="poi.rating"><i class="fas fa-star"></i> {{ poi.rating }}</span>
            </div>
            
            <!-- Quick Glance Button -->
            <button class="btn-quick-view" (click)="openDetail(poi)">
              <i class="fas fa-expand-alt"></i>
            </button>
          </div>
          <div class="pro-card-content">
            <span class="card-meta">{{ poi.city }} • {{ poi.bestTimeToVisit || 'Quanh năm' }}</span>
            <h3 class="luxury-font card-title-pro">{{ poi.name }}</h3>
            <p class="card-excerpt">{{ truncateDesc(poi.description, 100) }}</p>
            <div class="card-footer-pro">
              <button class="card-link" (click)="openDetail(poi)">KHÁM PHÁ CHI TIẾT <i class="fas fa-long-arrow-alt-right"></i></button>
              <div class="card-actions-minimal">
                <button class="btn-bookmark-mini" 
                        (click)="toggleFavorite($event, poi.id)"
                        [class.active]="isFavorite(poi.id)">
                  <i class="fas fa-bookmark"></i>
                </button>
                <i class="fas fa-share-alt share-btn"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-100" *ngIf="!loading() && filteredPois().length === 0">
        <div class="empty-icon-wrap">
          <i class="fas fa-compass"></i>
        </div>
        <h3 class="luxury-font text-gold mt-4">Thông tin đang được cập nhật</h3>
        <p class="text-gray mt-2">Chúng tôi đang chuẩn bị những bài viết chất lượng nhất cho phân vùng này.</p>
      </div>
    </section>

    <!-- Story Detail Modal - Pro Improvements -->
    <div class="guide-modal-overlay" *ngIf="selectedPoi() as detailPoi" (click)="closeDetail()">
      <div class="guide-modal-content animate-slide-up" (click)="$event.stopPropagation()">
        <button class="btn-close-pro" (click)="closeDetail()"><i class="fas fa-times"></i></button>
        
        <div class="modal-hero-pro" [style.backgroundImage]="'url(' + extractImage(detailPoi) + ')'">
          <div class="modal-hero-vignette"></div>
          <div class="modal-hero-text">
            <span class="cat-tag-pro">{{ detailPoi.category }}</span>
            <h2 class="luxury-font detail-title">{{ detailPoi.name }}</h2>
            <div class="detail-meta">
              <span><i class="fas fa-map-marker-alt"></i> {{ detailPoi.city }}</span>
              <span><i class="fas fa-clock"></i> {{ detailPoi.bestTimeToVisit }}</span>
              <span class="rating"><i class="fas fa-star"></i> {{ detailPoi.rating }}</span>
            </div>
          </div>
        </div>
        
        <!-- Internal Sticky Nav -->
        <nav class="handbook-nav-sticky">
          <a href="#overview" (click)="$event.preventDefault(); scrollInternal('overview')" class="h-nav-item">Tổng quan</a>
          <a href="#logistics" (click)="$event.preventDefault(); scrollInternal('logistics')" class="h-nav-item">Di chuyển</a>
          <a href="#discovery" (click)="$event.preventDefault(); scrollInternal('discovery')" class="h-nav-item">Khám phá</a>
          <a href="#culinary" (click)="$event.preventDefault(); scrollInternal('culinary')" class="h-nav-item">Ẩm thực</a>
          <a href="#itinerary" (click)="$event.preventDefault(); scrollInternal('itinerary')" class="h-nav-item">Lịch trình</a>
          <a href="#tips" (click)="$event.preventDefault(); scrollInternal('tips')" class="h-nav-item">Tips</a>
        </nav>
        
        <div class="modal-body-pro">
          <div class="article-layout-full">
            <div class="article-content" id="handbook-scroll-container">
              
              <!-- Handbook Content Rendering -->
              <ng-container *ngIf="getHandbook(detailPoi) as handbook; else comingSoon">
                <!-- Section 1: Overview -->
                <section id="overview" class="handbook-section">
                  <div class="section-label">PHẦN 1: TỔNG QUAN</div>
                  <div class="article-intro">
                    <p class="drop-cap">{{ detailPoi.description }}</p>
                  </div>
                  
                  <!-- Map Integration Pro -->
                  <div class="map-section-modal mt-40" *ngIf="detailPoi.latitude && detailPoi.longitude">
                    <div class="section-label">BẢN ĐỒ VỊ TRÍ</div>
                    <div class="map-modal-container glass-morph">
                        <iframe 
                            width="100%" 
                            height="350" 
                            frameborder="0" 
                            style="border:0;" 
                            [src]="getMapUrl(detailPoi) | safe" 
                            allowfullscreen>
                        </iframe>
                        <div class="map-modal-footer">
                            <span>📍 {{ detailPoi.address }}</span>
                            <a [href]="'https://www.google.com/maps?q=' + detailPoi.latitude + ',' + detailPoi.longitude" target="_blank" class="btn-maps-link">
                                Mở trong Google Maps <i class="fas fa-external-link-alt ml-1"></i>
                            </a>
                        </div>
                    </div>
                  </div>
                </section>

                <!-- Section 2: Logistics -->
                <section id="logistics" class="handbook-section">
                  <div class="section-label">PHẦN 2: DI CHUYỂN & LƯU TRÚ</div>
                  <div class="logistics-grid">
                    <div class="log-card glass-morph">
                      <i class="fas fa-motorcycle text-gold"></i>
                      <h4>Di chuyển</h4>
                      <p>{{ handbook.logistics }}</p>
                    </div>
                    <div class="log-card glass-morph">
                      <i class="fas fa-hotel text-gold"></i>
                      <h4>Lưu trú</h4>
                      <p>{{ handbook.accommodation }}</p>
                    </div>
                  </div>
                </section>

                <!-- Section 3: Discovery -->
                <section id="discovery" class="handbook-section">
                  <div class="section-label">PHẦN 3: BẢN ĐỒ KHÁM PHÁ</div>
                  <ul class="discovery-list">
                    <li *ngFor="let item of handbook.discovery">
                      <strong>{{ item.title }}:</strong> {{ item.desc }}
                    </li>
                  </ul>
                </section>

                <!-- Section 4: Culinary -->
                <section id="culinary" class="handbook-section">
                  <div class="section-label">PHẦN 4: HÀNH TRÌNH ẨM THỰC</div>
                  <div class="food-expert-box glass-morph">
                    <p>{{ handbook.culinary }}</p>
                  </div>
                </section>

                <!-- Section 5: Itinerary -->
                <section id="itinerary" class="handbook-section">
                  <div class="section-label">PHẦN 5: LỊCH TRÌNH TỐI ƯU</div>
                  <div class="iti-steps">
                    <div class="iti-step" *ngFor="let step of handbook.itinerary; let i = index">
                      <span>N{{ i + 1 }}</span> {{ step }}
                    </div>
                  </div>
                </section>

                <!-- Section 6: Tips -->
                <section id="tips" class="handbook-section">
                  <div class="section-label">PHẦN 6: TIPS TỪ CHUYÊN GIA</div>
                  <div class="survival-tips-grid">
                    <div class="s-tip" *ngFor="let tip of handbook.tips">
                      <i class="fas fa-lightbulb text-gold"></i> {{ tip }}
                    </div>
                  </div>
                </section>
              </ng-container>

              <ng-template #comingSoon>
                <section class="handbook-section">
                  <div class="section-label">ĐANG CẬP NHẬT</div>
                  <div class="article-intro">
                    <p class="drop-cap">{{ detailPoi.description }}</p>
                    <p class="mt-40 text-center opacity-50">Cẩm nang chi tiết cho địa điểm này đang được đội ngũ chuyên gia biên soạn.</p>
                  </div>
                </section>
              </ng-template>

            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --gold-secondary: #B8860B; --bg-dark: #050a14; --text-muted: #94a3b8; }

    /* Hero Carousel Pro Max */
    .guide-hero { position: relative; height: 100vh; min-height: 800px; overflow: hidden; margin-top: -80px; background: var(--bg-dark); }
    .slides-container { position: absolute; inset: 0; }
    .slide { position: absolute; inset: 0; opacity: 0; visibility: hidden; z-index: 1; transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1); background: var(--bg-dark); }
    .slide.active { opacity: 1; visibility: visible; z-index: 2; }
    
    .hero-bg { position: absolute; inset: 0; background-size: cover; background-position: center; transition: transform 0.1s linear; opacity: 1; visibility: visible; }
    
    .hero-overlay-complex { 
      position: absolute; inset: 0; 
      background: 
        linear-gradient(to right, rgba(5,10,20,0.95) 0%, rgba(5,10,20,0.4) 40%, transparent 100%),
        linear-gradient(to top, rgba(5,10,20,1) 0%, rgba(5,10,20,0) 50%);
      z-index: 3;
    }
    
    .hero-content { position: relative; z-index: 10; height: 100%; display: flex; align-items: center; padding-top: 100px; }
    .text-content { max-width: 750px; }
    
    .trend-tag { 
      display: inline-block; background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); 
      padding: 8px 24px; border-radius: 4px; border-left: 3px solid var(--gold-primary); 
      font-size: 0.8rem; font-weight: 700; text-transform: uppercase; letter-spacing: 4px; 
      margin-bottom: 30px; box-shadow: 10px 0 30px rgba(212,175,55,0.1);
    }
    
    .hero-title { font-size: 6.5rem; line-height: 1; margin-bottom: 24px; color: white; letter-spacing: -2px; font-family: 'Playfair Display', serif; }
    @media (max-width: 1200px) { .hero-title { font-size: 4.5rem; } }

    .hero-desc { font-size: 1.1rem; color: #cbd5e1; opacity: 0.8; line-height: 1.8; margin-bottom: 45px; max-width: 550px; }
    
    .hero-meta-grid { display: flex; gap: 40px; margin-bottom: 40px; }
    .meta-item { display: flex; align-items: center; gap: 15px; }
    .icon-gold { font-size: 1.5rem !important; color: var(--gold-primary) !important; opacity: 1 !important; display: inline-block !important; }
    .meta-item label { display: block; font-size: 0.7rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 2px; margin-bottom: 4px; }
    .meta-item span { color: white; font-weight: 600; font-size: 1rem; }

    .btn-pro-gold { 
      background: var(--gold-primary); color: #000; border: none; padding: 18px 45px; 
      font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-size: 0.9rem;
      border-radius: 4px; cursor: pointer; display: flex; align-items: center; 
      transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1); position: relative; z-index: 10;
    }
    .btn-pro-gold:hover { background: #fff; transform: translateY(-5px); box-shadow: 0 15px 35px rgba(212,175,55,0.3); }

    .thumbnail-stack { position: absolute; right: 100px; bottom: 120px; z-index: 20; display: flex; gap: 30px; }
    .thumb-card-pro { 
      width: 220px; height: 320px; border-radius: 12px; overflow: hidden; position: relative; 
      cursor: pointer; border: 1px solid rgba(255,255,255,0.08); transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    }
    .thumb-card-pro:hover { transform: translateY(-30px) scale(1.05); border-color: var(--gold-primary); box-shadow: 0 20px 40px rgba(0,0,0,0.5); }
    .thumb-img-pro { position: absolute; inset: 0; background-size: cover; background-position: center; transition: 0.8s; }
    .thumb-glass { position: absolute; inset: 0; background: linear-gradient(to top, rgba(5,10,20,0.95), transparent); }
    .thumb-label { position: absolute; bottom: 30px; left: 20px; right: 20px; color: white; }
    .thumb-label h4 { font-size: 1.1rem; font-family: 'Playfair Display', serif; }

    .hero-footer { position: absolute; left: 0; right: 0; bottom: 60px; z-index: 20; display: flex; justify-content: space-between; align-items: flex-end; }
    .indicator-pro { display: flex; align-items: center; gap: 30px; }
    .active-num { font-size: 2rem; font-weight: 700; color: var(--gold-primary); font-family: 'Playfair Display', serif; }
    .total-num { color: #fff; opacity: 0.5; font-family: 'Playfair Display', serif; }
    .progress-track { width: 150px; height: 2px; background: rgba(255,255,255,0.1); }
    .progress-bar-pro { height: 100%; background: var(--gold-primary); }
    
    .nav-controls-pro { display: flex; gap: 15px; }
    .nav-btn-pro { 
      width: 60px; height: 60px; border-radius: 50%; border: 1px solid rgba(212,175,55,0.3); 
      background: rgba(255,255,255,0.05); color: var(--gold-primary); cursor: pointer; transition: 0.3s;
      display: flex; align-items: center; justify-content: center; backdrop-filter: blur(10px);
    }
    .nav-btn-pro:hover { background: var(--gold-primary); color: #000; transform: scale(1.1); }
    .nav-btn-pro i { font-size: 1.2rem; display: block; }

    /* Section Header Pro Max */
    .section-header-pro { margin: 100px 0 60px; }
    .pro-tag { 
      display: inline-flex; align-items: center; gap: 10px; background: rgba(212,175,55,0.1); 
      padding: 6px 20px; border-radius: 20px; color: var(--gold-primary); 
      font-size: 0.65rem; font-weight: 800; letter-spacing: 3px; margin-bottom: 20px;
    }
    .pro-tag .dot { width: 6px; height: 6px; background: var(--gold-primary); border-radius: 50%; box-shadow: 0 0 10px var(--gold-primary); }
    .pro-main-title { font-size: 3.5rem; color: #fff; margin-bottom: 20px; letter-spacing: -1px; font-family: 'Playfair Display', serif; }
    .pro-section-desc { color: #94a3b8; font-size: 1.1rem; max-width: 650px; margin: 0 auto; line-height: 1.8; opacity: 0.8; }

    /* Region Navigation Pro Max */
    .pro-nav-container { display: flex; justify-content: center; margin: 50px 0 100px; }
    .pro-nav-glass { 
      display: flex; gap: 10px; background: rgba(255,255,255,0.03); 
      padding: 8px; border-radius: 60px; border: 1px solid rgba(255,255,255,0.05); 
      backdrop-filter: blur(20px); box-shadow: 0 30px 60px rgba(0,0,0,0.3);
    }
    .pro-pill { 
      background: transparent; border: none; color: #94a3b8; padding: 14px 35px; 
      border-radius: 50px; cursor: pointer; display: flex; align-items: center; gap: 12px;
      font-weight: 700; text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem;
      transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }
    .pro-pill i { font-size: 0.9rem; opacity: 0.6; transition: 0.3s; }
    .pro-pill:hover { color: #fff; background: rgba(255,255,255,0.05); }
    .pro-pill:hover i { transform: rotate(15deg) scale(1.2); opacity: 1; }
    
    .pro-pill.active { 
      background: linear-gradient(135deg, #FFD700 0%, #D4AF37 50%, #B8860B 100%);
      color: #000; box-shadow: 0 10px 30px rgba(212,175,55,0.4); transform: scale(1.05);
    }
    .pro-pill.active i { opacity: 1; color: #000; }
    
    @media (max-width: 768px) {
      .pro-nav-glass { flex-direction: column; border-radius: 20px; width: 100%; padding: 15px; }
      .pro-pill { justify-content: center; width: 100%; }
    }

    /* Grid & Cards Pro Max */
    .pro-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(380px, 1fr)); gap: 40px; margin-bottom: 100px; }
    .pro-card { background: #0a0f1a; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); transition: 0.6s cubic-bezier(0.165, 0.84, 0.44, 1); position: relative; }
    .pro-card:hover { transform: translateY(-15px); border-color: var(--gold-primary); }
    
    .pro-card-img { height: 320px; background-size: cover; background-position: center; position: relative; overflow: hidden; transition: 0.8s; }
    .pro-card:hover .pro-card-img { transform: scale(1.05); }
    .overlay-gradient { position: absolute; inset: 0; background: linear-gradient(to top, #0a0f1a 0%, transparent 60%); }
    
    .card-tags { position: absolute; top: 20px; left: 20px; right: 20px; display: flex; justify-content: space-between; z-index: 5; }
    .tag-blur { background: rgba(0,0,0,0.4); backdrop-filter: blur(10px); color: #fff; padding: 6px 15px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; border: 1px solid rgba(255,255,255,0.1); }
    .tag-gold-blur { background: rgba(212,175,55,0.15); backdrop-filter: blur(10px); color: var(--gold-primary); padding: 6px 15px; border-radius: 4px; font-size: 0.65rem; font-weight: 800; border: 1px solid rgba(212,175,55,0.3); }

    .pro-card-content { padding: 35px; position: relative; z-index: 5; }
    .card-meta { display: block; color: var(--gold-primary); font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 15px; }
    .card-title-pro { font-size: 2.2rem; color: white; font-family: 'Playfair Display', serif; margin-bottom: 15px; line-height: 1.2; }
    .card-excerpt { color: #94a3b8; line-height: 1.8; font-size: 1rem; margin-bottom: 30px; }
    .card-link { background: none; border: none; color: var(--gold-primary); font-weight: 800; font-size: 0.75rem; letter-spacing: 2px; cursor: pointer; display: flex; align-items: center; gap: 12px; transition: 0.3s; text-transform: uppercase; }
    .card-link:hover { gap: 20px; color: #fff; }

    /* Modal Pro Max Fixes */
    .guide-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); z-index: 10000; display: flex; justify-content: center; align-items: flex-end; }
    .guide-modal-content { background: #050a14; width: 100%; max-width: 1200px; height: 90vh; border-radius: 24px 24px 0 0; overflow-y: auto; position: relative; border: 1px solid rgba(212,175,55,0.3); }
    .btn-close-pro { position: absolute; top: 30px; right: 30px; z-index: 10010; width: 50px; height: 50px; border-radius: 50%; background: #000; border: 1px solid var(--gold-primary); color: var(--gold-primary); cursor: pointer; display: flex; align-items: center; justify-content: center; }

    .modal-hero-pro { height: 500px; background-size: cover; background-position: center; position: relative; display: flex; align-items: flex-end; padding: 60px; }
    .modal-hero-vignette { position: absolute; inset: 0; background: linear-gradient(to top, #050a14 0%, transparent 100%); }
    .modal-hero-text { position: relative; z-index: 10; }
    .detail-title { font-size: 4rem; color: #fff; font-family: 'Playfair Display', serif; margin-bottom: 15px; }
    .detail-meta { display: flex; gap: 30px; color: #cbd5e1; }
    .detail-meta span { display: flex; align-items: center; gap: 8px; }
    .detail-meta i { color: var(--gold-primary); }

    .modal-body-pro { padding: 60px; max-width: 1000px; margin: 0 auto; }
    .article-layout-full { width: 100%; }
    .drop-cap::first-letter { font-family: 'Playfair Display', serif; float: left; font-size: 5rem; color: var(--gold-primary); font-weight: 700; margin-right: 15px; line-height: 0.8; }
    
    /* Modal Handbook Styling */
    .handbook-nav-sticky { position: sticky; top: 0; background: rgba(5,10,20,0.8); backdrop-filter: blur(10px); z-index: 50; display: flex; gap: 25px; padding: 0 60px; height: 55px; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .h-nav-item { color: #fff; opacity: 0.5; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; text-decoration: none; transition: 0.3s; }
    .h-nav-item:hover { opacity: 1; color: var(--gold-primary); }

    .handbook-section { margin-bottom: 70px; scroll-margin-top: 80px; }
    .section-label { font-size: 0.75rem; font-weight: 800; color: var(--gold-primary); margin-bottom: 15px; letter-spacing: 1px; }
    
    .logistics-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 25px; }
    .log-card { padding: 25px; border-radius: 12px; border: 1px solid rgba(212,175,55,0.2); }
    .log-card i { font-size: 1.5rem; margin-bottom: 15px; color: var(--gold-primary); }
    .log-card h4 { color: white; margin-bottom: 10px; font-size: 1.1rem; }
    .log-card p { font-size: 0.9rem; color: #94a3b8; line-height: 1.6; }

    .discovery-list { list-style: none; padding: 0; }
    .discovery-list li { position: relative; padding-left: 25px; margin-bottom: 15px; color: #cbd5e1; line-height: 1.7; }
    .discovery-list li::before { content: '✦'; position: absolute; left: 0; color: var(--gold-primary); }

    .food-expert-box { padding: 25px; border-left: 3px solid var(--gold-primary); font-style: italic; color: #fff; font-size: 1.1rem; background: rgba(212,175,55,0.05); border-radius: 0 12px 12px 0; }

    .iti-steps { display: flex; flex-direction: column; gap: 12px; }
    .iti-step { background: rgba(212,175,55,0.05); padding: 15px 20px; border-radius: 8px; color: #fff; font-weight: 600; font-size: 0.95rem; }
    .iti-step span { color: var(--gold-primary); font-weight: 800; margin-right: 15px; }

    .survival-tips-grid { display: grid; grid-template-columns: 1fr; gap: 10px; }
    .s-tip { display: flex; align-items: center; gap: 15px; background: rgba(255,255,255,0.03); padding: 12px 20px; border-radius: 40px; color: #fff; font-size: 0.9rem; }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
    @keyframes revealUp { from { transform: translateY(100%); } to { transform: translateY(0); } }

    /* Search Bar Pro */
    .search-pro-container { margin-bottom: 50px; position: relative; z-index: 10; }
    .search-wrap { 
      max-width: 800px; margin: 0 auto; position: relative;
      background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
      border-radius: 20px; padding: 5px; backdrop-filter: blur(10px);
      transition: 0.4s;
    }
    .search-wrap:focus-within { border-color: var(--gold-primary); box-shadow: 0 0 40px rgba(212,175,55,0.1); }
    .search-icon { position: absolute; left: 30px; top: 50%; transform: translateY(-50%); color: var(--gold-primary); font-size: 1.2rem; }
    .search-wrap input { 
      width: 100%; background: none; border: none; padding: 18px 20px 18px 70px; 
      color: #f1f5f9; font-size: 1.1rem; outline: none;
    }

    .card-footer-pro { display: flex; justify-content: space-between; align-items: center; }
    .card-actions-minimal { display: flex; gap: 20px; align-items: center; }
    
    .btn-bookmark-mini {
      background: none; border: none; 
      color: #64748b; font-size: 1.1rem; cursor: pointer;
      transition: all 0.3s; padding: 0; display: flex; align-items: center;
    }
    .btn-bookmark-mini:hover { color: var(--gold-primary); transform: scale(1.2); }
    .btn-bookmark-mini.active { color: var(--gold-primary); }

    .share-btn { color: #64748b; cursor: pointer; transition: 0.3s; }
    .share-btn:hover { color: var(--gold-primary); }

    .mt-40 { margin-top: 40px; }
    .ml-2 { margin-left: 8px; }
    .ml-1 { margin-left: 4px; }

    /* Map Modal Addition */
    .map-section-modal { margin-bottom: 50px; }
    .map-modal-container { border-radius: 20px; overflow: hidden; border: 1px solid rgba(212,175,55,0.3); }
    .map-modal-footer { padding: 15px 25px; display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.5); border-top: 1px solid rgba(255,255,255,0.05); }
    .map-modal-footer span { font-size: 0.9rem; color: #94a3b8; }
    .btn-maps-link { color: var(--gold-primary); text-decoration: none; font-size: 0.85rem; font-weight: 700; transition: 0.3s; }
    .btn-maps-link:hover { color: #fff; }
  `]
})
export class PoiListComponent implements OnInit, OnDestroy {
  private service = inject(CatalogService);
  private favoriteService = inject(FavoriteService);
  private el = inject(ElementRef);

  pois = signal<POI[]>([]);
  favorites = signal<Set<string>>(new Set());
  loading = signal(true);
  selectedRegion = signal<string>('ALL');
  selectedPoi = signal<POI | null>(null);
  searchTerm = signal<string>('');
  
  activeIndex = signal(0);
  private timerId?: any;

  featuredPois = computed(() => {
    const list = this.pois();
    if (list.length === 0) return [];
    return [...list].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 8);
  });

  getUpcomingPois = computed(() => {
    const all = this.featuredPois();
    const idx = this.activeIndex();
    if (all.length <= 1) return [];
    const upcoming = [];
    for (let i = 1; i <= 3; i++) {
      upcoming.push(all[(idx + i) % all.length]);
    }
    return upcoming;
  });

  filteredPois = computed(() => {
    let list = this.pois();
    const region = this.selectedRegion();
    const query = this.searchTerm().toLowerCase();

    if (region !== 'ALL') {
      list = list.filter(p => p.region === region);
    }

    if (query) {
      list = list.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.city.toLowerCase().includes(query) || 
        p.category.toLowerCase().includes(query)
      );
    }

    return list;
  });

  constructor() {
    effect(() => {
      const index = this.activeIndex();
      this.animateSlide(index);
    });
  }

  ngOnInit() {
    this.service.getPOIs().subscribe({
      next: (res) => {
        if (res.success) {
          this.pois.set(res.data);
          this.startTimer();
        }
        this.loading.set(false);
      }
    });
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getAllFavorites().subscribe(res => {
      if (res.success && res.data.pois) {
        const ids = res.data.pois.map((p: any) => p.id);
        this.favorites.set(new Set(ids));
      }
    });
  }

  isFavorite(id: string) {
    return this.favorites().has(id);
  }

  toggleFavorite(event: Event, poiId: string) {
    event.stopPropagation();
    this.favoriteService.toggleFavorite({ itemType: 'POI', itemId: poiId }).subscribe(res => {
      if (res.success) {
        const newFavs = new Set(this.favorites());
        if (newFavs.has(poiId)) newFavs.delete(poiId);
        else newFavs.add(poiId);
        this.favorites.set(newFavs);
      }
    });
  }

  getMapUrl(poi: POI): string {
    if (!poi.latitude || !poi.longitude) return '';
    return `https://maps.google.com/maps?q=${poi.latitude},${poi.longitude}&z=15&output=embed`;
  }

  ngOnDestroy() { this.stopTimer(); }

  startTimer() {
    this.stopTimer();
    this.timerId = setInterval(() => this.nextSlide(), 8000);
  }

  stopTimer() { if (this.timerId) clearInterval(this.timerId); }

  nextSlide() {
    const total = this.featuredPois().length;
    if (total === 0) return;
    this.activeIndex.set((this.activeIndex() + 1) % total);
  }

  prevSlide() {
    const total = this.featuredPois().length;
    if (total === 0) return;
    this.activeIndex.set((this.activeIndex() - 1 + total) % total);
  }

  goToSlideByPoi(poi: POI) {
    const idx = this.featuredPois().findIndex(p => p.id === poi.id);
    if (idx !== -1) {
      this.activeIndex.set(idx);
      this.startTimer();
    }
  }

  private animateSlide(index: number) {
    setTimeout(() => {
      const container = this.el.nativeElement.querySelector('.guide-hero');
      if (!container) return;

      const activeSlide = container.querySelector('.slide.active');
      if (!activeSlide) return;

      const title = activeSlide.querySelector('.hero-title');
      const desc = activeSlide.querySelector('.hero-desc');
      const meta = activeSlide.querySelectorAll('.meta-item');
      const btn = activeSlide.querySelector('.btn-pro-gold');
      const tag = activeSlide.querySelector('.trend-tag');
      const bg = activeSlide.querySelector('.hero-bg');

      // Main Entry Animation
      const tl = gsap.timeline();

      // Ensure Background is visible
      gsap.set(bg, { opacity: 1, scale: 1, filter: 'blur(0px)' });

      tl.fromTo(tag, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8, ease: 'power4.out' }, '+=0.2')
        .fromTo(title, { y: 100, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.6')
        .fromTo(desc, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'power4.out' }, '-=0.8')
        .fromTo(meta, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power4.out' }, '-=0.6')
        .fromTo(btn, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' }, '-=0.4');

      // Animate Thumbnails
      gsap.fromTo('.thumb-card-pro',
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.1, ease: 'power4.out', delay: 0.5 }
      );
    }, 0);
  }

  padZero(n: number): string { return n < 10 ? `0${n}` : `${n}`; }

  extractImage(poi: POI): string {
    const fallback = 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=1200';
    if (!poi.imagesJson || poi.imagesJson === 'null' || poi.imagesJson === '[]') return fallback;
    try {
      const imgs = JSON.parse(poi.imagesJson);
      return imgs && imgs.length > 0 ? imgs[0] : fallback;
    } catch { return fallback; }
  }

  truncateDesc(desc?: string, length: number = 100): string {
    if (!desc) return '';
    return desc.length <= length ? desc : desc.substring(0, length).trim() + '...';
  }

  openDetail(poi: POI) {
    this.selectedPoi.set(poi);
    document.body.style.overflow = 'hidden';
  }

  closeDetail() {
    this.selectedPoi.set(null);
    document.body.style.overflow = '';
  }

  onSearch(event: any) {
    this.searchTerm.set(event.target.value);
  }

  askAI() {
    alert("Cửa sổ Trợ lý AI đang được khởi tạo. Bạn có thể hỏi về bất kỳ địa danh nào tại đây!");
  }

  getHandbook(poi: POI) {
    if (!poi.handbookJson) return null;
    try {
      return JSON.parse(poi.handbookJson);
    } catch { return null; }
  }

  scrollInternal(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
