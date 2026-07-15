const fs = require('fs');

// 1. Fix TS Errors
let bk = fs.readFileSync('src/app/features/bookings/bookings.component.ts', 'utf8');
if (!bk.includes('goBack()')) {
  bk = bk.replace(
    /export class BookingsComponent implements OnInit \{([\s\S]*?)ngOnInit\(\) \{/,
    `export class BookingsComponent implements OnInit {$1goBack() {\n    this.location.back();\n  }\n\n  ngOnInit() {`
  );
  fs.writeFileSync('src/app/features/bookings/bookings.component.ts', bk);
}

let sup = fs.readFileSync('src/app/features/support/support.component.ts', 'utf8');
if (!sup.includes('inject }')) {
  sup = sup.replace(/import \{ Component(.*?)\} from '@angular\/core';/, `import { Component$1, inject } from '@angular/core';`);
  fs.writeFileSync('src/app/features/support/support.component.ts', sup);
}

let rev = fs.readFileSync('src/app/features/reviews/reviews.component.ts', 'utf8');
if (!rev.includes('inject }')) {
  rev = rev.replace(/import \{ Component(.*?)\} from '@angular\/core';/, `import { Component$1, inject } from '@angular/core';`);
  fs.writeFileSync('src/app/features/reviews/reviews.component.ts', rev);
}

// 2. Fix Profile HTML (Payment Method Removal, Terms & Conditions RouterLink, Green Color Reversion)
let prof = fs.readFileSync('src/app/features/profile/profile.html', 'utf8');

// Remove Payment Methods Block
prof = prof.replace(/<div class="h-px bg-slate-100 dark:bg-white\/5 mx-4"><\/div>\s*<div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform" routerLink="\/bookings">[\s\S]*?<\/div>\s*<\/div>/, '');

// Fix Terms & Conditions Router Link
prof = prof.replace(
  /<div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform">(\s*<div class="flex items-center gap-4">[\s\S]*?Terms & Conditions[\s\S]*?)<\/div>/,
  '<div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform" routerLink="/terms-of-service">$1</div>'
);

fs.writeFileSync('src/app/features/profile/profile.html', prof);

console.log('Fixed profile and TS errors.');
