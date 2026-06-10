import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { ThemeService } from '../../core/services/theme.service';
import { InboxService } from '../../core/services/inbox.service';

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

  constructor(
    private router: Router,
    public authStore: AuthStore,
    public themeService: ThemeService,
    public inboxService: InboxService
  ) {}

  ngOnInit() {
    this.themeService.init();
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
    if (url.startsWith('http')) return url;
    return `https://localhost:7273${url.startsWith('/') ? '' : '/'}${url}`;
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
}
