import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { HotelService, Hotel } from '../../../core/services/hotel.service';
import { CatalogService } from '../../../core/services/catalog.service';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-hotel-mgmt',
  standalone: true,
  imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule, SafePipe],
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
                <label>Hình ảnh đại diện</label>
                
                <div class="image-preview-admin" *ngIf="hotelForm.get('imageUrl')?.value">
                  <img [src]="hotelForm.get('imageUrl')?.value" alt="Preview">
                  <button type="button" class="remove-img-btn" (click)="hotelForm.patchValue({imageUrl: ''})">×</button>
                </div>

                <div class="upload-controls">
                    <input type="text" formControlName="imageUrl" placeholder="Dán link ảnh hoặc tải lên..." class="url-input">
                    <div class="file-input-wrapper">
                        <input type="file" (change)="onFileSelected($event)" accept="image/*" id="hotel-img-up">
                        <label for="hotel-img-up" class="upload-label">
                            <i class="fas" [class.fa-upload]="!isUploading()" [class.fa-spinner]="isUploading()" [class.fa-spin]="isUploading()"></i>
                            {{ isUploading() ? 'Đang tải...' : 'Tải ảnh' }}
                        </label>
                    </div>
                </div>
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

            <div class="form-group full-width map-preview-admin" *ngIf="hotelForm.get('latitude')?.value && hotelForm.get('longitude')?.value">
                <label>Vị trí thực tế (Preview)</label>
                <div class="map-iframe-container">
                    <iframe 
                        width="100%" 
                        height="200" 
                        frameborder="0" 
                        style="border:0; border-radius: 12px;" 
                        [src]="getMapUrl() | safe" 
                        allowfullscreen>
                    </iframe>
                </div>
            </div>

            <div class="form-group full-width coord-hint">
              <span>💡 Hướng dẫn: Mở Google Maps → Chuột phải để lấy Vĩ độ (latitude) và Kinh độ (longitude).</span>
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
    .modal-card { width: 100%; max-width: 600px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); max-height: 95vh; overflow-y: auto; }
    h2 { color: var(--gold-primary); margin-bottom: 30px; text-align: center; }
    
    .admin-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: span 2; }
    
    .form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--gold-primary); }
    .form-group select option { background: #1a1a1a; color: white; }
    
    .upload-controls { display: flex; gap: 10px; margin-top: 5px; }
    .url-input { flex: 1; }
    .file-input-wrapper { position: relative; width: 120px; }
    .file-input-wrapper input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
    .upload-label { display: flex; align-items: center; justify-content: center; gap: 8px; height: 100%; width: 100%; background: rgba(212, 175, 55, 0.1); border: 1px dashed var(--gold-primary); border-radius: 12px; color: var(--gold-primary); font-size: 0.85rem; font-weight: 600; cursor: pointer; }
    
    .image-preview-admin { position: relative; width: 100%; height: 180px; border-radius: 14px; overflow: hidden; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); }
    .image-preview-admin img { width: 100%; height: 100%; object-fit: cover; }
    .remove-img-btn { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(239, 68, 68, 0.8); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }

    .map-preview-admin { margin-top: 10px; }
    .map-iframe-container { border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; overflow: hidden; height: 200px; background: #000; box-shadow: 0 5px 20px rgba(0,0,0,0.4); }

    .modal-actions { display: flex; gap: 15px; margin-top: 35px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .coord-hint { background: rgba(201,168,76,0.07); border: 1px dashed rgba(201,168,76,0.3); border-radius: 10px; padding: 10px 14px !important; font-size: 0.78rem; color: #94a3b8; }
  `]
})
export class HotelMgmtComponent implements OnInit {
  private hotelService = inject(HotelService);
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);

  hotels = signal<Hotel[]>([]);
  showForm = signal(false);
  editingHotel = signal<Hotel | null>(null);
  loading = signal(false);
  isUploading = signal(false);

  hotelForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    address: ['', Validators.required],
    city: ['', Validators.required],
    starRating: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
    imageUrl: [''],
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

  getMapUrl(): string {
    const lat = this.hotelForm.get('latitude')?.value;
    const lng = this.hotelForm.get('longitude')?.value;
    if (!lat || !lng) return '';
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe(res => {
      if (res.success && res.data) this.hotels.set(res.data);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      this.catalogService.uploadFile(file).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.hotelForm.patchValue({ imageUrl: res.data });
          }
        },
        error: (err) => {
          console.error('Upload error', err);
          alert('Lỗi khi tải ảnh lên.');
          this.isUploading.set(false);
        },
        complete: () => this.isUploading.set(false)
      });
    }
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
        imageUrl: hotel.imageUrl || (hotel.images && hotel.images.length > 0 ? hotel.images[0] : ''),
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
    const formVal = this.hotelForm.value;
    const requestData = {
      ...formVal,
      images: formVal.imageUrl ? [formVal.imageUrl] : []
    };

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
