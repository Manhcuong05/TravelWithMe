import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CatalogService, Tour } from '../../core/services/catalog.service';

@Component({
    selector: 'app-tour-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <section class="catalog-page animate-fade-in">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Exotic Expeditions</h1>
          <p>Curated private tours to the most breathtaking corners of the globe.</p>
        </div>

        <div class="grid" *ngIf="!loading()">
          <div *ngFor="let tour of tours()" class="card glass-effect hover-up">
            <div class="card-img" [style.backgroundImage]="'url(' + (tour.imageUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=600') + ')'">
              <div class="duration-badge">{{ tour.duration }}</div>
            </div>
            <div class="card-body">
              <div class="loc-tag">📍 {{ tour.location }}</div>
              <h3>{{ tour.title }}</h3>
              <p class="desc">{{ tour.description | slice:0:100 }}...</p>
              <div class="price">From <span>{{ tour.price | number }} VNĐ</span></div>
              <button class="btn-gold w-full mt-20">Book Expedition</button>
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
    .card { overflow: hidden; height: 100%; display: flex; flex-direction: column; }
    .card-img { height: 240px; background-size: cover; background-position: center; position: relative; }
    .duration-badge { position: absolute; bottom: 20px; right: 20px; background: rgba(0,0,0,0.6); padding: 5px 12px; border-radius: 4px; font-size: 0.8rem; color: var(--gold-secondary); backdrop-filter: blur(5px); }
    .card-body { padding: 25px; flex: 1; }
    .loc-tag { font-size: 0.7rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 8px; letter-spacing: 1px; }
    .card-body h3 { font-size: 1.4rem; margin-bottom: 12px; font-family: 'Playfair Display', serif; }
    .desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 20px; }
    .price { font-size: 0.9rem; color: var(--text-muted); }
    .price span { font-weight: 600; color: var(--gold-primary); font-size: 1.2rem; margin-left: 5px; }
    .mt-20 { margin-top: 20px; }
    .w-full { width: 100%; }
  `]
})
export class TourListComponent implements OnInit {
    private service = inject(CatalogService);
    tours = signal<Tour[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.service.getTours().subscribe({
            next: (res) => {
                if (res.success) this.tours.set(res.data);
                this.loading.set(false);
            }
        });
    }
}
