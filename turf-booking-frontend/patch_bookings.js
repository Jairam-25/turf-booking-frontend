const fs = require('fs');
const path = 'src/app/features/bookings/bookings.component.ts';
let content = fs.readFileSync(path, 'utf8');

const searchStart = '<div \r\n          *ngFor="let booking of bookings()"';
const searchEnd = '<ng-template #loadingTemplate>';

let htmlStart = content.indexOf('<div \n          *ngFor="let booking of bookings()"');
if (htmlStart === -1) htmlStart = content.indexOf(searchStart);

const htmlEnd = content.indexOf(searchEnd);

if (htmlStart === -1 || htmlEnd === -1) {
  console.log("Could not find HTML boundaries.", htmlStart, htmlEnd);
  process.exit(1);
}

const newHtml = `<div 
          *ngFor="let booking of bookings()" 
          class="glass booking-card flex flex-col p-3 rounded-2xl relative border border-[var(--border-color)] overflow-hidden"
        >
          <!-- Compact Status Badge -->
          <div class="absolute top-2 right-2">
            <span class="status-badge !text-[9px] !px-1.5 !py-0.5 !rounded">Confirmed</span>
          </div>
          
          <!-- Compact Header -->
          <div class="pr-16 mb-2">
            <h3 class="font-bold text-[14px] leading-tight truncate text-[var(--text-primary)] m-0">{{ booking.turfName }}</h3>
            <a 
              [href]="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(booking.turfName + ' ' + booking.location)"
              target="_blank" 
              class="flex items-center text-[10px] text-slate-400 hover:text-slate-300 mt-1 truncate"
              title="Open in Google Maps"
            >
              <svg class="w-3 h-3 mr-1 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" /><circle cx="12" cy="10.5" r="2.5" /></svg>
              <span class="truncate">Location View ↗</span>
            </a>
          </div>
          
          <!-- Details Grid (Compact) -->
          <div class="bg-black/5 dark:bg-white/5 rounded-lg p-2 mb-3 space-y-1">
            <div class="flex justify-between items-center text-[10px]">
              <span class="text-slate-500">Date</span>
              <span class="font-bold text-[var(--text-primary)] truncate pl-1">{{ formatBookingDate(booking.startTime).replace(',', '') }}</span>
            </div>
            <div class="flex justify-between items-center text-[10px]">
              <span class="text-slate-500">Time</span>
              <span class="font-bold text-[var(--text-primary)] truncate pl-1">{{ formatTimeBlocks(booking.rawSlots).split('(')[0].trim() }}</span>
            </div>
            <div class="flex justify-between items-center text-[10px] pt-1 border-t border-slate-500/20 mt-1">
              <span class="text-slate-500">Total</span>
              <span class="font-bold text-[var(--primary)] truncate pl-1">₹{{ booking.totalPrice }}</span>
            </div>
          </div>
          
          <!-- Actions Grid (Compact) -->
          <div class="mt-auto flex flex-col gap-1.5">
            <div class="flex gap-1.5 w-full">
              <button class="flex-1 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-[10px] font-bold py-1.5 rounded-md flex items-center justify-center transition-colors text-[var(--text-primary)]" (click)="shareBooking(booking)">
                Share
              </button>
              <button class="flex-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-bold py-1.5 rounded-md flex items-center justify-center transition-colors border border-red-500/20" (click)="openCancelModal(booking.bookingIds)">
                Cancel
              </button>
            </div>
            <button class="w-full bg-[var(--primary)]/10 hover:bg-[var(--primary)]/20 text-[var(--primary)] text-[10px] font-bold py-1.5 rounded-md flex items-center justify-center transition-colors border border-[var(--primary)]/30" (click)="openFeedbackModal(booking)">
              Rate Turf
            </button>
          </div>
        </div>

        <div class="empty-state glass col-span-2" *ngIf="bookings().length === 0">
          <h3>No bookings found</h3>
          <p>You haven't booked any turfs yet. Start playing today!</p>
          <button class="btn-premium btn-uniform" routerLink="/dashboard">Book a Turf</button>
        </div>
      </div>

      `;

content = content.slice(0, htmlStart) + newHtml + content.slice(htmlEnd);

fs.writeFileSync(path, content);
console.log("Updated bookings layout");
