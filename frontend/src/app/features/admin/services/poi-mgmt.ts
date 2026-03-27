import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { CatalogService, PointOfInterest } from '../../../core/services/catalog.service';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-poi-mgmt',
  standalone: true,
  imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule, SafePipe],
  template: `
    <app-generic-mgmt
      [title]="'Quản lý Địa danh'"
      [columns]="columns"
      [items]="pois"
      (onCreate)="openForm()"
      (onEdit)="openForm($event)"
      (onDelete)="handleDelete($event)"
    ></app-generic-mgmt>

    <!-- POI Form Modal Pro -->
    <div class="modal-overlay-pro" *ngIf="showForm()" (click)="$event.target === modalOverlay && showForm.set(false)" #modalOverlay>
      <div class="modal-card-pro glass-pro-heavy">
        <div class="modal-header-pro">
          <div class="header-main">
            <i class="fas fa-location-dot gold-glow mr-3"></i>
            <h2 class="luxury-font">{{ editingPoi() ? 'Chỉnh sửa' : 'Tạo mới' }} Địa danh</h2>
          </div>
          <button class="btn-close-modal" (click)="showForm.set(false)"><i class="fas fa-times"></i></button>
        </div>
        
        <form [formGroup]="poiForm" (ngSubmit)="savePoi()" class="admin-form-pro">
          <div class="form-scroll-area">
            <div class="form-grid-pro">
              <!-- Basic Info -->
              <div class="form-section-title full-width">THÔNG TIN CƠ BẢN</div>
              
              <div class="form-group-pro full-width">
                <label>Tên địa điểm du lịch</label>
                <input type="text" formControlName="name" placeholder="Ví dụ: Bà Nà Hills, Cầu Vàng...">
              </div>

              <div class="form-group-pro">
                <label>Thành phố / Tỉnh</label>
                <input type="text" formControlName="city" placeholder="Đà Nẵng">
              </div>

              <div class="form-group-pro">
                <label>Lĩnh vực / Phân loại</label>
                <input type="text" formControlName="category" placeholder="Công viên, Di tích...">
              </div>

              <div class="form-group-pro full-width">
                <label>Địa chỉ chi tiết</label>
                <input type="text" formControlName="address" placeholder="Số 123, đường...">
              </div>

              <div class="form-group-pro">
                <label>📍 Vĩ độ (Latitude)</label>
                <input type="number" formControlName="latitude" step="any" placeholder="Ví dụ: 21.0285">
              </div>

              <div class="form-group-pro">
                <label>📍 Kinh độ (Longitude)</label>
                <input type="number" formControlName="longitude" step="any" placeholder="Ví dụ: 105.8542">
              </div>

              <div class="form-group-pro full-width coord-hint-pro">
                <i class="fas fa-circle-info mr-2"></i>
                <span>💡 Hướng dẫn: Mở Google Maps → Chuột phải vào vị trí → Sao chép số đầu tiên (Vĩ độ) và số thứ hai (Kinh độ).</span>
              </div>

              <div class="form-group-pro full-width map-preview-wrap" *ngIf="poiForm.get('latitude')?.value && poiForm.get('longitude')?.value">
                <label>Bản đồ vị trí (Preview)</label>
                <div class="map-container-pro">
                  <iframe 
                    width="100%" 
                    height="200" 
                    frameborder="0" 
                    style="border:0; border-radius: 14px;" 
                    [src]="getMapUrl() | safe" 
                    allowfullscreen>
                  </iframe>
                </div>
              </div>

              <div class="form-group-pro">
                <label>Chi phí dự kiến (VNĐ)</label>
                <input type="number" formControlName="averageSpend" placeholder="500000">
              </div>

              <div class="form-group-pro">
                <label>Vùng miền</label>
                <div class="select-wrap-pro">
                  <select formControlName="region">
                    <option value="NORTH">Miền Bắc</option>
                    <option value="CENTRAL">Miền Trung</option>
                    <option value="SOUTH">Miền Nam</option>
                  </select>
                </div>
              </div>

              <div class="form-group-pro full-width">
                <label>Thời điểm tham quan tốt nhất</label>
                <input type="text" formControlName="bestTimeToVisit" placeholder="Tháng 3 - Tháng 9 hàng năm">
              </div>

              <div class="form-group-pro full-width">
                <label>Hình ảnh đại diện (Banner)</label>
                
                <!-- Preview area -->
                <div class="image-preview-container-pro" *ngIf="poiForm.get('imageUrl')?.value">
                  <img [src]="poiForm.get('imageUrl')?.value" alt="POI Preview">
                  <button type="button" class="btn-remove-img" (click)="poiForm.patchValue({imageUrl: ''})">
                    <i class="fas fa-times-circle"></i>
                  </button>
                </div>

                <div class="upload-zone-pro">
                  <div class="url-input">
                    <i class="fas fa-link"></i>
                    <input type="text" formControlName="imageUrl" placeholder="Link ảnh hoặc tải lên...">
                  </div>
                  <div class="file-trigger-pro">
                    <label class="btn-upload-minimal" [class.disabled]="isUploading()">
                      <input type="file" (change)="onFileSelected($event)" accept="image/*" [disabled]="isUploading()" style="display: none">
                      <i class="fas" [class.fa-cloud-arrow-up]="!isUploading()" [class.fa-spinner-third]="isUploading()" [class.fa-spin]="isUploading()"></i>
                      <span>{{ isUploading() ? 'Đang tải...' : 'Tải ảnh lên' }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <div class="form-group-pro full-width">
                <label>Mô tả tổng quát (Ngắn gọn)</label>
                <textarea formControlName="description" rows="2" placeholder="Tóm tắt về vẻ đẹp của địa danh..."></textarea>
              </div>

              <!-- AI Handbook Section -->
              <div class="form-section-title full-width mt-10 primary-gradient-text">
                <i class="fas fa-wand-magic-sparkles mr-2"></i> BIÊN TẬP CẨM NANG AI
              </div>
              
              <div class="ai-trigger-panel full-width">
                <div class="ai-info">
                  <h4>Tự động hóa nội dung</h4>
                  <p>Sử dụng trí tuệ nhân tạo để soạn thảo cẩm nang chuyên nghiệp 6 phần.</p>
                </div>
                <button type="button" class="btn-ai-sparkle-pro" (click)="generateWithAI()" [disabled]="aiLoading()">
                   <i class="fas" [class.fa-robot]="!aiLoading()" [class.fa-spinner-third]="aiLoading()" [class.fa-spin]="aiLoading()"></i>
                   <span>{{ aiLoading() ? 'Đang thực hiện...' : 'Soạn thảo bằng AI' }}</span>
                </button>
              </div>
              
              <div class="handbook-fields full-width">
                <div class="form-group-pro">
                  <label>Di chuyển (Logistics)</label>
                  <textarea formControlName="h_logistics" rows="2"></textarea>
                </div>
                <div class="form-group-pro">
                  <label>Lưu trú (Accommodation)</label>
                  <textarea formControlName="h_accommodation" rows="2"></textarea>
                </div>
                <div class="form-group-pro">
                  <label>Điểm khám phá (Discovery)</label>
                  <textarea formControlName="h_discovery" rows="4" placeholder="Tên điểm: Mô tả..."></textarea>
                </div>
                <div class="form-group-pro">
                  <label>Ẩm thực (Culinary)</label>
                  <textarea formControlName="h_culinary" rows="2"></textarea>
                </div>
                <div class="form-group-pro">
                  <label>Lịch trình (Itinerary)</label>
                  <textarea formControlName="h_itinerary" rows="4"></textarea>
                </div>
                <div class="form-group-pro">
                  <label>Tips & Mẹo hay (Expert Tips)</label>
                  <textarea formControlName="h_tips" rows="4"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer-pro">
            <button type="button" class="btn-cancel-pro" (click)="showForm.set(false)">Hủy bỏ</button>
            <button type="button" class="btn-save-pro" (click)="savePoi()" [disabled]="loading()">
              <i class="fas" [class.fa-check-circle]="!loading()" [class.fa-spinner-third]="loading()" [class.fa-spin]="loading()"></i>
              {{ loading() ? 'Đang lưu trữ...' : 'Lưu dữ liệu' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay-pro { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card-pro { width: 100%; max-width: 850px; border-radius: 30px; border: 1px solid rgba(255,255,255,0.08); display: flex; flex-direction: column; max-height: 90vh; overflow: hidden; box-shadow: 0 50px 100px rgba(0,0,0,0.6); }
    .glass-pro-heavy { background: rgba(15, 23, 42, 0.9); }
    
    .modal-header-pro { padding: 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .header-main { display: flex; align-items: center; }
    .header-main h2 { margin: 0; font-size: 1.6rem; color: #fff; }
    .gold-glow { color: #d4af37; filter: drop-shadow(0 0 5px rgba(212,175,55,0.5)); }
    .btn-close-modal { background: rgba(255,255,255,0.05); border: none; color: #64748b; width: 35px; height: 35px; border-radius: 50%; cursor: pointer; transition: 0.3s; }
    .btn-close-modal:hover { background: rgba(239, 68, 68, 0.2); color: #ef4444; }

    .admin-form-pro { flex: 1; display: flex; flex-direction: column; overflow: hidden; min-height: 0; }
    .form-scroll-area { flex: 1; overflow-y: auto; padding: 30px; min-height: 0; scroll-behavior: smooth; }
    .form-scroll-area::-webkit-scrollbar { width: 8px; }
    .form-scroll-area::-webkit-scrollbar-track { background: rgba(0,0,0,0.2); border-radius: 10px; }
    .form-scroll-area::-webkit-scrollbar-thumb { background: rgba(212,175,55,0.4); border-radius: 10px; border: 2px solid transparent; background-clip: content-box; }
    .form-scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(212,175,55,0.7); border: 2px solid transparent; background-clip: content-box; }

    .form-grid-pro { display: grid; grid-template-columns: 1fr 1fr; gap: 25px; }
    .full-width { grid-column: span 2; }
    .form-section-title { font-size: 0.7rem; font-weight: 800; color: #475569; letter-spacing: 2.5px; margin: 20px 0 10px; }
    .primary-gradient-text { background: linear-gradient(135deg, #FFD700, #D4AF37); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

    .form-group-pro label { display: block; font-size: 0.75rem; font-weight: 700; color: #94a3b8; margin-bottom: 10px; }
    .form-group-pro input, .form-group-pro textarea, .form-group-pro select { 
       width: 100%; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
       border-radius: 14px; padding: 14px 18px; color: #f1f5f9; outline: none; transition: all 0.3s;
       font-size: 0.9rem;
    }
    .form-group-pro input:focus, .form-group-pro textarea:focus { border-color: rgba(212,175,55,0.3); background: rgba(255,255,255,0.04); box-shadow: 0 0 15px rgba(212,175,55,0.05); }
    .form-group-pro input.ng-invalid.ng-touched, .form-group-pro textarea.ng-invalid.ng-touched { border-color: rgba(239, 68, 68, 0.5); }

    .upload-zone-pro { display: flex; gap: 15px; align-items: stretch; }
    .url-input { flex: 1; position: relative; }
    .url-input i { position: absolute; left: 15px; top: 18px; color: #475569; font-size: 0.8rem; }
    .url-input input { padding-left: 40px !important; }
    
    .file-trigger-pro { display: flex; align-items: stretch; }
    .btn-upload-minimal { 
       display: flex; align-items: center; justify-content: center; gap: 10px; 
       padding: 0 20px; background: rgba(212,175,55,0.1); 
       border: 1px dashed rgba(212,175,55,0.4); border-radius: 14px; 
       color: #d4af37; font-weight: 700; font-size: 0.85rem; cursor: pointer !important;
       transition: all 0.3s; white-space: nowrap; outline: none;
       user-select: none;
    }
    .btn-upload-minimal:hover:not(.disabled) { background: rgba(212,175,55,0.2); border-color: #d4af37; transform: translateY(-2px); }
    .btn-upload-minimal.disabled { opacity: 0.5; cursor: wait !important; }

    .ai-trigger-panel { 
       background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%);
       border: 1px solid rgba(168, 85, 247, 0.15); border-radius: 20px; padding: 25px;
       display: flex; justify-content: space-between; align-items: center; margin: 15px 0;
    }
    .ai-info h4 { margin: 0; color: #fff; font-size: 1rem; }
    .ai-info p { margin: 5px 0 0; color: #64748b; font-size: 0.8rem; }
    
    .btn-ai-sparkle-pro { 
       background: linear-gradient(135deg, #6366f1, #a855f7); color: #fff; border: none;
       padding: 12px 22px; border-radius: 12px; font-weight: 800; font-size: 0.85rem;
       cursor: pointer; display: flex; align-items: center; gap: 10px; transition: 0.3s;
       box-shadow: 0 10px 20px rgba(168, 85, 247, 0.2);
    }
    .btn-ai-sparkle-pro:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(168, 85, 247, 0.4); }

    .modal-footer-pro { padding: 30px; display: flex; justify-content: flex-end; gap: 15px; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(2, 6, 23, 0.2); }
    .btn-cancel-pro { background: none; border: 1px solid rgba(255,255,255,0.1); color: #64748b; padding: 12px 25px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; }
    .btn-cancel-pro:hover { background: rgba(255,255,255,0.05); color: #f1f5f9; }
    
    .btn-save-pro { background: linear-gradient(135deg, #FFD700, #D4AF37); color: #000; padding: 12px 35px; border: none; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2); }
    .btn-save-pro:hover:not(:disabled) { transform: scale(1.03); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }
    .btn-save-pro:disabled { opacity: 0.5; cursor: not-allowed; }

    .image-preview-container-pro { 
       position: relative; width: 100%; height: 200px; border-radius: 20px; 
       overflow: hidden; margin-bottom: 20px; border: 1px solid rgba(255,255,255,0.1);
    }
    .image-preview-container-pro img { width: 100%; height: 100%; object-fit: cover; }
    .btn-remove-img { 
       position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,0.5); 
       border: none; color: #ef4444; font-size: 1.5rem; cursor: pointer; border-radius: 50%;
       width: 40px; height: 40px; display: flex; align-items: center; justify-content: center;
       backdrop-filter: blur(5px); transition: 0.3s;
    }
    .btn-remove-img:hover { background: #ef4444; color: white; transform: scale(1.1); }

    .coord-hint-pro { 
       background: rgba(201,168,76,0.07); border: 1px dashed rgba(201,168,76,0.3); 
       border-radius: 12px; padding: 12px 18px !important; font-size: 0.8rem; color: #94a3b8;
       line-height: 1.5;
    }
    .map-preview-wrap { margin-top: 10px; }
    .map-container-pro { border: 2px solid rgba(255,255,255,0.05); border-radius: 16px; overflow: hidden; background: #000; box-shadow: 0 10px 30px rgba(0,0,0,0.3); }

    .mr-3 { margin-right: 12px; }
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
  aiLoading = signal(false);

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
    averageSpend: [0],
    h_logistics: [''],
    h_accommodation: [''],
    h_discovery: [''],
    h_culinary: [''],
    h_itinerary: [''],
    h_tips: ['']
  });

  columns: Column[] = [
    { key: 'name', label: 'Tên Địa danh' },
    { key: 'city', label: 'Thành phố', type: 'badge' },
    { key: 'category', label: 'Lĩnh vực', type: 'badge' },
    { key: 'averageSpend', label: 'Chi phí', type: 'price' }
  ];

  ngOnInit() {
    this.loadPOIs();
  }

  getMapUrl(): string {
    const lat = this.poiForm.get('latitude')?.value;
    const lng = this.poiForm.get('longitude')?.value;
    if (!lat || !lng) return '';
    return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
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
        averageSpend: poi.averageSpend || 0,
        h_logistics: '',
        h_accommodation: '',
        h_discovery: '',
        h_culinary: '',
        h_itinerary: '',
        h_tips: ''
      });

      if (poi.handbookJson) {
        try {
          const h = JSON.parse(poi.handbookJson);
          this.poiForm.patchValue({
            h_logistics: h.logistics || '',
            h_accommodation: h.accommodation || '',
            h_discovery: h.discovery?.map((d: any) => `${d.title}: ${d.desc}`).join('\n') || '',
            h_culinary: h.culinary || '',
            h_itinerary: h.itinerary?.join('\n') || '',
            h_tips: h.tips?.join('\n') || ''
          });
        } catch (e) { console.error('Error parsing handbookJson', e); }
      }
    } else {
      this.editingPoi.set(null);
      this.poiForm.reset({ latitude: 0, longitude: 0, averageSpend: 0, region: 'NORTH' });
    }
    this.showForm.set(true);
  }

  savePoi() {
    console.log('Save POI triggered. Form status:', this.poiForm.status);
    if (this.poiForm.invalid) {
      console.warn('Form invalid fields:', this.getInvalidFields());
      alert('Vui lòng điền đầy đủ các thông tin bắt buộc (được đánh dấu đỏ hoặc còn trống).');
      this.poiForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formVal: any = this.poiForm.value;

    // Serialize Handbook Data
    const handbook = {
      logistics: formVal.h_logistics,
      accommodation: formVal.h_accommodation,
      discovery: formVal.h_discovery?.split('\n').filter((l: string) => l.trim()).map((l: string) => {
        if (l.includes(':')) {
          const parts = l.split(':');
          return { title: parts[0].trim(), desc: parts.slice(1).join(':').trim() };
        }
        return { title: l.trim(), desc: '' };
      }),
      culinary: formVal.h_culinary,
      itinerary: formVal.h_itinerary?.split('\n').filter((l: string) => l.trim()),
      tips: formVal.h_tips?.split('\n').filter((l: string) => l.trim())
    };

    const requestData = {
      ...formVal,
      images: formVal.imageUrl ? [formVal.imageUrl] : [],
      handbookJson: JSON.stringify(handbook)
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

  private getInvalidFields() {
    const invalid = [];
    const controls = this.poiForm.controls;
    for (const name in controls) {
      if (controls[name as keyof typeof controls].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  generateWithAI() {
    const name = this.poiForm.value.name;
    const city = this.poiForm.value.city;
    if (!name || !city) {
      alert('Vui lòng nhập Tên địa danh và Thành phố để AI có thông tin biên soạn.');
      return;
    }

    this.aiLoading.set(true);
    this.catalogService.generateHandbook(name, city).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          try {
            // The backend might return a markdown-wrapped JSON or pure JSON
            let content = res.data.trim();
            if (content.startsWith('```json')) content = content.replace(/```json|```/g, '').trim();
            if (content.startsWith('```')) content = content.replace(/```/g, '').trim();

            const data = JSON.parse(content);
            this.poiForm.patchValue({
              h_logistics: data.logistics || '',
              h_accommodation: data.accommodation || '',
              h_discovery: data.discovery || '',
              h_culinary: data.culinary || '',
              h_itinerary: data.itinerary || '',
              h_tips: data.tips || ''
            });
          } catch (e) {
            console.error('Error parsing AI response:', e, res.data);
            alert('AI phản hồi định dạng không hợp lệ. Vui lòng thử lại.');
          }
        }
      },
      error: (err) => {
        console.error('AI error:', err);
        alert('Có lỗi xảy ra khi gọi AI: ' + (err.error?.message || 'Không thể kết nối với dịch vụ AI.'));
      },
      complete: () => this.aiLoading.set(false)
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
