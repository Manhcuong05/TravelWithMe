import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { PaymentService, Transaction } from '../../../core/services/payment.service';

@Component({
    selector: 'app-transaction-mgmt',
    standalone: true,
    imports: [CommonModule],
    providers: [DatePipe, DecimalPipe],
    template: `
    <div class="page-container">
      <div class="page-header">
        <div class="header-info">
          <h1 class="luxury-font">Lịch sử Giao Dịch</h1>
          <p class="subtitle">Theo dõi dòng tiền và tất cả các khoản thanh toán trong hệ thống.</p>
        </div>
      </div>

      <div class="table-card glass-effect animate-in">
        <table class="admin-table">
          <thead>
            <tr>
              <th>MÃ GIAO DỊCH</th>
              <th>MÃ ĐƠN HÀNG</th>
              <th>SỐ TIỀN</th>
              <th>PHƯƠNG THỨC</th>
              <th>THỜI GIAN</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let txn of transactions()" class="table-row">
              <td><span class="ref-badge">{{ txn.transactionReference }}</span></td>
              <td><span class="booking-id" title="{{ txn.bookingId }}">{{ txn.bookingId | slice:0:8 }}...</span></td>
              <td>
                <span class="amount text-gold">+{{ txn.amount | number }}đ</span>
              </td>
              <td>
                <div class="method-badge">
                  <span class="icon">{{ getMethodIcon(txn.paymentMethod) }}</span>
                  {{ txn.paymentMethod }}
                </div>
              </td>
              <td>
                <span class="date-text">{{ txn.createdAt | date:'dd/MM/yyyy HH:mm:ss' }}</span>
              </td>
              <td>
                <span class="status-badge" [class.success]="txn.status === 'SUCCESS'" [class.pending]="txn.status === 'PENDING'" [class.failed]="txn.status === 'FAILED'">
                  {{ getStatusText(txn.status) }}
                </span>
              </td>
            </tr>
            <tr *ngIf="transactions().length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-icon">💸</div>
                <p>Chưa có giao dịch thanh toán nào được ghi nhận.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
    styles: [`
    .page-container { animation: fadeIn 0.5s ease; }
    .page-header { margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end; }
    .page-header h1 { color: var(--gold-primary); font-size: 2rem; margin-bottom: 5px; }
    .subtitle { color: #64748b; font-size: 0.9rem; }

    .table-card { padding: 5px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); overflow: hidden; background: rgba(255,255,255,0.02); }
    .admin-table { width: 100%; border-collapse: separate; border-spacing: 0; }
    .admin-table th { text-align: left; padding: 20px 24px; color: #475569; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; border-bottom: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.2); }
    .admin-table td { padding: 18px 24px; vertical-align: middle; border-bottom: 1px solid rgba(255,255,255,0.02); }
    
    .table-row { transition: all 0.2s; }
    .table-row:hover { background: rgba(255,255,255,0.03); transform: scale(1.002); }

    .ref-badge { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #e2e8f0; padding: 6px 10px; border-radius: 6px; font-family: monospace; font-size: 0.85rem; letter-spacing: 1px; }
    .booking-id { color: #94a3b8; font-family: monospace; cursor: help; }
    
    .amount { font-weight: 800; font-size: 1.1rem; }
    .text-gold { color: var(--gold-primary); }

    .method-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.85rem; font-weight: 600; color: #cbd5e1; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 12px; }
    
    .date-text { color: #94a3b8; font-size: 0.85rem; }

    .status-badge { padding: 6px 14px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; }
    .status-badge.success { background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.2); }
    .status-badge.pending { background: rgba(245, 158, 11, 0.1); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.2); }
    .status-badge.failed { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); }

    .empty-state { text-align: center; padding: 60px 0; color: #475569; }
    .empty-icon { font-size: 3rem; margin-bottom: 15px; opacity: 0.3; }

    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class TransactionMgmtComponent implements OnInit {
    private paymentService = inject(PaymentService);
    transactions = signal<Transaction[]>([]);

    ngOnInit() {
        this.loadTransactions();
    }

    loadTransactions() {
        this.paymentService.getTransactions().subscribe({
            next: (res) => {
                if (res.success) this.transactions.set(res.data);
            }
        });
    }

    getMethodIcon(method: string): string {
        if (method.toLowerCase().includes('qr') || method.toLowerCase().includes('bank')) return '🏦';
        if (method.toLowerCase().includes('card')) return '💳';
        if (method.toLowerCase().includes('momo') || method.toLowerCase().includes('zalo')) return '📱';
        return '💵';
    }

    getStatusText(status: string): string {
        switch (status) {
            case 'SUCCESS': return 'Thành công';
            case 'PENDING': return 'Đang chờ';
            case 'FAILED': return 'Thất bại';
            default: return status;
        }
    }
}
