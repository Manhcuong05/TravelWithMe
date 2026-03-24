import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Column {
  key: string;
  label: string;
  type?: 'text' | 'image' | 'price' | 'badge' | 'date';
}

@Component({
  selector: 'app-generic-mgmt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mgmt-header">
      <div class="title-meta">
        <h1 class="luxury-font main-title">{{ title }}</h1>
        <span class="count-badge">{{ items().length }} bản ghi</span>
      </div>
      <div class="header-actions">
        <div class="search-wrap">
          <i class="fas fa-filter"></i>
          <input type="text" placeholder="Lọc nhanh kết quả...">
        </div>
        <button class="btn-create-pro" (click)="onCreate.emit()">
          <i class="fas fa-plus-circle"></i> <span>Thêm {{ title }} mới</span>
        </button>
      </div>
    </div>

    <div class="table-frame glass-pro">
      <table class="pro-table">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.label }}</th>
            <th class="text-right pr-6">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items()" class="pro-row">
            <td *ngFor="let col of columns">
              <ng-container [ngSwitch]="col.type">
                <div *ngSwitchCase="'image'" class="row-thumbnail">
                   <img [src]="item[col.key]" alt="thumb">
                </div>
                
                <span *ngSwitchCase="'price'" class="price-val">
                   <span class="currency">VNĐ</span> {{ item[col.key] | number:'1.0-0' }}
                </span>
                
                <span *ngSwitchCase="'badge'" class="elite-badge">
                   {{ item[col.key] }}
                </span>
                
                <span *ngSwitchCase="'date'" class="date-val">
                   <i class="far fa-calendar-alt mr-2 opacity-50"></i>
                   {{ item[col.key] | date:'dd MMM, yyyy' }}
                </span>
                
                <span *ngSwitchDefault class="text-val">{{ item[col.key] }}</span>
              </ng-container>
            </td>
            <td class="text-right pr-4">
              <div class="row-actions">
                <button class="btn-row-action btn-edit" (click)="onEdit.emit(item)" title="Chỉnh sửa">
                  <i class="fas fa-pen-to-square"></i>
                </button>
                <button class="btn-row-action btn-delete" (click)="onDelete.emit(item)" title="Xóa bỏ">
                  <i class="fas fa-trash-can"></i>
                </button>
              </div>
            </td>
          </tr>
          
          <tr *ngIf="items().length === 0">
            <td [attr.colspan]="columns.length + 1" class="empty-state">
              <div class="empty-content">
                <i class="fas fa-folder-open mb-4"></i>
                <p>Chưa có dữ liệu nào trong danh mục này.</p>
                <button class="btn-create-pro btn-sm mt-4" (click)="onCreate.emit()">Bắt đầu thêm mới</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
    styles: [`
    .mgmt-header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: flex-end; }
    .main-title { font-size: 2.2rem; margin: 0; color: #fff; letter-spacing: -0.5px; }
    .count-badge { font-size: 0.75rem; color: #64748b; font-weight: 700; background: rgba(255,255,255,0.03); padding: 4px 12px; border-radius: 50px; margin-top: 5px; display: inline-block; }

    .header-actions { display: flex; gap: 20px; align-items: center; }
    .search-wrap { 
      background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255,255,255,0.05);
      border-radius: 14px; padding: 10px 15px; display: flex; align-items: center; gap: 12px;
      width: 300px;
    }
    .search-wrap i { color: #475569; font-size: 0.9rem; }
    .search-wrap input { background: none; border: none; color: #fff; outline: none; font-size: 0.85rem; flex: 1; }

    .btn-create-pro { 
      background: linear-gradient(135deg, #FFD700, #D4AF37); color: #000; padding: 12px 24px;
      border-radius: 14px; border: none; font-weight: 800; display: flex; align-items: center; gap: 10px;
      cursor: pointer; transition: 0.3s; font-size: 0.95rem; box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
    }
    .btn-create-pro:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(212, 175, 55, 0.3); }

    /* Pro Table Frame */
    .table-frame { border-radius: 30px; overflow: hidden; border: 1px solid rgba(255,255,255,0.03); background: rgba(15, 23, 42, 0.2); backdrop-filter: blur(25px); }
    .pro-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    
    .pro-table th { padding: 22px 25px; text-align: left; font-size: 0.7rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 2px; }
    .pro-row { transition: 0.3s; }
    .pro-row:hover { background: rgba(255,255,255,0.015); }
    
    .pro-table td { padding: 20px 25px; border-top: 1px solid rgba(255,255,255,0.02); vertical-align: middle; color: #cbd5e1; }
    
    .row-thumbnail { width: 45px; height: 45px; border-radius: 12px; overflow: hidden; border: 1px solid rgba(255,255,255,0.05); }
    .row-thumbnail img { width: 100%; height: 100%; object-fit: cover; }

    .price-val { font-weight: 800; color: #D4AF37; display: flex; align-items: center; gap: 8px; }
    .currency { font-size: 0.65rem; color: #475569; letter-spacing: 1px; }
    
    .elite-badge { background: rgba(212, 175, 55, 0.1); color: #d4af37; padding: 5px 14px; border-radius: 50px; font-size: 0.7rem; font-weight: 800; border: 1px solid rgba(212, 175, 55, 0.15); }
    .date-val { font-size: 0.85rem; font-weight: 500; }

    .row-actions { display: flex; gap: 8px; justify-content: flex-end; }
    .btn-row-action { 
       width: 40px; height: 40px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);
       background: rgba(255,255,255,0.02); color: #64748b; font-size: 0.9rem; cursor: pointer; transition: 0.3s;
    }
    .btn-edit:hover { background: rgba(212, 175, 55, 0.1); color: #d4af37; border-color: #d4af37; }
    .btn-delete:hover { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: #ef4444; }

    .text-right { text-align: right; }
    .pr-6 { padding-right: 35px !important; }
    .pr-4 { padding-right: 25px !important; }
    .opacity-50 { opacity: 0.5; }
    .mr-2 { margin-right: 8px; }
    .mb-4 { margin-bottom: 16px; }
    .mt-4 { margin-top: 16px; }

    /* Empty State */
    .empty-state { padding: 100px 0 !important; text-align: center; color: #475569; }
    .empty-content i { font-size: 4rem; opacity: 0.1; }
    .btn-sm { padding: 10px 20px; font-size: 0.85rem; }
  `]
})
export class GenericMgmtComponent {
  @Input() title: string = '';
  @Input() columns: Column[] = [];
  @Input() items = signal<any[]>([]);

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<any>();
  @Output() onDelete = new EventEmitter<any>();
}
