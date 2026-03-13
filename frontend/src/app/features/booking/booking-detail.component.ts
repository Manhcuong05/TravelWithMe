import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BookingService, BookingResponse } from '../../core/services/booking.service';

@Component({
    selector: 'app-booking-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <section class="detail-page animate-fade-in" *ngIf="booking()">
      <div class="container">
        <div class="page-header">
          <h1 class="luxury-font">Reservation Details</h1>
          <p>Confirmation and payment options for your upcoming journey.</p>
        </div>

        <div class="main-grid">
          <div class="info-side">
            <div class="card glass-effect status-card">
              <div class="label">Booking Status</div>
              <div class="status-val" [attr.data-status]="booking()?.status">
                {{ booking()?.status }}
              </div>
              <p *ngIf="booking()?.status === 'AWAITING_PAYMENT'" class="instruction">
                Your reservation is held. Please complete payment to confirm.
              </p>
            </div>

            <div class="card glass-effect items-card">
              <h3 class="luxury-font">Order Summary</h3>
              <div *ngFor="let item of booking()?.items" class="booking-item">
                <div class="item-info">
                  <span class="type-tag">{{ item.type }}</span>
                  <div class="service-name">Service ID: {{ item.serviceId }}</div>
                </div>
                <div class="item-qty">Qty: {{ item.quantity }}</div>
              </div>
              <div class="total-row">
                <span>Total Amount</span>
                <span class="amount">{{ booking()?.totalAmount | number }} VNĐ</span>
              </div>
            </div>
          </div>

          <div class="payment-side" *ngIf="booking()?.status === 'AWAITING_PAYMENT'">
            <div class="card glass-effect payment-card">
              <h3 class="luxury-font">Secure Payment</h3>
              <p>Scan the QR code below using your banking app to complete the transaction.</p>
              
              <div class="qr-container">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=TravelWithMe-Payment-{{booking()?.id}}" alt="Payment QR">
                <div class="qr-overlay luxury-font">VIETQR</div>
              </div>

              <div class="sim-actions">
                <p class="hint">Simulate payment success for testing:</p>
                <button (click)="simulatePaymentSuccess()" class="btn-gold w-full" [disabled]="simulating()">
                  {{ simulating() ? 'Processing...' : 'Simulate Success' }}
                </button>
              </div>
            </div>
          </div>

          <div class="payment-side" *ngIf="booking()?.status === 'CONFIRMED'">
            <div class="card glass-effect success-card animate-fade-in">
              <div class="success-icon">✓</div>
              <h3 class="luxury-font">Payment Confirmed</h3>
              <p>Your journey is officially architected. A confirmation email has been sent to your account.</p>
              <button routerLink="/itinerary" class="btn-gold w-full">View My Itineraries</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
    styles: [`
    .detail-page { padding: 150px 0 100px; min-height: 100vh; }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 20px; }
    .page-header { text-align: center; margin-bottom: 60px; }
    
    .main-grid { display: grid; grid-template-columns: 1fr 400px; gap: 40px; }
    .card { padding: 40px; margin-bottom: 30px; border-radius: 24px; }
    
    .status-card { text-align: center; }
    .status-card .label { font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 15px; letter-spacing: 1px; }
    .status-val { font-size: 2rem; font-weight: 700; color: var(--gold-primary); font-family: 'Playfair Display', serif; }
    .status-val[data-status="CONFIRMED"] { color: #22c55e; }
    .instruction { margin-top: 15px; color: var(--text-secondary); font-size: 0.9rem; }

    .items-card h3 { margin-bottom: 30px; font-size: 1.5rem; }
    .booking-item { display: flex; justify-content: space-between; align-items: center; padding-bottom: 20px; border-bottom: 1px solid var(--glass-border); margin-bottom: 20px; }
    .type-tag { font-size: 0.65rem; background: var(--bg-accent); padding: 3px 10px; border-radius: 4px; color: var(--gold-secondary); text-transform: uppercase; margin-bottom: 8px; display: inline-block; }
    .service-name { font-size: 1rem; color: var(--text-primary); }
    .item-qty { color: var(--text-muted); font-size: 0.9rem; }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-top: 30px; font-weight: 700; font-size: 1.3rem; }
    .total-row .amount { color: var(--gold-primary); }

    .payment-card { text-align: center; position: sticky; top: 120px; }
    .payment-card h3 { margin-bottom: 20px; font-size: 1.5rem; }
    .payment-card p { font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 30px; line-height: 1.5; }
    .qr-container { padding: 20px; background: white; border-radius: 16px; display: inline-block; margin-bottom: 30px; position: relative; }
    .qr-overlay { position: absolute; bottom: 5px; right: 5px; font-size: 10px; color: #ccc; }
    
    .sim-actions { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--glass-border); }
    .hint { font-size: 0.8rem; color: var(--text-muted); margin-bottom: 15px; }

    .success-card { text-align: center; border-color: #22c55e; }
    .success-icon { width: 60px; height: 60px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 25px; }
    .success-card h3 { color: #22c55e; margin-bottom: 15px; font-size: 1.8rem; }
    .success-card p { color: var(--text-secondary); margin-bottom: 30px; }

    .w-full { width: 100%; }
  `]
})
export class BookingDetailComponent implements OnInit {
    private route = inject(ActivatedRoute);
    private service = inject(BookingService);
    private http = inject(HttpClient);

    booking = signal<BookingResponse | null>(null);
    simulating = signal<boolean>(false);

    ngOnInit() {
        this.loadBooking();
    }

    loadBooking() {
        const id = this.route.snapshot.params['id'];
        this.service.getBooking(id).subscribe({
            next: (res) => {
                if (res.success) this.booking.set(res.data);
            }
        });
    }

    simulatePaymentSuccess() {
        if (!this.booking()) return;
        this.simulating.set(true);

        // Call the backend simulation webhook handler
        // Based on earlier conversation, the endpoint is /api/payments/webhook/simulate-success?bookingId=...
        this.http.post<any>(`/api/payments/webhook/simulate-success?bookingId=${this.booking()!.id}`, {}).subscribe({
            next: () => {
                this.loadBooking(); // Refresh to show success state
                this.simulating.set(false);
            },
            error: () => this.simulating.set(false)
        });
    }
}
