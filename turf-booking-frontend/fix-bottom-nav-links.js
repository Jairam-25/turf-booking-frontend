const fs = require('fs');

let bn = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

// 1. Fix Owner Dashboard Link
if (!bn.includes('routerLink="/owner-dashboard"')) {
  bn = bn.replace(
    /<a class="(py-3 px-4 rounded-xl flex items-center gap-3 bg-purple-50 [^>]*?)" \(click\)="toggleMenu\(\)">\s*<svg[^>]*?>.*?<\/svg>\s*Owner Dashboard\s*<\/a>/,
    '<a routerLink="/owner-dashboard" class="$1" (click)="toggleMenu()">\n            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>\n            Owner Dashboard\n          </a>'
  );
}

// 2. Fix SuperAdmin Portal Link
if (!bn.includes('routerLink="/superadmin-dashboard"')) {
  bn = bn.replace(
    /<a class="(py-3 px-4 rounded-xl flex items-center gap-3 bg-red-50 [^>]*?)" \(click\)="toggleMenu\(\)">\s*<svg[^>]*?>.*?<\/svg>\s*SuperAdmin Portal\s*<\/a>/,
    '<a routerLink="/superadmin-dashboard" class="$1" (click)="toggleMenu()">\n            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>\n            SuperAdmin Portal\n          </a>'
  );
}

// 3. Fix Reviews and Support Links in Bottom Nav
if (!bn.includes('routerLink="/reviews"')) {
  bn = bn.replace(
    /<a class="(py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 [^>]*?)" \(click\)="toggleMenu\(\)">\s*<svg[^>]*?>.*?<\/svg>\s*Reviews\s*<\/a>/,
    '<a routerLink="/reviews" class="$1" (click)="toggleMenu()">\n            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>\n            Reviews\n          </a>'
  );
}

if (!bn.includes('routerLink="/support"')) {
  bn = bn.replace(
    /<a class="(py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 [^>]*?)" \(click\)="toggleMenu\(\)">\s*<svg[^>]*?>.*?<\/svg>\s*Support & FAQs\s*<\/a>/,
    '<a routerLink="/support" class="$1" (click)="toggleMenu()">\n            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>\n            Support & FAQs\n          </a>'
  );
}

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', bn);
console.log('Fixed router links in bottom-nav.');
