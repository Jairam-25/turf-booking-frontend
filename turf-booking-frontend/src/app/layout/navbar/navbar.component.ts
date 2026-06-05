import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { ThemeService } from '../../core/services/theme.service';

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

  constructor(
    private router: Router,
    public authStore: AuthStore,
    public themeService: ThemeService
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

  toggleTheme() {
    this.themeService.toggle();
  }

  logout() {
    this.isMobileMenuOpen = false;
    this.authStore.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
