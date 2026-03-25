import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { HotelService, Hotel, HotelRoom } from '../../../core/services/hotel.service';

@Component({
  selector: 'app-hotel-room-mgmt',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-info">
          <h1 class="luxury-font">Quản lý Phòng Khách sạn</h1>
          <p class="subtitle">Quản lý các hạng phòng và bảng giá của từng khách sạn trong hệ thống</p>
        </div>
      </div>

      <div class="selection-card glass-effect animate-in">
        <label class="select-label">Chọn Khách sạn</label>
        <select class="hotel-select" [ngModel]="selectedHotelId()" (ngModelChange)="selectHotel($event)">
          <option value="">-- Chọn khách sạn để quản lý --</option>
          <option *ngFor="let hotel of hotels()" [value]="hotel.id">{{ hotel.name }} ({{ hotel.city }})</option>
        </select>
      </div>

      <div *ngIf="selectedHotelId() as hotelId" class="room-management animate-fade-in">
        <div class="table-header-block">
            <h3 class="table-title">Danh sách hạng phòng</h3>
            <button class="btn-gold shadow-gold" (click)="openForm()">
              <span class="plus">+</span> Thêm Phòng Mới
            </button>
        </div>

        <div class="table-card glass-effect">
          <table class="admin-table">
            <thead>
              <tr>
                <th>HẠNG PHÒNG</th>
                <th>SỨC CHỨA</th>
                <th>SỐ LƯỢNG</th>
                <th>GIÁ / ĐÊM (VNĐ)</th>
                <th class="text-right">THAO TÁC</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let room of currentRooms()" class="table-row">
                <td>
                  <div class="room-type-info">
                    <span class="room-name">{{ room.roomType }}</span>
                    <div class="room-tags">
                      <span class="class-badge" *ngIf="room.classification">{{ getClassificationLabel(room.classification) }}</span>
                      <span class="room-amenities">{{ getAmenitiesText(room.amenities) }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ room.capacity }} người</td>
                <td>{{ room.totalRooms }} phòng</td>
                <td class="price-cell">{{ room.pricePerNight | number }} VNĐ</td>
                <td class="text-right">
                  <div class="row-actions">
                    <button class="action-btn edit" title="Chỉnh sửa" (click)="openForm(room)">✏️</button>
                    <button class="action-btn delete" title="Xóa" (click)="deleteRoom(room)">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="currentRooms().length === 0">
                <td colspan="5" class="empty-state">
                  <div class="empty-icon">🛏️</div>
                  <p>Khách sạn này chưa có hạng phòng nào.</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Room Form Modal -->
    <div class="modal-overlay" *ngIf="showForm()" (click)="showForm.set(false)">
      <div class="modal-card glass-effect stop-propagation" (click)="$event.stopPropagation()">
        <div class="modal-header">
          <h2 class="luxury-font">{{ editingRoom() ? 'Sửa Hạng Phòng' : 'Thêm Hạng Phòng Mới' }}</h2>
          <button class="close-modal" (click)="showForm.set(false)">✕</button>
        </div>
        
        <form [formGroup]="roomForm" (ngSubmit)="saveRoom()" class="room-form">
          <div class="form-grid">
            <div class="form-group full">
              <label>Tên hạng phòng (Room Type)</label>
              <input type="text" formControlName="roomType" placeholder="VD: Standard, Deluxe Ocean View...">
            </div>
            
            <div class="form-group">
              <label>Phân loại phòng (Classification)</label>
              <select formControlName="classification">
                <option value="STANDARD">Tiêu chuẩn (Standard)</option>
                <option value="BEST_VALUE">Giá tốt nhất (Best Value)</option>
                <option value="PREMIUM">Cao cấp (Premium)</option>
                <option value="LUXURY">Thượng hạng (Luxury)</option>
              </select>
            </div>

            <div class="form-group">
              <label>Sức chứa (Người)</label>
              <input type="number" formControlName="capacity" min="1" placeholder="VD: 2">
            </div>
            
            <div class="form-group">
              <label>Số lượng phòng trống</label>
              <input type="number" formControlName="totalRooms" min="1" placeholder="VD: 10">
            </div>

            <div class="form-group full">
              <label>Giá mỗi đêm (VNĐ)</label>
              <input type="number" formControlName="pricePerNight" min="0" placeholder="VD: 1500000">
            </div>

            <div class="form-group full">
              <label>Tiện ích (Phân cách bằng dấu phẩy)</label>
              <textarea formControlName="amenitiesStr" rows="2" placeholder="VD: Wifi, View Biển, Bữa sáng..."></textarea>
            </div>
          </div>

          <div class="modal-footer">
            <button type="button" class="btn-outline" (click)="showForm.set(false)">Hủy bỏ</button>
            <button type="submit" class="btn-gold" [disabled]="roomForm.invalid || loading()">
              {{ loading() ? 'Đang lưu...' : 'Lưu Hạng Phòng' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .page-container { animation: fadeIn 0.5s ease; }
    .page-header { margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .page-header h1 { color: var(--gold-primary); font-size: 2rem; margin-bottom: 5px; }
    .subtitle { color: #64748b; font-size: 0.9rem; }

    .selection-card { padding: 25px 30px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); margin-bottom: 30px; }
    .select-label { display: block; font-size: 0.85rem; color: #94a3b8; margin-bottom: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .hotel-select { width: 100%; max-width: 500px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px; color: white; outline: none; transition: border-color 0.2s; font-size: 1rem; appearance: auto; }
    .hotel-select:focus { border-color: var(--gold-primary); }
    .hotel-select option { background: #0a0a0c; color: white; padding: 10px; }

    .room-management { margin-top: 20px; }
    .table-header-block { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px; }
    .table-title { font-size: 1.2rem; color: #fff; font-weight: 600; }

    .table-card { padding: 5px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; background: rgba(255,255,255,0.02); }
    .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .admin-table th { text-align: left; padding: 20px 24px; color: #475569; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
    .admin-table td { padding: 18px 24px; vertical-align: middle; }
    
    .table-row { transition: all 0.2s; border-bottom: 1px solid rgba(255,255,255,0.02); }
    .table-row:hover { background: rgba(255,255,255,0.03); transform: scale(1.002); }

    .room-type-info { display: flex; flex-direction: column; }
    .room-name { font-weight: 600; color: #f1f5f9; font-size: 1rem; margin-bottom: 4px; }
    .room-tags { display: flex; align-items: center; gap: 8px; }
    .class-badge { background: rgba(212, 175, 55, 0.15); color: var(--gold-primary); font-size: 0.65rem; padding: 2px 6px; border-radius: 4px; border: 1px solid rgba(212, 175, 55, 0.3); text-transform: uppercase; font-weight: 700; white-space: nowrap; }
    .room-amenities { font-size: 0.75rem; color: var(--text-muted); max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

    .price-cell { font-weight: 700; color: var(--gold-secondary); }

    .text-right { text-align: right; }
    .row-actions { display: flex; justify-content: flex-end; gap: 8px; }
    .action-btn { width: 34px; height: 34px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s; font-size: 0.9rem; }
    .action-btn:hover { background: rgba(255,255,255,0.08); transform: translateY(-2px); }
    .action-btn.delete:hover { background: rgba(239, 68, 68, 0.15); border-color: #ef4444; }

    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal-card { width: 100%; max-width: 550px; border-radius: 28px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: #0a0a0c; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
    
    .modal-header { padding: 30px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .modal-header h2 { margin: 0; color: var(--gold-primary); font-size: 1.5rem; }
    .close-modal { background: none; border: none; color: #475569; font-size: 1.2rem; cursor: pointer; transition: color 0.2s; }
    .close-modal:hover { color: #f1f5f9; }

    .room-form { padding: 30px; }
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .form-group.full { grid-column: span 2; }
    .form-group label { display: block; font-size: 0.75rem; color: #64748b; margin-bottom: 8px; text-transform: uppercase; font-weight: 700; }
    .form-group input, .form-group textarea, .form-group select { width: 100%; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 14px; padding: 14px; color: white; outline: none; transition: all 0.3s; font-family: inherit; appearance: auto; }
    .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--gold-primary); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1); }
    .form-group select option { background: #0a0a0c; color: white; }

    .modal-footer { display: flex; gap: 12px; margin-top: 35px; justify-content: flex-end; }
    .modal-footer button { padding: 12px 28px; border-radius: 14px; font-weight: 600; cursor: pointer; font-size: 0.9rem; transition: all 0.2s; }

    .empty-state { text-align: center; padding: 60px 0; color: #475569; }
    .empty-icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.3; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .shadow-gold { box-shadow: 0 10px 20px -5px rgba(212, 175, 55, 0.3); }
  `]
})
export class HotelRoomMgmtComponent implements OnInit {
  private hotelService = inject(HotelService);
  private fb = inject(FormBuilder);

  hotels = signal<Hotel[]>([]);
  selectedHotelId = signal<string>('');
  selectedHotel = signal<Hotel | null>(null);
  currentRooms = signal<HotelRoom[]>([]);

  showForm = signal(false);
  editingRoom = signal<HotelRoom | null>(null);
  loading = signal(false);

  roomForm = this.fb.group({
    roomType: ['', Validators.required],
    classification: ['STANDARD'],
    capacity: [2, [Validators.required, Validators.min(1)]],
    totalRooms: [1, [Validators.required, Validators.min(1)]],
    pricePerNight: [0, [Validators.required, Validators.min(0)]],
    amenitiesStr: [''] // Comma separated string for simplicity
  });

  ngOnInit() {
    this.loadHotels();
  }

  loadHotels() {
    this.hotelService.getHotels().subscribe(res => {
      if (res.success && res.data) {
        this.hotels.set(res.data);
        // If a hotel was selected, refresh its rooms
        if (this.selectedHotelId()) {
          this.refreshCurrentHotel();
        }
      }
    });
  }

  selectHotel(hotelId: string) {
    this.selectedHotelId.set(hotelId);
    this.refreshCurrentHotel();
  }

  refreshCurrentHotel() {
    const hotel = this.hotels().find(h => h.id === this.selectedHotelId());
    if (hotel) {
      this.selectedHotel.set(hotel);
      // Since rooms are loaded with hotel, just set it
      this.currentRooms.set(hotel.rooms || []);
      // Alternatively, could fetch hotel by ID to ensure fresh rooms if needed.
      this.hotelService.getHotel(hotel.id).subscribe(res => {
        if (res.success && res.data) {
          this.currentRooms.set(res.data.rooms || []);
        }
      });
    } else {
      this.selectedHotel.set(null);
      this.currentRooms.set([]);
    }
  }

  openForm(room?: HotelRoom) {
    if (room) {
      this.editingRoom.set(room);
      const amenitiesStr = room.amenities ? room.amenities.join(', ') : '';
      this.roomForm.patchValue({
        roomType: room.roomType,
        classification: room.classification || 'STANDARD',
        capacity: room.capacity,
        totalRooms: room.totalRooms,
        pricePerNight: room.pricePerNight,
        amenitiesStr: amenitiesStr
      });
    } else {
      this.editingRoom.set(null);
      this.roomForm.reset({ classification: 'STANDARD', capacity: 2, totalRooms: 1, pricePerNight: 0, amenitiesStr: '' });
    }
    this.showForm.set(true);
  }

  saveRoom() {
    if (this.roomForm.invalid || !this.selectedHotelId()) return;

    this.loading.set(true);
    const formVal = this.roomForm.value;
    const amenities = formVal.amenitiesStr ? formVal.amenitiesStr.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [];

    const requestData = {
      roomType: formVal.roomType,
      classification: formVal.classification,
      capacity: formVal.capacity,
      totalRooms: formVal.totalRooms,
      pricePerNight: formVal.pricePerNight,
      amenities: amenities
    };

    const action = this.editingRoom()
      ? this.hotelService.updateRoom(this.editingRoom()!.id, requestData)
      : this.hotelService.addRoom(this.selectedHotelId(), requestData);

    action.subscribe({
      next: (res) => {
        if (res.success) {
          this.showForm.set(false);
          // Refresh hotels or just the current hotel's room
          this.refreshCurrentHotel();
        }
      },
      error: (err) => {
        console.error('Error saving room:', err);
        alert('Có lỗi xảy ra khi lưu phòng.');
      },
      complete: () => this.loading.set(false)
    });
  }

  deleteRoom(room: HotelRoom) {
    if (confirm(`Bạn có chắc muốn xóa hạng phòng "${room.roomType}"?`)) {
      this.hotelService.deleteRoom(room.id).subscribe(res => {
        if (res.success) {
          this.refreshCurrentHotel();
        }
      });
    }
  }

  getAmenitiesText(amenities: string[]): string {
    if (!amenities || amenities.length === 0) return 'Không có tiện ích ghi chú';
    return amenities.join(' • ');
  }

  getClassificationLabel(classification: string | undefined): string {
    switch (classification) {
      case 'BEST_VALUE': return 'Giá tốt nhất';
      case 'PREMIUM': return 'Cao cấp';
      case 'LUXURY': return 'Thượng hạng';
      default: return 'Tiêu chuẩn';
    }
  }
}
