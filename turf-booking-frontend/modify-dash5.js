const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

// 1. Move Map stuff inside `.mobile-app-layout`
// Remove the current ones:
c = c.replace(/<!-- Mobile Map View -->[\s\S]*?<!-- Mobile Location Selector Modal -->/, '<!-- Mobile Location Selector Modal -->');

// Insert them right before <!-- Empty State --> in the Popular Turfs section
c = c.replace(
  /<!-- Empty State -->/,
  `<!-- Mobile Map View -->
      <div *ngIf="viewMode() === 'map' && !isLoading()" class="w-full h-[60vh] rounded-[24px] overflow-hidden relative z-10 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mt-4">
         <div id="turf-map-mobile" class="w-full h-full bg-slate-900"></div>
      </div>

      <!-- Floating Map/List Toggle for Mobile -->
      <div class="fixed left-1/2 transform -translate-x-1/2 z-[90]" style="bottom: 110px;">
        <button class="bg-[#1e293b] text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center gap-2 border border-white/10 active:scale-95 transition-transform" (click)="toggleMobileViewMode()">
          <span class="font-bold text-[13px] tracking-wide">{{ viewMode() === 'grid' ? 'Map' : 'List' }}</span>
          <svg *ngIf="viewMode() === 'grid'" class="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
          <svg *ngIf="viewMode() === 'map'" class="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
        </button>
      </div>

      <!-- Empty State -->`
);

// 2. Hide Turf Cards when viewMode is map
c = c.replace(
  /<div class="flex flex-col gap-5" \*ngIf="!isLoading\(\)">\s*<app-turf-card \*ngFor="let turf of turfs\(\)" \[turf\]="turf"><\/app-turf-card>\s*<\/div>/,
  `<div class="flex flex-col gap-5" *ngIf="!isLoading() && viewMode() === 'grid'">
        <app-turf-card *ngFor="let turf of turfs()" [turf]="turf"></app-turf-card>
      </div>`
);

// 3. Update selectAllGamesAndScroll and resetFiltersAndScroll to use better scrolling
// Sometimes window.scrollTo isn't right if body is scrollable or html is.
c = c.replace(
  /window\.scrollTo\(\{ top: document\.body\.scrollHeight, behavior: 'smooth' \}\);/,
  `window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });`
);
c = c.replace(
  /window\.scrollTo\(\{ top: 500, behavior: 'smooth' \}\);/,
  `window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });`
);

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
