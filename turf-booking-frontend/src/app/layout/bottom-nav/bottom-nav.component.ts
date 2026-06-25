import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
 selector: 'app-bottom-nav',
 standalone: true,
 imports: [CommonModule, RouterModule],
 template: `
 <nav class="bottom-nav glass" [class.hidden]="isHidden">
 <div class="nav-items">
 <a routerLink="/dashboard" routerLinkActive="active" class="nav-item" title="Dashboard">
 <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
 </svg>
 <span class="nav-label">Book Turf</span>
 </a>

 <a routerLink="/bookings" routerLinkActive="active" class="nav-item" title="Bookings">
 <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
 </svg>
 <span class="nav-label">Bookings</span>
 </a>

 </div>
 </nav>
 `,
 styles: [`
 .bottom-nav {
 display: none; /* Hidden on desktop by default */
 position: fixed;
 bottom: 0;
 left: 0;
 right: 0;
 z-index: 1000;
 background: rgba(var(--background-rgb), 0.85);
 backdrop-filter: blur(16px);
 -webkit-backdrop-filter: blur(16px);
 border-top: 1px solid var(--border-color);
 padding-bottom: env(safe-area-inset-bottom);
 transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 }
 .bottom-nav.hidden {
 transform: translateY(100%);
 }

 .nav-items {
 display: flex;
 justify-content: space-around;
 align-items: center;
 height: 64px;
 padding: 0 8px;
 }

 .nav-item {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 gap: 4px;
 color: var(--text-secondary);
 text-decoration: none;
 width: 100%;
 height: 100%;
 transition: all 0.2s ease;
 position: relative;
 }

 .nav-item:active {
 transform: scale(0.92);
 }

 .nav-icon {
 width: 24px;
 height: 24px;
 transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.2s ease;
 }

 .nav-label {
 font-size: 0.75rem;
 font-weight: 600;
 transition: color 0.2s ease;
 }

 .nav-item.active {
 color: var(--primary);
 }

 .nav-item.active .nav-icon {
 transform: translateY(-2px);
 stroke: var(--primary);
 }

 .nav-item.active::after {
 content: '';
 position: absolute;
 bottom: 6px;
 width: 4px;
 height: 4px;
 border-radius: 50%;
 background: var(--primary);
 }

 @media (min-width: 0px) {
 .bottom-nav {
 display: block; /* Show on mobile */
 }
 }
 `]
})
export class BottomNavComponent implements OnInit {
 isHidden = false;
 private hiddenRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password'];

 constructor(private router: Router) {}

 ngOnInit() {
 this.router.events.pipe(
 filter(event => event instanceof NavigationEnd)
 ).subscribe((event: any) => {
 // Hide bottom nav on auth pages and deep detail pages if desired, but here we just hide on auth.
 this.isHidden = this.hiddenRoutes.includes(event.urlAfterRedirects.split('?')[0]);
 });
 }
}
