import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TurfRepository } from '../../domain/repositories/turf.repository';
import { ReviewRepository } from '../../domain/repositories/review.repository';
import { NotificationService } from '../../core/services/notification.service';
import { Turf } from '../../domain/models/turf.model';
import { Review } from '../../domain/models/review.model';

interface FeaturedTestimonial {
  name: string;
  role: string;
  rating: number;
  comment: string;
  avatar: string;
  sport: string;
}

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="reviews-page-container container-fluid spacing-vertical-24 fade-in">
      
      <!-- Back Button -->
      <div class="navigation-bar">
        <button class="btn-back" routerLink="/dashboard">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <!-- Hero Banner -->
      <header class="reviews-hero glass">
        <div class="glow-blob"></div>
        <div class="hero-text-content">
          <span class="reviews-badge">PLAYER TESTIMONIALS</span>
          <h1>What the Pro Athletes Say</h1>
          <p>Read honest reviews from professional coaches, league players, and weekend warriors who trust TurfXpert for their games.</p>
        </div>
      </header>

      <!-- Featured Testimonials Section -->
      <section class="featured-section">
        <h2 class="section-title">Verified Elite Testimonials</h2>
        <div class="featured-grid">
          <div *ngFor="let t of featuredTestimonials" class="testimonial-card glass">
            <div class="card-top">
              <img [src]="t.avatar" [alt]="t.name" class="avatar">
              <div class="user-meta">
                <span class="user-name">{{ t.name }}</span>
                <span class="user-role">{{ t.role }}</span>
              </div>
              <span class="sport-badge">{{ t.sport }}</span>
            </div>
            
            <div class="star-rating">
              <span *ngFor="let star of [1,2,3,4,5]" class="star fill" [class.empty]="star > t.rating">★</span>
            </div>

            <p class="quote">“{{ t.comment }}”</p>
          </div>
        </div>
      </section>

      <!-- Live Review Hub -->
      <section class="live-hub-section glass">
        <h2 class="section-title text-center">Live Arena Reviews</h2>
        <p class="section-subtitle">Select an arena below to check live player feedback or write your own review.</p>

        <!-- Selector Control -->
        <div class="selector-control">
          <label for="turf-select">Choose Turf Arena:</label>
          <div class="select-wrapper glass">
            <select 
              id="turf-select"
              [ngModel]="selectedTurfId()" 
              (ngModelChange)="onTurfChange($event)"
            >
              <option [value]="null" disabled>-- Select a Turf Arena --</option>
              <option *ngFor="let turf of turfs()" [value]="turf.id">
                {{ turf.name }} ({{ turf.location }})
              </option>
            </select>
          </div>
        </div>

        <div class="live-hub-layout" *ngIf="selectedTurfId() !== null">
          <!-- Left side: Review List -->
          <div class="reviews-list-container">
            <h3>Player Feedback</h3>
            
            <div class="loading-spinner" *ngIf="isLoadingReviews()">
              <div class="spinner"></div>
              <span>Fetching reviews...</span>
            </div>

            <div class="no-reviews glass" *ngIf="!isLoadingReviews() && liveReviews().length === 0">
              <p>No verified player reviews yet for this arena.</p>
              <span class="subtext">Be the first to share your match experience below!</span>
            </div>

            <div class="reviews-grid" *ngIf="!isLoadingReviews() && liveReviews().length > 0">
              <div *ngFor="let r of liveReviews()" class="review-item glass">
                <div class="review-header">
                  <div class="user-avatar-placeholder">
                    {{ r.userName.charAt(0).toUpperCase() }}
                  </div>
                  <div class="review-meta">
                    <span class="reviewer-name">{{ r.userName }}</span>
                    <span class="review-date">{{ formatDate(r.createdAt) }}</span>
                  </div>
                  <div class="star-rating mini">
                    <span *ngFor="let star of [1,2,3,4,5]" class="star fill" [class.empty]="star > r.rating">★</span>
                  </div>
                </div>
                <p class="review-text">{{ r.comment }}</p>
              </div>
            </div>
          </div>

          <!-- Right side: Add Review Form -->
          <div class="add-review-container glass">
            <h3>Leave Your Feedback</h3>
            <p class="form-desc">Share your honest rating and comment about this turf. Only players who booked this turf can submit reviews.</p>
            
            <form (submit)="submitReview($event)" class="review-form">
              <!-- Interactive Stars -->
              <div class="form-group">
                <label>Your Rating:</label>
                <div class="star-rating-input">
                  <button 
                    type="button"
                    *ngFor="let star of [1,2,3,4,5]"
                    class="star-input-btn"
                    [class.active]="star <= newRating()"
                    (click)="newRating.set(star)"
                  >
                    ★
                  </button>
                </div>
              </div>

              <!-- Comment input -->
              <div class="form-group">
                <label for="review-comment">Review Details:</label>
                <textarea 
                  id="review-comment"
                  rows="4" 
                  placeholder="Tell us about the turf quality, lighting, staff service..." 
                  [(ngModel)]="newComment"
                  name="newComment"
                  required
                ></textarea>
              </div>

              <button 
                type="submit" 
                class="btn-premium btn-uniform submit-btn" 
                [disabled]="isSubmitting() || newRating() === 0 || !newComment.trim()"
              >
                <span *ngIf="!isSubmitting()">Submit Verified Review</span>
                <span *ngIf="isSubmitting()" class="spinner"></span>
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  `,
  styles: [`
    .navigation-bar {
      display: flex;
      align-items: center;
    }
    .btn-back {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: 12px;
      cursor: pointer;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    .btn-back:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--primary);
    }
    .back-icon {
      width: 16px;
      height: 16px;
    }

    .reviews-page-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 3.5rem;
      font-family: 'Manrope', sans-serif;
    }

    .reviews-hero {
      position: relative;
      padding: 5rem 3rem;
      border-radius: 24px;
      text-align: center;
      overflow: hidden;
      background: linear-gradient(135deg, rgba(12, 10, 20, 0.8) 0%, rgba(31, 41, 55, 0.45) 100%);
    }

    :host-context(body[data-theme="light"]) .reviews-hero {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(241, 245, 249, 0.95) 100%);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    .glow-blob {
      position: absolute;
      width: 400px;
      height: 400px;
      top: -100px;
      left: -100px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(123, 57, 252, 0.12) 0%, transparent 70%);
      z-index: 0;
      pointer-events: none;
    }

    .hero-text-content {
      position: relative;
      z-index: 10;
      max-width: 700px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .reviews-badge {
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.2em;
      color: var(--primary);
      background: rgba(var(--primary-rgb), 0.1);
      padding: 6px 16px;
      border-radius: 20px;
      border: 1px solid rgba(var(--primary-rgb), 0.25);
    }

    .hero-text-content h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      font-weight: 850;
      line-height: 1.1;
      margin: 0;
      color: var(--text-primary);
    }

    .hero-text-content p {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }

    .section-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-bottom: 2rem;
      letter-spacing: -0.02em;
    }

    .section-subtitle {
      font-size: 1rem;
      color: var(--text-secondary);
      text-align: center;
      margin-top: -1.5rem;
      margin-bottom: 2.5rem;
    }

    .featured-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 2rem;
    }

    .testimonial-card {
      border-radius: 20px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: var(--bg-card);
      transition: var(--transition-smooth);
    }

    .testimonial-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--shadow-hover);
      border-color: var(--primary);
    }

    .card-top {
      display: flex;
      align-items: center;
      gap: 1rem;
      position: relative;
    }

    .avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--primary);
    }

    .user-meta {
      display: flex;
      flex-direction: column;
    }

    .user-name {
      font-weight: 800;
      font-size: 0.95rem;
      color: var(--text-primary);
    }

    .user-role {
      font-size: 0.75rem;
      color: var(--text-secondary);
      opacity: 0.8;
    }

    .sport-badge {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 0.65rem;
      font-weight: 800;
      background: rgba(var(--primary-rgb), 0.1);
      color: var(--primary);
      padding: 4px 10px;
      border-radius: 12px;
    }

    .star-rating {
      display: flex;
      gap: 2px;
    }

    .star {
      color: #fbbf24;
      font-size: 1.2rem;
    }

    .star.empty {
      color: var(--border-color);
    }

    .quote {
      font-size: 0.925rem;
      line-height: 1.6;
      color: var(--text-secondary);
      font-style: italic;
      margin: 0;
    }

    .live-hub-section {
      padding: 3rem;
      border-radius: 24px;
      background: var(--bg-card);
    }

    .selector-control {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      max-width: 400px;
      margin: 0 auto 3rem auto;
    }

    .selector-control label {
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .select-wrapper {
      position: relative;
      width: 100%;
      border-radius: 12px;
      padding: 2px;
      border: 1px solid var(--border-color);
      overflow: hidden;
    }

    .select-wrapper select {
      width: 100%;
      padding: 12px 16px;
      background: transparent;
      border: none;
      color: var(--text-primary);
      font-size: 0.95rem;
      font-weight: 650;
      outline: none;
      cursor: pointer;
    }

    .select-wrapper select option {
      background: var(--bg-card);
      color: var(--text-primary);
    }

    .live-hub-layout {
      display: grid;
      grid-template-columns: 1.25fr 1fr;
      gap: 3rem;
      margin-top: 2rem;
      align-items: start;
    }

    .reviews-list-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .reviews-list-container h3 {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 3rem 0;
      color: var(--text-secondary);
    }

    .no-reviews {
      padding: 4rem 2rem;
      border-radius: 20px;
      text-align: center;
      color: var(--text-secondary);
      border: 1px dashed var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .no-reviews .subtext {
      font-size: 0.8rem;
      opacity: 0.7;
    }

    .reviews-grid {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 500px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }

    .reviews-grid::-webkit-scrollbar {
      width: 6px;
    }

    .reviews-grid::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.3);
      border-radius: 10px;
    }

    .review-item {
      padding: 1.5rem;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .review-header {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar-placeholder {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--on-primary);
      font-weight: 800;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .review-meta {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
    }

    .reviewer-name {
      font-weight: 750;
      font-size: 0.875rem;
      color: var(--text-primary);
    }

    .review-date {
      font-size: 0.725rem;
      color: var(--text-secondary);
      opacity: 0.65;
    }

    .star-rating.mini .star {
      font-size: 0.9rem;
    }

    .review-text {
      font-size: 0.875rem;
      line-height: 1.55;
      color: var(--text-secondary);
      margin: 0;
    }

    .add-review-container {
      padding: 2rem;
      border-radius: 20px;
      background: rgba(255, 255, 255, 0.015);
      border: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .add-review-container h3 {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--text-primary);
      margin: 0;
    }

    .form-desc {
      font-size: 0.8rem;
      line-height: 1.5;
      color: var(--text-secondary);
      opacity: 0.8;
      margin: 0;
    }

    .review-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 700;
      color: var(--text-secondary);
    }

    .star-rating-input {
      display: flex;
      gap: 4px;
    }

    .star-input-btn {
      background: transparent;
      border: none;
      font-size: 2rem;
      color: var(--border-color);
      cursor: pointer;
      padding: 0;
      transition: transform 0.15s ease, color 0.15s ease;
    }

    .star-input-btn.active {
      color: #fbbf24;
    }

    .star-input-btn:hover {
      transform: scale(1.15);
    }

    .form-group textarea {
      padding: 12px;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: rgba(0, 0, 0, 0.2);
      color: var(--text-primary);
      font-size: 0.875rem;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
    }

    :host-context(body[data-theme="light"]) .form-group textarea {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.1);
    }

    :host-context(body[data-theme="light"]) .testimonial-card {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    :host-context(body[data-theme="light"]) .testimonial-card:hover {
      box-shadow: 0 12px 30px rgba(0, 0, 0, 0.06);
      border-color: var(--primary);
    }

    :host-context(body[data-theme="light"]) .live-hub-section {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }

    :host-context(body[data-theme="light"]) .select-wrapper {
      background: rgba(0, 0, 0, 0.02);
      border: 1px solid rgba(0, 0, 0, 0.08);
    }

    :host-context(body[data-theme="light"]) .select-wrapper select option {
      background: #ffffff;
      color: #0f172a;
    }

    :host-context(body[data-theme="light"]) .review-item {
      background: rgba(0, 0, 0, 0.01);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    :host-context(body[data-theme="light"]) .add-review-container {
      background: rgba(0, 0, 0, 0.01);
      border: 1px solid rgba(0, 0, 0, 0.06);
    }

    :host-context(body[data-theme="light"]) .no-reviews {
      background: rgba(0, 0, 0, 0.015);
      border: 1px dashed rgba(0, 0, 0, 0.1);
    }

    .form-group textarea:focus {
      border-color: var(--primary);
    }

    .submit-btn {
      width: 100%;
      height: 46px;
      border-radius: 12px;
      font-size: 0.9rem;
    }

    @media (max-width: 992px) {
      .live-hub-layout {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
    }

    @media (max-width: 768px) {
      .reviews-page-container {
        padding: 1rem;
      }
      .reviews-hero {
        padding: 3rem 1.5rem;
      }
      .live-hub-section {
        padding: 1.5rem;
      }
    }
  `]
})
export class ReviewsComponent implements OnInit {
  turfs = signal<Turf[]>([]);
  selectedTurfId = signal<number | null>(null);
  liveReviews = signal<Review[]>([]);
  isLoadingReviews = signal(false);
  isSubmitting = signal(false);

  // Form properties
  newRating = signal<number>(0);
  newComment = '';

  featuredTestimonialAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop'
  ];

  featuredTestimonials: FeaturedTestimonial[] = [
    {
      name: 'Rohan Sharma',
      role: 'Manager, Kickers FC League',
      rating: 5,
      comment: 'The night slot booking at TurfXpert was seamless. The turf fibers are high density, very gentle on the knees, and floodlighting was absolutely flawless. Best experience so far!',
      avatar: this.featuredTestimonialAvatars[1],
      sport: 'Football'
    },
    {
      name: 'Priya Sundar',
      role: 'District Volleyball Captain',
      rating: 5,
      comment: 'We use TurfXpert to host weekly tournaments. The advance payment option is extremely helpful to lock down multiple slots without stress. Staff is highly supportive!',
      avatar: this.featuredTestimonialAvatars[0],
      sport: 'Volleyball'
    },
    {
      name: 'Karthik Raja',
      role: 'Corporate Cricket MVP',
      rating: 4,
      comment: 'Excellent bounce on the pitch for indoor cricket. Booking was straightforward and the app allowed us to get a 30% midweek discount using their happy hour promo code.',
      avatar: this.featuredTestimonialAvatars[2],
      sport: 'Cricket'
    }
  ];

  constructor(
    private turfRepository: TurfRepository,
    private reviewRepository: ReviewRepository,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadTurfs();
  }

  loadTurfs() {
    this.turfRepository.getAll().subscribe({
      next: (res) => {
        this.turfs.set(res.items);
        if (res.items.length > 0) {
          // Select first turf by default
          this.onTurfChange(res.items[0].id);
        }
      },
      error: () => {
        this.notificationService.error('Failed to load turf list.');
      }
    });
  }

  onTurfChange(turfId: number) {
    this.selectedTurfId.set(turfId);
    this.newRating.set(0);
    this.newComment = '';
    this.loadLiveReviews(turfId);
  }

  loadLiveReviews(turfId: number) {
    this.isLoadingReviews.set(true);
    this.reviewRepository.getReviewsByTurf(turfId).subscribe({
      next: (reviews) => {
        // Sort chronologically (latest first)
        reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.liveReviews.set(reviews);
        this.isLoadingReviews.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load reviews.');
        this.isLoadingReviews.set(false);
      }
    });
  }

  submitReview(event: Event) {
    event.preventDefault();
    const turfId = this.selectedTurfId();
    if (turfId === null || this.newRating() === 0 || !this.newComment.trim()) return;

    this.isSubmitting.set(true);
    const dto = {
      turfId,
      rating: this.newRating(),
      comment: this.newComment
    };

    this.reviewRepository.createReview(dto).subscribe({
      next: () => {
        this.notificationService.success('Review submitted successfully!');
        this.isSubmitting.set(false);
        this.newRating.set(0);
        this.newComment = '';
        this.loadLiveReviews(turfId); // Reload review list!
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.notificationService.error(
          err.error?.message || 'Only users who have booked this turf can leave a review.'
        );
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }
}
