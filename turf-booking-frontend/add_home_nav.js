const fs = require('fs');

let path = 'src/app/layout/navbar/navbar.component.html';
let content = fs.readFileSync(path, 'utf8');

const loggedOutLinks = `<ng-container *ngIf="!isLoggedIn()">
 <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active-link" class="navbar-link font-medium text-sm transition-colors duration-200 hover:text-[var(--text-primary)] text-[var(--text-secondary)]">Home</a>
 <a routerLink="/dashboard" routerLinkActive="active-link" class="navbar-link font-medium text-sm transition-colors duration-200 hover:text-[var(--text-primary)] text-[var(--text-secondary)]">Book Turf</a>`;

const loggedInLinks = `<ng-container *ngIf="isLoggedIn()">
 <a routerLink="/" [routerLinkActiveOptions]="{exact: true}" routerLinkActive="active-link" class="navbar-link font-medium text-sm transition-colors duration-200 hover:text-[var(--text-primary)] text-[var(--text-secondary)]">Home</a>
 <a routerLink="/dashboard" routerLinkActive="active-link" class="navbar-link font-medium text-sm transition-colors duration-200 hover:text-[var(--text-primary)] text-[var(--text-secondary)]">Book Turf</a>`;

content = content.replace(
    /<ng-container \*ngIf="!isLoggedIn\(\)">\s*<a routerLink="\/dashboard"/,
    loggedOutLinks
);

content = content.replace(
    /<ng-container \*ngIf="isLoggedIn\(\)">\s*<a routerLink="\/dashboard"/,
    loggedInLinks
);

fs.writeFileSync(path, content);
console.log('Added Home to desktop navbar');
