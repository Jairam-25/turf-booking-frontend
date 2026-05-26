import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/models/booking.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bookings-container fade-in">
      <div class="glass header-card">
        <h1>My Bookings</h1>
        <p>Manage and track all your turf reservations</p>
      </div>

      <div class="bookings-list" *ngIf="!isLoading(); else loadingTemplate">
        <div 
          *ngFor="let booking of bookings()" 
          class="glass booking-card"
        >
          <div class="booking-main">
            <div class="turf-details">
              <h3>{{ booking.turfName }}</h3>
              <a 
                [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(booking.turfName + ' ' + booking.location)"
                target="_blank" 
                class="location-link"
                title="Open in Google Maps"
              >
                {{ booking.location }} ↗
              </a>
            </div>
            <div class="booking-status">
              <span class="status-badge">Booking Confirmed</span>
            </div>
          </div>
          
          <div class="booking-footer">
            <div class="info-item">
              <span class="label">Date & Time</span>
              <span class="value">{{ formatDateTime(booking.startTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Duration</span>
              <span class="value">1 Hour</span>
            </div>
            <div class="info-item">
              <span class="label">Price</span>
              <span class="value">₹{{ booking.price }}</span>
            </div>
            <div class="info-item cancel-action">
              <button class="btn-cancel" (click)="openCancelModal(booking.bookingId)">Cancel Booking</button>
            </div>
          </div>
        </div>

        <div class="empty-state glass" *ngIf="bookings().length === 0">
          <h3>No bookings found</h3>
          <p>You haven't booked any turfs yet. Start playing today!</p>
          <button class="btn-premium" routerLink="/dashboard">Book a Turf</button>
        </div>
      </div>

      <ng-template #loadingTemplate>
        <div class="bookings-list">
          <div class="glass booking-card skeleton" *ngFor="let i of [1,2,3]"></div>
        </div>
      </ng-template>
    </div>

    <!-- Cancellation Modal -->
    <div class="modal-overlay" *ngIf="isCancelModalOpen()">
      <div class="modal-content glass">
        <h3>Cancel Booking</h3>
        <p>Please provide a reason for cancelling this booking. This will be sent to your email.</p>
        <textarea 
          [(ngModel)]="cancelReason" 
          placeholder="e.g., Change of plans, Injury, Weather..." 
          rows="4">
        </textarea>
        <div class="modal-actions">
          <button class="btn-secondary" (click)="closeCancelModal()" [disabled]="isCancelling()">Keep Booking</button>
          <button class="btn-cancel-confirm" (click)="confirmCancel()" [disabled]="isCancelling()">
            <span *ngIf="!isCancelling()">Confirm Cancel</span>
            <span *ngIf="isCancelling()" class="spinner-small"></span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      padding: 2rem;
      max-width: 1000px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .header-card {
      padding: 2.5rem;
      text-align: center;
    }
    .header-card h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--primary);
    }
    .header-card p {
      color: var(--text-secondary);
    }

    .bookings-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .booking-card {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
      transition: var(--transition-smooth);
    }
    .booking-card:hover {
      transform: translateX(8px);
      border-color: var(--primary);
    }

    .booking-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .turf-details h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .location-link {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      text-decoration: none;
      display: inline-block;
      transition: var(--transition-smooth);
    }
    .location-link:hover {
      color: var(--primary);
    }

    .status-badge {
      background: rgba(16, 185, 129, 0.1);
      color: var(--success-color);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.8125rem;
      font-weight: 700;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .booking-footer {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--glass-border);
      align-items: center;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .label {
      font-size: 0.75rem;
      color: var(--text-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .value {
      font-weight: 600;
      color: var(--text-primary);
    }

    .cancel-action {
      align-items: flex-end;
      justify-content: center;
    }
    .btn-cancel {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.3);
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-cancel:hover {
      background: #ef4444;
      color: white;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.3s ease;
    }
    .modal-content {
      width: 90%;
      max-width: 400px;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .modal-content h3 {
      font-size: 1.5rem;
      color: #ef4444;
      margin: 0;
    }
    .modal-content p {
      color: var(--text-secondary);
      font-size: 0.9375rem;
      line-height: 1.5;
      margin: 0;
    }
    .modal-content textarea {
      width: 100%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      padding: 1rem;
      color: var(--text-primary);
      font-family: inherit;
      resize: vertical;
    }
    .modal-content textarea:focus {
      outline: none;
      border-color: #ef4444;
    }
    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    .btn-secondary {
      background: transparent;
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
    }
    .btn-secondary:hover:not([disabled]) {
      background: rgba(255, 255, 255, 0.05);
    }
    .btn-cancel-confirm {
      background: #ef4444;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: background 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 130px;
    }
    .btn-cancel-confirm:hover:not([disabled]) {
      background: #dc2626;
    }
    .btn-cancel-confirm[disabled] {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .spinner-small {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.3);
      border-radius: 50%;
      border-top-color: #fff;
      animation: spin 1s ease-in-out infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .skeleton {
      height: 200px;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    .empty-state {
      padding: 5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }
  `]
})
export class BookingsComponent implements OnInit {
  bookings = signal<Booking[]>([]);
  isLoading = signal(true);
  
  // Modal state
  isCancelModalOpen = signal(false);
  isCancelling = signal(false);
  bookingToCancel: number | null = null;
  cancelReason: string = '';

  constructor(
    private bookingRepository: BookingRepository,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingRepository.getMyBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load your bookings.');
        this.isLoading.set(false);
      }
    });
  }

  openCancelModal(bookingId: number) {
    this.bookingToCancel = bookingId;
    this.cancelReason = '';
    this.isCancelModalOpen.set(true);
  }

  closeCancelModal() {
    this.isCancelModalOpen.set(false);
    this.bookingToCancel = null;
  }

  confirmCancel() {
    if (!this.bookingToCancel) return;
    
    if (!this.cancelReason.trim()) {
      this.notificationService.error('Please provide a reason for cancellation');
      return;
    }

    this.isCancelling.set(true);
    this.bookingRepository.cancelBooking(this.bookingToCancel, this.cancelReason).subscribe({
      next: () => {
        this.notificationService.success('Booking cancelled successfully');
        this.closeCancelModal();
        this.loadBookings(); // Reload to get updated list
        this.isCancelling.set(false);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Failed to cancel booking');
        this.isCancelling.set(false);
      }
    });
  }

  encodeURIComponent(val: string): string {
    return encodeURIComponent(val);
  }

  formatDateTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
