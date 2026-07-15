const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/ui/turf-card.component.ts', 'utf8');

c = c.replace(
  /<div class="turf-card-mobile h-full">/,
  `<div class="turf-card-mobile h-full cursor-pointer" (click)="onBook()">`
);

c = c.replace(
  /\.turf-card-mobile \{([\s\S]*?)\}/,
  `.turf-card-mobile {$1\n      cursor: pointer;\n    }`
);

fs.writeFileSync('src/app/features/dashboard/ui/turf-card.component.ts', c);
