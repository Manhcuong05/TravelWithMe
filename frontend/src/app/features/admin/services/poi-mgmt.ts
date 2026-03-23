import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { CatalogService, PointOfInterest } from '../../../core/services/catalog.service';

@Component({
  selector: 'app-poi-mgmt',
  standalone: true,
  imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule],
  template: `
    <app-generic-mgmt
      [title]="'Quản lý Địa danh'"
      [columns]="columns"
      [items]="pois"
      (onCreate)="openForm()"
      (onEdit)="openForm($event)"
      (onDelete)="handleDelete($event)"
    ></app-generic-mgmt>

    <!-- POI Form Modal -->
    <div class="modal-overlay" *ngIf="showForm()">
      <div class="modal-card glass-effect">
        <h2 class="luxury-font">{{ editingPoi() ? 'Sửa Địa danh' : 'Thêm Địa danh Mới' }}</h2>
        
        <form [formGroup]="poiForm" (ngSubmit)="savePoi()" class="admin-form">
          <div class="form-grid">
            <div class="form-group full-width">
              <label>Tên địa điểm</label>
              <input type="text" formControlName="name" placeholder="Ví dụ: Bà Nà Hills">
            </div>

            <div class="form-group">
              <label>Thành phố</label>
              <input type="text" formControlName="city">
            </div>

            <div class="form-group">
              <label>Lĩnh vực / Thể loại</label>
              <input type="text" formControlName="category" placeholder="Ví dụ: Công viên, Di tích...">
            </div>

            <div class="form-group full-width">
              <label>Địa chỉ cụ thể</label>
              <input type="text" formControlName="address">
            </div>

            <div class="form-group">
              <label>Vĩ độ (Latitude)</label>
              <input type="number" formControlName="latitude" step="0.000001">
            </div>

            <div class="form-group">
              <label>Kinh độ (Longitude)</label>
              <input type="number" formControlName="longitude" step="0.000001">
            </div>

            <div class="form-group full-width">
              <label>Chi phí trung bình (VNĐ)</label>
              <input type="number" formControlName="averageSpend">
            </div>

            <div class="form-group">
              <label>Vùng miền</label>
              <select formControlName="region">
                <option value="NORTH">Miền Bắc</option>
                <option value="CENTRAL">Miền Trung</option>
                <option value="SOUTH">Miền Nam</option>
              </select>
            </div>

            <div class="form-group">
              <label>Thời điểm lý tưởng</label>
              <input type="text" formControlName="bestTimeToVisit" placeholder="Ví dụ: Tháng 3 - Tháng 8">
            </div>

            <div class="form-group full-width">
              <label>Đường dẫn Ảnh (Cover URL) hoặc Tải ảnh từ máy tính</label>
              <div class="upload-flex">
                 <input type="text" formControlName="imageUrl" placeholder="HTTPS://...">
                 <input type="file" (change)="onFileSelected($event)" accept="image/*" class="file-input">
              </div>
              <div *ngIf="isUploading()" class="uploading-text">Đang tải ảnh lên... Vui lòng đợi</div>
            </div>

            <div class="form-group full-width">
              <label>Mô tả ngắn</label>
              <textarea formControlName="description" rows="2"></textarea>
            </div>

            <div class="form-group full-width">
              <label>Tips & Lưu ý (Cẩm nang)</label>
              <textarea formControlName="tips" rows="4" placeholder="Nhập kinh nghiệm, lưu ý khi đi..."></textarea>
            </div>
          </div>

          <div class="modal-actions">
            <button type="submit" class="btn-gold" [disabled]="poiForm.invalid || loading()">
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
    .form-group select option { background: #0f172a; color: white; }
    
    .upload-flex { display: flex; gap: 10px; align-items: stretch; }
    .upload-flex input[type="text"] { flex: 1; }
    .file-input { width: auto !important; padding: 9px !important; cursor: pointer; }
    .file-input::-webkit-file-upload-button { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: white; padding: 6px 12px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; margin-right: 10px;}
    .uploading-text { color: var(--gold-primary); font-size: 0.85rem; margin-top: 6px; font-style: italic; }

    .modal-actions { display: flex; gap: 15px; margin-top: 35px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
  `]
})
export class PoiMgmtComponent implements OnInit {
  private catalogService = inject(CatalogService);
  private fb = inject(FormBuilder);

