import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { CatalogService, Tour } from '../../../core/services/catalog.service';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-tour-mgmt',
  standalone: true,
  imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule, SafePipe],
  template: `
    <app-generic-mgmt
      [title]="'Quản lý Tour Du Lịch'"
      [columns]="columns"
      [items]="tours"
      (onCreate)="openForm()"
      (onEdit)="openForm($event)"
      (onDelete)="handleDelete($event)"
    ></app-generic-mgmt>

    <!-- Tour Form Modal -->
    <div class="modal-overlay" *ngIf="showForm()">
      <div class="modal-card glass-effect">
        <h2 class="luxury-font">{{ editingTour() ? 'Sửa Tour' : 'Thêm Tour Mới' }}</h2>
        
        <form [formGroup]="tourForm" (ngSubmit)="saveTour()" class="admin-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Tiêu đề Tour</label>
              <input type="text" formControlName="title" placeholder="Ví dụ: Tour Đà Nẵng - Hội An 3N2Đ">
            </div>

            <div class="form-group">
              <label>Địa điểm</label>
              <input type="text" formControlName="location" placeholder="Ví dụ: Đà Nẵng">
            </div>

            <div class="form-group">
              <label>Số ngày</label>
              <input type="number" formControlName="durationDays">
            </div>

            <div class="form-group">
              <label>Giá (VNĐ)</label>
              <input type="number" formControlName="price">
            </div>

            <div class="form-group full-width">
                <label>Hình ảnh đại diện</label>
                
                <div class="image-preview-admin" *ngIf="tourForm.get('imageUrl')?.value">
                  <img [src]="tourForm.get('imageUrl')?.value" alt="Preview">
                  <button type="button" class="remove-img-btn" (click)="tourForm.patchValue({imageUrl: ''})">×</button>
                </div>

                <div class="upload-controls">
                    <i class="fas fa-link preview-link-icon"></i>
                    <input type="text" formControlName="imageUrl" placeholder="Dán link ảnh hoặc tải lên..." class="url-input">
                    <div class="file-input-wrapper">
                        <input type="file" (change)="onFileSelected($event)" accept="image/*" id="tour-img-up">
                        <label for="tour-img-up" class="upload-label">
                            <i class="fas" [class.fa-upload]="!isUploading()" [class.fa-spinner]="isUploading()" [class.fa-spin]="isUploading()"></i>
                            {{ isUploading() ? 'Đang tải...' : 'Tải lên' }}
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-group full-width">
              <label>Mô tả</label>
              <textarea formControlName="description" rows="3"></textarea>
            </div>

            <div class="form-group full-width">
              <label>Điểm nổi bật (Cách nhau bằng dấu phẩy)</label>
              <input type="text" formControlName="highlights" placeholder="Khách sạn 5 sao, Buffet sáng...">
            </div>

            <div class="form-group">
              <label>📍 Vĩ độ (Latitude)</label>
              <input type="number" step="any" formControlName="latitude" placeholder="VD: 15.8801">
            </div>

            <div class="form-group">
              <label>📍 Kinh độ (Longitude)</label>
              <input type="number" step="any" formControlName="longitude" placeholder="VD: 108.3380">
            </div>

            <div class="form-group full-width map-preview-admin" *ngIf="tourForm.get('latitude')?.value && tourForm.get('longitude')?.value">
                <label>Vị trí địa lý (Preview)</label>
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
              <span>💡 Hướng dẫn: Mở Google Maps → Chuột phải để lấy Vĩ độ và Kinh độ.</span>
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-gold" [disabled]="tourForm.invalid || loading()">
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
    .form-group input, .form-group textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--gold-primary); }
    
    .upload-controls { display: flex; gap: 10px; margin-top: 5px; position: relative; }
    .url-input { flex: 1; padding-left: 35px !important; }
    .preview-link-icon { position: absolute; left: 12px; top: 14px; color: #475569; font-size: 0.8rem; }
    .file-input-wrapper { position: relative; width: 110px; }
    .file-input-wrapper input { position: absolute; inset: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
    .upload-label { display: flex; align-items: center; justify-content: center; gap: 6px; height: 100%; width: 100%; background: rgba(212, 175, 55, 0.1); border: 1px dashed var(--gold-primary); border-radius: 12px; color: var(--gold-primary); font-size: 0.8rem; font-weight: 600; cursor: pointer; }
    
    .image-preview-admin { position: relative; width: 100%; height: 180px; border-radius: 14px; overflow: hidden; margin-bottom: 12px; border: 1px solid rgba(255,255,255,0.1); }
    .image-preview-admin img { width: 100%; height: 100%; object-fit: cover; }
    .remove-img-btn { position: absolute; top: 8px; right: 8px; width: 28px; height: 28px; border-radius: 50%; background: rgba(239, 68, 68, 0.8); border: none; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; z-index: 10; }

    .map-preview-admin { margin-top: 10px; }
    .map-iframe-container { border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; overflow: hidden; height: 200px; background: #000; box-shadow: 0 5px 20px rgba(0,0,0,0.4); }

    .modal-actions { display: flex; gap: 15px; margin-top: 35px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
    .coord-hint { background: rgba(201,168,76,0.07); border: 1px dashed rgba(201,168,76,0.3); border-radius: 10px; padding: 10px 14px !important; font-size: 0.78rem; color: #94a3b8; }
  `]
})
export class TourMgmtComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);

  tours = signal<Tour[]>([]);
  showForm = signal(false);
  editingTour = signal<Tour | null>(null);
  loading = signal(false);
  isUploading = signal(false);

  tourForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(5)]],
    description: [''],
    location: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    durationDays: [1, [Validators.required, Validators.min(1)]],
    imageUrl: [''],
    highlights: [''],
    latitude: [null as number | null],
    longitude: [null as number | null]
  });

  columns: Column[] = [
    { key: 'title', label: 'Tên Tour' },
    { key: 'location', label: 'Địa điểm' },
    { key: 'price', label: 'Giá', type: 'price' },
    { key: 'durationDays', label: 'Số ngày' }
  ];

  ngOnInit() {
    this.loadTours();
  }

  getMapUrl(): string {
    const lat = this.tourForm.get('latitude')?.value;
    const lng = this.tourForm.get('longitude')?.value;
    if (!lat || !lng) return '';
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }

  loadTours() {
    this.catalogService.getTours().subscribe(res => {
      if (res.success && res.data) this.tours.set(res.data);
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      this.catalogService.uploadFile(file).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.tourForm.patchValue({ imageUrl: res.data });
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

  openForm(tour?: Tour) {
    if (tour) {
      this.editingTour.set(tour);
      this.tourForm.patchValue({
        title: tour.title,
        description: tour.description,
        location: tour.location,
        price: tour.price,
        durationDays: tour.durationDays || 1,
        imageUrl: tour.imageUrl || '',
        highlights: tour.highlights?.join(', ') || '',
        latitude: (tour as any).latitude ?? null,
        longitude: (tour as any).longitude ?? null
      });
    } else {
      this.editingTour.set(null);
      this.tourForm.reset({ price: 0, durationDays: 1 });
    }
    this.showForm.set(true);
  }

  saveTour() {
    if (this.tourForm.invalid) return;

    this.loading.set(true);
    const formVal = this.tourForm.value;
    const requestData = {
      ...formVal,
      images: formVal.imageUrl ? [formVal.imageUrl] : [],
      highlights: formVal.highlights ? formVal.highlights.trim() : ''
    };

    const action = this.editingTour()
      ? this.catalogService.updateTour(this.editingTour()!.id, requestData)
      : this.catalogService.createTour(requestData);

    action.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadTours();
          this.showForm.set(false);
        }
      },
      error: (err) => {
        console.error('Error saving tour:', err);
        alert('Có lỗi xảy ra khi lưu thông tin tour.');
      },
      complete: () => this.loading.set(false)
    });
  }

  handleDelete(tour: Tour) {
    if (confirm(`Bạn có chắc muốn xóa tour "${tour.title}"?`)) {
      this.catalogService.deleteTour(tour.id).subscribe(res => {
        if (res.success) this.loadTours();
      });
    }
  }
}
