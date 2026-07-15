const fs = require('fs');
const path = require('path');

const dashboardPath = path.join(__dirname, 'src/app/features/dashboard/dashboard.component.ts');
let content = fs.readFileSync(dashboardPath, 'utf8');

// Add state variables
const stateVars = `
  // Pull to refresh state
  isRefreshing = signal(false);
  pullDownDistance = signal(0);
  private touchStartY = 0;
`;
content = content.replace(/words = \['Turf', 'Court', 'Pitch', 'Match', 'Arena', 'Game'\];/, stateVars + '\n  words = [\'Turf\', \'Court\', \'Pitch\', \'Match\', \'Arena\', \'Game\'];');

// Add event handlers
const eventHandlers = `
  onTouchStart(event: TouchEvent) {
    if (window.scrollY === 0) {
      this.touchStartY = event.touches[0].clientY;
    } else {
      this.touchStartY = 0;
    }
  }

  onTouchMove(event: TouchEvent) {
    if (this.touchStartY === 0 || this.isRefreshing()) return;
    
    const currentY = event.touches[0].clientY;
    const diff = currentY - this.touchStartY;
    
    if (diff > 0 && diff < 150) {
      this.pullDownDistance.set(diff);
    }
  }

  onTouchEnd() {
    if (this.pullDownDistance() > 80) {
      this.triggerRefresh();
    } else {
      this.pullDownDistance.set(0);
    }
  }

  triggerRefresh() {
    this.isRefreshing.set(true);
    this.pullDownDistance.set(80);
    
    this.loadInitialLocationsAndTurfs();
    
    setTimeout(() => {
      this.isRefreshing.set(false);
      this.pullDownDistance.set(0);
    }, 1500);
  }
`;

if (!content.includes('onTouchStart')) {
    content = content.replace('ngOnInit() {', eventHandlers + '\n\n  ngOnInit() {');
}

// Update the mobile-app-layout div
const oldDiv = '<div class="mobile-app-layout min-h-screen pb-[100px] font-sans transition-colors duration-300 bg-white dark:bg-[#0A0E1A] text-slate-900 dark:text-white">';
const newDiv = `<div class="mobile-app-layout min-h-screen pb-[100px] font-sans transition-colors duration-300 bg-white dark:bg-[#0A0E1A] text-slate-900 dark:text-white"
       (touchstart)="onTouchStart($event)" 
       (touchmove)="onTouchMove($event)" 
       (touchend)="onTouchEnd()">
       
    <!-- Custom Pull to Refresh Indicator -->
    <div class="w-full flex justify-center items-end overflow-hidden transition-all duration-300 pointer-events-none"
         [style.height.px]="pullDownDistance()">
      <div class="mb-4 bg-white dark:bg-slate-800 shadow-lg rounded-full p-2 flex items-center justify-center border border-slate-100 dark:border-slate-700"
           [style.transform]="'rotate(' + (pullDownDistance() * 3) + 'deg)'"
           [style.opacity]="pullDownDistance() / 80">
        <svg class="w-6 h-6 text-[#7b39fc]" [class.animate-spin]="isRefreshing()" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
      </div>
    </div>`;

content = content.replace(oldDiv, newDiv);

fs.writeFileSync(dashboardPath, content);
console.log('Added Pull to Refresh functionality.');