  pois = signal<PointOfInterest[]>([]);
  showForm = signal(false);
  editingPoi = signal<PointOfInterest | null>(null);
  loading = signal(false);
  isUploading = signal(false);

  poiForm = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    category: ['', Validators.required],
    region: ['NORTH'],
    bestTimeToVisit: [''],
    tips: [''],
    imageUrl: [''],
    address: [''],
    city: ['', Validators.required],
    latitude: [0],
    longitude: [0],
    averageSpend: [0]
  });

  columns: Column[] = [
    { key: 'name', label: 'Tên Địa danh' },
    { key: 'city', label: 'Thành phố' },
    { key: 'category', label: 'Lĩnh vực' }
  ];

  ngOnInit() {
    this.loadPOIs();
  }

  loadPOIs() {
    this.catalogService.getPOIs().subscribe(res => {
      if (res.success && res.data) this.pois.set(res.data);
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.isUploading.set(true);
      this.catalogService.uploadFile(file).subscribe({
        next: (res) => {
          if (res.success && res.data) {
            this.poiForm.patchValue({ imageUrl: res.data });
          }
        },
        error: (err) => {
          console.error('Upload error', err);
          alert('Có lỗi xảy ra khi tải ảnh lên.');
          this.isUploading.set(false);
        },
        complete: () => this.isUploading.set(false)
      });
    }
  }

  openForm(poi?: PointOfInterest) {
    if (poi) {
      this.editingPoi.set(poi);
      let parsedImage = '';
      if (poi.imagesJson && poi.imagesJson !== 'null' && poi.imagesJson !== '[]') {
        try {
          const imgs = JSON.parse(poi.imagesJson);
          if (imgs && imgs.length > 0) parsedImage = imgs[0];
        } catch (e) { }
      }

      this.poiForm.patchValue({
        name: poi.name,
        description: poi.description,
        category: poi.category,
        region: poi.region || 'NORTH',
        bestTimeToVisit: poi.bestTimeToVisit || '',
        tips: poi.tips || '',
        imageUrl: parsedImage,
        address: poi.address || '',
        city: poi.city,
        latitude: poi.latitude || 0,
        longitude: poi.longitude || 0,
        averageSpend: poi.averageSpend || 0
      });
    } else {
      this.editingPoi.set(null);
      this.poiForm.reset({ latitude: 0, longitude: 0, averageSpend: 0, region: 'NORTH' });
    }
    this.showForm.set(true);
  }

  savePoi() {
    if (this.poiForm.invalid) return;

    this.loading.set(true);
    const formVal = this.poiForm.value;
    const requestData = {
      ...formVal,
      images: formVal.imageUrl ? [formVal.imageUrl] : []
    };

    const action = this.editingPoi()
      ? this.catalogService.updatePOI(this.editingPoi()!.id, requestData)
      : this.catalogService.createPOI(requestData);

    action.subscribe({
      next: (res) => {
        if (res.success) {
          this.loadPOIs();
          this.showForm.set(false);
        }
      },
      error: (err) => {
        console.error('Error saving POI:', err);
        alert('Có lỗi xảy ra khi lưu thông tin địa danh.');
      },
      complete: () => this.loading.set(false)
    });
  }

  handleDelete(poi: PointOfInterest) {
    if (confirm(`Bạn có chắc muốn xóa địa danh "${poi.name}"?`)) {
      this.catalogService.deletePOI(poi.id).subscribe(res => {
        if (res.success) this.loadPOIs();
      });
    }
  }
}
