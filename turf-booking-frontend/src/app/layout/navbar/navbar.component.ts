import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';

@Component({
  selector: 'app-navbar-component',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  theme: 'dark' | 'light' = 'dark';

  constructor(
    private router: Router,
    public authStore: AuthStore
  ) {}

  ngOnInit() {
    // Load stored theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light';
    if (savedTheme) {
      this.theme = savedTheme;
    } else {
      // Check system preference
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      this.theme = prefersLight ? 'light' : 'dark';
    }
    this.applyTheme();
  }

  isLoggedIn(): boolean {
    return this.authStore.isLoggedIn();
  }

  toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', this.theme);
    this.applyTheme();
  }

  private applyTheme() {
    const body = document.body;
    if (this.theme === 'light') {
      body.setAttribute('data-theme', 'light');
    } else {
      body.removeAttribute('data-theme');
    }
  }

  logout() {
    this.authStore.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
