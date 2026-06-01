import { Component, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TurfRepository } from '../../../domain/repositories/turf.repository';
import { BookingRepository } from '../../../domain/repositories/booking.repository';
import { ReviewRepository } from '../../../domain/repositories/review.repository';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';
import { Turf } from '../../../domain/models/turf.model';
import { Slot } from '../../../domain/models/booking.model';
import { Review } from '../../../domain/models/review.model';
import { PixelImageComponent } from '../../../shared/components/magic-ui/magic-pixel-image/pixel-image.component';

interface CategorizedSlot extends Slot {
  category: 'Day' | 'Afternoon' | 'Night';
  calculatedPrice: number;
}

@Component({
  selector: 'app-turf-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, PixelImageComponent, FormsModule],
  template: `
    <div class="detail-page-container fade-in">
      
      <!-- Header Bar / Back Navigation -->
      <div class="navigation-bar">
        <button class="btn-back" routerLink="/dashboard">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Dashboard
        </button>
      </div>

      <div class="detail-grid" *ngIf="!isLoading(); else loadingTemplate">
        
        <!-- Left Side: Turf Media & Info -->
        <div class="turf-main-info glass">
          <div class="turf-hero-image">
            <magic-pixel-image [src]="turf()?.imageUrl ?? '/images/turf_sports_ground.png'"></magic-pixel-image>
            <div class="rating-badge">★ {{ turf()?.rating?.toFixed(1) }}</div>
          </div>

          <div class="turf-details-content">
            <h1 class="turf-name">{{ turf()?.name }}</h1>
            
            <a 
              [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(turf()?.name + ' ' + turf()?.location)"
              target="_blank"
              class="location-bar link-map"
              title="Open in Google Maps"
            >
              <svg class="location-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" />
                <circle cx="12" cy="10.5" r="2.5" />
              </svg>
              <span>{{ turf()?.location }}</span>
              <span class="map-tag">View on Map ↗</span>
            </a>

            <p class="turf-description">
              Experience the best-in-class sports infrastructure at {{ turf()?.name }}. 
              Equipped with professional-grade turf, ambient night floodlighting, change rooms, 
              and pure athletic vibes. Perfect for friendly matches, corporate tournaments, and skill sessions.
            </p>

            <div class="pricing-rules-card glass">
              <h3>Pricing Tiers</h3>
              <div class="rules-grid">
                <div class="rule-item day">
                  <span class="rule-label">Day Time</span>
                  <span class="rule-hours">6:00 AM - 12:00 PM</span>
                  <span class="rule-price">₹{{ getTierPrice('Day') }}/hr</span>
                </div>
                <div class="rule-item afternoon">
                  <span class="rule-label">Afternoon</span>
                  <span class="rule-hours">12:00 PM - 5:00 PM</span>
                  <span class="rule-price">₹{{ getTierPrice('Afternoon') }}/hr</span>
                </div>
                <div class="rule-item night">
                  <span class="rule-label">Night Time</span>
                  <span class="rule-hours">5:00 PM - Midnight</span>
                  <span class="rule-price">₹{{ getTierPrice('Night') }}/hr</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Reviews Section -->
          <div class="reviews-section-card glass" style="border-top: 1px solid var(--border-color); border-radius: 0 0 24px 24px;">
            <h2 class="section-title">Player Reviews & Ratings</h2>
            
            <!-- Review Summary & Form Row -->
            <div class="reviews-layout">
              <!-- Summary Column -->
              <div class="reviews-summary glass">
                <div class="avg-score">
                  <span class="score-num">{{ turf()?.rating?.toFixed(1) || '0.0' }}</span>
                  <span class="stars">
                    <span class="star-filled" *ngFor="let s of [1,2,3,4,5]">
                      {{ s <= (turf()?.rating || 0) ? '★' : '☆' }}
                    </span>
                  </span>
                  <span class="total-reviews">{{ reviews().length }} reviews</span>
                </div>
              </div>

              <!-- Review Form -->
              <div class="write-review-form glass">
                <h3>Share your experience</h3>
                <p class="form-desc">Help other athletes find the best fields. Only players who have booked this turf can leave a review.</p>
                
                <div class="rating-input">
                  <span class="label">Your Rating:</span>
                  <div class="star-rating-selector">
                    <span 
                      *ngFor="let star of [1,2,3,4,5]" 
                      class="selector-star" 
                      [class.active]="newReviewRating() >= star"
                      (click)="setNewReviewRating(star)"
                    >★</span>
                  </div>
                </div>

                <div class="comment-input">
                  <textarea 
                    [(ngModel)]="newReviewComment" 
                    placeholder="Tell us about the turf quality, lighting, facilities..." 
                    rows="3"
                    class="review-textarea glass"
                  ></textarea>
                </div>

                <button 
                  class="btn-premium btn-submit-review" 
                  [disabled]="newReviewRating() === 0 || isSubmittingReview()"
                  (click)="submitReview()"
                >
                  <span *ngIf="!isSubmittingReview()">Submit Review</span>
                  <span *ngIf="isSubmittingReview()" class="spinner"></span>
                </button>
              </div>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              <h3>Player Feedback</h3>
              <div class="review-item-card glass" *ngFor="let review of reviews()">
                <div class="review-header">
                  <div class="user-avatar">{{ review.userName.charAt(0).toUpperCase() }}</div>
                  <div class="review-meta">
                    <span class="username">{{ review.userName }}</span>
                    <span class="review-date">{{ formatDate(review.createdAt) }}</span>
                  </div>
                  <div class="review-stars">
                    <span class="star" *ngFor="let s of [1,2,3,4,5]">
                      {{ s <= review.rating ? '★' : '☆' }}
                    </span>
                  </div>
                </div>
                <p class="review-comment">{{ review.comment || 'No written comment left.' }}</p>
              </div>

              <div class="empty-reviews" *ngIf="reviews().length === 0">
                <p>No reviews yet. Be the first player to review this turf!</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: Slots Booking & Checkout Panel -->
        <div class="booking-panel-container">
          
          <!-- Standard Booking State -->
          <div class="booking-panel glass" *ngIf="!isBookedSuccess()">
            <h2>Reserve Your Time Slots</h2>
            <p class="panel-subtitle">Select multiple slots below to play for longer duration.</p>

            <!-- Slots Grid -->
            <div class="slots-section">
              <div class="section-header">
                <h3>Select Slots</h3>
                <span class="selected-count-badge" *ngIf="selectedSlots().length > 0">
                  {{ selectedSlots().length }} selected
                </span>
              </div>

              <!-- Calendar Section -->
              <div class="calendar-section">
                <div class="quick-days-strip">
                  <div 
                    *ngFor="let day of upcomingDays" 
                    class="day-chip glass" 
                    [class.active]="selectedDate() === day.dateStr"
                    (click)="selectDate(day.dateStr)"
                  >
                    <span class="day-num">{{ day.dayNum }}</span>
                    <span class="day-name">{{ day.label }}</span>
                  </div>

                  <!-- Custom Date Picker Trigger -->
                  <div class="custom-date-picker glass" title="Pick custom date">
                    <input 
                      type="date" 
                      [value]="selectedDate()" 
                      (change)="onCustomDateChange($event)" 
                      [min]="minDate"
                      [max]="maxDate"
                    />
                  </div>
                </div>
              </div>

              <!-- Status Legend -->
              <div class="legend-bar">
                <div class="legend-item"><span class="legend-dot available"></span> Available</div>
                <div class="legend-item"><span class="legend-dot selected"></span> Selected</div>
                <div class="legend-item"><span class="legend-dot booked"></span> Booked</div>
                <div class="legend-item"><span class="legend-dot unavailable"></span> Unavailable</div>
              </div>
              
              <div class="slots-grid-view" *ngIf="!isLoadingSlots(); else loadingSlotsTemplate">
                <div 
                  *ngFor="let slot of filteredSlots()" 
                  class="slot-card-v3"
                  [class.selected]="getSlotStatus(slot) === 'Selected'"
                  [class.booked]="getSlotStatus(slot) === 'Booked'"
                  [class.unavailable]="getSlotStatus(slot) === 'Unavailable'"
                  (click)="toggleSlotSelection(slot)"
                >
                  <span class="status-badge" [class]="getSlotStatus(slot).toLowerCase()">
                    {{ getSlotStatus(slot) }}
                  </span>
                  <span class="time">{{ formatTime(slot.startTime) }}</span>
                  <span class="category-tag" [class]="slot.category.toLowerCase()">
                    {{ slot.category }}
                  </span>
                  <span class="price-tag">₹{{ slot.calculatedPrice }}</span>
                </div>

                <div class="empty-slots" *ngIf="filteredSlots().length === 0">
                  <p>No slots found for this date.</p>
                </div>
              </div>

              <ng-template #loadingSlotsTemplate>
                <div class="slots-grid-view">
                  <div class="slot-card-v3 skeleton" *ngFor="let i of [1,2,3,4,5,6,7,8]"></div>
                </div>
              </ng-template>
            </div>

            <!-- Payment Option Cards (Dummy Payment Options) -->
            <div class="payment-options-section" *ngIf="selectedSlots().length > 0">
              <h3>Select Payment Option</h3>
              <div class="payment-options-grid">
                <div 
                  class="payment-option-card glass" 
                  [class.active]="paymentOption() === 'full'"
                  (click)="paymentOption.set('full')"
                >
                  <div class="option-header">
                    <input type="radio" name="paymentOption" [checked]="paymentOption() === 'full'" readOnly />
                    <span class="option-title">Full Payment</span>
                  </div>
                  <p class="option-description">Pay 100% now for standard checkout.</p>
                  <span class="option-price">₹{{ getTotalPrice() }}</span>
                </div>

                <div 
                  class="payment-option-card glass" 
                  [class.active]="paymentOption() === 'advance'"
                  (click)="paymentOption.set('advance')"
                >
                  <div class="option-header">
                    <input type="radio" name="paymentOption" [checked]="paymentOption() === 'advance'" readOnly />
                    <span class="option-title">Advance Pay</span>
                  </div>
                  <p class="option-description">Pay ₹30 × {{ selectedSlots().length }} now, rest at venue.</p>
                  <span class="option-price">₹{{ getAdvancePrice() }}</span>
                </div>
              </div>
            </div>

            <!-- Booking Summary -->
            <div class="checkout-summary glass" *ngIf="selectedSlots().length > 0">
              <h3>Reservation Summary</h3>
              
              <div class="selected-slots-list" style="display: flex; flex-direction: column; gap: 0.75rem;">
                <div class="summary-row">
                  <span>Date</span>
                  <span style="color: var(--text-primary); font-weight: 600;">{{ getFormattedBookingDate() }}</span>
                </div>
                <div class="summary-row">
                  <span>Time</span>
                  <span style="color: var(--text-primary); font-weight: 600;">{{ getFormattedTimeRange() }}</span>
                </div>
                <div class="summary-row">
                  <span>Duration</span>
                  <span style="color: var(--text-primary); font-weight: 600;">{{ selectedSlots().length }} Hour{{ selectedSlots().length > 1 ? 's' : '' }}</span>
                </div>
                <div class="summary-row">
                  <span>Price per hour</span>
                  <span style="color: var(--text-primary); font-weight: 600;">
                    ₹{{ turf()?.pricePerHour }} &nbsp; 
                    <span style="color: var(--primary); font-weight: 700;">({{ selectedSlots().length }} hrs: ₹{{ getTotalPrice() }})</span>
                  </span>
                </div>
              </div>

              <div class="divider"></div>

              <div class="summary-row total">
                <span>Amount to Pay Now</span>
                <span>₹{{ paymentOption() === 'full' ? getTotalPrice() : getAdvancePrice() }}</span>
              </div>
              <p class="payment-note" *ngIf="paymentOption() === 'advance'">
                *Remaining balance of ₹{{ getTotalPrice() - getAdvancePrice() }} to be paid at the turf venue.
              </p>
            </div>

            <div class="booking-actions">
              <button 
                class="btn-premium book-btn"
                [disabled]="selectedSlots().length === 0 || isBooking()"
                (click)="confirmBooking()"
              >
                <span *ngIf="!isBooking()">Confirm Booking ({{ selectedSlots().length }} Slots)</span>
                <span *ngIf="isBooking()" class="spinner"></span>
              </button>
            </div>
          </div>

          <!-- Apple/Stripe Success Screen -->
          <div class="success-card glass scale-in" *ngIf="isBookedSuccess()">
            <div class="success-header">
              <div class="success-icon-wrapper">
                <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                  <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
              </div>
              <h2>Booking Confirmed!</h2>
              <p>Your premium turf reservation is active.</p>
            </div>

            <div class="success-details-list glass" *ngIf="confirmedBookingDetails() as details">
              <div class="detail-row">
                <span class="label">Turf Arena</span>
                <span class="value">{{ turf()?.name }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Payment Plan</span>
                <span class="value">{{ details.paymentPlan }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Amount Paid Now</span>
                <span class="value price">₹{{ details.amountPaid }}</span>
              </div>
              <div class="detail-row" *ngIf="details.balanceDue > 0">
                <span class="label">Balance Due at Venue</span>
                <span class="value" style="color: var(--accent);">₹{{ details.balanceDue }}</span>
              </div>
              <div class="detail-row">
                <span class="label">Selected Hours</span>
                <span class="value">{{ details.hours }} hr(s)</span>
              </div>
            </div>

            <div class="success-actions" style="display: flex; flex-direction: column; gap: 0.75rem; width: 100%; margin-top: 1rem;">
              <button class="btn-premium" routerLink="/bookings" style="width: 100%;">
                Go to My Bookings
              </button>
              <button class="btn-premium secondary" (click)="resetSuccessState()" style="width: 100%;">
                Return to Slots Selection
              </button>
            </div>
          </div>

        </div>

      </div>

      <!-- Main Loader -->
      <ng-template #loadingTemplate>
        <div class="main-loader-container">
          <div class="loader-spinner"></div>
          <p>Loading Turf Details...</p>
        </div>
      </ng-template>

    </div>
  `,
  styles: [`
    .detail-page-container {
      max-width: 1300px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
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

    .detail-grid {
      display: grid;
      grid-template-columns: 1.4fr 1.2fr;
      gap: 2.5rem;
      align-items: start;
      width: 100%;
      min-width: 0;
    }

    .turf-main-info {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      border-radius: 24px;
    }
    .turf-hero-image {
      position: relative;
      height: 400px;
      width: 100%;
    }
    .rating-badge {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(8px);
      padding: 6px 14px;
      border-radius: 20px;
      color: var(--accent);
      font-weight: 700;
      font-size: 0.9rem;
      border: 1px solid rgba(255,255,255,0.1);
    }

    .turf-details-content {
      padding: 2.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .turf-name {
      font-size: 2.5rem;
      font-weight: 800;
      margin: 0;
      color: var(--text-primary);
      line-height: 1.1;
    }
    .location-bar {
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--text-secondary);
      font-weight: 500;
      font-size: 1.1rem;
    }
    .link-map {
      text-decoration: none;
      cursor: pointer;
      display: inline-flex;
      transition: var(--transition-smooth);
    }
    .link-map:hover {
      color: var(--primary);
    }
    .map-tag {
      font-size: 0.75rem;
      background: rgba(var(--primary-rgb), 0.08);
      color: var(--primary);
      padding: 2px 8px;
      border-radius: 8px;
      margin-left: 0.5rem;
      font-weight: 600;
    }
    .location-icon {
      width: 20px;
      height: 20px;
      color: var(--primary);
    }
    .turf-description {
      font-size: 1.05rem;
      line-height: 1.6;
      color: var(--text-secondary);
      margin: 0;
    }

    .pricing-rules-card {
      padding: 1.5rem;
      border-radius: 16px;
      background: rgba(255,255,255,0.01);
    }
    .pricing-rules-card h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin-bottom: 1.25rem;
      color: var(--text-primary);
    }
    .rules-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    .rule-item {
      display: flex;
      flex-direction: column;
      padding: 1.25rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      text-align: center;
      gap: 6px;
      background: rgba(255,255,255,0.01);
    }
    .rule-item.day { border-color: rgba(99, 102, 241, 0.2); }
    .rule-item.afternoon { border-color: rgba(245, 158, 11, 0.2); }
    .rule-item.night { border-color: rgba(123, 57, 252, 0.2); }

    .rule-label {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-secondary);
    }
    .rule-hours {
      font-size: 0.85rem;
      color: var(--text-secondary);
      opacity: 0.8;
    }
    .rule-price {
      font-size: 1.3rem;
      font-weight: 800;
      color: var(--primary);
      margin-top: 4px;
    }

    /* Booking Checkout Panel */
    .booking-panel-container {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      min-width: 0;
      width: 100%;
    }
    .booking-panel {
      padding: 2.5rem;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      gap: 1.75rem;
    }
    .booking-panel h2 {
      font-size: 1.6rem;
      font-weight: 700;
      margin: 0;
    }
    .panel-subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: -1rem 0 0 0;
    }

    .slots-section {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .section-header h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin: 0;
    }
    .selected-count-badge {
      font-size: 0.8rem;
      font-weight: 700;
      background: var(--primary);
      color: var(--on-primary);
      padding: 4px 10px;
      border-radius: 20px;
    }

    /* Calendar styles */
    .calendar-section {
      margin-bottom: 0.5rem;
    }
    .quick-days-strip {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 2px;
      align-items: center;
    }
    .quick-days-strip::-webkit-scrollbar {
      height: 4px;
    }
    .quick-days-strip::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.2);
      border-radius: 4px;
    }
    .day-chip {
      flex: 0 0 56px;
      padding: 10px 4px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      cursor: pointer;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
      transition: var(--transition-smooth);
    }
    .day-chip:hover {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.03);
    }
    .day-chip.active {
      border-color: var(--primary);
      background: var(--primary);
      color: var(--on-primary);
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.25);
    }
    .day-chip .day-num {
      font-size: 1.1rem;
      font-weight: 800;
    }
    .day-chip .day-name {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      opacity: 0.8;
    }
    .day-chip.active .day-name {
      opacity: 1;
    }

    .custom-date-picker {
      flex: 0 0 48px;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
      position: relative;
      cursor: pointer;
      overflow: hidden;
    }
    .custom-date-picker:hover {
      border-color: var(--primary);
    }
    .custom-date-picker input[type="date"] {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    .custom-date-picker::after {
      content: "📅";
      font-size: 1.25rem;
    }

    .legend-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin: 0.25rem 0 0.5rem 0;
      font-size: 0.8rem;
      color: var(--text-secondary);
    }
    .legend-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .legend-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
    }
    .legend-dot.available { background: #10b981; }
    .legend-dot.selected { background: #2563eb; }
    .legend-dot.booked { background: #ef4444; }
    .legend-dot.unavailable { background: #64748b; }

    .slots-grid-view {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 12px;
      max-height: 400px;
      overflow-y: auto;
      padding: 0.5rem 0.25rem;
    }
    .slots-grid-view::-webkit-scrollbar {
      width: 6px;
    }
    .slots-grid-view::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
      border-radius: 10px;
    }
    .slots-grid-view::-webkit-scrollbar-thumb {
      background: rgba(var(--primary-rgb), 0.3);
      border-radius: 10px;
    }

    .slot-card-v3 {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      cursor: pointer;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.02);
      transition: var(--transition-smooth);
      position: relative;
    }
    .slot-card-v3:hover:not(.booked):not(.unavailable):not(.selected) {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.04);
      transform: translateY(-2px);
    }
    .slot-card-v3.selected {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.25);
    }
    .slot-card-v3.selected:hover {
      background: #1d4ed8;
      border-color: #1d4ed8;
      color: #ffffff;
      transform: translateY(-2px);
    }
    .slot-card-v3.booked {
      border-color: rgba(239, 68, 68, 0.2);
      background: rgba(239, 68, 68, 0.05);
      cursor: not-allowed;
      opacity: 0.7;
    }
    .slot-card-v3.unavailable {
      border-color: rgba(255, 255, 255, 0.05);
      background: rgba(255, 255, 255, 0.01);
      cursor: not-allowed;
      opacity: 0.45;
    }

    .status-badge {
      font-size: 0.6rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 6px;
      letter-spacing: 0.02em;
    }
    .status-badge.available {
      background: rgba(16, 185, 129, 0.15);
      color: #34d399;
    }
    .status-badge.selected {
      background: rgba(255, 255, 255, 0.2);
      color: #ffffff;
    }
    .status-badge.booked {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
    }
    .status-badge.unavailable {
      background: rgba(255, 255, 255, 0.1);
      color: #94a3b8;
    }

    .slot-card-v3 .time {
      font-size: 0.95rem;
      font-weight: 800;
    }
    .category-tag {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .category-tag.day {
      background: rgba(99, 102, 241, 0.15);
      color: #818cf8;
    }
    .category-tag.afternoon {
      background: rgba(245, 158, 11, 0.15);
      color: #fbbf24;
    }
    .category-tag.night {
      background: rgba(123, 57, 252, 0.15);
      color: #a78bfa;
    }

    .slot-card-v3.selected .category-tag {
      background: rgba(255,255,255,0.2) !important;
      color: white !important;
    }

    .price-tag {
      font-size: 1.05rem;
      font-weight: 800;
    }

    /* Payment selection styles */
    .payment-options-section {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 0.5rem;
    }
    .payment-options-section h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-primary);
    }
    .payment-options-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .payment-option-card {
      padding: 1.25rem;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
      cursor: pointer;
      display: flex;
      flex-direction: column;
      gap: 6px;
      transition: var(--transition-smooth);
    }
    .payment-option-card:hover {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.03);
    }
    .payment-option-card.active {
      border-color: var(--primary);
      background: rgba(var(--primary-rgb), 0.06);
      box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.1);
    }
    .option-header {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .option-header input {
      accent-color: var(--primary);
      cursor: pointer;
    }
    .option-title {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .option-description {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0;
      line-height: 1.3;
    }
    .option-price {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--primary);
      margin-top: auto;
    }
    .payment-note {
      font-size: 0.75rem;
      color: var(--accent);
      margin: 0;
      font-style: italic;
    }

    .checkout-summary {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: rgba(255,255,255,0.01);
      border-radius: 16px;
    }
    .checkout-summary h3 {
      font-size: 1.1rem;
      font-weight: 700;
      margin: 0;
    }
    .selected-slots-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .summary-slot-item {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
      color: var(--text-secondary);
    }
    .divider {
      height: 1px;
      background: var(--border-color);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.95rem;
      color: var(--text-secondary);
    }
    .summary-row.total {
      font-size: 1.2rem;
      font-weight: 800;
      color: var(--text-primary);
    }

    .book-btn {
      width: 100%;
      height: 52px;
      font-size: 1.05rem;
    }

    /* Success Card */
    .success-card {
      padding: 3rem 2.5rem;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.5rem;
    }
    .success-header h2 {
      font-size: 1.8rem;
      font-weight: 800;
      color: var(--text-primary);
      margin-top: 1rem;
      margin-bottom: 0.25rem;
    }
    .success-header p {
      color: var(--text-secondary);
      font-size: 0.95rem;
      margin: 0;
    }

    .success-icon-wrapper {
      width: 80px;
      height: 80px;
      margin: 0 auto;
    }
    .checkmark {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      display: block;
      stroke-width: 3;
      stroke: var(--primary);
      stroke-miterlimit: 10;
      box-shadow: inset 0px 0px 0px var(--primary);
      animation: fill .4s ease-in-out .4s forwards, scale .3s ease-in-out .9s both;
    }
    .checkmark-circle {
      stroke-dasharray: 166;
      stroke-dashoffset: 166;
      stroke-width: 3;
      stroke-miterlimit: 10;
      stroke: var(--primary);
      fill: none;
      animation: stroke .6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
    }
    .checkmark-check {
      transform-origin: 50% 50%;
      stroke-dasharray: 48;
      stroke-dashoffset: 48;
      stroke-width: 3;
      stroke: #ffffff;
      animation: stroke .3s cubic-bezier(0.65, 0, 0.45, 1) .8s forwards;
    }
    @keyframes stroke { 100% { stroke-dashoffset: 0; } }
    @keyframes fill { 100% { box-shadow: inset 0px 0px 0px 40px var(--primary); } }
    @keyframes scale { 0%, 100% { transform: none; } 50% { transform: scale3d(1.08, 1.08, 1); } }

    .success-details-list {
      width: 100%;
      padding: 1.5rem;
      background: rgba(16, 185, 129, 0.01);
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      text-align: left;
    }
    .detail-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.9rem;
    }
    .detail-row .label { color: var(--text-secondary); }
    .detail-row .value { color: var(--text-primary); font-weight: 600; }
    .detail-row .value.price { color: var(--primary); font-weight: 800; }

    /* Loader */
    .main-loader-container {
      padding: 8rem 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      color: var(--text-secondary);
    }
    .loader-spinner {
      width: 48px;
      height: 48px;
      border: 4px solid var(--border-color);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    .skeleton {
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    .empty-slots {
      padding: 2rem;
      text-align: center;
      color: var(--text-secondary);
      width: 100%;
    }

    /* Reviews Section Styling */
    .reviews-section-card {
      margin-top: 2rem;
      padding: 2.5rem;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .section-title {
      font-size: 1.8rem;
      font-weight: 800;
      margin: 0;
      color: var(--text-primary);
    }
    .reviews-layout {
      display: grid;
      grid-template-columns: 1fr 1.8fr;
      gap: 1.5rem;
    }
    .reviews-summary {
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--border-color);
    }
    .avg-score {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .score-num {
      font-size: 3.5rem;
      font-weight: 900;
      color: var(--primary);
      line-height: 1;
    }
    .stars {
      font-size: 1.25rem;
      color: var(--accent);
      letter-spacing: 2px;
    }
    .total-reviews {
      font-size: 0.9rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .write-review-form {
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      background: rgba(255, 255, 255, 0.01);
      border: 1px solid var(--border-color);
    }
    .write-review-form h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0;
    }
    .form-desc {
      font-size: 0.8rem;
      color: var(--text-secondary);
      margin: -0.75rem 0 0 0;
      line-height: 1.4;
    }
    .rating-input {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .rating-input .label {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .star-rating-selector {
      display: flex;
      gap: 6px;
    }
    .selector-star {
      font-size: 1.6rem;
      color: rgba(255, 255, 255, 0.15);
      cursor: pointer;
      transition: var(--transition-smooth);
    }
    .selector-star:hover,
    .selector-star.active {
      color: var(--accent);
      transform: scale(1.15);
    }
    .review-textarea {
      width: 100%;
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid var(--border-color);
      color: var(--text-primary);
      background: rgba(0,0,0,0.2) !important;
      font-size: 0.95rem;
      outline: none;
      resize: vertical;
      transition: var(--transition-smooth);
    }
    .review-textarea:focus {
      border-color: var(--primary);
    }
    .btn-submit-review {
      height: 44px;
      font-size: 0.95rem;
      align-self: flex-start;
      padding: 0 2rem;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .reviews-list h3 {
      font-size: 1.2rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
    }
    .review-item-card {
      padding: 1.5rem;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border: 1px solid var(--border-color);
    }
    .review-header {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary);
      color: var(--on-primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      font-size: 1.1rem;
      box-shadow: 0 4px 10px rgba(var(--primary-rgb), 0.3);
    }
    .review-meta {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .username {
      font-weight: 700;
      font-size: 0.95rem;
      color: var(--text-primary);
    }
    .review-date {
      font-size: 0.75rem;
      color: var(--text-secondary);
    }
    .review-stars {
      margin-left: auto;
      font-size: 0.95rem;
      color: var(--accent);
    }
    .review-comment {
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--text-secondary);
      margin: 0;
    }
    .empty-reviews {
      padding: 3rem;
      text-align: center;
      color: var(--text-secondary);
      border: 1px dashed var(--border-color);
      border-radius: 16px;
      background: rgba(255,255,255,0.01);
    }

    @media (max-width: 992px) {
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .turf-hero-image {
        height: 280px;
      }
      .detail-page-container {
        padding: 1rem;
      }
    }

    @media (max-width: 768px) {
      .turf-details-content,
      .booking-panel {
        padding: 1.5rem;
      }
      .turf-name {
        font-size: 2rem;
      }
      .rules-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem;
      }
      .rule-item {
        padding: 1rem 0.5rem;
      }
      .rule-label {
        font-size: 0.75rem;
      }
      .rule-hours {
        font-size: 0.7rem;
      }
      .rule-price {
        font-size: 1.1rem;
        margin-top: 0;
      }
      .payment-options-grid {
        grid-template-columns: 1fr;
      }
      .success-card {
        padding: 2rem 1.5rem;
      }
      .success-header h2 {
        font-size: 1.5rem;
      }
    }

    @media (max-width: 480px) {
      .turf-hero-image {
        height: 200px;
      }
      .turf-details-content,
      .booking-panel {
        padding: 1.25rem;
      }
      .turf-name {
        font-size: 1.6rem;
      }
      .location-bar {
        font-size: 0.95rem;
      }
      .rules-grid {
        grid-template-columns: 1fr;
      }
      .rule-item {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0.75rem 1rem;
        text-align: left;
      }
      .rule-item > span {
        margin: 0;
      }
      .rule-price {
        font-size: 1.2rem;
      }
      .day-chip {
        flex: 0 0 50px;
        padding: 8px 2px;
      }
      .slot-card-v3 {
        padding: 0.75rem;
      }
      .time {
        font-size: 0.85rem;
      }
      .price-tag {
        font-size: 0.95rem;
      }
      .summary-row {
        flex-direction: column;
        gap: 4px;
      }
      .summary-row.total {
        flex-direction: row;
      }
      .success-details-list {
        padding: 1rem;
      }
    }
  `]
})
export class TurfDetailComponent implements OnInit, OnDestroy {
  turfId!: number;
  turf = signal<Turf | null>(null);
  slots = signal<CategorizedSlot[]>([]);
  selectedSlots = signal<CategorizedSlot[]>([]);
  paymentOption = signal<'full' | 'advance'>('full');
  selectedDate = signal<string>('');
  upcomingDays: { dateStr: string; label: string; dayNum: string }[] = [];
  minDate = '';
  maxDate = '';
  
