const fs = require('fs');

const path = 'src/app/features/dashboard/turf-detail/turf-detail.component.ts';
let code = fs.readFileSync(path, 'utf8');

// 1. Remove glass class from day-chip and custom-date-picker
code = code.replace(
  'class="day-chip glass"',
  'class="day-chip"'
);
code = code.replace( // Catch all instances if there are multiple
  /class="day-chip glass"/g,
  'class="day-chip"'
);

code = code.replace(
  'class="custom-date-picker glass"',
  'class="custom-date-picker"'
);

// 2. Update the emoji to SVG in custom-date-picker
code = code.replace(
  `.custom-date-picker::after {
      content: '📅';
      font-size: 1.5rem;
      pointer-events: none;
    }`,
  `.custom-date-picker::after {
      content: '';
      width: 24px;
      height: 24px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%237b39fc' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='4' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Cline x1='16' y1='2' x2='16' y2='6'%3E%3C/line%3E%3Cline x1='8' y1='2' x2='8' y2='6'%3E%3C/line%3E%3Cline x1='3' y1='10' x2='21' y2='10'%3E%3C/line%3E%3C/svg%3E");
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      pointer-events: none;
    }`
);

fs.writeFileSync(path, code);
console.log('Fixed turf-detail.component.ts');
