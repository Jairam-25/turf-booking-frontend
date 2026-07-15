const fs = require('fs');

// 1. Update bottom-nav.component.ts
let bn = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

// Add modal HTML before the closing </nav> or at the end of the template
const modalHtml = `
  <!-- Logout Confirmation Modal -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200] transition-opacity flex items-center justify-center p-4" *ngIf="isLogoutModalOpen">
    <div class="w-full max-w-sm bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 transform transition-all text-center">
      <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Log Out?</h3>
      <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">Are you sure you want to log out? You'll need to sign in again to book turfs and view your profile.</p>
      
      <div class="flex gap-3">
        <button class="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-transform" (click)="isLogoutModalOpen = false">Cancel</button>
        <button class="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-transform shadow-[0_4px_12px_rgba(239,68,68,0.3)]" (click)="confirmLogout()">Log Out</button>
      </div>
    </div>
  </div>
`;

if (!bn.includes('isLogoutModalOpen')) {
  bn = bn.replace(/<\/div>\s*<\/div>\s*<\/div>\s*`/g, '</div>\n    </div>\n  </div>\n' + modalHtml + '\n  `');
  
  bn = bn.replace(/logout\(\) \{([\s\S]*?)\}/, `logout() {\n    this.isMenuOpen = false;\n    this.isLogoutModalOpen = true;\n  }\n\n  confirmLogout() {$1}`);
  
  bn = bn.replace(/isMenuOpen = false;/, `isMenuOpen = false;\n  isLogoutModalOpen = false;`);
  
  fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', bn);
}

// 2. Update profile.html
let prof = fs.readFileSync('src/app/features/profile/profile.html', 'utf8');

const profModalHtml = `
  <!-- Logout Confirmation Modal -->
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1200] transition-opacity flex items-center justify-center p-4" *ngIf="isLogoutModalOpen()">
    <div class="w-full max-w-sm bg-white dark:bg-[#121212] rounded-3xl border border-slate-200 dark:border-white/10 shadow-2xl p-6 transform transition-all text-center">
      <div class="w-16 h-16 rounded-full bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-4">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Log Out?</h3>
      <p class="text-slate-500 dark:text-slate-400 mb-6 text-sm leading-relaxed">Are you sure you want to log out? You'll need to sign in again to book turfs and view your profile.</p>
      
      <div class="flex gap-3">
        <button class="flex-1 py-3 px-4 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-transform" (click)="isLogoutModalOpen.set(false)">Cancel</button>
        <button class="flex-1 py-3 px-4 rounded-xl bg-red-500 text-white font-bold active:scale-95 transition-transform shadow-[0_4px_12px_rgba(239,68,68,0.3)]" (click)="confirmLogout()">Log Out</button>
      </div>
    </div>
  </div>
`;

if (!prof.includes('isLogoutModalOpen()')) {
  prof = prof.replace(/\(click\)="logout\(\)"/g, '(click)="isLogoutModalOpen.set(true)"');
  prof = prof.replace(/<\/div>\s*$/, '\n' + profModalHtml + '\n</div>');
  fs.writeFileSync('src/app/features/profile/profile.html', prof);
}

// 3. Update profile.ts
let pts = fs.readFileSync('src/app/features/profile/profile.ts', 'utf8');

if (!pts.includes('isLogoutModalOpen')) {
  pts = pts.replace(/export class ProfileComponent \{/, `export class ProfileComponent {\n  isLogoutModalOpen = signal(false);`);
  pts = pts.replace(/logout\(\) \{([\s\S]*?)\}/, `logout() {\n    this.isLogoutModalOpen.set(true);\n  }\n\n  confirmLogout() {\n    this.isLogoutModalOpen.set(false);$1}`);
  fs.writeFileSync('src/app/features/profile/profile.ts', pts);
}

console.log('Added logout modals');
