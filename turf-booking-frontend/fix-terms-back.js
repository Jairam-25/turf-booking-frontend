const fs = require('fs');

// 1. Fix Terms of Service TS
let ts = fs.readFileSync('src/app/features/terms-of-service/terms-of-service.ts', 'utf8');
if (!ts.includes('Location')) {
  ts = ts.replace(/import \{ Component \} from '@angular\/core';/, `import { Component, inject } from '@angular/core';\nimport { Location } from '@angular/common';`);
  ts = ts.replace(/export class TermsOfService \{\}/, `export class TermsOfService {\n  private location = inject(Location);\n\n  goBack() {\n    this.location.back();\n  }\n}`);
  fs.writeFileSync('src/app/features/terms-of-service/terms-of-service.ts', ts);
}

// 2. Fix Terms of Service HTML
let html = fs.readFileSync('src/app/features/terms-of-service/terms-of-service.html', 'utf8');
if (!html.includes('goBack()')) {
  html = html.replace(
    /<div class="relative z-10">/,
    `<div class="relative z-10">\n      <button (click)="goBack()" class="flex items-center gap-2 text-[#7b39fc] text-sm font-bold bg-[#7b39fc]/10 px-4 py-2 rounded-lg hover:bg-[#7b39fc]/20 transition-colors mb-6 w-max">\n        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>\n        Go Back\n      </button>`
  );
  fs.writeFileSync('src/app/features/terms-of-service/terms-of-service.html', html);
}

console.log('Fixed terms of service.');
