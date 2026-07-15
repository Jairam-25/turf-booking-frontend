const fs = require('fs');
const path = require('path');

const bookingsPath = path.join(__dirname, 'src/app/features/bookings/bookings.component.ts');
let content = fs.readFileSync(bookingsPath, 'utf8');

const newCss = `.bookings-list {
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
      }`;

// Use regex to replace the entire chunk of CSS in the mobile media query
content = content.replace(/\.bookings-list\s*\{\s*grid-template-columns:\s*1fr;\s*gap:\s*1rem;\s*\}\s*\.booking-card\s*\{\s*padding:\s*1rem;\s*gap:\s*1rem;\s*min-height:\s*auto;\s*\}\s*\.turf-info\s*h3\s*\{\s*font-size:\s*1\.1rem;\s*\}\s*\.location-link\s*\{\s*font-size:\s*0\.75rem;\s*\}/g, newCss);

fs.writeFileSync(bookingsPath, content);
console.log('Bookings mobile CSS updated via regex.');
