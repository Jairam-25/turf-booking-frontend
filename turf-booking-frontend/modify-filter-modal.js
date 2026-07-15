const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

// 1. Remove the inline filter panel
const inlineFilterRegex = /<!-- Mobile Filter Panel -->\s*<div class="mt-4 bg-white dark:bg-slate-800\/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl border dark:border-white\/10" \[ngClass\]="\{'max-h-0 opacity-0 invisible': !isFilterOpen\(\), 'max-h-\[300px\] opacity-100 p-4 visible': isFilterOpen\(\)\}">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/;

// Wait, the HTML structure is:
//       <!-- Search & Filter Row -->
//       <div class="flex items-center gap-3"> ... </div>
//       <!-- Mobile Filter Panel -->
//       <div ...> ... </div>
//     </div> <!-- end of mobile navbar header -->

// Let's explicitly replace the Mobile Filter Panel using a safe replacement
c = c.replace(/<!-- Mobile Filter Panel -->[\s\S]*?<\/div>\s*<\/div>\s*<!-- Banner Slider -->/, 
`    </div>
  
    <!-- Banner Slider -->`);


// 2. Add the new Filter Modal right before <!-- Mobile Location Selector Modal -->
const filterModalHtml = `
    <!-- Filter Modal (Full Screen / Bottom Sheet) -->
    <div class="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm transition-opacity flex items-end justify-center" *ngIf="isFilterOpen()" (click)="toggleFilter()">
      <div class="w-full h-[90vh] bg-[#f8f9fa] dark:bg-[#0A0E1A] rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.3)] flex flex-col relative overflow-hidden" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="flex items-center p-5 bg-[#f8f9fa] dark:bg-[#121212] rounded-t-3xl">
          <button class="p-1 -ml-2" (click)="toggleFilter()">
            <svg class="w-6 h-6 text-slate-800 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          </button>
          <h2 class="text-xl font-bold ml-2 text-slate-900 dark:text-white">Filters</h2>
        </div>
        
        <!-- Content -->
        <div class="flex-1 overflow-y-auto px-5 pt-2 pb-32">
          <div class="bg-white dark:bg-[#1A1F2E] rounded-[32px] p-6 shadow-sm border border-slate-100 dark:border-white/5 space-y-8">
            
            <!-- Availability Dummy Toggle -->
            <div class="flex justify-between items-center">
              <div>
                <p class="text-[13px] text-slate-400 font-semibold mb-1">Availability</p>
                <div class="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-white/5 rounded-full border border-slate-100 dark:border-white/10 text-sm font-bold text-slate-700 dark:text-slate-200">
                  This week
                  <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-[13px] font-bold text-slate-400">Immediate</span>
                <div class="w-12 h-7 bg-[#38bdf8] rounded-full flex items-center justify-end px-1 cursor-pointer">
                  <div class="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                </div>
              </div>
            </div>

            <!-- Price Range -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Fees Range Per schedule</p>
              <div class="flex justify-between mb-2">
                <span class="text-[13px] font-bold text-slate-700 dark:text-slate-300">INR 500 - {{ maxPrice() }} Rs</span>
              </div>
              <input type="range" class="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-800 dark:accent-[#4ade80]" min="500" max="5000" step="100" [value]="maxPrice()" (input)="onPriceChange($event)">
            </div>
            
            <!-- Sports -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Sports</p>
              <div class="flex flex-wrap gap-2.5">
                <button *ngFor="let game of gameTypes" 
                        class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border"
                        [ngClass]="selectedGame() === game ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5'"
                        (click)="selectGame(game)">
                  {{ game }}
                </button>
              </div>
            </div>

            <!-- Rating -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Rating</p>
              <div class="flex flex-wrap gap-2.5">
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border flex items-center gap-1" [ngClass]="minRating() === 4 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectRating(4)">4+ <span class="text-[#fbbf24] text-lg leading-none">★</span></button>
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border flex items-center gap-1" [ngClass]="minRating() === 5 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectRating(5)">5+ <span class="text-[#fbbf24] text-lg leading-none">★</span></button>
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border" [ngClass]="minRating() === 0 ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectRating(0)">All</button>
              </div>
            </div>

            <!-- Sort By -->
            <div>
              <p class="text-[13px] text-slate-400 font-semibold mb-3">Sort By</p>
              <div class="flex flex-wrap gap-2.5">
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border" [ngClass]="sortBy() === 'recommended' ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectSort('recommended')">Recommended</button>
                <button class="px-5 py-2.5 rounded-[20px] text-[13px] font-bold transition-all border" [ngClass]="sortBy() === 'price_asc' ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-white shadow-sm' : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50'" (click)="selectSort('price_asc')">Lowest Price</button>
              </div>
            </div>

          </div>
        </div>

        <!-- Footer Actions -->
        <div class="absolute bottom-0 left-0 right-0 p-5 bg-[#f8f9fa] dark:bg-[#0A0E1A] flex gap-4 z-10 items-center justify-between shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
          <button class="flex-1 py-4 bg-[#0ea5e9] dark:bg-[#4ade80] text-white rounded-full font-bold text-[16px] shadow-lg active:scale-95 transition-transform" (click)="resetFiltersAndScroll(); toggleFilter()">Reset</button>
          <button class="flex-1 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-full font-bold text-[16px] border border-slate-200 dark:border-white/10 shadow-sm active:scale-95 transition-transform" (click)="toggleFilter()">Apply</button>
        </div>
      </div>
    </div>
    
    <!-- Mobile Location Selector Modal -->`;

c = c.replace(/<!-- Mobile Location Selector Modal -->/, filterModalHtml);

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
