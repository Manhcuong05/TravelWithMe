import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { CatalogService, Flight } from '../../../core/services/catalog.service';

@Component({
    selector: 'app-flight-mgmt',
    standalone: true,
    imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule],
    template: `
    <app-generic-mgmt
      [title]="'Quản lý Chuyến bay'"
      [columns]="columns"
      [items]="flights"
      (onCreate)="openForm()"
      (onEdit)="openForm($event)"
      (onDelete)="handleDelete($event)"
    ></app-generic-mgmt>

    <!-- Flight Form Modal -->
    <div class="modal-overlay" *ngIf="showForm()">
      <div class="modal-card glass-effect">
        <h2 class="luxury-font">{{ editingFlight() ? 'Sửa Chuyến bay' : 'Thêm Chuyến bay Mới' }}</h2>
        
        <form [formGroup]="flightForm" (ngSubmit)="saveFlight()" class="admin-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Số hiệu chuyến bay</label>
              <input type="text" formControlName="flightNumber" placeholder="Ví dụ: VN123">
            </div>

            <div class="form-group">
              <label>Hãng hàng không</label>
              <input type="text" formControlName="airline" placeholder="Ví dụ: Vietnam Airlines">
            </div>

            <div class="form-group">
              <label>Thành phố đi</label>
              <input type="text" formControlName="departureCity">
            </div>

            <div class="form-group">
              <label>Thành phố đến</label>
              <input type="text" formControlName="arrivalCity">
            </div>

            <div class="form-group">
              <label>Thời gian đi</label>
              <input type="datetime-local" formControlName="departureTime">
            </div>

            <div class="form-group">
              <label>Thời gian đến</label>
              <input type="datetime-local" formControlName="arrivalTime">
            </div>

            <div class="form-group">
              <label>Giá vé cơ bản (VNĐ)</label>
              <input type="number" formControlName="basePrice">
            </div>

            <div class="form-group">
              <label>Loại máy bay</label>
              <input type="text" formControlName="aircraft" placeholder="Ví dụ: Airbus A350">
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-gold" [disabled]="flightForm.invalid || loading()">
              {{ loading() ? 'Đang lưu...' : 'Lưu thông tin' }}
            </button>
            <button type="button" class="btn-outline" (click)="showForm.set(false)">Hủy</button>
          </div>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card { width: 100%; max-width: 700px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); max-height: 90vh; overflow-y: auto; }
    h2 { color: var(--gold-primary); margin-bottom: 30px; text-align: center; }
    
    .admin-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; }
    .form-group input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; transition: border-color 0.2s; }
    .form-group input:focus { border-color: var(--gold-primary); }
    
    .modal-actions { display: flex; gap: 15px; margin-top: 35px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
  `]
})
export class FlightMgmtComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private fb = inject(FormBuilder);

    flights = signal<Flight[]>([]);
    showForm = signal(false);
    editingFlight = signal<Flight | null>(null);
    loading = signal(false);

    flightForm = this.fb.group({
        flightNumber: ['', Validators.required],
        airline: ['', Validators.required],
        departureCity: ['', Validators.required],
        arrivalCity: ['', Validators.required],
        departureTime: ['', Validators.required],
        arrivalTime: ['', Validators.required],
        basePrice: [0, [Validators.required, Validators.min(0)]],
        aircraft: ['']
    });

    columns: Column[] = [
        { key: 'airline', label: 'Hãng bay' },
        { key: 'flightNumber', label: 'Số hiệu' },
        { key: 'departureCity', label: 'Điểm đi' },
        { key: 'arrivalCity', label: 'Điểm đến' },
        { key: 'basePrice', label: 'Giá vé', type: 'price' }
    ];

    ngOnInit() {
        this.loadFlights();
    }

    loadFlights() {
        this.catalogService.getFlights().subscribe(res => {
            if (res.success && res.data) this.flights.set(res.data);
        });
    }

    openForm(flight?: Flight) {
        if (flight) {
            this.editingFlight.set(flight);
            // Format dates for datetime-local
            const depDate = flight.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : '';
            const arrDate = flight.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '';

            this.flightForm.patchValue({
                flightNumber: flight.flightNumber,
                airline: flight.airline,
                departureCity: flight.departureCity,
                arrivalCity: flight.arrivalCity,
                departureTime: depDate,
                arrivalTime: arrDate,
                basePrice: flight.basePrice,
                aircraft: flight.aircraft || ''
            });
        } else {
            this.editingFlight.set(null);
            this.flightForm.reset({ basePrice: 0 });
        }
        this.showForm.set(true);
    }

    saveFlight() {
        if (this.flightForm.invalid) return;

        this.loading.set(true);
        const requestData = this.flightForm.value;

        const action = this.editingFlight()
            ? this.catalogService.updateFlight(this.editingFlight()!.id, requestData)
            : this.catalogService.createFlight(requestData);

        action.subscribe({
            next: (res) => {
                if (res.success) {
                    this.loadFlights();
                    this.showForm.set(false);
                }
            },
            error: (err) => {
                console.error('Error saving flight:', err);
                alert('Có lỗi xảy ra khi lưu thông tin chuyến bay.');
            },
            complete: () => this.loading.set(false)
        });
    }

    handleDelete(flight: Flight) {
        if (confirm(`Bạn có chắc muốn xóa chuyến bay ${flight.flightNumber}?`)) {
            this.catalogService.deleteFlight(flight.id).subscribe(res => {
                if (res.success) this.loadFlights();
            });
        }
    }
}
