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
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { NotificationService } from './core/services/notification.service';

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
  hideFooter = signal(false);
  hideBottomNav = signal(false);

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private authStore: AuthStore,
    private authRepo: AuthRepository,
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.themeService.init();
    this.updateVisibility(this.router.url);

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
      .subscribe((event) => this.updateVisibility(event.urlAfterRedirects));

    // Render Cold-Start UX: Health check on app init
    const healthCheckStart = Date.now();
    let toastShown = false;

    // Set a timeout to show the toast if the server takes more than 5 seconds
    const timeoutId = setTimeout(() => {
      toastShown = true;
      this.notificationService.info('Server waking up... Please wait a moment (Render free tier cold-start).');
    }, 5000);

    // Call the backend API (e.g. turfs endpoint) to wake it up
    this.http.get(`${environment.apiUrl}/turf`).subscribe({
      next: () => {
        clearTimeout(timeoutId);
        if (toastShown) {
          this.notificationService.success('Server is awake and ready!');
        }
      },
      error: () => {
        clearTimeout(timeoutId);
        // If it fails, the global error handler or interceptor might catch it, or it's just down.
      }
    });
  }

  private updateVisibility(url: string) {
    const cleanUrl = url.split('?')[0];
    const isAuth = cleanUrl.startsWith('/auth');

    this.hideNavbar.set(isAuth);
    this.hideBottomNav.set(isAuth);
    // Hide footer on auth pages, payment, and possibly others if needed
    this.hideFooter.set(isAuth || cleanUrl.startsWith('/payment'));
  }
}
