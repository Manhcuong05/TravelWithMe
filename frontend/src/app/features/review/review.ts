import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReviewService, ReviewResponse, ReviewRequest } from '../../core/services/review.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="reviews-section glass-effect">
      <h2 class="luxury-font">Trải Nghiệm Từ Khách Hàng</h2>
      
      <!-- Trạng thái: đang kiểm tra quyền -->
      <div *ngIf="authService.isAuthenticated() && checkingPermission()" class="checking-msg">
        <span class="spinner">⏳</span> Đang kiểm tra...
      </div>

      <!-- Trạng thái: có thể review -->
      <div *ngIf="authService.isAuthenticated() && !checkingPermission() && canReview()" class="add-review glass-effect">
        <h3>Chia sẻ cảm nhận của bạn</h3>
        <div class="rating-input">
          <span *ngFor="let star of [1,2,3,4,5]" 
                (click)="newReview.rating = star"
                [class.active]="newReview.rating >= star">★</span>
        </div>
        <textarea [(ngModel)]="newReview.comment" placeholder="Bạn cảm thấy thế nào về trải nghiệm này?"></textarea>
        <button (click)="submitReview()" class="btn-gold" [disabled]="submitting()">
          {{ submitting() ? 'Đang gửi...' : 'Gửi đánh giá' }}
        </button>
        <div *ngIf="submitError()" class="error-note">{{ submitError() }}</div>
      </div>

      <!-- Trạng thái: chưa đủ điều kiện (chỉ hiện với TOUR) -->
      <div *ngIf="authService.isAuthenticated() && !checkingPermission() && !canReview() && serviceType === 'TOUR'" class="pending-review glass-effect">
        <span class="pending-icon">✈️</span>
        <div>
          <p class="pending-title">Đánh giá của bạn rất quý giá!</p>
          <p class="pending-sub">Bạn sẽ có thể chia sẻ trải nghiệm sau khi chuyến đi kết thúc. Chúng tôi sẽ gửi email nhắc nhở bạn nhé!</p>
        </div>
      </div>

      <div class="review-list">
        <p *ngIf="reviews().length === 0" class="no-reviews">Chưa có đánh giá nào. Hãy là người đầu tiên! 🌟</p>
        <div *ngFor="let review of reviews()" class="review-card">
          <div class="review-header">
            <span class="user">{{ review.userName }}</span>
            <span class="stars">{{ '★'.repeat(review.rating) }}</span>
          </div>
          <p class="comment">{{ review.comment }}</p>
          <div class="date">{{ review.createdAt | date:'mediumDate' }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .reviews-section { padding: 40px; }
    .add-review { padding: 30px; margin-bottom: 40px; border-radius: 16px; }
    .rating-input { font-size: 1.5rem; margin-bottom: 15px; cursor: pointer; color: var(--text-muted); }
    .rating-input span.active { color: var(--gold-primary); }
    textarea { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); padding: 15px; border-radius: 8px; color: var(--text-primary); margin-bottom: 15px; resize: none; min-height: 100px; box-sizing: border-box; }
    
    .pending-review { display: flex; align-items: flex-start; gap: 16px; padding: 24px; margin-bottom: 32px; border-radius: 16px; border: 1px dashed var(--gold-primary); background: rgba(201, 168, 76, 0.05); }
    .pending-icon { font-size: 2rem; flex-shrink: 0; }
    .pending-title { color: var(--gold-primary); font-weight: 600; margin: 0 0 6px 0; }
    .pending-sub { color: var(--text-secondary); font-size: 0.875rem; margin: 0; line-height: 1.6; }

    .checking-msg { color: var(--text-muted); font-size: 0.875rem; padding: 12px 0; margin-bottom: 24px; }
    .error-note { color: #ef4444; font-size: 0.8rem; margin-top: 8px; }
    .no-reviews { color: var(--text-muted); text-align: center; padding: 24px 0; }
    
    .review-list { display: flex; flex-direction: column; gap: 25px; }
    .review-card { padding-bottom: 25px; border-bottom: 1px solid var(--glass-border); }
    .review-header { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .user { font-weight: 600; color: var(--gold-secondary); }
    .stars { color: var(--gold-primary); }
    .comment { color: var(--text-secondary); line-height: 1.6; }
    .date { font-size: 0.75rem; color: var(--text-muted); margin-top: 10px; }
  `]
})
export class ReviewsComponent implements OnInit {
  @Input() serviceId!: string;
  @Input() serviceType!: string;

  private reviewService = inject(ReviewService);
  authService = inject(AuthService);

  reviews = signal<ReviewResponse[]>([]);
  submitting = signal<boolean>(false);
  canReview = signal<boolean>(false);
  checkingPermission = signal<boolean>(false);
  submitError = signal<string>('');
  newReview: ReviewRequest = { serviceId: '', serviceType: '', rating: 5, comment: '' };

  ngOnInit() {
    this.newReview.serviceId = this.serviceId;
    this.newReview.serviceType = this.serviceType;
    this.loadReviews();

    // Kiểm tra quyền đánh giá nếu đã đăng nhập và là TOUR
    if (this.authService.isAuthenticated()) {
      this.checkingPermission.set(true);
      this.reviewService.canReview(this.serviceId, this.serviceType).subscribe({
        next: (res) => {
          if (res.success) this.canReview.set(res.data.canReview);
          this.checkingPermission.set(false);
        },
        error: () => this.checkingPermission.set(false)
      });
    }
  }

  loadReviews() {
    this.reviewService.getServiceReviews(this.serviceId, this.serviceType).subscribe({
      next: (res) => {
        if (res.success) this.reviews.set(res.data);
      }
    });
  }

  submitReview() {
    if (!this.newReview.comment) return;
    this.submitting.set(true);
    this.submitError.set('');
    this.reviewService.createReview(this.newReview).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadReviews();
          this.newReview.comment = '';
          this.canReview.set(false); // Đã review rồi, ẩn form
        }
        this.submitting.set(false);
      },
      error: (err) => {
        this.submitError.set(err.error?.message || 'Có lỗi xảy ra khi gửi đánh giá.');
        this.submitting.set(false);
      }
    });
  }
}
