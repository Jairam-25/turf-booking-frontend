const fs = require('fs');

let bookingsPath = 'src/app/features/bookings/bookings.component.ts';
let bookings = fs.readFileSync(bookingsPath, 'utf8');

const newCardHTML = `        <div 
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

// Replace HTML
let startHtml = bookings.indexOf('<div \n          *ngFor="let booking of bookings()"');
let endHtml = bookings.indexOf('<div class="empty-state glass');
if (startHtml > -1 && endHtml > -1) {
    bookings = bookings.substring(0, startHtml) + newCardHTML + '\n\n        ' + bookings.substring(endHtml);
} else {
    console.log("HTML markers not found!");
}

// Replace CSS
const oldCss = `
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
      gap: 1rem;
      margin-top: 0.5rem;
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
`;

// Replace CSS
let cssStart = bookings.indexOf('.bookings-list {');
let cssEnd = bookings.indexOf('.empty-state {');

if (cssStart > -1 && cssEnd > -1) {
    // Keep `.bookings-list` rule, but inject the rest after it
    let cssBlockMatch = bookings.substring(cssStart, cssEnd);
    let closingBraceIndex = cssBlockMatch.indexOf('}') + 1;
    let listCss = cssBlockMatch.substring(0, closingBraceIndex);
    
    bookings = bookings.substring(0, cssStart) + listCss + '\n' + oldCss + bookings.substring(cssEnd);
} else {
    console.log("CSS markers not found!");
}

fs.writeFileSync(bookingsPath, bookings);
console.log('Restored old style completely.');
