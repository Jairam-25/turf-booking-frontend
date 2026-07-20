import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { BookingRepository } from '../../domain/repositories/booking.repository';
import { Booking } from '../../domain/models/booking.model';
import { NotificationService } from '../../core/services/notification.service';
import { ActivatedRoute } from '@angular/router';

export interface GroupedBooking {
  bookingIds: number[];
  turfName: string;
  location: string;
  bookedOn: string;
  startTime: string;
  endTime: string;
  rawSlots: { startTime: string; endTime: string }[];
  pricePerHour: number;
  totalPrice: number;
  durationHours: number;
}

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="bookings-container container-fluid spacing-vertical-24 fade-in">
      <!-- Back Button -->
      <div class="navigation-bar mt-[25px]">
        <button class="btn-back" (click)="goBack()" title="Back">
          <svg class="back-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Go Back
        </button>
      </div>

      <!-- Analytics & Insights -->
      <div class="glass header-card" style="margin-bottom: 2rem;">
        <div class="insights-header">
          <h1>My Insights</h1>
          <p>Personalized analytics based on your booking history</p>
        </div>
        
        <div class="insights-grid" *ngIf="bookings().length > 0; else noInsights">
           <!-- Most Played Arena -->
           <div class="insight-card">
              <div class="insight-icon" style="background: rgba(16, 185, 129, 0.1); color: #10b981;" title="Most Played Arena">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
              </div>
              <div class="insight-info">
                <h4>Most Played Arena</h4>
                <h2>{{ mostPlayedArena }}</h2>
                <span class="trend">{{ mostPlayedCount }} Bookings</span>
              </div>
           </div>
           
           <!-- Preferred Time Slots -->
           <div class="insight-card">
              <div class="insight-icon" style="background: rgba(245, 158, 11, 0.1); color: #f59e0b;" title="Preferred Time">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div class="insight-info">
                <h4>Preferred Time</h4>
                <h2>{{ preferredTimeSlot }}</h2>
                <span class="trend">Night Owl Badge</span>
              </div>
           </div>
           
           <!-- Recommended Turf -->
           <div class="insight-card highlight">
              <div class="insight-icon" style="background: rgba(255, 255, 255, 0.2); color: #fff;" title="Recommended Turf">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ><path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 0115 0z" /></svg>
              </div>
              <div class="insight-info">
                <h4>Recommended for You</h4>
                <h2>{{ recommendedTurf }}</h2>
                <button class="btn-book-now btn-uniform" routerLink="/dashboard">Book Now</button>
              </div>
           </div>
        </div>
        <ng-template #noInsights>
          <div class="no-insights">Play more matches to unlock your personalized insights!</div>
        </ng-template>
      </div>

      <div class="flex justify-between items-center" style="margin-bottom: 1rem;">
        <h2 style="font-size: 1.5rem; margin: 0; color: var(--text-primary);">My Bookings</h2>
        
        <div class="tabs-container">
          <button [class.active]="activeTab() === 'today'" (click)="activeTab.set('today')" class="tab-btn">Today's Bookings</button>
          <button [class.active]="activeTab() === 'history'" (click)="activeTab.set('history')" class="tab-btn">Booking History</button>
        </div>
      </div>

      <!-- Filters for Booking History -->
      <div *ngIf="activeTab() === 'history'" class="flex gap-2 mb-4 overflow-x-auto scrollbar-hide py-1 snap-x">
        <div class="relative flex-1 min-w-[150px]">
          <input type="text" [ngModel]="historySearchQuery()" (ngModelChange)="historySearchQuery.set($event)" placeholder="Search turf..." class="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)] pl-8 text-[var(--text-primary)]">
          <svg class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <select [ngModel]="historyTurfFilter()" (ngModelChange)="historyTurfFilter.set($event)" class="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)] text-[var(--text-primary)] min-w-[100px]">
          <option value="all">All Turfs</option>
          <option *ngFor="let turf of uniqueBookedTurfs()" [value]="turf">{{ turf }}</option>
        </select>
        <select [ngModel]="historyDateFilter()" (ngModelChange)="historyDateFilter.set($event)" class="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)] text-[var(--text-primary)] min-w-[100px]">
          <option value="all">All Time</option>
          <option value="last30">Last 30 Days</option>
          <option value="last90">Last 90 Days</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>

      <div class="bookings-list" *ngIf="!isLoading(); else loadingTemplate">
        <div 
          *ngFor="let booking of bookings()" 
          class="glass booking-card transition-all duration-500 ease-in-out"
          [ngClass]="{'highlight-booking': booking.turfName === highlightedTurfName()}"
          [attr.id]="'booking-' + booking.turfName.replaceAll(' ', '-')"
        >
          <div class="booking-header">
            <div class="turf-info">
              <h3>{{ booking.turfName }}</h3>
              <a 
                [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(booking.turfName + ' ' + booking.location)"
                target="_blank" 
                class="location-link"
                title="Open in Google Maps"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" /><circle cx="12" cy="10.5" r="2.5" /></svg>
                Location View ↗
              </a>
            </div>
            <span class="status-badge">Confirmed</span>
          </div>
          
          <div class="booking-body flex-card-body">
            <div class="info-row">
              <span class="label">Date</span>
              <span class="value">{{ formatBookingDate(booking.startTime) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Time</span>
              <span class="value">{{ formatTimeBlocks(booking.rawSlots) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Duration</span>
              <span class="value">{{ booking.durationHours }} Hour{{ booking.durationHours > 1 ? 's' : '' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Price per hour</span>
              <span class="value">
                ₹{{ booking.pricePerHour }} &nbsp;&nbsp;
                <span style="color: var(--primary); font-weight: 700;">{{ booking.durationHours }} hrs ₹{{ booking.totalPrice }}</span>
              </span>
            </div>
          </div>
          
          <div class="booking-actions">
            <div class="booking-actions-row">
              <button class="btn-share btn-uniform" (click)="shareBooking(booking)" title="Share">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share
              </button>
              <button class="btn-cancel btn-uniform" (click)="openCancelModal(booking.bookingIds)">Cancel</button>
            </div>
            <button class="btn-share btn-uniform" style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); border: 1px solid var(--primary); width: 100%;" (click)="openFeedbackModal(booking)">Rate Turf</button>
          </div>
        </div>

        <div class="empty-state glass col-span-2" *ngIf="bookings().length === 0">
          <h3>No bookings found</h3>
          <p>You haven't booked any turfs yet. Start playing today!</p>
          <button class="btn-premium btn-uniform" routerLink="/dashboard">Book a Turf</button>
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
      <div class="bg-[var(--bg-card)] max-w-md w-full p-6 rounded-2xl border border-[var(--border-color)] fade-in space-y-4 shadow-2xl m-4">
        <h3 class="text-xl font-bold text-[#ef4444] m-0">Cancel Booking</h3>
        <p class="text-[var(--text-secondary)] text-sm leading-relaxed m-0">Please provide a reason for cancelling this booking. This will be sent to your email.</p>
        <textarea 
          [(ngModel)]="cancelReason" 
          placeholder="e.g., Change of plans, Injury, Weather..." 
          rows="4"
          class="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg p-3 outline-none focus:border-[#ef4444] focus:ring-1 focus:ring-[#ef4444]/20 placeholder:text-[var(--text-secondary)]/50">
        </textarea>
        <div class="flex justify-end gap-3 pt-2">
          <button class="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-lg text-sm font-bold text-[var(--text-primary)] transition-colors" (click)="closeCancelModal()" [disabled]="isCancelling()">Keep Booking</button>
          <button class="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-bold text-white transition-colors flex items-center justify-center min-w-[130px] disabled:opacity-50 disabled:cursor-not-allowed" (click)="confirmCancel()" [disabled]="isCancelling()">
            <span *ngIf="!isCancelling()">Confirm Cancel</span>
            <span *ngIf="isCancelling()" class="spinner-small"></span>
          </button>
        </div>
      </div>
    </div>

    <!-- Feedback Modal -->
    <div class="modal-overlay" *ngIf="isFeedbackModalOpen()">
      <div class="bg-[var(--bg-card)] max-w-md w-full p-6 rounded-2xl border border-[var(--border-color)] fade-in space-y-4 shadow-2xl m-4 text-center">
        <h3 class="text-xl font-bold text-[var(--text-primary)] m-0">Rate Your Experience</h3>
        <p class="text-[var(--text-secondary)] text-sm leading-relaxed m-0">How was your game at <strong>{{ feedbackBooking?.turfName }}</strong>?</p>
        
        <div class="star-rating" style="display: flex; justify-content: center; gap: 8px; margin: 1.5rem 0;" title="Star Rating">
          <svg *ngFor="let star of [1, 2, 3, 4, 5]" 
               (click)="feedbackRating = star"
               [attr.fill]="star <= feedbackRating ? '#fbbf24' : 'none'"
               viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" 
               
               style="width: 32px; height: 32px; cursor: pointer; color: #fbbf24; transition: transform 0.2s;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        
        <textarea 
          [(ngModel)]="feedbackText" 
          placeholder="Leave a quick review... (Optional)" 
          rows="3"
          class="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] text-[var(--text-primary)] rounded-lg p-3 outline-none focus:border-[#7b39fc] focus:ring-1 focus:ring-[#7b39fc]/20 placeholder:text-[var(--text-secondary)]/50 mb-2">
        </textarea>
        
        <div class="flex justify-center gap-3 pt-2">
          <button class="px-4 py-2 bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20 rounded-lg text-sm font-bold text-[var(--text-primary)] transition-colors" (click)="closeFeedbackModal()">Skip</button>
          <button class="px-4 py-2 bg-[#7b39fc] hover:bg-[#6b21a8] rounded-lg text-sm font-bold text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" (click)="submitFeedback()" [disabled]="feedbackRating === 0">Submit Feedback</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .highlight-booking {
      animation: highlightPulse 2s ease-out;
      border: 2px solid var(--primary) !important;
      box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4) !important;
    }
    @keyframes highlightPulse {
      0% { transform: scale(1); box-shadow: 0 0 0 rgba(var(--primary-rgb), 0); }
      50% { transform: scale(1.02); box-shadow: 0 0 30px rgba(var(--primary-rgb), 0.6); }
      100% { transform: scale(1); box-shadow: 0 0 20px rgba(var(--primary-rgb), 0.4); }
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
    @media (max-width: 768px) {
      .btn-back {
        padding: 6px 10px;
        font-size: 0.75rem; 
        border-radius: 6px;
        gap: 4px;
        min-height: 32px !important;
      }
      .back-icon, .btn-back svg {
        width: 14px;
        height: 14px;
      }
    }
    .btn-back:hover {
      background: rgba(255,255,255,0.05);
      border-color: var(--primary);
    }
    .back-icon {
      width: 16px;
      height: 16px;
    }
    .header-card {
      padding: 2rem 2.5rem;
      border-radius: 20px;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .header-card h1 {
      font-size: 2.2rem;
      margin: 0;
      background: linear-gradient(135deg, var(--text-primary) 0%, var(--primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .header-card p {
      margin: 0;
      color: var(--text-secondary);
      font-size: 1rem;
    }
    
    .tabs-container {
      display: flex;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 4px;
      gap: 4px;
    }
    .tab-btn {
      background: transparent;
      border: none;
      color: var(--text-secondary);
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.9rem;
      transition: var(--transition-smooth);
    }
    .tab-btn:hover {
      color: var(--text-primary);
    }
    .tab-btn.active {
      background: var(--primary);
      color: white;
      box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.3);
    }
    
    /* Insights Grid */
    .insights-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
      margin-top: 2rem;
    }
    .insight-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1.25rem;
      transition: var(--transition-smooth);
    }
    .insight-card:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }
    .insight-card.highlight {
      background: linear-gradient(135deg, var(--primary), var(--accent));
      border: none;
      color: white;
    }
    .insight-icon {
      width: 54px;
      height: 54px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .insight-icon svg {
      width: 28px;
      height: 28px;
    }
    .insight-info {
      display: flex;
      flex-direction: column;
    }
    .insight-info h4 {
      font-size: 0.85rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      opacity: 0.7;
      margin-bottom: 0.25rem;
      margin-top: 0;
    }
    .insight-info h2 {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.25rem;
      margin-top: 0;
    }
    .insight-card.highlight .insight-info h4,
    .insight-card.highlight .insight-info h2 {
      color: white;
    }
    .trend {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-secondary);
    }
    .insight-card.highlight .trend {
      color: rgba(255, 255, 255, 0.8);
    }
    .btn-book-now {
      margin-top: 0.5rem;
      background: rgba(255,255,255,0.2);
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      width: fit-content;
      transition: background 0.2s;
    }
    .btn-book-now:hover {
      background: rgba(255,255,255,0.3);
    }
    .no-insights {
      margin-top: 2rem;
      padding: 1.5rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.02);
      border-radius: 12px;
      color: var(--text-secondary);
      border: 1px dashed var(--border-color);
    }

    .bookings-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    
    .booking-card {
      padding: 1.75rem;
      border-radius: 20px;
      min-height: 280px;
      transition: var(--transition-smooth);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .booking-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
    }
    
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .turf-info h3 {
      font-size: 1.25rem;
      font-weight: 800;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
    }
    .location-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: var(--transition-smooth);
    }
    .location-link:hover {
      color: var(--primary);
    }
    .location-link svg {
      width: 14px;
      height: 14px;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .flex-card-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .label {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    .value {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.95rem;
    }
    .value.price {
      font-size: 1.1rem;
      color: var(--primary);
    }
    
    .booking-actions {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    
    .booking-actions-row {
      display: flex;
      gap: 1rem;
      width: 100%;
    }
    
    .btn-uniform {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 12px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-share {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .btn-share:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    .btn-share svg {
      width: 18px;
      height: 18px;
    }
    
    .btn-cancel {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-cancel:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: translateY(-2px);
    }
.empty-state {
      padding: 5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
      grid-column: 1 / -1;
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
      height: 280px;
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
      grid-column: 1 / -1;
    }

    /* Tablet and Mobile Responsiveness */
    @media (max-width: 768px) {
      .bookings-container {
        padding: 1rem;
        gap: 1rem;
      }
      .header-card {
        display: none !important;
      }
      .header-card h1 {
        font-size: 1.5rem;
      }
      .header-card p {
        font-size: 0.85rem;
      }
      .insights-grid {
        display: flex;
        overflow-x: auto;
        scroll-snap-type: x mandatory;
        padding-bottom: 0.5rem;
        gap: 0.75rem;
        margin-top: 1rem;
      }
      .insight-card {
        min-width: 80vw;
        scroll-snap-align: center;
        flex-shrink: 0;
        padding: 1rem;
        gap: 0.75rem;
      }
      .insight-icon {
        width: 36px;
        height: 36px;
        border-radius: 10px;
      }
      .insight-icon svg {
        width: 18px;
        height: 18px;
      }
      .insight-info h4 {
        font-size: 0.75rem;
      }
      .insight-info h2 {
        font-size: 1rem;
      }
      .trend {
        font-size: 0.75rem;
      }
      h2 {
        font-size: 1.25rem !important;
      }
      .tab-btn {
        padding: 6px 10px;
        font-size: 0.8rem;
      }
      .bookings-list {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 0.75rem;
      }
      .booking-card {
        padding: 0.75rem;
        gap: 0.5rem;
        min-height: auto;
      }
      .turf-info h3 {
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .location-link {
        font-size: 0.65rem;
      }
      .status-badge {
        font-size: 0.6rem;
        padding: 2px 6px;
      }
      .info-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 2px;
      }
      .label {
        font-size: 0.65rem;
      }
      .value {
        font-size: 0.75rem;
      }
      .value.price {
        font-size: 0.85rem;
      }
      .booking-actions {
        flex-direction: column;
      }
      
      .btn-cancel, .btn-share {
        padding: 8px;
        font-size: 0.8rem;
        border-radius: 8px;
      }
      .empty-state {
        padding: 2rem 1rem;
      }
      .empty-state h3 {
        font-size: 1.2rem;
      }
      .empty-state p {
        font-size: 0.85rem;
      }
    }

    @media (max-width: 480px) {
      .modal-content {
        padding: 1.25rem;
      }
      .modal-content h3 {
        font-size: 1.25rem;
      }
      .modal-content p {
        font-size: 0.85rem;
      }
      .modal-actions {
        flex-direction: column;
        gap: 0.5rem;
      }
      .modal-actions button {
        width: 100%;
        padding: 8px;
        font-size: 0.85rem;
      }
    }
  `]
})
export class BookingsComponent implements OnInit {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }

  allBookings = signal<GroupedBooking[]>([]);
  activeTab = signal<'today' | 'history'>('today');
  highlightedTurfName = signal<string | null>(null);
  
  historySearchQuery = signal<string>('');
  historyTurfFilter = signal<string>('all');
  historyDateFilter = signal<'all' | 'last30' | 'last90' | 'thisYear'>('all');

  uniqueBookedTurfs = computed(() => {
    const all = this.allBookings();
    const names = all.map(b => b.turfName);
    return [...new Set(names)].sort();
  });

  bookings = computed(() => {
    const all = this.allBookings();
    if (this.activeTab() === 'history') {
      let filtered = all;
      
      const turfFilter = this.historyTurfFilter();
      if (turfFilter !== 'all') {
        filtered = filtered.filter(b => b.turfName === turfFilter);
      }

      const query = this.historySearchQuery().toLowerCase();
      if (query) {
        filtered = filtered.filter(b => b.turfName.toLowerCase().includes(query) || b.location.toLowerCase().includes(query));
      }
      
      const dateFilter = this.historyDateFilter();
      if (dateFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(b => {
          const bDate = new Date(b.startTime);
          if (dateFilter === 'last30') {
            const diffTime = Math.abs(now.getTime() - bDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 30;
          }
          if (dateFilter === 'last90') {
            const diffTime = Math.abs(now.getTime() - bDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 90;
          }
          if (dateFilter === 'thisYear') {
            return bDate.getFullYear() === now.getFullYear();
          }
          return true;
        });
      }
      
      // Sort history by date descending
      return filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return all.filter(b => {
        const bookingDate = new Date(b.startTime);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });
    }
  });

  isLoading = signal(true);
  
  // Modal state
  isCancelModalOpen = signal(false);
  isCancelling = signal(false);
  bookingsToCancel: number[] = [];
  cancelReason: string = '';

  // Analytics state
  mostPlayedArena = 'N/A';
  mostPlayedCount = 0;
  preferredTimeSlot = 'N/A';
  recommendedTurf = 'Green Field Arena';
  
  // Feedback state
  isFeedbackModalOpen = signal(false);
  feedbackBooking: GroupedBooking | null = null;
  feedbackRating = 0;
  feedbackText = '';

  constructor(
    private bookingRepository: BookingRepository,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.loadBookings();
    
    this.route.queryParams.subscribe(params => {
      if (params['highlightTurf']) {
        this.highlightedTurfName.set(params['highlightTurf']);
        this.activeTab.set('history');
      }
    });
  }

  loadBookings() {
    this.isLoading.set(true);
    this.bookingRepository.getMyBookings().subscribe({
      next: (data) => {
        const grouped = this.groupBookings(data);
        this.allBookings.set(grouped);
        this.calculateAnalytics(grouped);
        this.isLoading.set(false);
        
        if (this.highlightedTurfName()) {
          setTimeout(() => {
            const elId = 'booking-' + this.highlightedTurfName()!.replaceAll(' ', '-');
            const el = document.getElementById(elId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }, 300);
        }
      },
      error: () => {
        this.notificationService.error('Failed to load your bookings.');
        this.isLoading.set(false);
      }
    });
  }

  calculateAnalytics(bookings: GroupedBooking[]) {
    if (!bookings || bookings.length === 0) return;
    
    // 1. Most Played Arena
    const arenaCounts: Record<string, number> = {};
    bookings.forEach(b => {
      arenaCounts[b.turfName] = (arenaCounts[b.turfName] || 0) + b.rawSlots.length;
    });
    
    let maxArena = 'N/A';
    let maxCount = 0;
    for (const [arena, count] of Object.entries(arenaCounts)) {
      if (count > maxCount) {
        maxCount = count;
        maxArena = arena;
      }
    }
    this.mostPlayedArena = maxArena;
    this.mostPlayedCount = maxCount;
    
    // 2. Preferred Time Slot
    const timeCounts: Record<string, number> = {};
    bookings.forEach(b => {
      b.rawSlots.forEach(slot => {
        const hour = new Date(slot.startTime).getHours();
        if (hour < 12) timeCounts['Morning (6 AM - 12 PM)'] = (timeCounts['Morning (6 AM - 12 PM)'] || 0) + 1;
        else if (hour < 17) timeCounts['Afternoon (12 PM - 5 PM)'] = (timeCounts['Afternoon (12 PM - 5 PM)'] || 0) + 1;
        else timeCounts['Evening (5 PM - 11 PM)'] = (timeCounts['Evening (5 PM - 11 PM)'] || 0) + 1;
      });
    });
    
    let maxTime = 'N/A';
    let maxTimeCount = 0;
    for (const [time, count] of Object.entries(timeCounts)) {
      if (count > maxTimeCount) {
        maxTimeCount = count;
        maxTime = time;
      }
    }
    this.preferredTimeSlot = maxTime;
    
    // 3. Recommended Turf
    const allTurfs = ['Spartan Arena', 'Kickoff Turf', 'Galaxy Sports', 'Green Field Arena', 'Urban Pitch'];
    const unplayedTurfs = allTurfs.filter(t => !arenaCounts[t]);
    if (unplayedTurfs.length > 0) {
      this.recommendedTurf = unplayedTurfs[Math.floor(Math.random() * unplayedTurfs.length)];
    } else {
      this.recommendedTurf = maxArena;
    }
  }

  groupBookings(flatBookings: Booking[]): GroupedBooking[] {
    const groups: GroupedBooking[] = [];

    // Sort by bookedOn descending first, then by startTime ascending (so consecutive slots are sorted chronologically within the group)
    const sorted = [...flatBookings].sort((a, b) => {
      // Sort bookedOn descending (latest bookings first)
      const bookedOnDiff = new Date(b.bookedOn).getTime() - new Date(a.bookedOn).getTime();
      if (Math.abs(bookedOnDiff) > 60000) {
        return bookedOnDiff;
      }
      // If bookedOn is very close (within 1 min), sort by startTime ascending
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    });

    for (const booking of sorted) {
      const bookingDateStr = new Date(booking.startTime).toDateString();
      const bookingBookedTime = new Date(booking.bookedOn).getTime();

      const existingGroup = groups.find(g => {
        const groupDateStr = new Date(g.startTime).toDateString();
        const groupBookedTime = new Date(g.bookedOn).getTime();

        return g.turfName === booking.turfName &&
               groupDateStr === bookingDateStr &&
               Math.abs(groupBookedTime - bookingBookedTime) < 60000; // 60 seconds
      });

      if (existingGroup) {
        existingGroup.bookingIds.push(booking.bookingId);
        existingGroup.totalPrice += booking.price;
        existingGroup.durationHours += 1;
        existingGroup.rawSlots.push({ startTime: booking.startTime, endTime: booking.endTime });
        // Update startTime and endTime to span the whole selection (still kept for backward compatibility)
        if (new Date(booking.startTime).getTime() < new Date(existingGroup.startTime).getTime()) {
          existingGroup.startTime = booking.startTime;
        }
        if (new Date(booking.endTime).getTime() > new Date(existingGroup.endTime).getTime()) {
          existingGroup.endTime = booking.endTime;
        }
      } else {
        groups.push({
          bookingIds: [booking.bookingId],
          turfName: booking.turfName,
          location: booking.location,
          bookedOn: booking.bookedOn,
          startTime: booking.startTime,
          endTime: booking.endTime,
          rawSlots: [{ startTime: booking.startTime, endTime: booking.endTime }],
          pricePerHour: booking.price, // Base hourly rate
          totalPrice: booking.price,
          durationHours: 1
        });
      }
    }

    return groups;
  }

  openCancelModal(bookingIds: number[]) {
    this.bookingsToCancel = bookingIds;
    this.cancelReason = '';
    this.isCancelModalOpen.set(true);
  }

  closeCancelModal() {
    this.isCancelModalOpen.set(false);
    this.bookingsToCancel = [];
  }

  confirmCancel() {
    if (this.bookingsToCancel.length === 0) return;
    
    if (!this.cancelReason.trim()) {
      this.notificationService.error('Please provide a reason for cancellation');
      return;
    }

    this.isCancelling.set(true);

    const cancelRequests = this.bookingsToCancel.map(id => 
      this.bookingRepository.cancelBooking(id, this.cancelReason)
    );

    forkJoin(cancelRequests).subscribe({
      next: () => {
        this.notificationService.success(`Booking cancelled. Reason recorded: ${this.cancelReason}`);
        this.isCancelling.set(false);
        this.closeCancelModal();
        this.loadBookings(); // Refresh the list
      },
      error: () => {
        this.notificationService.error('Failed to cancel the booking. Please try again.');
        this.isCancelling.set(false);
      }
    });
  }

  // Feedback Methods
  openFeedbackModal(booking: GroupedBooking) {
    this.feedbackBooking = booking;
    this.feedbackRating = 0;
    this.feedbackText = '';
    this.isFeedbackModalOpen.set(true);
  }

  closeFeedbackModal() {
    this.isFeedbackModalOpen.set(false);
    this.feedbackBooking = null;
  }

  submitFeedback() {
    // Here you would typically call your backend API to save the review
    this.notificationService.success(`Thank you for rating ${this.feedbackBooking?.turfName} ${this.feedbackRating} stars!`);
    this.closeFeedbackModal();
  }

  encodeURIComponent(val: string): string {
    return encodeURIComponent(val);
  }

  formatBookingDate(startTime: string): string {
    const date = new Date(startTime);
    return date.toLocaleDateString([], { weekday: 'short', day: 'numeric', month: 'short' }) + ',';
  }

  formatTimeBlocks(slots: { startTime: string; endTime: string }[]): string {
    if (!slots || slots.length === 0) return '';

    // Sort slots by start time
    const sortedSlots = [...slots].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    
    const mergedBlocks: { start: Date, end: Date, hours: number }[] = [];
    
    for (const slot of sortedSlots) {
      const slotStart = new Date(slot.startTime);
      const slotEnd = new Date(slot.endTime);
      
      const lastBlock = mergedBlocks.length > 0 ? mergedBlocks[mergedBlocks.length - 1] : null;
      
      if (lastBlock && lastBlock.end.getTime() === slotStart.getTime()) {
        // Contiguous slot, extend the last block
        lastBlock.end = slotEnd;
        lastBlock.hours += 1;
      } else {
        // New block
        mergedBlocks.push({ start: slotStart, end: slotEnd, hours: 1 });
      }
    }

    // Format blocks
    const formatOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const parts = mergedBlocks.map(block => {
      let startStr = block.start.toLocaleTimeString([], formatOptions).toUpperCase();
      let endStr = block.end.toLocaleTimeString([], formatOptions).toUpperCase();
      
      // Clean up ":00" for a cleaner look if desired
      startStr = startStr.replace(':00', '');
      endStr = endStr.replace(':00', '');

      if (block.hours === 1) {
        return `${startStr} (1 hr)`;
      } else {
        return `${startStr} to ${endStr} (${block.hours} hr${block.hours > 1 ? 's' : ''})`;
      }
    });
    
    return parts.join(', ');
  }

  shareBooking(booking: GroupedBooking) {
    if (navigator.share) {
      navigator.share({
        title: 'TurfXpert Booking',
        text: `I just booked ${booking.turfName} on TurfXpert for ${this.formatBookingDate(booking.startTime)} at ${this.formatTimeBlocks(booking.rawSlots)}! Care to join me?`,
        url: window.location.origin
      }).catch(err => { /* Share failed */ });
    } else {
      alert('Sharing is not supported on this device/browser.');
    }
  }
}
