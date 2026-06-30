import { Component, OnInit, inject } from '@angular/core';
import { AuthStore } from '../../core/services/auth.store';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
 selector: 'app-bottom-nav',
 standalone: true,
 imports: [CommonModule, RouterModule],
 template: `
  <nav class="bottom-nav-mobile" [class.hidden]="isHidden">
    <div class="nav-items-mobile">
      <a routerLink="/dashboard" routerLinkActive="active" class="nav-item-mobile cursor-pointer" title="Home">
        <div class="nav-icon-container">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
        <span class="nav-label">Home</span>
      </a>

      <a routerLink="/bookings" routerLinkActive="active" class="nav-item-mobile cursor-pointer" title="Bookings">
        <div class="nav-icon-container">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <span class="nav-label">Bookings</span>
      </a>

      <a routerLink="/profile" routerLinkActive="active" class="nav-item-mobile cursor-pointer" title="Profile">
        <div class="nav-icon-container">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <span class="nav-label">Profile</span>
      </a>
    
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
        
        <div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto scrollbar-hide pb-10">
          <a routerLink="/profile" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            My Account
          </a>
          
          <a routerLink="/bookings" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            My Bookings
          </a>
          
          <a routerLink="/reviews" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>
            Reviews
          </a>
          
          <a routerLink="/support" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-slate-50 dark:bg-white/5 text-slate-700 dark:text-slate-200 font-bold active:scale-95 transition-all cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Support & FAQs
          </a>

          <div class="h-px bg-slate-200 dark:bg-white/10 my-2"></div>

          <!-- Become an Owner (For Normal Users) -->
          <a *ngIf="authStore.user()?.role !== 'Owner' && authStore.user()?.role !== 'SuperAdmin'" routerLink="/become-owner" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-bold active:scale-95 transition-all border border-indigo-100 dark:border-indigo-800/30 cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Become an Owner
          </a>

          <!-- Owner Dashboard (For Owners and SuperAdmins) -->
          <a *ngIf="authStore.user()?.role === 'Owner' || authStore.user()?.role === 'SuperAdmin'" routerLink="/owner-dashboard" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 font-bold active:scale-95 transition-all border border-purple-100 dark:border-purple-800/30 cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            Owner Dashboard
          </a>

          <!-- SuperAdmin Portal (For SuperAdmins Only) -->
          <a *ngIf="authStore.user()?.role === 'SuperAdmin'" routerLink="/superadmin" class="py-3 px-4 rounded-xl flex items-center gap-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold active:scale-95 transition-all border border-red-100 dark:border-red-800/30 cursor-pointer" (click)="toggleMenu()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            SuperAdmin Portal
          </a>

          <div class="h-px bg-slate-200 dark:bg-white/10 my-2"></div>

          <a class="py-3 px-4 rounded-xl flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-red-500 font-bold active:scale-95 transition-all cursor-pointer" (click)="logout()">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            Logout
          </a>

        </div>
      </div>
    </div>
  </div>

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

  `,
  styles: [`
  .bottom-nav-mobile {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(10, 14, 26, 0.95);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .bottom-nav-mobile.hidden {
    transform: translateY(150%);
  }

  .nav-items-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 16px;
  }

  .nav-item-mobile {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    color: #64748b;
    text-decoration: none;
    flex: 1;
    height: 100%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .nav-item-mobile:active {
    transform: scale(0.9);
  }

  .nav-icon-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 32px;
    border-radius: 16px;
    transition: all 0.3s ease;
  }

  .nav-icon {
    width: 22px;
    height: 22px;
    transition: stroke 0.3s ease;
  }

  .nav-label {
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.3px;
    opacity: 0;
    transform: translateY(4px);
    position: absolute;
    bottom: 6px;
    transition: all 0.3s ease;
  }

  .nav-item-mobile.active {
    color: #fff;
  }

  .nav-item-mobile.active .nav-icon-container {
    background: rgba(123, 57, 252, 0.2);
    transform: translateY(-8px);
    box-shadow: 0 4px 12px rgba(123, 57, 252, 0.3);
  }

  .nav-item-mobile.active .nav-icon {
    stroke: #7b39fc;
  }

  .nav-item-mobile.active .nav-label {
    opacity: 1;
    transform: translateY(0);
    color: #7b39fc;
  }

  .notification-badge {
    position: absolute;
    top: 2px;
    right: 8px;
    width: 8px;
    height: 8px;
    background: #3b82f6;
    border: 2px solid rgba(10, 14, 26, 1);
    border-radius: 50%;
  }

  @media (max-width: 768px) {
    .bottom-nav-mobile {
      display: block;
    }
  }
 `]
})
export class BottomNavComponent implements OnInit {
  public authStore = inject(AuthStore);
  isMenuOpen = false;
  isLogoutModalOpen = false;
  
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  
  logout() {
    this.isMenuOpen = false;
    this.isLogoutModalOpen = true;
  }

  confirmLogout() {
    this.isMenuOpen = false;
    this.authStore.clearSession();
    this.router.navigate(['/auth/login']);
  }

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

