const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

// 1. Categories "See All"
c = c.replace(
  /<h3 class="text-\[18px\] font-bold text-white">Categories<\/h3>\s*<span class="text-\[12px\] text-\[var\(--primary\)\] font-bold tracking-wide uppercase cursor-pointer">See All<\/span>/,
  `<h3 class="text-[18px] font-bold text-white">Categories</h3>
        <span class="text-[12px] text-[var(--primary)] font-bold tracking-wide uppercase cursor-pointer active:scale-95 transition-transform" (click)="selectGame('All')">See All</span>`
);

// 2. Nearby Arenas "See All"
c = c.replace(
  /<h3 class="text-\[18px\] font-bold text-white">Nearby Arenas<\/h3>\s*<span class="text-\[12px\] text-\[var\(--primary\)\] font-bold tracking-wide uppercase cursor-pointer">See All<\/span>/,
  `<h3 class="text-[18px] font-bold text-white">Nearby Arenas</h3>
        <span class="text-[12px] text-[var(--primary)] font-bold tracking-wide uppercase cursor-pointer active:scale-95 transition-transform" (click)="resetFilters()">See All</span>`
);

// 3. Add Mobile Map toggle and Mobile Map View before <!-- Mobile Location Selector Modal -->
if (!c.includes('toggleMobileViewMode()')) {
  c = c.replace(
    /<!-- Mobile Location Selector Modal -->/,
    `<!-- Mobile Map View -->
    <div *ngIf="viewMode() === 'map' && !isLoading()" class="px-5 pb-5">
      <div class="w-full h-[60vh] rounded-[24px] overflow-hidden relative z-10 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
         <div id="turf-map-mobile" class="w-full h-full bg-slate-900"></div>
      </div>
    </div>
    
    <!-- Floating Map/List Toggle for Mobile -->
    <div class="fixed bottom-[90px] left-1/2 transform -translate-x-1/2 z-[90]">
      <button class="bg-[#1e293b] text-white px-5 py-3 rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.6)] flex items-center gap-2 border border-white/10 active:scale-95 transition-transform" (click)="toggleMobileViewMode()">
        <span class="font-bold text-[13px] tracking-wide">{{ viewMode() === 'grid' ? 'Map' : 'List' }}</span>
        <svg *ngIf="viewMode() === 'grid'" class="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
        <svg *ngIf="viewMode() === 'map'" class="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
      </button>
    </div>

    <!-- Mobile Location Selector Modal -->`
  );
}

// 4. Update initMap() to handle dynamic ID
c = c.replace(
  /const mapEl = document\.getElementById\('turf-map'\);\s*if \(!mapEl\) return;\s*this\.map = L\.map\('turf-map', \{ attributionControl: false \}\)\.setView\(\[13\.0827, 80\.2707\], 10\);/,
  `const mapId = document.body.classList.contains('is-mobile-app') ? 'turf-map-mobile' : 'turf-map';
  const mapEl = document.getElementById(mapId);
  if (!mapEl) return;

  this.map = L.map(mapId, { attributionControl: false }).setView([13.0827, 80.2707], 10);`
);

// 5. Add new class methods
if (!c.includes('resetFilters() {')) {
  c = c.replace(
    /toggleFilter\(\) \{/,
    `resetFilters() {
    this.searchTerm.set('');
    this.selectedGame.set('All');
    this.maxPrice.set(5000);
    this.minRating.set(0);
    this.selectedState.set('');
    this.selectedDistrict.set('');
    this.selectedLocation.set('');
    this.loadTurfs();
  }

  toggleMobileViewMode() {
    this.setViewMode(this.viewMode() === 'grid' ? 'map' : 'grid');
  }

  toggleFilter() {`
  );
}

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
