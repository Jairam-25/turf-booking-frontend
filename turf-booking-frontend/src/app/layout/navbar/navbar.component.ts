import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { ThemeService } from '../../core/services/theme.service';
import { InboxService } from '../../core/services/inbox.service';
import { SuperadminStateService } from '../../core/services/superadmin-state.service';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  isMobileMenuOpen = false;
  isAnnouncementVisible = true;
  showLogoutConfirm = false;
  isNotificationsOpen = false;
  profileImageError = false;

  constructor(
    private router: Router,
    public authStore: AuthStore,
    public themeService: ThemeService,
    public inboxService: InboxService,
    public superadminStateService: SuperadminStateService
  ) {}

  ngOnInit() {
    this.themeService.init();
    if (this.authStore.user()?.role === 'SuperAdmin') {
      this.superadminStateService.fetchPendingCount();
    }
  }

  isLoggedIn(): boolean {
    return this.authStore.isLoggedIn();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  navigate(action: 'login' | 'register') {
    this.isMobileMenuOpen = false;
    this.router.navigate([`/auth/${action}`]);
  }

  getProfilePictureUrl(): string {
    const url = this.authStore.user()?.profilePictureUrl;
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    return `https://turf-booking-backend-fixl.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
  }

  toggleTheme() {
    this.themeService.toggle();
  }

  openLogoutConfirm() {
    this.isMobileMenuOpen = false;
    this.showLogoutConfirm = true;
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    this.authStore.clearSession();
    this.router.navigate(['/auth/login']);
  }

  toggleNotifications() {
    this.isNotificationsOpen = !this.isNotificationsOpen;
    if (this.isNotificationsOpen) {
      this.isMobileMenuOpen = false;
    }
  }

  formatDate(isoString: string): string {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  getIcon(type: string) {
    switch (type) {
      case 'success': return '<svg title="Success" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'info': return '<svg title="Warning" class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
      case 'warning': return '<svg title="Warning" class="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
      default: return '<svg title="Notification" class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>';
    }
  }
}
