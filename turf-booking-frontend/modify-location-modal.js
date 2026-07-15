const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

c = c.replace(
  /<!-- Mobile Location Selector Modal --><!-- Mobile Location Selector Modal -->\s*<div class="fixed inset-0 z-\[100\]/g,
  `<!-- Mobile Location Selector Modal -->\n    <div class="fixed inset-0 z-[2000]`
);

// Fallback if the comment isn't exactly like that
c = c.replace(
  /<div class="fixed inset-0 z-\[100\] bg-black\/60 backdrop-blur-sm transition-opacity" \*ngIf="isLocationSelectOpen\(\)"/g,
  `<div class="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm transition-opacity" *ngIf="isLocationSelectOpen()"`
);

// Also add pb-20 to the inner scroll container so they can scroll past the bottom easily
c = c.replace(
  /<div class="max-h-\[60vh\] overflow-y-auto scrollbar-hide pr-2">/,
  `<div class="max-h-[60vh] overflow-y-auto scrollbar-hide pr-2 pb-10">`
);

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
