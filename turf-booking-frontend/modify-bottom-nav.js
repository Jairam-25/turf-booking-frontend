const fs = require('fs');
let c = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

c = c.replace(
  /<\/div>\s*<\/nav>/,
  `
      <a class="nav-item-mobile cursor-pointer" [class.active]="isMenuOpen" (click)="toggleMenu()" title="Menu">
        <div class="nav-icon-container">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </div>
        <span class="nav-label">Menu</span>
      </a>
    </div>
  </nav>

  <!-- Mobile Menu Popup -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1100] transition-opacity flex items-end justify-center" *ngIf="isMenuOpen" (click)="toggleMenu()">
    <div class="w-full bg-white dark:bg-[#121212] rounded-t-3xl border-t border-slate-200 dark:border-white/10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transform transition-transform" (click)="$event.stopPropagation()">
      <div class="p-6">
        <div class="w-12 h-1.5 bg-slate-200 dark:bg-white/20 rounded-full mx-auto mb-6"></div>
        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-4">Menu</h3>
        
        <div class="flex flex-col gap-2">
          <a routerLink="/profile" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            My Account
          </a>
          
          <a routerLink="/bookings" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            My Bookings
          </a>
          
          <a class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            Reviews
          </a>
          
          <a class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Support & FAQs
          </a>

          <div class="h-px bg-slate-200 dark:bg-white/10 my-2"></div>

          <a class="py-3 px-4 rounded-xl flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold active:scale-95 transition-all border border-purple-100 dark:border-purple-800/30" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Owner Dashboard
          </a>

          <a class="py-3 px-4 rounded-xl flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold active:scale-95 transition-all border border-red-100 dark:border-red-800/30" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            SuperAdmin Portal
          </a>

          <div class="h-px bg-slate-200 dark:bg-white/10 my-2"></div>

          <a class="py-3 px-4 rounded-xl flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-red-500 font-bold active:scale-95 transition-all" (click)="logout()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </a>

        </div>
      </div>
    </div>
  </div>`
);

// Add class logic
if (!c.includes('isMenuOpen = false;')) {
  c = c.replace(/export class BottomNavComponent implements OnInit \{/,
`export class BottomNavComponent implements OnInit {
  isMenuOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
    this.isMenuOpen = false;
    // Auth cleanup and redirect logic
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }
`
  );
}

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', c);
