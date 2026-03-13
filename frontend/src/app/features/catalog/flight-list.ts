import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService, Flight } from '../../core/services/catalog.service';

@Component({
    selector: 'app-flight-list',
    standalone: true,
    imports: [CommonModule],
    template: `
    <section class="catalog-page animate-fade-in">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">First Class Journeys</h1>
          <p>Luxury air travel with world-renowned airlines and exceptional service.</p>
        </div>

        <div class="flight-list" *ngIf="!loading()">
          <div *ngFor="let flight of flights()" class="flight-card glass-effect hover-up">
            <div class="airline-info">
              <div class="logo luxury-font">{{ flight.airline[0] }}</div>
              <div>
                <div class="airline-name">{{ flight.airline }}</div>
                <div class="flight-num">Flight {{ flight.flightNumber }}</div>
              </div>
            </div>
            
            <div class="route-info">
              <div class="stop">
                <div class="time">{{ flight.departureTime | date:'shortTime' }}</div>
                <div class="city">{{ flight.departure }}</div>
              </div>
              <div class="path-line">
                <span>✈</span>
              </div>
              <div class="stop text-right">
                <div class="time">Arriving</div>
                <div class="city">{{ flight.arrival }}</div>
              </div>
            </div>

            <div class="price-action">
              <div class="price">From <span>{{ flight.price | number }} VNĐ</span></div>
              <button class="btn-gold">Select Flight</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .catalog-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1000px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    
    .flight-list { display: flex; flex-direction: column; gap: 20px; }
    .flight-card { padding: 30px; display: grid; grid-template-columns: 200px 1fr 200px; align-items: center; gap: 40px; }
    
    .airline-info { display: flex; align-items: center; gap: 20px; }
    .logo { width: 50px; height: 50px; background: var(--bg-accent); color: var(--gold-primary); display: flex; align-items: center; justify-content: center; border-radius: 12px; font-size: 1.5rem; font-weight: 700; }
    .airline-name { font-weight: 600; color: var(--text-primary); }
    .flight-num { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }

    .route-info { display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }
    .stop .time { font-size: 1.2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 5px; }
    .stop .city { color: var(--gold-secondary); font-size: 0.9rem; font-weight: 500; }
    .path-line { flex: 1; height: 1px; background: var(--glass-border); margin: 0 30px; position: relative; text-align: center; }
    .path-line span { position: absolute; top: -10px; left: 50%; transform: translateX(-50%); background: var(--bg-primary); padding: 0 10px; color: var(--gold-primary); }
    .text-right { text-align: right; }

    .price-action { text-align: right; border-left: 1px solid var(--glass-border); padding-left: 40px; }
    .price { font-size: 0.85rem; color: var(--text-muted); margin-bottom: 15px; }
    .price span { font-size: 1.4rem; font-weight: 700; color: var(--gold-primary); display: block; margin-top: 5px; }
  `]
})
export class FlightListComponent implements OnInit {
    private service = inject(CatalogService);
    flights = signal<Flight[]>([]);
    loading = signal(true);

    ngOnInit() {
        this.service.getFlights().subscribe({
            next: (res) => {
                if (res.success) this.flights.set(res.data);
                this.loading.set(false);
            }
        });
    }
}
