import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from '@studio-freight/lenis';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="hero-section">
      <div class="hero-bg"></div>
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="luxury-font">Khám Phá Những Hành Trình<br>Phi Thường Cùng Chúng Tôi</h1>
        <p class="subtitle">Trải nghiệm sự sang trọng được định nghĩa lại. Những hành trình được thiết kế riêng vượt xa mọi mong đợi.</p>
        <!-- Removed Search Bar for visual space -->
      </div>
    </section>

    <section class="featured-sections container">
      <div class="section-header">
        <h2 class="luxury-font">Bộ Sưu Tập Tuyển Chọn</h2>
        <p>Những điểm lưu trú và trải nghiệm được chọn lọc kỹ lưỡng cho những lữ khách tinh tế.</p>
      </div>
      
      <div class="grid grid-3-cols">
        <!-- Khách Sạn Boutique -->
        <div class="card glass-effect">
          <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600')"></div>
          <div class="card-body">
            <h3 class="luxury-font">Khách Sạn Boutique</h3>
            <p>Những không gian độc đáo, dịch vụ xuất sắc.</p>
            <a routerLink="/hotels" class="link-gold">Xem Khách Sạn →</a>
          </div>
        </div>
        
        <!-- Biệt Thự Biệt Lập -->
        <div class="card glass-effect">
          <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600')"></div>
          <div class="card-body">
            <h3 class="luxury-font">Biệt Thự Biệt Lập</h3>
            <p>Sự riêng tư tuyệt đối, trải nghiệm đẳng cấp.</p>
            <a routerLink="/villas" class="link-gold">Khám Phá Villa →</a>
          </div>
        </div>

        <!-- Trải Nghiệm Ẩm Thực -->
        <div class="card glass-effect">
          <div class="card-img" style="background-image: url('https://images.unsplash.com/photo-1544148103-0773bf10d330?auto=format&fit=crop&q=80&w=600')"></div>
          <div class="card-body">
            <h3 class="luxury-font">Hành Trình Ẩm Thực Tinh Hoa</h3>
            <p>Vị ngon bản địa, dịch vụ chuẩn mực.</p>
            <a routerLink="/dining" class="link-gold">Xem Tiệc Tối →</a>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      font-family: "Helvetica Neue", Arial, sans-serif;
      font-weight: 300;
    }
    .luxury-font {
      font-family: "Playfair Display", "Times New Roman", serif;
      letter-spacing: 0.05em; /* Tăng letter-spacing */
    }
    .hero-section {
      position: relative;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      overflow: hidden;
    }
    .hero-bg {
      position: absolute;
      top: -10%; left: 0; right: 0; bottom: -10%;
      background: url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1920') center/cover no-repeat;
      z-index: -2;
      height: 120%;
    }
    .hero-overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle, rgba(5,10,20,0.4) 0%, rgba(5,10,20,0.85) 100%);
      z-index: -1;
    }
    .hero-content {
      z-index: 1;
      padding: 0 20px;
    }
    .hero-content h1 {
      font-size: 5rem;
      margin-bottom: 24px;
      line-height: 1.15;
      color: #ffffff;
      text-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }
    .subtitle {
      font-size: 1.25rem;
      color: rgba(255,255,255,0.85);
      max-width: 650px;
      margin: 0 auto;
      font-weight: 300;
      letter-spacing: 0.5px;
    }
    .container {
      max-width: 1280px;
      margin: 120px auto;
      padding: 0 24px;
    }
    .section-header {
      text-align: center;
      margin-bottom: 80px;
    }
    .section-header h2 { 
      font-size: 2.8rem; 
      margin-bottom: 16px; 
      color: #fff;
    }
    .section-header p {
      color: rgba(255,255,255,0.7);
      font-size: 1.1rem;
      max-width: 600px;
      margin: 0 auto;
    }
    /* Grid 3-4 columns */
    .grid-3-cols {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 40px;
    }
    @media (max-width: 1024px) {
      .grid-3-cols { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .grid-3-cols { grid-template-columns: 1fr; }
    }
    /* Card Styles with GSAP reveal ready & Glassmorphism */
    .card {
      position: relative;
      border-radius: 24px;   /* Bo góc lớn */
      overflow: hidden;
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
      perspective: 1000px;
      cursor: pointer;
    }
    .card-img {
      height: 420px;
      background-size: cover;
      background-position: center;
      transition: transform 0.7s cubic-bezier(0.25, 1, 0.5, 1);
    }
    /* Hover state micro-interactions */
    .card:hover .card-img {
      transform: scale(1.05); /* Zoom in nhẹ */
    }
    .card-body {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 40px 30px 30px;
      background: linear-gradient(to top, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.6) 60%, transparent 100%);
      transform: translateY(20px);
      transition: transform 0.5s cubic-bezier(0.25, 1, 0.5, 1);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }
    .card:hover .card-body {
      transform: translateY(0);
    }
    .card-body h3 { 
      margin-bottom: 12px; 
      font-size: 1.6rem; 
      color: #fff;
    }
    .card-body p { 
      color: rgba(255,255,255,0.7); 
      margin-bottom: 20px;
      font-size: 0.95rem;
      line-height: 1.5;
    }
    .link-gold {
      color: #d4af37; /* Màu gold sang trọng */
      text-decoration: none;
      font-weight: 400;
      letter-spacing: 2px;
      font-size: 0.8rem;
      text-transform: uppercase;
      opacity: 0;
      transform: translateY(15px);
      transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1) 0.1s; /* delay nhẹ */
      display: inline-block;
      position: relative;
    }
    .card:hover .link-gold {
      opacity: 1;
      transform: translateY(0);
    }
    .link-gold::after {
      content: '';
      position: absolute;
      width: 0;
      height: 1px;
      bottom: -4px;
      left: 0;
      background-color: #d4af37;
      transition: width 0.3s ease;
    }
    .card:hover .link-gold:hover::after {
      width: 100%;
    }
  `]
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private lenis: any;
  private ctx: any;

  constructor(private el: ElementRef) { }

  ngAfterViewInit() {
    // 1. Smooth Inertia Scroll (Lenis)
    this.lenis = new Lenis({
      duration: 1.0,
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

    // Create a GSAP Context allows easy cleanup
    this.ctx = gsap.context(() => {

      // 2. On-load Animation "Hero Fade-in"
      const tl = gsap.timeline();
      tl.from('.hero-bg', { scale: 1.05, duration: 2, ease: 'power2.out' })
        .from('.hero-content h1', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.5')
        .from('.hero-content .subtitle', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=1.2');

      // 3. Parallax Layering for Hero Background
      gsap.to('.hero-bg', {
        yPercent: 30, // move BG down 30% of its height
        ease: 'none',
        scrollTrigger: {
          trigger: '.hero-section',
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // Entrance animation for header
      gsap.from('.section-header', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.featured-sections',
          start: 'top bottom+=400', // Triggers way before entering screen
          toggleActions: "play none none reverse"
        }
      });

      // 4. Scroll-triggered Animations "Earlier Emerging Motion"
      gsap.from('.card', {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.featured-sections',
          start: 'top bottom+=300', // Triggers earlier so it's ready when visible
          toggleActions: "play none none reverse"
        }
      });
    }, this.el.nativeElement);
  }

  ngOnDestroy() {
    if (this.lenis) {
      this.lenis.destroy();
    }
    if (this.ctx) {
      this.ctx.revert();
    }
  }
}
