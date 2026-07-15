const fs = require('fs');

let bn = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

// Fix Superadmin route
bn = bn.replace(/routerLink="\/superadmin-dashboard"/g, 'routerLink="/superadmin"');

// Fix AuthStore import
if (!bn.includes('AuthStore')) {
  bn = bn.replace(
    /import \{ Component, OnInit \} from '@angular\/core';/,
    `import { Component, OnInit, inject } from '@angular/core';\nimport { AuthStore } from '../../core/services/auth.store';`
  );
}

// Inject authStore
if (!bn.includes('authStore = inject(AuthStore)')) {
  bn = bn.replace(
    /export class BottomNavComponent implements OnInit \{/,
    `export class BottomNavComponent implements OnInit {\n  private authStore = inject(AuthStore);`
  );
}

// Fix logout logic
bn = bn.replace(
  /logout\(\) \{\s*this\.isMenuOpen = false;\s*\/\/ Auth cleanup and redirect logic\s*localStorage\.removeItem\('authToken'\);\s*this\.router\.navigate\(\['\/auth\/login'\]\);\s*\}/,
  `logout() {\n    this.isMenuOpen = false;\n    this.authStore.clearSession();\n    this.router.navigate(['/auth/login']);\n  }`
);

// Add cursor-pointer to all <a> tags that don't have it
bn = bn.replace(/<a ([^>]*?)class="(.*?)"/g, (match, p1, p2) => {
  if (!p2.includes('cursor-pointer')) {
    return `<a ${p1}class="${p2} cursor-pointer"`;
  }
  return match;
});

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', bn);
console.log('Fixed bottom-nav completely.');
