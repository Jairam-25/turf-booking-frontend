const fs = require('fs');

let bn = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

// 1. Fix logout in bottom-nav
if (!bn.includes('AuthStore')) {
  bn = bn.replace(/import \{ Component, OnInit \} from '@angular\/core';/, `import { Component, OnInit, inject } from '@angular/core';\nimport { AuthStore } from '../../core/services/auth.store';`);
}

if (!bn.includes('authStore = inject(AuthStore)')) {
  bn = bn.replace(/export class BottomNavComponent implements OnInit \{/, `export class BottomNavComponent implements OnInit {\n  private authStore = inject(AuthStore);\n`);
}

bn = bn.replace(
  /logout\(\) \{[\s\S]*?this\.router\.navigate\(\['\/auth\/login'\]\);\s*\}/,
  `logout() {\n    this.isMenuOpen = false;\n    this.authStore.clearSession();\n    this.router.navigate(['/auth/login']);\n  }`
);

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', bn);


// 2. Add Logout to profile.html
let prof = fs.readFileSync('src/app/features/profile/profile.html', 'utf8');

if (!prof.includes('logout()')) {
  prof = prof.replace(
    /<div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform" \(click\)="deleteAccount\(\)">/,
    `<div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform" (click)="logout()">
          <div class="flex items-center gap-4">
            <div class="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-slate-700 dark:text-slate-300">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </div>
            <span class="font-bold text-slate-800 dark:text-slate-200">Logout</span>
          </div>
        </div>

        <div class="h-px bg-slate-100 dark:bg-white/5 mx-4"></div>

        <div class="flex items-center justify-between p-3 cursor-pointer active:scale-95 transition-transform" (click)="deleteAccount()">`
  );
  fs.writeFileSync('src/app/features/profile/profile.html', prof);
}

// 3. Add logout to profile.ts
let pts = fs.readFileSync('src/app/features/profile/profile.ts', 'utf8');
if (!pts.includes('logout() {')) {
  pts = pts.replace(
    /deleteAccount\(\) \{/,
    `logout() {\n    this.authStore.clearSession();\n    this.router.navigate(['/auth/login']);\n  }\n\n  deleteAccount() {`
  );
  fs.writeFileSync('src/app/features/profile/profile.ts', pts);
}

console.log('Fixed logout');
