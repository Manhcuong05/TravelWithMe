import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { GenericMgmtComponent, Column } from '../shared/generic-mgmt';
import { CatalogService, Tour } from '../../../core/services/catalog.service';

@Component({
    selector: 'app-tour-mgmt',
    standalone: true,
    imports: [CommonModule, GenericMgmtComponent, FormsModule, ReactiveFormsModule],
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
              <label>Mô tả</label>
              <textarea formControlName="description" rows="3"></textarea>
            </div>

            <div class="form-group full-width">
              <label>Điểm nổi bật (Cách nhau bằng dấu phẩy)</label>
              <input type="text" formControlName="highlights" placeholder="Khách sạn 5 sao, Buffet sáng...">
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
    .modal-card { width: 100%; max-width: 600px; padding: 40px; border-radius: 24px; border: 1px solid var(--glass-border); max-height: 90vh; overflow-y: auto; }
    h2 { color: var(--gold-primary); margin-bottom: 30px; text-align: center; }
    
    .admin-form .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .full-width { grid-column: span 2; }
    
    .form-group label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 8px; }
    .form-group input, .form-group textarea { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; color: white; outline: none; transition: border-color 0.2s; }
    .form-group input:focus, .form-group textarea:focus { border-color: var(--gold-primary); }
    
    .modal-actions { display: flex; gap: 15px; margin-top: 35px; }
    .modal-actions button { flex: 1; padding: 12px; border-radius: 12px; font-weight: 600; cursor: pointer; }
  `]
})
export class TourMgmtComponent implements OnInit {
    private catalogService = inject(CatalogService);
    private fb = inject(FormBuilder);

    tours = signal<Tour[]>([]);
    showForm = signal(false);
    editingTour = signal<Tour | null>(null);
    loading = signal(false);

    tourForm = this.fb.group({
        title: ['', [Validators.required, Validators.minLength(5)]],
        description: [''],
        location: ['', Validators.required],
        price: [0, [Validators.required, Validators.min(0)]],
        durationDays: [1, [Validators.required, Validators.min(1)]],
        highlights: ['']
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

    loadTours() {
        this.catalogService.getTours().subscribe(res => {
            if (res.success && res.data) this.tours.set(res.data);
        });
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
                highlights: tour.highlights?.join(', ') || ''
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
        const formValue = this.tourForm.value;
        const requestData = {
            ...formValue,
            // Backend expects single string for highlights in TourRequest
            highlights: formValue.highlights ? formValue.highlights.trim() : ''
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
