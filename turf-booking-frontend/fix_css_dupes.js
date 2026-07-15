const fs = require('fs');
const path = require('path');

const bookingsPath = path.join(__dirname, 'src/app/features/bookings/bookings.component.ts');
let content = fs.readFileSync(bookingsPath, 'utf8');

content = content.replace(`.status-badge {
        font-size: 0.65rem;
        padding: 2px 8px;
      }
      .label {
        font-size: 0.65rem;
      }
      .value {
        font-size: 0.8rem;
      }
      .value.price {
        font-size: 0.9rem;
      }`, '');

fs.writeFileSync(bookingsPath, content);
console.log('Duplicate CSS removed.');