  isLoading = signal(true);
  isLoadingSlots = signal(true);
  isBooking = signal(false);
  isBookedSuccess = signal(false);
  confirmedBookingDetails = signal<{ paymentPlan: string; amountPaid: number; balanceDue: number; hours: number } | null>(null);

  // Reviews signals & properties
  reviews = signal<Review[]>([]);
  newReviewRating = signal<number>(0);
  newReviewComment = '';
  isSubmittingReview = signal(false);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private turfRepository: TurfRepository,
    private bookingRepository: BookingRepository,
    private reviewRepository: ReviewRepository,
    private notificationService: NotificationService,
    private signalr: SignalrService
  ) {}

  ngOnInit() {
    const today = new Date();
    this.selectedDate.set(this.getLocalDateString(today));
    this.minDate = this.getLocalDateString(today);
    
    const futureLimit = new Date();
    futureLimit.setDate(today.getDate() + 2); // Max 3 days
    this.maxDate = this.getLocalDateString(futureLimit);
    this.upcomingDays = this.getUpcomingDays();

    this.route.paramMap.subscribe(params => {
      const idStr = params.get('id');
      if (idStr) {
        this.turfId = parseInt(idStr, 10);
        this.loadTurfDetails();
        this.loadSlots();
        this.loadReviews();
        
        try {
          this.signalr.joinTurfGroup(String(this.turfId));
        } catch {}

        // Listen for real-time booking updates
        this.signalr.on('SlotBooked', (data: any) => {
          const slotId = data.slotId || data.SlotId;
          const isBooked = data.isBooked !== undefined ? data.isBooked : data.IsBooked;
          if (slotId !== undefined && isBooked !== undefined) {
            this.slots.update(currentSlots =>
              currentSlots.map(s => s.id === slotId ? { ...s, isBooked: isBooked } : s)
            );
            // If the slot is currently selected by this user, deselect it (only if not successfully booked yet)
            if (!this.isBookedSuccess() && isBooked && this.selectedSlots().some(s => s.id === slotId)) {
              this.selectedSlots.update(selected => selected.filter(s => s.id !== slotId));
            }
          }
        });
      } else {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadTurfDetails() {
    this.isLoading.set(true);
    this.turfRepository.getById(this.turfId).subscribe({
      next: (data) => {
        this.turf.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load turf details.');
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadSlots() {
    this.isLoadingSlots.set(true);
    this.bookingRepository.getSlotsByTurf(this.turfId).subscribe({
      next: (slotsList) => {
        // Map raw slots to categorized pricing
        const mapped = slotsList.map(s => {
          const catInfo = this.getSlotCategory(s.startTime);
          const basePrice = this.turf()?.pricePerHour ?? 40;
          return {
            ...s,
            category: catInfo.category,
            calculatedPrice: Math.round(basePrice * catInfo.multiplier)
          } as CategorizedSlot;
        });

        // Sort slots chronologically by start time
        mapped.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

        this.slots.set(mapped);
        this.isLoadingSlots.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load slots.');
        this.isLoadingSlots.set(false);
      }
    });
  }

  getLocalDateString(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
  }

  getUpcomingDays(): { dateStr: string; label: string; dayNum: string }[] {
    const days = [];
    const today = new Date();
    for (let i = 0; i < 3; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      const dateStr = this.getLocalDateString(d);
      
      const weekday = d.toLocaleDateString([], { weekday: 'short' });
      const dayNum = d.toLocaleDateString([], { day: '2-digit' });
      
      days.push({
        dateStr,
        label: weekday,
        dayNum: dayNum
      });
    }
    return days;
  }

  filteredSlots(): CategorizedSlot[] {
    const dateStr = this.selectedDate();
    if (!dateStr) return [];
    return this.slots().filter(s => {
      const localDate = new Date(s.startTime);
      const slotLocalStr = this.getLocalDateString(localDate);
      return slotLocalStr === dateStr;
    });
  }

  selectDate(dateStr: string) {
    this.selectedDate.set(dateStr);
  }

  onCustomDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.value) {
      this.selectedDate.set(input.value);
    }
  }

  getSlotCategory(startTimeStr: string): { category: 'Day' | 'Afternoon' | 'Night', multiplier: number } {
    const date = new Date(startTimeStr);
    const hour = date.getHours();
    
    // Day time: 6 AM to 12 PM (noon)
    if (hour >= 6 && hour < 12) {
      return { category: 'Day', multiplier: 0.75 };
    } 
    // Afternoon: 12 PM to 5 PM
    else if (hour >= 12 && hour < 17) {
      return { category: 'Afternoon', multiplier: 1.0 };
    } 
    // Night: 5 PM to Midnight
    else {
      return { category: 'Night', multiplier: 1.125 };
    }
  }

  getTierPrice(tier: 'Day' | 'Afternoon' | 'Night'): number {
    const basePrice = this.turf()?.pricePerHour ?? 40;
    if (tier === 'Day') return Math.round(basePrice * 0.75);
    if (tier === 'Afternoon') return basePrice;
    return Math.round(basePrice * 1.125);
  }

  getSlotStatus(slot: CategorizedSlot): 'Available' | 'Selected' | 'Booked' | 'Unavailable' {
    if (slot.isBooked) {
      return 'Booked';
    }
    const isPast = new Date(slot.startTime).getTime() < new Date().getTime();
    if (isPast) {
      return 'Unavailable';
    }
    if (this.isSlotSelected(slot)) {
      return 'Selected';
    }
    return 'Available';
  }

  toggleSlotSelection(slot: CategorizedSlot) {
    const status = this.getSlotStatus(slot);
    if (status === 'Booked' || status === 'Unavailable') {
      return; // Cannot select booked or past slots
    }
    const current = this.selectedSlots();
    const exists = current.find(s => s.id === slot.id);
    if (exists) {
      this.selectedSlots.set(current.filter(s => s.id !== slot.id));
    } else {
      this.selectedSlots.set([...current, slot]);
    }
  }

  isSlotSelected(slot: CategorizedSlot): boolean {
    return !!this.selectedSlots().find(s => s.id === slot.id);
  }

  getTotalPrice(): number {
    return this.selectedSlots().reduce((sum, slot) => sum + slot.calculatedPrice, 0);
  }

  getAdvancePrice(): number {
    // Flat advance fee of ₹30 per slot selected
    return 30 * this.selectedSlots().length;
  }

  confirmBooking() {
    const selected = this.selectedSlots();
    if (selected.length === 0) return;

    // Capture booking details before starting the booking process
    const option = this.paymentOption();
    const totalPrice = this.getTotalPrice();
    const advancePrice = this.getAdvancePrice();
    const hours = selected.length;

    this.confirmedBookingDetails.set({
      paymentPlan: option === 'full' ? 'Full Payment' : 'Advance Booking Plan',
      amountPaid: option === 'full' ? totalPrice : advancePrice,
      balanceDue: option === 'full' ? 0 : (totalPrice - advancePrice),
      hours: hours
    });

    this.isBooking.set(true);

    const bookings = selected.map(slot => this.bookingRepository.bookSlot({ slotId: slot.id }));

    forkJoin(bookings).subscribe({
      next: () => {
        // Mark the slots we just booked as booked in our local state immediately
        const bookedIds = selected.map(s => s.id);
        this.slots.update(currentSlots =>
          currentSlots.map(s => bookedIds.includes(s.id) ? { ...s, isBooked: true } : s)
        );

        this.isBooking.set(false);
        this.isBookedSuccess.set(true);
        this.notificationService.success('All slots booked successfully!');
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Booking failed.');
        this.isBooking.set(false);
        this.confirmedBookingDetails.set(null); // Clear on failure
      }
    });
  }

  resetSuccessState() {
    this.isBookedSuccess.set(false);
    this.selectedSlots.set([]);
    this.confirmedBookingDetails.set(null);
    this.loadSlots(); // Refresh slot availability
  }

  loadReviews() {
    this.reviewRepository.getReviewsByTurf(this.turfId).subscribe({
      next: (data) => {
        this.reviews.set(data);
      },
      error: () => {
        this.notificationService.error('Failed to load reviews.');
      }
    });
  }

  setNewReviewRating(rating: number) {
    this.newReviewRating.set(rating);
  }

  submitReview() {
    if (this.newReviewRating() === 0) return;
    this.isSubmittingReview.set(true);

    const dto = {
      turfId: this.turfId,
      rating: this.newReviewRating(),
      comment: this.newReviewComment
    };

    this.reviewRepository.createReview(dto).subscribe({
      next: () => {
        this.isSubmittingReview.set(false);
        this.newReviewRating.set(0);
        this.newReviewComment = '';
        this.notificationService.success('Review submitted successfully!');
        this.loadReviews();
        this.loadTurfDetails(); // Reload turf to get updated average rating!
      },
      error: (err) => {
        this.isSubmittingReview.set(false);
        this.notificationService.error(err.error?.message || 'Only users who have booked this turf can leave a review.');
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  }

  ngOnDestroy(): void {
    try {
      this.signalr.off('SlotBooked');
      this.signalr.leaveTurfGroup(String(this.turfId));
    } catch {}
  }

  encodeURIComponent(val: string | undefined): string {
    return val ? encodeURIComponent(val) : '';
  }

  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  getFormattedBookingDate(): string {
    const selected = this.selectedSlots();
    if (selected.length === 0) return '';
    const date = new Date(selected[0].startTime);
    return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }) + ',';
  }

  getFormattedTimeRange(): string {
    const selected = this.selectedSlots();
    if (selected.length === 0) return '';
    
    // Sort slots by start time to get chronological min and max
    const sorted = [...selected].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const minStart = new Date(sorted[0].startTime);
    const maxEnd = new Date(sorted[sorted.length - 1].endTime);
    
    const formatOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const startStr = minStart.toLocaleTimeString([], formatOptions).toLowerCase();
    const endStr = maxEnd.toLocaleTimeString([], formatOptions).toLowerCase();
    
    return `${startStr} to ${endStr}`;
  }
}
