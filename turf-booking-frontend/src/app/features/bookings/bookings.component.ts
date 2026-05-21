import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/models/booking.model';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule],
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
              <p class="location">{{ booking.location }}</p>
            </div>
            <div class="booking-status">
              <span class="status-badge">Confirmed</span>
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
    .location {
      color: var(--text-secondary);
      font-size: 0.9375rem;
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
