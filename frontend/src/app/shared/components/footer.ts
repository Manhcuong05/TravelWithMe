import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule],
    template: `
    <footer class="footer luxury-bg animate-fade-in">
      <div class="container footer-grid">
        <div class="brand-col">
          <h2 class="luxury-font gold-text">TravelWithMe</h2>
          <p>Architecting extraordinary journeys for the world's most discerning travelers since 2026.</p>
        </div>
        
        <div class="links-col">
          <h4>Experience</h4>
          <ul>
            <li><a>Boutique Hotels</a></li>
            <li><a>Private Estates</a></li>
            <li><a>Exotic Tours</a></li>
            <li><a>AI Butler</a></li>
          </ul>
        </div>

        <div class="links-col">
          <h4>Company</h4>
          <ul>
            <li><a>Our Story</a></li>
            <li><a>Curation Process</a></li>
            <li><a>Contact Us</a></li>
          </ul>
        </div>

        <div class="newsletter-col">
          <h4>The Journal</h4>
          <p>Subscribe for exclusive travel insights and early access.</p>
          <div class="input-group">
            <input type="email" placeholder="Your Email">
            <button class="btn-gold">Join</button>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="container">
          <p>&copy; 2026 TravelWithMe Premium. All rights reserved.</p>
          <div class="social-links">
            <a>Instagram</a> · <a>LinkedIn</a> · <a>X</a>
          </div>
        </div>
      </div>
    </footer>
  `,
    styles: [`
    .footer { padding: 100px 0 40px; border-top: 1px solid var(--glass-border); margin-top: 100px; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 2fr; gap: 60px; margin-bottom: 80px; }
    
    .gold-text { color: var(--gold-primary); margin-bottom: 20px; }
    .footer p { color: var(--text-secondary); font-size: 0.9rem; line-height: 1.6; }
    
    h4 { color: var(--text-primary); margin-bottom: 25px; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 2px; }
    ul { list-style: none; }
    ul li { margin-bottom: 15px; }
    ul li a { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: var(--transition-smooth); cursor: pointer; }
    ul li a:hover { color: var(--gold-secondary); }

    .newsletter-col h4 { margin-bottom: 25px; }
    .input-group { display: flex; gap: 10px; margin-top: 20px; }
    .input-group input { flex: 1; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); padding: 10px 15px; border-radius: 8px; color: var(--text-primary); outline: none; }
    .btn-gold { padding: 10px 20px; }

    .footer-bottom { border-top: 1px solid var(--glass-border); padding-top: 40px; font-size: 0.8rem; color: var(--text-muted); }
    .footer-bottom .container { display: flex; justify-content: space-between; align-items: center; }
    .social-links a { margin-left: 20px; color: var(--text-muted); text-decoration: none; }
  `]
})
export class FooterComponent { }
