const fs = require('fs');

let bn = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

// Replace Owner Dashboard
bn = bn.replace(
  /<a routerLink="\/owner-dashboard" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-purple-50 dark:bg-purple-900\/20 text-purple-600 dark:text-purple-400 font-bold active:scale-95 transition-all border border-purple-100 dark:border-purple-800\/30 cursor-pointer" \(click\)="toggleMenu\(\)">\s*<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"><\/path><\/svg>\s*Owner Dashboard\s*<\/a>/,
  `<!-- Become an Owner (For Normal Users) -->
          <a *ngIf="authStore.user()?.role !== 'Owner' && authStore.user()?.role !== 'SuperAdmin'" routerLink="/become-owner" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold active:scale-95 transition-all border border-indigo-100 dark:border-indigo-800/30 cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Become an Owner
          </a>

          <!-- Owner Dashboard (For Owners and SuperAdmins) -->
          <a *ngIf="authStore.user()?.role === 'Owner' || authStore.user()?.role === 'SuperAdmin'" routerLink="/owner-dashboard" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold active:scale-95 transition-all border border-purple-100 dark:border-purple-800/30 cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Owner Dashboard
          </a>`
);

// Replace SuperAdmin
bn = bn.replace(
  /<a routerLink="\/superadmin" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-red-50 dark:bg-red-900\/20 text-red-600 dark:text-red-400 font-bold active:scale-95 transition-all border border-red-100 dark:border-red-800\/30 cursor-pointer" \(click\)="toggleMenu\(\)">\s*<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"><\/path><\/svg>\s*SuperAdmin Portal\s*<\/a>/,
  `<!-- SuperAdmin Portal (For SuperAdmins Only) -->
          <a *ngIf="authStore.user()?.role === 'SuperAdmin'" routerLink="/superadmin" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold active:scale-95 transition-all border border-red-100 dark:border-red-800/30 cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            SuperAdmin Portal
          </a>`
);

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', bn);
console.log('Fixed auth rendering in bottom nav');
