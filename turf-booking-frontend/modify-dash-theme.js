const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

const newMobileLayout = `  <!-- MOBILE APP LAYOUT (TurfXpert Premium) -->
  <div class="mobile-app-layout min-h-screen pb-[100px] font-sans transition-colors duration-300 bg-white dark:bg-[#0A0E1A] text-slate-900 dark:text-white">
    
    <!-- Mobile Navbar Header -->
    <div class="px-5 pt-12 pb-4 sticky top-0 z-50 bg-white/95 dark:bg-[#0A0E1A]/95 backdrop-blur-xl">
      <div class="flex justify-between items-center mb-5">
        <!-- User Info & Location -->
        <div class="flex flex-col">
          <span class="text-lg font-bold">Hi, {{ userName() }}</span>
          <div class="flex items-center gap-1 mt-1 cursor-pointer" (click)="toggleLocationSelect()">
            <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span class="text-[13px] font-medium text-slate-500">{{ selectedLocation() || 'Select Location' }}</span>
          </div>
        </div>
        
        <!-- Action Icons (Theme, Favorites, Notifications) -->
        <div class="flex items-center gap-4">
          <button (click)="toggleTheme()" class="text-slate-400 hover:text-slate-600 transition-colors">
            <svg *ngIf="isDarkMode()" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            <svg *ngIf="!isDarkMode()" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          </button>
          <button class="text-slate-400 hover:text-slate-600 transition-colors" (click)="navigateToLiked()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>
          <button class="text-slate-400 hover:text-slate-600 transition-colors relative" (click)="navigateToNotifications()">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
            </svg>
            <div class="absolute top-0 right-1 w-2 h-2 bg-[#ea5b5b] rounded-full"></div>
          </button>
        </div>
      </div>

      <!-- Search & Filter Row -->
      <div class="flex items-center gap-3">
        <div class="relative bg-[#f3f9f0] dark:bg-slate-800/40 rounded-full flex items-center p-1 flex-grow transition-all">
          <svg class="w-5 h-5 text-slate-400 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input class="bg-transparent border-none text-[14px] font-medium p-3 w-full outline-none text-slate-800 dark:text-white placeholder-slate-400" placeholder="What sport are you looking for?" [value]="searchTerm()" #mobileSearch (input)="onSearch(mobileSearch.value)" />
        </div>
        <button class="text-slate-500 hover:text-slate-800 transition-colors p-2" (click)="toggleFilter()">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        </button>
      </div>

      <!-- Mobile Filter Panel -->
      <div class="mt-4 bg-white dark:bg-slate-800/80 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl border dark:border-white/10" [ngClass]="{'max-h-0 opacity-0 invisible': !isFilterOpen(), 'max-h-[300px] opacity-100 p-4 visible': isFilterOpen()}">
        <h4 class="text-sm font-bold mb-4">Refine Results</h4>
        <div class="flex flex-col gap-4">
           <div>
             <div class="flex justify-between mb-2">
               <label class="text-[13px] font-semibold text-slate-500 block">Max Price</label>
               <span class="text-[13px] font-bold text-[#4ade80]">₹{{ maxPrice() }}</span>
             </div>
             <input type="range" class="w-full accent-[#4ade80]" min="500" max="5000" step="100" [value]="maxPrice()" (input)="onPriceChange($event)">
           </div>
           <div class="flex gap-3 mt-2">
             <button class="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-colors" [ngClass]="{'bg-[#4ade80] text-white': sortBy() === 'price_asc', 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300': sortBy() !== 'price_asc'}" (click)="selectSort('price_asc')">Price: Low to High</button>
             <button class="flex-1 py-2.5 rounded-xl text-[12px] font-bold transition-colors" [ngClass]="{'bg-[#4ade80] text-white': sortBy() === 'rating_desc', 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300': sortBy() !== 'rating_desc'}" (click)="selectSort('rating_desc')">Top Rated</button>
           </div>
        </div>
      </div>
    </div>
  
    <!-- Banner Slider -->
    <div class="px-5 mb-8">
      <div class="relative w-full rounded-[24px] overflow-hidden shadow-lg bg-gradient-to-r from-[#4ade80] to-[#22c55e] px-6 py-6 cursor-pointer transition-transform active:scale-95 flex" (click)="navigateToOffers()">
        <div class="z-10 w-2/3">
          <p class="text-[11px] font-medium text-white/90 mb-1">Batdoor Badminton Academy</p>
          <h2 class="text-[20px] font-bold text-white leading-tight mb-4">Get Special offer<br><span class="font-normal text-sm">Up to</span> 40%</h2>
          <button class="bg-white text-[#22c55e] text-xs font-bold px-4 py-2 rounded-full shadow-sm">View details</button>
        </div>
        <div class="absolute right-[-20px] top-1/2 transform -translate-y-1/2 opacity-90 text-[100px]">⚽</div>
      </div>
    </div>
  
    <!-- Categories -->
    <div class="px-0 mb-8">
      <div class="flex justify-between items-center px-5 mb-4">
        <h3 class="text-[18px] font-bold">Categories</h3>
        <span class="text-[12px] text-[#9b51e0] font-bold uppercase cursor-pointer active:scale-95 transition-transform" (click)="selectAllGamesAndScroll()">See All</span>
      </div>
      <div class="flex gap-4 overflow-x-auto px-5 pb-2 scrollbar-hide snap-x">
        
        <div class="flex flex-col items-center gap-2 min-w-[72px] snap-start cursor-pointer" (click)="selectGame('All')">
          <div class="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-xl transition-all duration-300"
               [ngClass]="selectedGame() === 'All' ? 'bg-slate-900 text-white shadow-md' : 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-white/5 text-slate-900 dark:text-white'">
            <span class="font-bold text-sm">All</span>
          </div>
        </div>

        <div class="flex flex-col items-center gap-2 min-w-[72px] snap-start cursor-pointer" *ngFor="let game of ['Cricket', 'Football', 'Badminton', 'Basketball', 'Volleyball']" (click)="selectGame(game)">
          <div class="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 relative"
               [ngClass]="{
                 'bg-[#eef2fc] text-[#5b73e8]': game === 'Cricket',
                 'bg-[#fdebea] text-[#ea5b5b]': game === 'Football',
                 'bg-[#fdf4e7] text-[#f2a74c]': game === 'Badminton',
                 'bg-[#fdf0e7] text-[#ea7f41]': game === 'Basketball',
                 'bg-[#f3ebfe] text-[#9b51e0]': game === 'Volleyball',
                 'shadow-lg scale-105 border-2 border-current': selectedGame() === game
               }">
            <span *ngIf="game === 'Cricket'">🏏</span>
            <span *ngIf="game === 'Football'">⚽</span>
            <span *ngIf="game === 'Badminton'">🏸</span>
            <span *ngIf="game === 'Tennis'">🎾</span>
            <span *ngIf="game === 'Volleyball'">🏐</span>
            <span *ngIf="game === 'Basketball'">🏀</span>
          </div>
          <span class="text-[12px] font-medium transition-colors" [class.font-bold]="selectedGame() === game"
            [ngClass]="{
                 'text-[#5b73e8]': game === 'Cricket' && selectedGame() === game,
                 'text-[#ea5b5b]': game === 'Football' && selectedGame() === game,
                 'text-[#f2a74c]': game === 'Badminton' && selectedGame() === game,
                 'text-[#ea7f41]': game === 'Basketball' && selectedGame() === game,
                 'text-[#9b51e0]': game === 'Volleyball' && selectedGame() === game,
                 'text-slate-500': selectedGame() !== game
               }">{{ game }}</span>
        </div>
      </div>
    </div>
  
    <!-- Popular Turfs -->
    <div class="px-5">
      <div class="flex justify-between items-center mb-5">
        <h3 class="text-[18px] font-bold">Nearby Arenas</h3>
        <span class="text-[14px] text-[#4ade80] font-bold capitalize cursor-pointer active:scale-95 transition-transform" (click)="resetFiltersAndScroll()">View all</span>
      </div>
      
      <div class="flex flex-col gap-5" *ngIf="!isLoading() && viewMode() === 'grid'">
        <app-turf-card *ngFor="let turf of turfs()" [turf]="turf"></app-turf-card>
      </div>
      <div class="flex flex-col gap-5" *ngIf="isLoading()">
        <div class="h-[280px] w-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
        <div class="h-[280px] w-full bg-slate-100 dark:bg-slate-800/50 rounded-3xl animate-pulse"></div>
      </div>
      
      <!-- Mobile Map View -->
      <div *ngIf="viewMode() === 'map' && !isLoading()" class="w-full h-[60vh] rounded-[24px] overflow-hidden relative z-10 border border-slate-200 dark:border-white/10 shadow-lg mt-4">
         <div id="turf-map-mobile" class="w-full h-full bg-slate-200 dark:bg-slate-900"></div>
      </div>

      <!-- Floating Map/List Toggle for Mobile -->
      <div class="fixed left-1/2 transform -translate-x-1/2 z-[90]" style="bottom: 110px;">
        <button class="bg-[#1e293b] text-white px-5 py-3 rounded-full shadow-lg flex items-center gap-2 active:scale-95 transition-transform" (click)="toggleMobileViewMode()">
          <span class="font-bold text-[13px] tracking-wide">{{ viewMode() === 'grid' ? 'Map' : 'List' }}</span>
          <svg *ngIf="viewMode() === 'grid'" class="w-4 h-4 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
          <svg *ngIf="viewMode() === 'map'" class="w-4 h-4 text-[#4ade80]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
        </button>
      </div>

      <!-- Empty State -->
      <div class="empty-state text-center py-10 bg-slate-50 dark:bg-slate-800/30 rounded-3xl border border-slate-100 dark:border-white/5 backdrop-blur-sm" *ngIf="!isLoading() && turfs().length === 0">
        <div class="w-16 h-16 mx-auto bg-slate-100 dark:bg-slate-800/80 rounded-full flex items-center justify-center mb-4">
          <svg class="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h3 class="text-lg font-bold">No arenas found</h3>
        <p class="text-sm text-slate-500 mt-2">Try switching sports or location</p>
      </div>
    </div>

    <!-- Mobile Location Selector Modal -->`;

const startIdx = c.indexOf('<!-- MOBILE APP LAYOUT (TurfXpert Premium) -->');
const endIdx = c.indexOf('<!-- Mobile Location Selector Modal -->');

const replacement1 = c.substring(startIdx, endIdx);
c = c.replace(replacement1, newMobileLayout);

// Add isDarkMode signal and toggle function
if (!c.includes('isDarkMode = signal<boolean>')) {
  c = c.replace(/isLoading = signal\(true\);/, `isLoading = signal(true);\n  isDarkMode = signal<boolean>(false);`);
}

if (!c.includes('toggleTheme() {')) {
  c = c.replace(/resetFilters\(\) \{/, `toggleTheme() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.body.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  resetFilters() {`);
}

// Ensure theme is loaded in ngOnInit
if (!c.includes("const savedTheme = localStorage.getItem('theme');")) {
  c = c.replace(/ngOnInit\(\) \{/, `ngOnInit() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode.set(true);
      document.body.classList.add('dark');
    } else {
      this.isDarkMode.set(false);
      document.body.classList.remove('dark');
    }
`);
}

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
