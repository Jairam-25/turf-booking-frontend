import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turf } from '../../../domain/models/turf.model';
import { Slot } from '../../../domain/models/booking.model';
import { BookingRepository } from '../../../domain/repositories/booking.repository';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-overlay fade-in" (click)="onClose()">
      <div class="modal-content glass scale-in" (click)="$event.stopPropagation()">
        <header class="modal-header">
          <div class="turf-info">
            <h2>Book {{ turf.name }}</h2>
            <p class="location">{{ turf.location }}</p>
          </div>
          <button class="btn-close" (click)="onClose()">&times;</button>
        </header>

        <div class="modal-body">
          <div class="slots-section">
            <h3>Select a Time Slot</h3>
            
            <div class="slots-grid" *ngIf="!isLoading(); else loadingTemplate">
              <div 
                *ngFor="let slot of slots()" 
                class="slot-card glass"
                [class.selected]="selectedSlot()?.id === slot.id"
                (click)="selectSlot(slot)"
              >
                <span class="time">{{ formatTime(slot.startTime) }}</span>
                <span class="duration">1 Hour</span>
              </div>

              <div class="empty-slots" *ngIf="slots().length === 0">
                <p>No available slots for this turf today.</p>
              </div>
            </div>

            <ng-template #loadingTemplate>
              <div class="slots-grid">
                <div class="slot-card glass skeleton" *ngFor="let i of [1,2,3,4]"></div>
              </div>
            </ng-template>
          </div>

          <div class="booking-summary glass" *ngIf="selectedSlot()">
            <div class="summary-row">
              <span>Rate</span>
              <span>₹{{ turf.pricePerHour }}/hr</span>
            </div>
            <div class="summary-row total">
              <span>Total Amount</span>
              <span>₹{{ turf.pricePerHour }}</span>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-premium secondary" (click)="onClose()">Cancel</button>
          <button 
            class="btn-premium" 
            [disabled]="!selectedSlot() || isBooking()" 
            (click)="confirmBooking()"
          >
            <span *ngIf="!isBooking()">Confirm Booking</span>
            <span *ngIf="isBooking()" class="spinner"></span>
          </button>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(8px);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
      padding: 1rem;
    }
    .modal-content {
      width: 100%;
      max-width: 500px;
      background: rgba(30, 41, 59, 0.7);
      border-radius: 24px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .modal-header {
      padding: 1.5rem 2rem;
      border-bottom: 1px solid var(--glass-border);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .turf-info h2 {
      font-size: 1.5rem;
      margin: 0;
    }
    .location {
      font-size: 0.875rem;
      color: var(--text-secondary);
      margin: 4px 0 0;
    }
    .btn-close {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 2rem;
      cursor: pointer;
      line-height: 1;
    }

    .modal-body {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .slots-section h3 {
      font-size: 1.125rem;
      margin-bottom: 1.25rem;
    }
    .slots-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
      gap: 1rem;
      max-height: 250px;
      overflow-y: auto;
      padding-right: 0.5rem;
    }
    .slot-card {
      padding: 1rem;
      text-align: center;
      cursor: pointer;
      transition: var(--transition-smooth);
      border: 1px solid var(--glass-border);
    }
    .slot-card:hover {
      border-color: var(--primary);
      background: rgba(99, 102, 241, 0.1);
    }
    .slot-card.selected {
      background: var(--primary);
      border-color: var(--primary);
      color: white;
    }
    .slot-card .time {
      display: block;
      font-weight: 700;
      font-size: 1rem;
    }
    .slot-card .duration {
      font-size: 0.75rem;
      opacity: 0.7;
    }

    .booking-summary {
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.03);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-secondary);
    }
    .summary-row.total {
      border-top: 1px solid var(--glass-border);
      padding-top: 0.75rem;
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.125rem;
    }

    .modal-footer {
      padding: 1.5rem 2rem;
      background: rgba(15, 23, 42, 0.3);
      display: flex;
      gap: 1rem;
    }
    .modal-footer .btn-premium {
      flex: 1;
      height: 48px;
    }

    .skeleton {
      height: 60px;
      animation: pulse 1.5s infinite;
    }
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }
  `]
})
export class BookingModalComponent implements OnInit {
  @Input({ required: true }) turf!: Turf;
  @Output() close = new EventEmitter<void>();
  @Output() booked = new EventEmitter<void>();

  slots = signal<Slot[]>([]);
  isLoading = signal(true);
  isBooking = signal(false);
  selectedSlot = signal<Slot | null>(null);

  constructor(
    private bookingRepository: BookingRepository,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadSlots();
  }

  loadSlots() {
    this.isLoading.set(true);
    this.bookingRepository.getSlotsByTurf(this.turf.id).subscribe({
      next: (slots) => {
        this.slots.set(slots);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load slots.');
        this.isLoading.set(false);
      }
    });
  }

  selectSlot(slot: Slot) {
    this.selectedSlot.set(slot);
  }

  confirmBooking() {
    const slot = this.selectedSlot();
    if (!slot) return;

    this.isBooking.set(true);
    this.bookingRepository.bookSlot({ slotId: slot.id }).subscribe({
      next: () => {
        this.notificationService.success(`Successfully booked ${this.turf.name}!`);
        this.booked.emit();
        this.isBooking.set(false);
      },
      error: (err) => {
        this.notificationService.error(err.error?.message || 'Booking failed.');
        this.isBooking.set(false);
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  formatTime(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
