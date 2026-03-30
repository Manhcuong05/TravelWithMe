import { Component, AfterViewInit, OnDestroy, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- HERO SECTION -->
    <section class="hero-section">
      <div class="hero-bg" style="background-image: url('/images/home_hero.png')"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content container">
        <h1 class="luxury-font main-title animate-on-load">Hành Trình Độc Bản<br><span class="gold-gradient-text">Dành Riêng Cho Bạn</span></h1>
        <p class="subtitle-hero animate-on-load">Khám phá thế giới qua lăng kính công nghệ AI và dịch vụ độc bản, được kiến tạo bởi đam mê của những sinh viên CMC.</p>
        <div class="hero-actions animate-on-load">
           <button routerLink="/tours" class="btn-primary-pro">KHÁM PHÁ NGAY</button>
           <button routerLink="/itinerary" class="btn-glass-pro">TRẢI NGHIỆM AI</button>
        </div>
      </div>
      <div class="scroll-indicator">
         <div class="mouse"></div>
         <span>CUỘN ĐỂ KHÁM PHÁ</span>
      </div>
    </section>

    <!-- AI FEATURES SECTION -->
    <section class="ai-experience container-fluid">
      <div class="ai-bg-glow"></div>
      <div class="container staggered-grid">
        <div class="grid-visual animate-left">
           <div class="glass-visual-card">
              <div class="ai-orb-container">
                <div class="ai-orb-ring ring-1"></div>
                <div class="ai-orb-ring ring-2"></div>
                <div class="ai-orb-ring ring-3"></div>
                <i class="fas fa-brain ai-icon"></i>
              </div>
              <h3>Lập Kế Hoạch AI</h3>
              <p>Thấu hiểu sở thích của bạn để thiết kế hành trình độc bản chỉ trong vài giây.</p>
              <div class="ai-stats-row">
                <div class="ai-stat">
                  <span class="stat-num gold-gradient-text">98%</span>
                  <span class="stat-label">Hài lòng</span>
                </div>
                <div class="ai-stat-divider"></div>
                <div class="ai-stat">
                  <span class="stat-num gold-gradient-text">10K+</span>
                  <span class="stat-label">Hành trình</span>
                </div>
                <div class="ai-stat-divider"></div>
                <div class="ai-stat">
                  <span class="stat-num gold-gradient-text">24/7</span>
                  <span class="stat-label">Hỗ trợ</span>
                </div>
              </div>
           </div>
        </div>
        <div class="grid-text animate-right">
           <span class="pro-tag">Công Nghệ Tương Lai</span>
           <h2 class="luxury-font section-title">Du Lịch Thông Minh <br>Bắt Đầu Từ <span class="gold-text">Trí Tuệ Nhân Tạo</span></h2>
           <p>Chúng tôi ứng dụng các thuật toán AI tiên tiến nhất để phân tích hàng triệu dữ liệu, từ thời tiết đến sở thích cá nhân, nhằm kiến tạo một chuyến đi hoàn hảo cho riêng bạn.</p>
           <ul class="check-list">
              <li><i class="fas fa-check-circle gold-text"></i> Gợi ý điểm đến cá nhân hóa 100%.</li>
              <li><i class="fas fa-check-circle gold-text"></i> Tối ưu hóa thời gian và ngân sách.</li>
              <li><i class="fas fa-check-circle gold-text"></i> Hỗ trợ trợ lý ảo 24/7 trong suốt hành trình.</li>
           </ul>
           <button routerLink="/itinerary" class="btn-primary-pro mt-8" style="margin-top: 40px; display: inline-block;">THỬ NGAY MIỄN PHÍ</button>
        </div>
      </div>
    </section>

    <!-- COLLECTIONS SECTION -->
    <section class="collections container">
      <div class="section-header text-center">
        <span class="pro-tag">BỘ SƯU TẬP</span>
        <h2 class="luxury-font">Điểm Đến Tuyển Chọn</h2>
      </div>
      
      <div class="collection-grid">
        <div class="collection-item large glass-card animate-card" (click)="navigate('/hotels')">
           <div class="coll-img" style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600')"></div>
           <div class="coll-info">
              <h3>Khách Sạn Boutique</h3>
              <p>Những không gian độc bản, dịch vụ xuất sắc.</p>
           </div>
        </div>
        <div class="collection-item glass-card animate-card" (click)="navigate('/villas')">
           <div class="coll-img" style="background-image: url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600')"></div>
           <div class="coll-info">
              <h3>Biệt Thự Biệt Lập</h3>
              <p>Sự riêng tư tuyệt đối cho gia đình.</p>
           </div>
        </div>
        <div class="collection-item glass-card animate-card" (click)="navigate('/dining')">
           <div class="coll-img" style="background-image: url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=600')"></div>
           <div class="coll-info">
              <h3>Ẩm Thực Tinh Hoa</h3>
              <p>Trải nghiệm vị giác chuẩn mực.</p>
           </div>
        </div>
      </div>
    </section>

    <!-- STUDENT STORY SECTION (CMC) -->
    <section class="student-story container-fluid">
       <div class="story-bg-overlay"></div>
       <div class="container story-content">
          <div class="story-text-center text-center">
             <span class="pro-tag white">CÂU CHUYỆN SÁNG LẬP</span>
             <h2 class="luxury-font">Kiến tạo bởi đam mê của<br>nhóm 5 sinh viên <span class="gold-text">Đại học CMC</span></h2>
             <p>Khởi nguồn từ một dự án tại trường học, chúng tôi - 5 sinh viên CMC - đã khát khao biến việc du lịch trở nên dễ dàng và đẳng cấp hơn nhờ sức mạnh của AI. "TravelWithMe" không chỉ là một ứng dụng, đó là tầm nhìn của chúng tôi về một thế giới du lịch thông minh và bền vững.</p>
             <button routerLink="/about/brand-story" class="btn-outline-white">XEM CÂU CHUYỆN CỦA CHÚNG TÔI</button>
          </div>
       </div>
    </section>
  `,
  styles: [`
    :host { --gold-primary: #D4AF37; --bg-dark: #050a14; --glass-bg: rgba(255, 255, 255, 0.03); }
    
    /* Layout & Base */
    section { position: relative; overflow: hidden; }
    .container { max-width: 1280px; margin: 0 auto; padding: 0 24px; }
    .container-fluid { width: 100%; padding: 120px 0; }
    .text-center { text-align: center; }
    .gold-text { color: var(--gold-primary); }
    .gold-gradient-text { background: linear-gradient(135deg, #d4af37 0%, #f9e29c 50%, #d4af37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    .pro-tag { display: inline-block; background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.3); color: var(--gold-primary); padding: 6px 16px; border-radius: 30px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 3px; margin-bottom: 25px; }
    .white { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.2); color: #fff; }

    /* HERO */
    .hero-section { height: 100vh; display: flex; align-items: center; background: #000; }
    .hero-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.3s; will-change: transform; }
    .hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle, rgba(5,10,20,0.3) 0%, rgba(5,10,20,0.8) 100%); }
    .hero-content { position: relative; z-index: 5; text-align: center; }
    .main-title { font-size: clamp(3rem, 8vw, 6rem); color: #fff; line-height: 1.1; margin-bottom: 30px; font-weight: 700; letter-spacing: -1px; }
    .main-title .gold-gradient-text { font-size: 0.70em; display: block; margin-top: 5px; }
    .subtitle-hero { font-size: clamp(1.1rem, 2vw, 1.4rem); color: rgba(255,255,255,0.85); max-width: 800px; margin: 0 auto 50px; line-height: 1.6; font-weight: 300; }
    
    .hero-actions { display: flex; gap: 20px; justify-content: center; }
    .btn-primary-pro { background: var(--gold-primary); color: #000; border: none; padding: 18px 45px; border-radius: 40px; font-weight: 800; font-size: 0.9rem; letter-spacing: 2px; cursor: pointer; transition: 0.4s; }
    .btn-primary-pro:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.4); }
    .btn-glass-pro { background: rgba(255,255,255,0.08); backdrop-filter: blur(10px); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 18px 45px; border-radius: 40px; font-weight: 700; font-size: 0.9rem; letter-spacing: 2px; cursor: pointer; transition: 0.4s; }
    .btn-glass-pro:hover { background: rgba(255,255,255,0.15); border-color: #fff; }

    .scroll-indicator { position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); text-align: center; color: rgba(255,255,255,0.5); font-size: 0.7rem; letter-spacing: 3px; }
    .mouse { width: 24px; height: 40px; border: 2px solid rgba(255,255,255,0.3); border-radius: 12px; margin: 0 auto 10px; position: relative; }
    .mouse::after { content: ''; position: absolute; top: 8px; left: 50%; transform: translateX(-50%); width: 4px; height: 8px; background: var(--gold-primary); border-radius: 2px; animation: scrollMouse 2s infinite; }
    @keyframes scrollMouse { 0% { opacity: 1; top: 8px; } 100% { opacity: 0; top: 25px; } }

    /* AI STAGGERED GRID */
    .ai-experience { background: #050a14; position: relative; }
    .ai-bg-glow { position: absolute; top: 50%; left: 25%; transform: translate(-50%, -50%); width: 600px; height: 600px; background: radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%); pointer-events: none; }
    .container-fluid { width: 100%; padding: 80px 0; }
    .staggered-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
    
    /* AI Visual Card - Enriched */
    .glass-visual-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(212,175,55,0.15); padding: 50px 40px; border-radius: 40px; text-align: center; backdrop-filter: blur(20px); position: relative; overflow: hidden; }
    .glass-visual-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, transparent, rgba(212,175,55,0.4), transparent); }
    
    /* AI Orb Animation */
    .ai-orb-container { position: relative; width: 130px; height: 130px; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; }
    .ai-orb-ring { position: absolute; border-radius: 50%; border: 1px solid rgba(212,175,55,0.3); animation: orbitRing 4s infinite linear; }
    .ring-1 { width: 100%; height: 100%; animation-duration: 4s; }
    .ring-2 { width: 75%; height: 75%; animation-duration: 3s; animation-direction: reverse; border-color: rgba(212,175,55,0.2); }
    .ring-3 { width: 50%; height: 50%; animation-duration: 2s; border-color: rgba(212,175,55,0.1); }
    @keyframes orbitRing { to { transform: rotate(360deg); } }
    .ai-icon { font-size: 3.5rem; color: var(--gold-primary); text-shadow: 0 0 30px rgba(212, 175, 55, 0.6); position: relative; z-index: 2; }
    
    /* Stats Row */
    .ai-stats-row { display: flex; align-items: center; justify-content: center; gap: 20px; margin-top: 35px; padding-top: 25px; border-top: 1px solid rgba(255,255,255,0.05); }
    .ai-stat { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .stat-num { font-size: 1.6rem; font-weight: 800; font-family: 'Playfair Display', serif; }
    .stat-label { font-size: 0.75rem; color: rgba(255,255,255,0.4); letter-spacing: 1px; text-transform: uppercase; }
    .ai-stat-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.08); }
    
    .section-title { font-size: clamp(2.5rem, 4vw, 3.5rem); color: #fff; line-height: 1.2; margin-bottom: 30px; }
    .check-list { list-style: none; padding: 0; margin-top: 35px; }
    .check-list li { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; color: rgba(255,255,255,0.7); font-size: 1.1rem; }

    /* COLLECTIONS */
    .collections { margin-bottom: 150px; }
    .collection-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; margin-top: 80px; }
    .collection-item { position: relative; height: 500px; border-radius: 32px; overflow: hidden; cursor: pointer; }
    .coll-img { position: absolute; width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.8s; }
    .collection-item:hover .coll-img { transform: scale(1.1); }
    .coll-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 40px; background: linear-gradient(to top, rgba(0,0,0,0.9), transparent); display: flex; flex-direction: column; justify-content: flex-end; }
    .coll-info h3 { font-size: 1.8rem; margin-bottom: 10px; color: #fff; }
    .coll-info p { color: rgba(255,255,255,0.7); font-weight: 300; }

    /* STORY SECTION */
    .student-story { height: 70vh; min-height: 600px; display: flex; align-items: center; position: relative; background: #000; }
    .story-bg-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1600'); background-size: cover; background-position: center; filter: grayscale(100%) brightness(0.3); }
    .story-content { position: relative; z-index: 5; }
    .story-text-center h2 { font-size: clamp(2.5rem, 5vw, 4rem); color: #fff; margin-bottom: 30px; line-height: 1.2; }
    .story-text-center p { max-width: 850px; margin: 0 auto 50px; color: rgba(255,255,255,0.7); font-size: 1.25rem; line-height: 1.8; font-weight: 300; }
    .btn-outline-white { background: transparent; border: 1px solid #fff; color: #fff; padding: 18px 40px; border-radius: 40px; font-weight: 700; cursor: pointer; transition: 0.4s; letter-spacing: 2px; }
    .btn-outline-white:hover { background: #fff; color: #000; }

    @media (max-width: 1024px) {
      .staggered-grid { grid-template-columns: 1fr; gap: 50px; text-align: center; }
      .check-list li { justify-content: center; }
      .collection-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private lenis: any;
  private ctx: any;
  private router = inject(Router);

  constructor(private el: ElementRef) { }

  navigate(path: string) {
    this.router.navigate([path]);
  }

  ngAfterViewInit() {
    // 1. Smooth Scroll (Lenis)
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const raf = (time: number) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // GSAP Setup
    gsap.registerPlugin(ScrollTrigger);

    this.ctx = gsap.context(() => {
      // Hero Animations
      const tl = gsap.timeline();
      tl.from('.hero-bg', { scale: 1.2, duration: 2.5, ease: 'power2.out' })
        .from('.animate-on-load', {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power4.out'
        }, '-=1.5');

      // AI Section Animations
      gsap.from('.animate-left', {
        x: -50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ai-experience',
          start: 'top 95%',
        }
      });

      gsap.from('.animate-right', {
        x: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.ai-experience',
          start: 'top 95%',
        }
      });

      // Collections Grid
      gsap.from('.animate-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.collections',
          start: 'top 95%',
        }
      });

      // Story Section Parallax
      gsap.from('.story-content', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.student-story',
          start: 'top 95%',
        }
      });

      // Hero Parallax
      gsap.to('.hero-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }, this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.lenis) this.lenis.destroy();
    if (this.ctx) this.ctx.revert();
  }
}
