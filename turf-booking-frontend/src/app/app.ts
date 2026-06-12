import { Component, OnInit, signal } from '@angular/core';
import { ToastComponent } from './layout/toast/toast.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer-component/footer-component';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { ChatbotComponent } from './layout/chatbot/chatbot.component';
import { BottomNavComponent } from './layout/bottom-nav/bottom-nav.component';
import { AuthStore } from './core/services/auth.store';
import { AuthRepository } from './domain/repositories/auth.repository';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent,
    FooterComponent,
    ChatbotComponent,
    BottomNavComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  hideNavbar = signal(false);

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authStore: AuthStore,
    private authRepo: AuthRepository
  ) {}

  ngOnInit() {
    this.themeService.init();
    this.updateNavbarVisibility(this.router.url);

    // Silent refresh on app init
    const token = this.authStore.token();
    const refreshToken = this.authStore.refreshToken();

    if (token && refreshToken && this.authStore.isTokenExpired()) {
      this.authRepo.refreshToken({ token, refreshToken }).subscribe({
        next: (response) => {
          this.authStore.setSession(response.user, response.auth.token, response.auth.refreshToken);
        },
        error: () => {
          this.authStore.clearSession();
          this.router.navigate(['/auth/login']);
        }
      });
    }

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateNavbarVisibility(event.urlAfterRedirects));
  }

  private updateNavbarVisibility(url: string) {
    this.hideNavbar.set(url.startsWith('/auth'));
  }
}
