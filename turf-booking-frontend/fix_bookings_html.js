const fs = require('fs');

let bookingsPath = 'src/app/features/bookings/bookings.component.ts';
let bookings = fs.readFileSync(bookingsPath, 'utf8');

const newCardHTML = `<div 
          *ngFor="let booking of bookings()" 
          class="glass booking-card"
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
            <button class="btn-share btn-uniform" (click)="shareBooking(booking)" title="Share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share
            </button>
            <button class="btn-cancel btn-uniform" (click)="openCancelModal(booking.bookingIds)">Cancel Booking</button>
            <button class="btn-share btn-uniform" style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); border: 1px solid var(--primary);" (click)="openFeedbackModal(booking)">Rate Turf</button>
          </div>
        </div>`;

// Manual slicing for precision
const lines = bookings.split('\\n');
let newLines = [];
let replacing = false;
let foundStart = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Look for the start of the booking-card div
    if (line.includes('*ngFor="let booking of bookings()"') && !foundStart) {
        replacing = true;
        foundStart = true;
        // Since the previous line was \`<div\`, pop it
        if (newLines.length > 0 && newLines[newLines.length - 1].trim() === '<div') {
            newLines.pop();
        }
        
        newLines.push(newCardHTML);
    }
    
    // Stop replacing when we hit empty state
    if (replacing && line.includes('<div class="empty-state glass')) {
        replacing = false;
    }
    
    if (!replacing && !line.includes('*ngFor="let booking of bookings()"')) {
        newLines.push(line);
    }
}

fs.writeFileSync(bookingsPath, newLines.join('\\n'));
console.log('Restored HTML layout.');
