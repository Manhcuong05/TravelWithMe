import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, POI } from '../../core/services/catalog.service';

@Component({
    selector: 'app-poi-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="catalog-page animate-fade-in">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Hidden Gems</h1>
          <p>Iconic landmarks and secret sanctuaries curated for the enlightened traveler.</p>
        </div>

        <div class="grid" *ngIf="!loading()">
          <div *ngFor="let poi of pois()" class="poi-card glass-effect hover-up">
            <div class="card-img" [style.backgroundImage]="'url(' + (poi.imageUrl || 'https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=600') + ')'">
              <div class="cat-tag">{{ poi.category }}</div>
            </div>
            <div class="card-body">
              <div class="city-tag">📍 {{ poi.city }}</div>
              <h3>{{ poi.name }}</h3>
              <p class="desc">{{ poi.description }}</p>
              <button class="btn-gold-outline w-full mt-20">Discover Story</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .catalog-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 30px; }
    .poi-card { overflow: hidden; display: flex; flex-direction: column; }
    .card-img { height: 280px; background-size: cover; background-position: center; position: relative; }
    .cat-tag { position: absolute; top: 20px; left: 20px; background: var(--gold-gradient); color: var(--bg-primary); padding: 4px 12px; border-radius: 4px; font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .card-body { padding: 30px; }
    .city-tag { font-size: 0.7rem; text-transform: uppercase; color: var(--gold-secondary); margin-bottom: 10px; letter-spacing: 1px; }
    .card-body h3 { font-size: 1.6rem; margin-bottom: 15px; font-family: 'Playfair Display', serif; }
    .desc { color: var(--text-secondary); line-height: 1.6; font-size: 0.95rem; }
    .btn-gold-outline { background: transparent; border: 1px solid var(--gold-primary); color: var(--gold-primary); padding: 10px 20px; border-radius: 8px; cursor: pointer; transition: var(--transition-smooth); }
    .btn-gold-outline:hover { background: var(--gold-primary); color: var(--bg-primary); }
    .mt-20 { margin-top: 20px; }
    .w-full { width: 100%; }
  `]
})
export class PoiListComponent implements OnInit {
    private service = inject(CatalogService);
    pois = signal<POI[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.service.getPOIs().subscribe({
            next: (res) => {
                if (res.success) this.pois.set(res.data);
                this.loading.set(false);
            }
        });
    }
}
