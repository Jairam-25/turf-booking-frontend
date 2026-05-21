import { Component, OnInit, signal } from '@angular/core';
import { ToastComponent } from './layout/toast/toast.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { AuthStore } from './core/services/auth.store';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  hideNavbar = signal(false);

  constructor(
    public authStore: AuthStore,
    private router: Router,
    private themeService: ThemeService
  ) {}

  ngOnInit() {
    this.themeService.init();
    this.updateNavbarVisibility(this.router.url);

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateNavbarVisibility(event.urlAfterRedirects));
  }

  private updateNavbarVisibility(url: string) {
    this.hideNavbar.set(url.startsWith('/auth'));
  }
}