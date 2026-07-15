const fs = require('fs');

// Fix BookingsComponent
let bk = fs.readFileSync('src/app/features/bookings/bookings.component.ts', 'utf8');
if (!bk.includes('goBack()')) {
  // It seems goBack() wasn't added because it couldn't find `ngOnInit() {` properly?
  // Let's inject it into `export class BookingsComponent`
  bk = bk.replace(
    /export class BookingsComponent implements OnInit \{([\s\S]*?)ngOnInit\(\) \{/,
    `export class BookingsComponent implements OnInit {$1goBack() {\n    this.location.back();\n  }\n\n  ngOnInit() {`
  );
  fs.writeFileSync('src/app/features/bookings/bookings.component.ts', bk);
}

// Fix SupportComponent
let sup = fs.readFileSync('src/app/features/support/support.component.ts', 'utf8');
if (!sup.includes('inject }')) {
  sup = sup.replace(/import \{ Component(.*?)\} from '@angular\/core';/, `import { Component$1, inject } from '@angular/core';`);
  fs.writeFileSync('src/app/features/support/support.component.ts', sup);
}

// Fix ReviewsComponent
let rev = fs.readFileSync('src/app/features/reviews/reviews.component.ts', 'utf8');
if (!rev.includes('inject }')) {
  rev = rev.replace(/import \{ Component(.*?)\} from '@angular\/core';/, `import { Component$1, inject } from '@angular/core';`);
  fs.writeFileSync('src/app/features/reviews/reviews.component.ts', rev);
}

console.log("Fixed TS errors");
