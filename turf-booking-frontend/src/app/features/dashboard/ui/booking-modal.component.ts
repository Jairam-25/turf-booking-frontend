import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turf } from '../../../domain/models/turf.model';
import { Slot } from '../../../domain/models/booking.model';
import { BookingRepository } from '../../../domain/repositories/booking.repository';
import { NotificationService } from '../../../core/services/notification.service';
import { SignalrService } from '../../../core/services/signalr.service';

@Component({
 selector: 'app-booking-modal',
 standalone: true,
 imports: [CommonModule],
 template: `
 <div class="modal-overlay fade-in" (click)="onClose()">
 <div class="modal-content glass scale-in" (click)="$event.stopPropagation()">
 
 <!-- Standard Booking Layout -->
 <ng-container *ngIf="!isBookedSuccess()">
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
 class="slot-card"
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
 <div class="slot-card skeleton" *ngFor="let i of [1,2,3,4]"></div>
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
 <button class="btn-premium btn-uniform secondary" (click)="onClose()">Cancel</button>
 <button 
 class="btn-premium btn-uniform" 
 [disabled]="!selectedSlot() || isBooking()" 
 (click)="confirmBooking()"
 >
 <span *ngIf="!isBooking()">Confirm Booking</span>
 <span *ngIf="isBooking()" class="spinner"></span>
 </button>
 </footer>
 </ng-container>

 <!-- Gorgeous Stripe-Style Booking Success Overlay -->
 <div class="success-overlay fade-in" *ngIf="isBookedSuccess()">
 <div class="success-content scale-in">
 <div class="success-icon-wrapper" title="Bookings">
 <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
 <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
 <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
 </svg>
 </div>
 <h2>Booking Confirmed!</h2>
 <p class="success-subtitle">Your slot has been reserved successfully.</p>
 
 <div class="success-details glass">
 <div class="summary-row">
 <span class="label">Turf Arena</span>
 <span class="value">{{ turf.name }}</span>
 </div>
 <div class="summary-row" *ngIf="selectedSlot()">
 <span class="label">Time Reserved</span>
 <span class="value">{{ formatTime(selectedSlot()!.startTime) }} (1 Hour)</span>
 </div>
 <div class="summary-row">
 <span class="label">Total Paid</span>
 <span class="value">₹{{ turf.pricePerHour }}</span>
 </div>
 </div>

 <p class="closing-hint">Closing window shortly...</p>
 </div>
 </div>

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
 background: rgba(11, 15, 25, 0.8);
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
 background: var(--bg-card);
 border-radius: 24px;
 overflow: hidden;
 display: flex;
 flex-direction: column;
 border: 1px solid var(--border-color);
 box-shadow: var(--shadow-hover);
 position: relative;
 min-height: 400px;
 }
 .modal-header {
 padding: 1.5rem 2rem;
 border-bottom: 1px solid var(--border-color);
 display: flex;
 justify-content: space-between;
 align-items: center;
 }
 .turf-info h2 {
 font-size: 1.5rem;
 margin: 0;
 font-weight: 700;
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
 transition: var(--transition-smooth);
 }
 .btn-close:hover {
 color: var(--text-primary);
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
 font-weight: 600;
 }
 .slots-grid {
 display: flex;
 flex-direction: row;
 gap: 1rem;
 overflow-x: auto;
 padding: 0.5rem 0.25rem 1rem 0.25rem;
 scroll-behavior: smooth;
 -webkit-overflow-scrolling: touch;
 }
 .slots-grid::-webkit-scrollbar {
 height: 6px;
 }
 .slots-grid::-webkit-scrollbar-track {
 background: rgba(255, 255, 255, 0.02);
 border-radius: 10px;
 }
 .slots-grid::-webkit-scrollbar-thumb {
 background: rgba(var(--primary-rgb), 0.3);
 border-radius: 10px;
 transition: background 0.2s ease;
 }
 .slots-grid::-webkit-scrollbar-thumb:hover {
 background: var(--primary);
 }
 .slot-card {
 flex: 0 0 120px;
 padding: 1rem;
 text-align: center;
 cursor: pointer;
 transition: var(--transition-smooth);
 border: 1px solid var(--border-color);
 border-radius: 10px;
 background: rgba(var(--primary-rgb), 0.02);
 }
 .slot-card:hover {
 border-color: var(--primary);
 background: rgba(var(--primary-rgb), 0.06);
 transform: translateY(-2px);
 }
 .slot-card:active {
 transform: scale(0.96);
 }
 .slot-card.selected {
 background: var(--primary);
 border-color: var(--primary);
 color: var(--on-primary);
 animation: select-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) both;
 }
 .slot-card .time {
 display: block;
 font-weight: 700;
 font-size: 1rem;
 }
 .slot-card .duration {
 font-size: 0.75rem;
 opacity: 0.8;
 }

 @keyframes select-pop {
 0% { transform: scale(0.95); }
 50% { transform: scale(1.04); }
 100% { transform: scale(1); }
 }

 .booking-summary {
 padding: 1.5rem;
 background: rgba(var(--primary-rgb), 0.03);
 display: flex;
 flex-direction: column;
 gap: 0.75rem;
 border: 1px solid var(--border-color);
 border-radius: 12px;
 }
 .summary-row {
 display: flex;
 justify-content: space-between;
 color: var(--text-secondary);
 }
 .summary-row.total {
 border-top: 1px solid var(--border-color);
 padding-top: 0.75rem;
 color: var(--text-primary);
 font-weight: 700;
 font-size: 1.125rem;
 }

 .modal-footer {
 padding: 1.5rem 2rem;
 border-top: 1px solid var(--border-color);
 display: flex;
 gap: 1rem;
 background: rgba(var(--primary-rgb), 0.01);
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

 /* Stripe/Apple Checkmark Success Overlay */
 .success-overlay {
 position: absolute;
 top: 0;
 left: 0;
 right: 0;
 bottom: 0;
 background: var(--bg-card);
 z-index: 100;
 display: flex;
 align-items: center;
 justify-content: center;
 padding: 2.5rem;
 }

 .success-content {
 display: flex;
 flex-direction: column;
 align-items: center;
 text-align: center;
 gap: 1.25rem;
 width: 100%;
 max-width: 380px;
 }

 .success-icon-wrapper {
 width: 72px;
 height: 72px;
 margin-bottom: 0.5rem;
 }

 .checkmark {
 width: 72px;
 height: 72px;
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

 @keyframes stroke {
 100% { stroke-dashoffset: 0; }
 }

 @keyframes fill {
 100% { box-shadow: inset 0px 0px 0px 36px var(--primary); }
 }

 @keyframes scale {
 0%, 100% { transform: none; }
 50% { transform: scale3d(1.08, 1.08, 1); }
 }

 .success-content h2 {
 font-size: 1.6rem;
 font-weight: 800;
 margin: 0;
 color: var(--text-primary);
 letter-spacing: -0.5px;
 }

 .success-subtitle {
 font-size: 0.9375rem;
 color: var(--text-secondary);
 margin: 0;
 }

 .success-details {
 width: 100%;
 padding: 1.25rem 1.5rem;
 background: rgba(16, 185, 129, 0.02);
 display: flex;
 flex-direction: column;
 gap: 0.75rem;
 border: 1px solid var(--border-color);
 border-radius: 12px;
 text-align: left;
 }

 .success-details .summary-row {
 display: flex;
 justify-content: space-between;
 font-size: 0.875rem;
 }

 .success-details .summary-row .label {
 color: var(--text-secondary);
 }

 .success-details .summary-row .value {
 color: var(--text-primary);
 font-weight: 600;
 }

 .closing-hint {
 font-size: 0.75rem;
 color: var(--text-secondary);
 opacity: 0.7;
 margin-top: 0.5rem;
 }

 .spinner {
 width: 20px;
 height: 20px;
 border: 2px solid rgba(255, 255, 255, 0.3);
 border-radius: 50%;
 border-top-color: var(--on-primary);
 animation: spin 0.8s linear infinite;
 }
 @keyframes spin {
 to { transform: rotate(360deg); }
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
 isBookedSuccess = signal(false);
 selectedSlot = signal<Slot | null>(null);

 constructor(
 private bookingRepository: BookingRepository,
 private notificationService: NotificationService
 , private signalr: SignalrService
 ) {}

 ngOnInit() {
 this.loadSlots();
 // join signalr turf group so backend can push updates for this turf
 try {
 this.signalr.joinTurfGroup(String(this.turf.id));
 } catch {}

 // Listen for real-time booking updates
 this.signalr.on('SlotBooked', (data: any) => {
 const slotId = data.slotId || data.SlotId;
 const isBooked = data.isBooked !== undefined ? data.isBooked : data.IsBooked;
 if (slotId !== undefined && isBooked !== undefined) {
 if (isBooked) {
 this.slots.update(currentSlots => currentSlots.filter(s => s.id !== slotId));
 if (!this.isBookedSuccess() && this.selectedSlot()?.id === slotId) {
 this.selectedSlot.set(null);
 }
 }
 }
 });
 }

 loadSlots() {
 this.isLoading.set(true);
 this.bookingRepository.getSlotsByTurf(this.turf.id).subscribe({
 next: (slots) => {
 const now = new Date().getTime();
 this.slots.set(slots.filter(s => !s.isBooked && new Date(s.startTime).getTime() > now));
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
 this.isBooking.set(false);
 // Trigger Stripe checkmark success overlay animation
 this.isBookedSuccess.set(true);

 // Notify and smoothly close modal after animation completes
 setTimeout(() => {
 this.booked.emit();
 }, 2200);
 },
 error: (err) => {
 this.notificationService.error(err.error?.message || 'Booking failed.');
 this.isBooking.set(false);
 }
 });
 }

 onClose() {
 if (this.isBookedSuccess()) return; // Prevent closing while success animation runs
 try { 
 this.signalr.off('SlotBooked');
 this.signalr.leaveTurfGroup(String(this.turf.id)); 
 } catch {}
 this.close.emit();
 }

 ngOnDestroy(): void {
 try { 
 this.signalr.off('SlotBooked');
 this.signalr.leaveTurfGroup(String(this.turf.id)); 
 } catch {}
 }

 formatTime(isoString: string): string {
 const date = new Date(isoString);
 return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
 }
}
