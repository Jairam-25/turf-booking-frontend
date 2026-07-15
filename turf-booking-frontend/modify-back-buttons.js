const fs = require('fs');
const path = require('path');

function replaceFileContent(filePath, replacer) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let newContent = replacer(content);
    if (newContent !== content) {
      fs.writeFileSync(filePath, newContent, 'utf8');
      console.log('Updated', filePath);
    }
  } catch (e) {
    console.log('Error reading/writing', filePath, e.message);
  }
}

// 1. Liked Turfs TS
replaceFileContent('src/app/features/liked-turfs/liked-turfs.ts', (c) => {
  if (!c.includes('@angular/common')) return c;
  if (!c.includes('Location')) {
    c = c.replace(/import \{ CommonModule \} from '@angular\/common';/, `import { CommonModule, Location } from '@angular/common';`);
  }
  if (!c.includes('private location: Location')) {
    c = c.replace(/private turfRepository: TurfRepository/, `private turfRepository: TurfRepository,\n    private location: Location`);
  }
  if (!c.includes('goBack()')) {
    c = c.replace(/ngOnInit\(\) \{/, `goBack() {\n    this.location.back();\n  }\n\n  ngOnInit() {`);
  }
  return c;
});

// Liked Turfs HTML
replaceFileContent('src/app/features/liked-turfs/liked-turfs.html', (c) => {
  if (c.includes('Explore More') && !c.includes('goBack()')) {
    c = c.replace(
      /<a routerLink="\/dashboard" class="text-\[#7b39fc\] text-sm font-semibold hover:underline bg-\[#7b39fc\]\/10 px-4 py-2 rounded-lg w-full text-center">\s*Explore More\s*<\/a>/s,
      `<button (click)="goBack()" class="flex items-center justify-center gap-2 text-[#7b39fc] text-sm font-bold bg-[#7b39fc]/10 px-4 py-2 rounded-lg w-full hover:bg-[#7b39fc]/20 transition-colors">
         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
         Go Back
       </button>`
    );
  }
  return c;
});

// 2. Bookings TS/HTML
replaceFileContent('src/app/features/bookings/bookings.component.ts', (c) => {
  if (!c.includes('Location')) {
    c = c.replace(/import \{ CommonModule \} from '@angular\/common';/, `import { CommonModule, Location } from '@angular/common';`);
  }
  // Remove routerLink and add (click)="goBack()"
  c = c.replace(/routerLink="\/dashboard"/, `(click)="goBack()"`);
  c = c.replace(/Back to Book Turf/, `Go Back`);
  
  if (!c.includes('goBack()')) {
    // Inject Location using inject() or constructor
    if (c.includes('constructor(')) {
      c = c.replace(/constructor\(/, `constructor(private location: Location, `);
    } else {
      c = c.replace(/export class BookingsComponent implements OnInit \{/, `export class BookingsComponent implements OnInit {\n  private location = inject(Location);\n`);
      if (!c.includes('inject } from')) {
        c = c.replace(/import \{ Component/, `import { Component, inject`);
      }
    }
    c = c.replace(/ngOnInit\(\) \{/, `goBack() {\n    this.location.back();\n  }\n\n  ngOnInit() {`);
  }
  return c;
});

// 3. Privacy Policy TS
replaceFileContent('src/app/features/privacy-policy/privacy-policy.ts', (c) => {
  if (!c.includes('Location')) {
    c = c.replace(/import \{ Component \} from '@angular\/core';/, `import { Component, inject } from '@angular/core';\nimport { Location } from '@angular/common';`);
  }
  if (!c.includes('goBack()')) {
    c = c.replace(/export class PrivacyPolicy \{/, `export class PrivacyPolicy {\n  private location = inject(Location);\n\n  goBack() {\n    this.location.back();\n  }\n`);
  }
  return c;
});

// Privacy Policy HTML
replaceFileContent('src/app/features/privacy-policy/privacy-policy.html', (c) => {
  if (!c.includes('goBack()')) {
    c = c.replace(
      /<h1 class="text-3xl font-bold text-\[var\(--text-primary\)\] mb-4">Privacy Policy<\/h1>/,
      `<button (click)="goBack()" class="flex items-center gap-2 text-[#7b39fc] text-sm font-bold bg-[#7b39fc]/10 px-4 py-2 rounded-lg hover:bg-[#7b39fc]/20 transition-colors mb-6 w-max">
         <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
         Go Back
       </button>\n      <h1 class="text-3xl font-bold text-[var(--text-primary)] mb-4">Privacy Policy</h1>`
    );
  }
  return c;
});

// 4. Support TS
replaceFileContent('src/app/features/support/support.component.ts', (c) => {
  if (!c.includes('Location')) {
    c = c.replace(/import \{ Component \} from '@angular\/core';/, `import { Component, inject } from '@angular/core';\nimport { Location } from '@angular/common';`);
  }
  
  if (!c.includes('goBack()')) {
    if (c.includes('export class SupportComponent')) {
      c = c.replace(/export class SupportComponent (.*)\{/, `export class SupportComponent $1{\n  private location = inject(Location);\n\n  goBack() {\n    this.location.back();\n  }\n`);
    }
  }
  
  if (c.includes('routerLink="/dashboard"') && !c.includes('goBack()')) {
     // If there's an inline template
     c = c.replace(/routerLink="\/dashboard"/g, `(click)="goBack()"`);
  }
  return c;
});

// 5. Reviews TS
replaceFileContent('src/app/features/reviews/reviews.component.ts', (c) => {
  if (!c.includes('Location')) {
    c = c.replace(/import \{ Component \} from '@angular\/core';/, `import { Component, inject } from '@angular/core';\nimport { Location } from '@angular/common';`);
  }
  
  if (!c.includes('goBack()')) {
    if (c.includes('export class ReviewsComponent')) {
      c = c.replace(/export class ReviewsComponent (.*)\{/, `export class ReviewsComponent $1{\n  private location = inject(Location);\n\n  goBack() {\n    this.location.back();\n  }\n`);
    }
  }
  
  if (c.includes('routerLink="/dashboard"')) {
     c = c.replace(/routerLink="\/dashboard"/g, `(click)="goBack()"`);
  }
  return c;
});

