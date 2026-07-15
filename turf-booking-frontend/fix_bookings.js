const fs = require('fs');
const path = require('path');

const bookingsPath = path.join(__dirname, 'src/app/features/bookings/bookings.component.ts');
let content = fs.readFileSync(bookingsPath, 'utf8');

const oldCss = `.bookings-list {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .booking-card {
        padding: 1rem;
        gap: 1rem;
        min-height: auto;
      }`;

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

content = content.replace(oldCss, newCss);

fs.writeFileSync(bookingsPath, content);
console.log('Bookings mobile CSS updated.');
