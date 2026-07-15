const fs = require('fs');
const path = require('path');

const bookingsPath = path.join(__dirname, 'src/app/features/bookings/bookings.component.ts');
let content = fs.readFileSync(bookingsPath, 'utf8');

const regex = /\.status-badge\s*\{\s*font-size:\s*0\.65rem;\s*padding:\s*2px 8px;\s*\}\s*\.label\s*\{\s*font-size:\s*0\.65rem;\s*\}\s*\.value\s*\{\s*font-size:\s*0\.8rem;\s*\}\s*\.value\.price\s*\{\s*font-size:\s*0\.9rem;\s*\}/g;

content = content.replace(regex, '');

fs.writeFileSync(bookingsPath, content);
console.log('Fixed duplicate CSS.');
