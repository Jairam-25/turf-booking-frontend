const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

// 1. Fix banner link
c = c.replace(
  /<div class="relative w-full h-36 rounded-\[20px\] overflow-hidden shadow-2xl bg-gradient-to-r from-\[var\(--primary\)\] to-indigo-900 flex items-center justify-between px-6 border border-white\/10">/,
  `<div class="relative w-full h-36 rounded-[20px] overflow-hidden shadow-2xl bg-gradient-to-r from-[var(--primary)] to-indigo-900 flex items-center justify-between px-6 border border-white/10 cursor-pointer transition-transform active:scale-95" (click)="navigateToOffers()">`
);

// 2. Add navigateToOffers method if missing
if (!c.includes('navigateToOffers() {')) {
  c = c.replace(
    /navigateToNotifications\(\) \{/,
    `navigateToOffers() {\n    this.router.navigate(['/offers']);\n  }\n\n  navigateToNotifications() {`
  );
}

// 3. Add mobile location modal before desktop-web-layout
if (!c.includes('<!-- Mobile Location Selector Modal -->')) {
  c = c.replace(
    /<\/div>\s*<!-- DESKTOP WEB LAYOUT -->/,
    `</div>\n
    <!-- Mobile Location Selector Modal -->
    <div class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm transition-opacity" *ngIf="isLocationSelectOpen()" (click)="toggleLocationSelect()">
      <div class="absolute bottom-0 left-0 right-0 bg-[#141A28] rounded-t-3xl border-t border-white/10 p-6 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transform transition-transform" (click)="$event.stopPropagation()">
        <div class="w-12 h-1 bg-white/20 rounded-full mx-auto mb-6"></div>
        <h3 class="text-xl font-bold text-white mb-4">Select Location</h3>
        <div class="max-h-[60vh] overflow-y-auto scrollbar-hide pr-2">
          
          <ng-container *ngIf="!viewingDistrictsForState()">
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors" (click)="selectLocation($event, '', '')" [ngClass]="{'bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]': selectedState() === '' && selectedDistrict() === '', 'hover:bg-white/5 text-slate-300': selectedState() !== '' || selectedDistrict() !== ''}">
              <span class="font-bold text-base">All Locations</span>
            </div>
            
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors flex justify-between items-center" *ngFor="let state of statesList()" (click)="openStateDistricts($event, state)" [ngClass]="{'bg-[var(--primary)]/10 border-[var(--primary)]/30 text-white': selectedState() === state, 'hover:bg-white/5 text-slate-300': selectedState() !== state}">
              <span class="font-bold text-base">{{ state }}</span>
              <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
            </div>
          </ng-container>
          
          <ng-container *ngIf="viewingDistrictsForState() as stateName">
            <div class="py-2 px-3 flex items-center gap-2 font-bold text-[var(--primary)] mb-4 cursor-pointer" (click)="backToStates($event)">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              Back to States
            </div>
            
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors" (click)="selectLocation($event, stateName, '')" [ngClass]="{'bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]': selectedState() === stateName && selectedDistrict() === '', 'hover:bg-white/5 text-slate-300': selectedState() !== stateName || selectedDistrict() !== ''}">
              <span class="font-bold text-base">All of {{ stateName }}</span>
            </div>
            
            <div class="py-3 px-4 rounded-xl border border-white/5 mb-2 cursor-pointer transition-colors" *ngFor="let dist of getDistrictsForState(stateName)" (click)="selectLocation($event, stateName, dist)" [ngClass]="{'bg-[var(--primary)]/20 border-[var(--primary)]/50 text-[var(--primary)]': selectedDistrict() === dist, 'hover:bg-white/5 text-slate-300': selectedDistrict() !== dist}">
              <span class="font-medium text-[15px]">{{ dist }}</span>
            </div>
            
            <div *ngIf="getDistrictsForState(stateName).length === 0" class="py-4 text-center text-slate-500">
              No districts available
            </div>
          </ng-container>

        </div>
      </div>
    </div>\n
    <!-- DESKTOP WEB LAYOUT -->`
  );
}

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
