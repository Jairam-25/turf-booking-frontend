const fs = require('fs');

let ts = fs.readFileSync('src/app/features/bookings/bookings.component.ts', 'utf8');

// 1. Replace the HTML for bookings-list
const newHtml = `
      <div class="bookings-list" *ngIf="!isLoading(); else loadingTemplate">
        <div 
          *ngFor="let booking of bookings()" 
          class="glass booking-card relative overflow-hidden"
        >
          <!-- Status Badge -->
          <div class="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-wider font-black px-2.5 py-1 rounded-bl-lg border-b border-l border-emerald-500/20 shadow-sm backdrop-blur-md">
            Confirmed
          </div>

          <div class="flex flex-col h-full">
            <div class="mb-3 pr-14">
              <h3 class="text-sm font-black truncate text-[var(--text-primary)]">{{ booking.turfName }}</h3>
              <a 
                [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(booking.turfName + ' ' + booking.location)"
                target="_blank" 
                class="text-[10px] text-[var(--primary)] flex items-center gap-1 mt-1 hover:underline font-semibold"
                title="Open in Google Maps"
              >
                <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" /><circle cx="12" cy="10.5" r="2.5" /></svg>
                View Map
              </a>
            </div>
            
            <div class="space-y-2 mb-4 flex-1 bg-black/20 dark:bg-white/5 rounded-xl p-3 border border-white/5">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-[var(--text-secondary)] font-medium">Date</span>
                <span class="text-[11px] font-bold text-[var(--text-primary)]">{{ formatBookingDate(booking.startTime) }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-[var(--text-secondary)] font-medium">Time ({{ booking.durationHours }}h)</span>
                <span class="text-[11px] font-bold text-[var(--text-primary)] truncate max-w-[90px] text-right" title="{{ formatTimeBlocks(booking.rawSlots) }}">{{ formatTimeBlocks(booking.rawSlots) }}</span>
              </div>
              <div class="w-full h-px bg-white/10 my-1"></div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-[var(--text-secondary)] font-medium">Total Paid</span>
                <span class="text-xs font-black text-[var(--primary)]">₹{{ booking.totalPrice }}</span>
              </div>
            </div>
            
            <div class="flex flex-col gap-2 mt-auto">
              <!-- Book Again Button -->
              <button class="w-full py-2 bg-[var(--primary)] hover:bg-[#6b21a8] text-white text-[11px] font-bold rounded-lg shadow-lg shadow-[var(--primary)]/30 active:scale-95 transition-all flex items-center justify-center gap-1.5" routerLink="/dashboard">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4"></path></svg>
                Book Again
              </button>
              
              <div class="flex gap-2">
                <button class="flex-1 py-1.5 bg-black/10 dark:bg-white/5 hover:bg-black/20 dark:hover:bg-white/10 border border-white/10 text-[var(--text-secondary)] text-[10px] font-bold rounded-lg active:scale-95 transition-all" (click)="openCancelModal(booking.bookingIds)">Cancel</button>
                <button class="flex-1 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 text-yellow-500 text-[10px] font-bold rounded-lg active:scale-95 transition-all" (click)="openFeedbackModal(booking)">Rate</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;

ts = ts.replace(/<div class="bookings-list" \*ngIf="!isLoading\(\); else loadingTemplate">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<ng-template #loadingTemplate>/, newHtml + '\n\n      <ng-template #loadingTemplate>');

// 2. Replace the CSS for bookings-list
ts = ts.replace(
  /\.bookings-list \{\s*display: grid;\s*grid-template-columns: repeat\(auto-fill, minmax\(320px, 1fr\)\);\s*gap: 1\.5rem;\s*\}/,
  `.bookings-list {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }`
);

// 3. Update .booking-card css
ts = ts.replace(
  /\.booking-card \{\s*padding: 1\.75rem;\s*display: flex;\s*flex-direction: column;\s*justify-content: space-between;\s*gap: 1\.5rem;\s*border-radius: 20px;\s*min-height: 280px;\s*transition: var\(--transition-smooth\);\s*\}/,
  `.booking-card {
      padding: 1rem;
      border-radius: 20px;
      min-height: 250px;
      transition: var(--transition-smooth);
      display: flex;
      flex-direction: column;
    }`
);

fs.writeFileSync('src/app/features/bookings/bookings.component.ts', ts);
console.log('Fixed bookings list UI');
