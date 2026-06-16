import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../../layout/theme-toggle/theme-toggle.component';
import { TurfBackgroundComponent } from '../../../shared/components/turf-background/turf-background.component';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent, TurfBackgroundComponent],
  template: `
    <div class="hero-page font-inter">
      <!-- Custom realistic animated turf background -->
      <app-turf-background></app-turf-background>
      <div class="hero-overlay"></div>

      <div class="auth-theme-bar">
        <app-theme-toggle />
      </div>

      <div class="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div class="bg-[var(--glass-bg)] border border-[var(--glass-border)] backdrop-blur-xl p-8 md:p-10 rounded-[24px] shadow-2xl max-w-md w-full text-center animate-fade-in-up">
          
          <div class="mx-auto w-16 h-16 bg-[var(--primary)] rounded-full flex items-center justify-center mb-6 shadow-lg shadow-[var(--primary)]/30">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
            </svg>
          </div>

          <h2 class="text-3xl font-bold text-[var(--text-primary)] mb-3 font-instrument-serif tracking-tight">
            Welcome to TurfXpert
          </h2>
          
          <p class="text-[var(--text-secondary)] mb-8 text-[0.95rem] leading-relaxed px-2">
            To continue, please sign in to your existing account or create a new account to access all booking features and community benefits.
          </p>
          
          <div class="flex flex-col gap-4">
            <button (click)="onNavigate('login')" class="w-full py-3.5 px-6 rounded-[12px] font-bold text-white bg-[var(--primary)] hover:bg-[#6825e6] shadow-[0_4px_14px_rgba(123,57,252,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(123,57,252,0.23)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
              Sign In
            </button>
            <button (click)="onNavigate('register')" class="w-full py-3.5 px-6 rounded-[12px] font-bold text-[var(--text-primary)] bg-[rgba(var(--text-primary-rgb),0.05)] hover:bg-[rgba(var(--text-primary-rgb),0.08)] border border-[rgba(var(--text-primary-rgb),0.1)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-95">
              Create Account
            </button>
          </div>
        </div>
      </div>

      <div class="goal-overlay" [class.active]="isOverlayActive()">
        <div class="transition-content">
          <span class="overlay-label">Welcome To</span>
          <span class="overlay-brand">TurfXpert</span>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class WelcomeComponent {
  isOverlayActive = signal(false);
  isTransitioning = signal(false);

  constructor(private router: Router) {}

  onNavigate(action: 'login' | 'register') {
    if (this.isTransitioning()) return;

    this.isTransitioning.set(true);
    this.isOverlayActive.set(true);

    setTimeout(() => {
      this.router.navigate([`/auth/${action}`]).then(() => {
        setTimeout(() => {
          this.isOverlayActive.set(false);
          this.isTransitioning.set(false);
        }, 500);
      });
    }, 1200);
  }
}
