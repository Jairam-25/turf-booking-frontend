import { Component } from '@angular/core';
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
export class NavbarComponent {
  constructor(
    private router: Router,
    public authStore: AuthStore
  ) {}

  isLoggedIn(): boolean {
    return this.authStore.isLoggedIn();
  }

  logout() {
    this.authStore.clearSession();
    this.router.navigate(['/auth/login']);
  }
}
