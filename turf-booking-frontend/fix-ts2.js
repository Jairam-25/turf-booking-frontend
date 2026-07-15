const fs = require('fs');

// 1. Fix Profile HTML closing div
let prof = fs.readFileSync('src/app/features/profile/profile.html', 'utf8');
if (prof.includes('<ng-container *ngIf="viewState() === \'menu\'">') && prof.includes('</ng-container>') && prof.split('<div').length > prof.split('</div').length) {
  // It's missing a </div>. Let's just append it before </ng-container>
  prof = prof.replace(/\s*<\/ng-container>\s*<!-- EDIT STATE -->/, '\n      </div>\n    </div>\n  </ng-container>\n\n  <!-- EDIT STATE -->');
  fs.writeFileSync('src/app/features/profile/profile.html', prof);
} else {
  // Actually, wait, let me just fix the regex I used before.
  // My previous regex was:
  // /<div class="h-px bg-slate-100 dark:bg-white\/5 mx-4"><\/div>\s*<div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform" routerLink="\/bookings">[\s\S]*?<\/div>\s*<\/div>/
  // That replaced two closing divs. The last </div> was for the parent block. Let's just put it back.
  prof = prof.replace(/\s*<\/ng-container>\s*<!-- EDIT STATE -->/, '\n    </div>\n  </ng-container>\n\n  <!-- EDIT STATE -->');
  fs.writeFileSync('src/app/features/profile/profile.html', prof);
}

// 2. Fix Reviews TS
let rev = fs.readFileSync('src/app/features/reviews/reviews.component.ts', 'utf8');
if (!rev.includes('Location } from \'@angular/common\'')) {
  rev = rev.replace(/import \{ CommonModule \} from '@angular\/common';/, `import { CommonModule, Location } from '@angular/common';`);
  fs.writeFileSync('src/app/features/reviews/reviews.component.ts', rev);
}

// 3. Fix Support TS
let sup = fs.readFileSync('src/app/features/support/support.component.ts', 'utf8');
if (!sup.includes('Location } from \'@angular/common\'')) {
  sup = sup.replace(/import \{ CommonModule \} from '@angular\/common';/, `import { CommonModule, Location } from '@angular/common';`);
  fs.writeFileSync('src/app/features/support/support.component.ts', sup);
}

console.log('Fixed imports and closing div');
