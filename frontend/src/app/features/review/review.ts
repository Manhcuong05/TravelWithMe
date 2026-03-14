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
      
      <div *ngIf="authService.isAuthenticated()" class="add-review glass-effect">
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
      </div>

      <div class="review-list">
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
    textarea { width: 100%; background: rgba(255, 255, 255, 0.05); border: 1px solid var(--glass-border); padding: 15px; border-radius: 8px; color: var(--text-primary); margin-bottom: 15px; resize: none; }
    
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
  newReview: ReviewRequest = { serviceId: '', serviceType: '', rating: 5, comment: '' };

  ngOnInit() {
    this.newReview.serviceId = this.serviceId;
    this.newReview.serviceType = this.serviceType;
    this.loadReviews();
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
    this.reviewService.createReview(this.newReview).subscribe({
      next: (res) => {
        if (res.success) {
          this.loadReviews();
          this.newReview.comment = '';
        }
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }
}
