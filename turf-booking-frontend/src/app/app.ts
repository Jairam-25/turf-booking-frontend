import { Component, OnInit, signal } from '@angular/core';
import { ToastComponent } from './layout/toast/toast.component';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { FooterComponent } from './layout/footer-component/footer-component';
import { filter } from 'rxjs/operators';
import { ThemeService } from './core/services/theme.service';
import { ChatbotComponent } from './layout/chatbot/chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    ToastComponent,
    FooterComponent,
    ChatbotComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  hideNavbar = signal(false);

  constructor(
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