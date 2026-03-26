import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { HotelService, Hotel } from '../../../core/services/hotel.service';

@Component({
    selector: 'app-hotel-mgmt',
    standalone: true,
    imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule],
    template: `
    <app-generic-mgmt
      [title]="'Quản lý Khách sạn'"
      [columns]="columns"
      [items]="hotels"
      (onCreate)="openForm()"
      (onEdit)="openForm($event)"
      (onDelete)="handleDelete($event)"
    ></app-generic-mgmt>

    <!-- Hotel Form Modal -->
    <div class="modal-overlay" *ngIf="showForm()">
      <div class="modal-card glass-effect">
        <h2 class="luxury-font">{{ editingHotel() ? 'Sửa Khách sạn' : 'Thêm Khách sạn Mới' }}</h2>
        
        <form [formGroup]="hotelForm" (ngSubmit)="saveHotel()" class="admin-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Tên Khách sạn</label>
              <input type="text" formControlName="name" placeholder="Ví dụ: Hilton Da Nang">
            </div>

            <div class="form-group">
              <label>Thành phố</label>
              <input type="text" formControlName="city" placeholder="Ví dụ: Đà Nẵng">
            </div>

            <div class="form-group">
              <label>Xếp hạng sao</label>
              <select formControlName="starRating">
                <option [ngValue]="1">1 Sao</option>
                <option [ngValue]="2">2 Sao</option>
                <option [ngValue]="3">3 Sao</option>
                <option [ngValue]="4">4 Sao</option>
                <option [ngValue]="5">5 Sao</option>
              </select>
            </div>

            <div class="form-group full-width">
              <label>Địa chỉ chi tiết</label>
              <input type="text" formControlName="address">
            </div>

            <div class="form-group full-width">
              <label>Mô tả</label>
              <textarea formControlName="description" rows="3"></textarea>
            </div>

            <div class="form-group">
              <label>📍 Vĩ độ (Latitude)</label>
              <input type="number" step="any" formControlName="latitude" placeholder="VD: 10.7769">
            </div>

            <div class="form-group">
              <label>📍 Kinh độ (Longitude)</label>
              <input type="number" step="any" formControlName="longitude" placeholder="VD: 106.7009">
            </div>

            <div class="form-group full-width coord-hint">
              <span>💡 Lấy tọa độ: vào Google Maps → chuột phải vào địa điểm → copy số đầu tiên (vĩ độ) và số thứ hai (kinh độ)</span>
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-gold" [disabled]="hotelForm.invalid || loading()">
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
    .modal-card { width: 100%; max-width: 600px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); max-height: 90vh; overflow-y: auto; }
    h2 { color: var(--gold-primary); margin-bottom: 30px; text-align: center; }
    
    .admin-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: span 2; }
    
    .form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--gold-primary); }
    .form-group select option { background: #1a1a1a; color: white; }
    
    .modal-actions { display: flex; gap: 15px; margin-top: 35px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .coord-hint { background: rgba(201,168,76,0.07); border: 1px dashed rgba(201,168,76,0.3); border-radius: 10px; padding: 10px 14px !important; font-size: 0.78rem; color: var(--text-muted); }
  `]
})
export class HotelMgmtComponent implements OnInit {
    private hotelService = inject(HotelService);
    private fb = inject(FormBuilder);

    hotels = signal<Hotel[]>([]);
    showForm = signal(false);
    editingHotel = signal<Hotel | null>(null);
    loading = signal(false);

    hotelForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(3)]],
        description: [''],
        address: ['', Validators.required],
        city: ['', Validators.required],
        starRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
        latitude: [null as number | null],
        longitude: [null as number | null]
    });

    columns: Column[] = [
        { key: 'name', label: 'Tên Khách sạn' },
        { key: 'city', label: 'Thành phố' },
        { key: 'starRating', label: 'Sao' }
    ];

    ngOnInit() {
        this.loadHotels();
    }

    loadHotels() {
        this.hotelService.getHotels().subscribe(res => {
            if (res.success && res.data) this.hotels.set(res.data);
        });
    }

    openForm(hotel?: Hotel) {
        if (hotel) {
            this.editingHotel.set(hotel);
            this.hotelForm.patchValue({
                name: hotel.name,
                description: hotel.description,
                address: hotel.address,
                city: hotel.city,
                starRating: hotel.starRating,
                latitude: hotel.latitude ?? null,
                longitude: hotel.longitude ?? null
            });
        } else {
            this.editingHotel.set(null);
            this.hotelForm.reset({ starRating: 3 });
        }
        this.showForm.set(true);
    }

    saveHotel() {
        if (this.hotelForm.invalid) return;

        this.loading.set(true);
        const requestData = this.hotelForm.value;

        const action = this.editingHotel()
            ? this.hotelService.updateHotel(this.editingHotel()!.id, requestData)
            : this.hotelService.createHotel(requestData);

        action.subscribe({
            next: (res) => {
                if (res.success) {
                    this.loadHotels();
                    this.showForm.set(false);
                }
            },
            error: (err) => {
                console.error('Error saving hotel:', err);
                alert('Có lỗi xảy ra khi lưu thông tin khách sạn.');
            },
            complete: () => this.loading.set(false)
        });
    }

    handleDelete(hotel: Hotel) {
        if (confirm(`Bạn có chắc muốn xóa khách sạn "${hotel.name}"?`)) {
            this.hotelService.deleteHotel(hotel.id).subscribe(res => {
                if (res.success) this.loadHotels();
            });
        }
    }
}
