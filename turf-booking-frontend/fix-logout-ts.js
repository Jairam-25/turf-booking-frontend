const fs = require('fs');

// 1. Fix Profile Component
let pts = fs.readFileSync('src/app/features/profile/profile.ts', 'utf8');

if (!pts.includes('isLogoutModalOpen')) {
  pts = pts.replace(
    /export class ProfileComponent implements OnInit \{/,
    `export class ProfileComponent implements OnInit {\n  isLogoutModalOpen = signal(false);`
  );
  
  pts = pts.replace(
    /logout\(\) \{\s*this\.authStore\.clearSession\(\);\s*this\.router\.navigate\(\['\/auth\/login'\]\);\s*\}/,
    `logout() {\n    this.isLogoutModalOpen.set(true);\n  }\n\n  confirmLogout() {\n    this.isLogoutModalOpen.set(false);\n    this.authStore.clearSession();\n    this.router.navigate(['/auth/login']);\n  }`
  );
  
  fs.writeFileSync('src/app/features/profile/profile.ts', pts);
}

// 2. Fix Bottom Nav Component
let bn = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

if (!bn.includes('isLogoutModalOpen = false')) {
  bn = bn.replace(
    /isMenuOpen = false;/,
    `isMenuOpen = false;\n  isLogoutModalOpen = false;`
  );
  
  bn = bn.replace(
    /logout\(\) \{\s*this\.isMenuOpen = false;\s*this\.authStore\.clearSession\(\);\s*this\.router\.navigate\(\['\/auth\/login'\]\);\s*\}/,
    `logout() {\n    this.isMenuOpen = false;\n    this.isLogoutModalOpen = true;\n  }\n\n  confirmLogout() {\n    this.isLogoutModalOpen = false;\n    this.authStore.clearSession();\n    this.router.navigate(['/auth/login']);\n  }`
  );
  
  fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', bn);
}

console.log('Fixed TS for logout modals');
