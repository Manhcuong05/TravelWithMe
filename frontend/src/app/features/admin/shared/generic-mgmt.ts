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
    <div class="header">
      <h1 class="luxury-font">{{ title }}</h1>
      <button class="btn-gold" (click)="onCreate.emit()">+ Thêm mới</button>
    </div>

    <div class="table-container glass-effect">
      <table class="admin-table">
        <thead>
          <tr>
            <th *ngFor="let col of columns">{{ col.label }}</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of items()">
            <td *ngFor="let col of columns">
              <ng-container [ngSwitch]="col.type">
                <img *ngSwitchCase="'image'" [src]="item[col.key]" class="row-img">
                <span *ngSwitchCase="'price'">{{ item[col.key] | number:'1.0-0' }} VNĐ</span>
                <span *ngSwitchCase="'badge'" class="badge">{{ item[col.key] }}</span>
                <span *ngSwitchCase="'date'">{{ item[col.key] | date:'dd/MM/yyyy HH:mm' }}</span>
                <span *ngSwitchDefault>{{ item[col.key] }}</span>
              </ng-container>
            </td>
            <td>
              <div class="actions">
                <button class="btn-icon" (click)="onEdit.emit(item)">✏️</button>
                <button class="btn-icon delete" (click)="onDelete.emit(item)">🗑️</button>
              </div>
            </td>
          </tr>
          <tr *ngIf="items().length === 0">
            <td [attr.colspan]="columns.length + 1" class="text-center py-4">Chưa có dữ liệu.</td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .header { margin-bottom: 40px; display: flex; justify-content: space-between; align-items: center; }
    h1 { color: var(--gold-primary); font-size: 1.8rem; }
    
    .table-container { padding: 20px; border-radius: 20px; overflow-x: auto; }
    .admin-table { width: 100%; border-collapse: collapse; }
    .admin-table th { text-align: left; padding: 15px; color: #94a3b8; font-size: 0.85rem; text-transform: uppercase; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .admin-table td { padding: 15px; border-bottom: 1px solid rgba(255,255,255,0.02); vertical-align: middle; }
    
    .row-img { width: 60px; height: 40px; object-fit: cover; border-radius: 6px; }
    .badge { background: rgba(212, 175, 55, 0.1); color: var(--gold-primary); padding: 4px 10px; border-radius: 12px; font-size: 0.75rem; }
    
    .btn-icon { background: none; border: none; cursor: pointer; padding: 5px; opacity: 0.6; transition: opacity 0.2s; font-size: 1.1rem; }
    .btn-icon:hover { opacity: 1; }
    .btn-icon.delete:hover { color: #ef4444; }
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
