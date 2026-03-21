import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { CatalogService, Flight, FlightClass } from '../../../core/services/catalog.service';

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
        <h2 class="luxury-font text-gold">{{ editingFlight() ? 'Sửa Chuyến bay' : 'Thêm Chuyến bay Mới' }}</h2>
        
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
              <label>Sân bay đi</label>
              <input type="text" formControlName="departureAirport">
            </div>

            <div class="form-group">
              <label>Sân bay đến</label>
              <input type="text" formControlName="arrivalAirport">
            </div>

            <div class="form-group">
              <label>Thời gian đi</label>
              <input type="datetime-local" formControlName="departureTime">
            </div>

            <div class="form-group">
              <label>Thời gian đến</label>
              <input type="datetime-local" formControlName="arrivalTime">
            </div>

            <div class="form-group full-width">
              <label>Loại máy bay</label>
              <input type="text" formControlName="aircraft" placeholder="Ví dụ: Airbus A350">
            </div>
          </div>

          <!-- Flight Classes Section -->
          <div class="section-header mt-8">
            <h3 class="text-gold luxury-font">Hạng vé & Giá</h3>
            <button type="button" class="btn-add-class" (click)="addFlightClass()">+ Thêm hạng vé</button>
          </div>

          <div class="flight-classes-list" *ngFor="let fc of flightClasses; let i = index">
            <div class="class-card">
              <div class="class-card-header">
                <span class="class-number">Hạng {{ i + 1 }}</span>
                <button type="button" class="btn-remove" (click)="removeFlightClass(i)">✕</button>
              </div>

              <div class="class-form-grid">
                <div class="form-group">
                  <label>Loại hạng</label>
                  <select [(ngModel)]="fc.className" [ngModelOptions]="{standalone: true}" class="form-ctrl">
                    <option value="ECONOMY">Phổ thông (Economy)</option>
                    <option value="BUSINESS">Thương gia (Business)</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Giá Người lớn (VNĐ)</label>
                  <input type="number" [(ngModel)]="fc.priceAdult" [ngModelOptions]="{standalone: true}" class="form-ctrl" min="0">
                </div>

                <div class="form-group">
                  <label>Giá Trẻ em (VNĐ)</label>
                  <input type="number" [(ngModel)]="fc.priceChild" [ngModelOptions]="{standalone: true}" class="form-ctrl" min="0">
                </div>

                <div class="form-group">
                  <label>Giá Em bé (VNĐ)</label>
                  <input type="number" [(ngModel)]="fc.priceInfant" [ngModelOptions]="{standalone: true}" class="form-ctrl" min="0">
                </div>

                <div class="form-group">
                  <label>Tổng ghế</label>
                  <input type="number" [(ngModel)]="fc.totalSeats" [ngModelOptions]="{standalone: true}" class="form-ctrl" min="1">
                </div>

                <div class="form-group">
                  <label>Hành lý ký gửi (kg)</label>
                  <input type="number" [(ngModel)]="fc.baggageAllowanceKg" [ngModelOptions]="{standalone: true}" class="form-ctrl" min="0">
                </div>
              </div>
            </div>
          </div>

          <div class="empty-classes" *ngIf="flightClasses.length === 0">
            <p>Chưa có hạng vé nào. Nhấn "+ Thêm hạng vé" để cấu hình.</p>
          </div>

          <div class="modal-actions mt-6">
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
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: flex-start; justify-content: center; z-index: 1000; padding: 40px 20px; overflow-y: auto; }
    .modal-card { width: 100%; max-width: 800px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); background: rgba(15, 20, 30, 0.98); }
    h2.text-gold { color: #d4af37; margin-bottom: 30px; text-align: center; }
    
    .admin-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group { display: flex; flex-direction: column; gap: 6px; }
    .form-group.full-width { grid-column: span 2; }
    .form-group label { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
    .form-group input, .form-ctrl { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 12px; color: white; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
    .form-group input:focus, .form-ctrl:focus { border-color: #d4af37; }
    select.form-ctrl { appearance: none; background: rgba(30,35,50,0.9); }

    .section-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(212,175,55,0.2); padding-bottom: 12px; margin-bottom: 18px; }
    .section-header h3 { margin: 0; font-size: 1.1rem; }
    .btn-add-class { background: rgba(212,175,55,0.15); border: 1px solid rgba(212,175,55,0.3); color: #d4af37; padding: 8px 18px; border-radius: 8px; cursor: pointer; font-weight: 600; transition: 0.2s; }
    .btn-add-class:hover { background: rgba(212,175,55,0.3); }

    .flight-classes-list { margin-bottom: 16px; }
    .class-card { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; }
    .class-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .class-number { font-weight: 700; color: #d4af37; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 1px; }
    .btn-remove { background: rgba(220,50,50,0.1); border: 1px solid rgba(220,50,50,0.3); color: #ff6b6b; border-radius: 6px; width: 28px; height: 28px; cursor: pointer; transition: 0.2s; }
    .btn-remove:hover { background: rgba(220,50,50,0.3); }
    .class-form-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
    
    .empty-classes { text-align: center; padding: 30px; color: #8b9bb4; border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; font-size: 0.9rem; }
    
    .modal-actions { display: flex; gap: 15px; margin-top: 30px; }
    .modal-actions button { flex: 1; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; font-size: 1rem; border: none; }
    .btn-gold { background: linear-gradient(135deg, #dfc15a 0%, #c49a20 100%); color: #0b0f19; }
    .btn-gold:disabled { background: #444; color: #888; cursor: not-allowed; }
    .btn-outline { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #ccc; }

    .text-gold { color: #d4af37; }
    .mt-8 { margin-top: 2rem; }
    .mt-6 { margin-top: 1.5rem; }
  `]
})
export class FlightMgmtComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);

  flights = signal<Flight[]>([]);
  showForm = signal(false);
  editingFlight = signal<Flight | null>(null);
  loading = signal(false);

  flightClasses: Partial<FlightClass>[] = [];

  flightForm = this.fb.group({
    flightNumber: ['', Validators.required],
    airline: ['', Validators.required],
    departureCity: ['', Validators.required],
    arrivalCity: ['', Validators.required],
    departureAirport: [''],
    arrivalAirport: [''],
    departureTime: ['', Validators.required],
    arrivalTime: ['', Validators.required],
    aircraft: ['']
  });

  columns: Column[] = [
    { key: 'airline', label: 'Hãng bay' },
    { key: 'flightNumber', label: 'Số hiệu' },
    { key: 'departureCity', label: 'Điểm đi' },
    { key: 'arrivalCity', label: 'Điểm đến' },
    { key: 'departureTime', label: 'Giờ bay' }
  ];

  ngOnInit() {
    this.loadFlights();
  }

  loadFlights() {
    this.catalogService.getFlights().subscribe(res => {
      if (res.success && res.data) this.flights.set(res.data);
    });
  }

  addFlightClass() {
    this.flightClasses.push({
      className: 'ECONOMY',
      priceAdult: 1000000,
      priceChild: 700000,
      priceInfant: 100000,
      totalSeats: 150,
      availableSeats: 150,
      baggageAllowanceKg: 20
    });
  }

  removeFlightClass(index: number) {
    this.flightClasses.splice(index, 1);
  }

  openForm(flight?: Flight) {
    if (flight) {
      this.editingFlight.set(flight);
      const depDate = flight.departureTime ? new Date(flight.departureTime).toISOString().slice(0, 16) : '';
      const arrDate = flight.arrivalTime ? new Date(flight.arrivalTime).toISOString().slice(0, 16) : '';

      this.flightForm.patchValue({
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        departureCity: flight.departureCity,
        arrivalCity: flight.arrivalCity,
        departureAirport: flight.departureAirport || '',
        arrivalAirport: flight.arrivalAirport || '',
        departureTime: depDate,
        arrivalTime: arrDate,
        aircraft: flight.aircraft || ''
      });

      // clone existing flight classes for editing
      this.flightClasses = flight.flightClasses
        ? flight.flightClasses.map(fc => ({ ...fc }))
        : [];
    } else {
      this.editingFlight.set(null);
      this.flightForm.reset();
      this.flightClasses = [];
    }
    this.showForm.set(true);
  }

  saveFlight() {
    if (this.flightForm.invalid) return;

    this.loading.set(true);
    const rawValue = this.flightForm.value;

    const requestData = {
      ...rawValue,
      flightClasses: this.flightClasses.map(fc => ({
        id: (fc as any).id,
        className: fc.className,
        priceAdult: fc.priceAdult,
        priceChild: fc.priceChild,
        priceInfant: fc.priceInfant,
        totalSeats: fc.totalSeats,
        availableSeats: fc.availableSeats || fc.totalSeats,
        baggageAllowanceKg: fc.baggageAllowanceKg
      }))
    };

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
