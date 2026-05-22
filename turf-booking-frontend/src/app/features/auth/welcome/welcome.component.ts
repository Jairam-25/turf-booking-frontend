import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemeToggleComponent } from '../../../layout/theme-toggle/theme-toggle.component';
import { DEFAULT_AUTH_BACKGROUND_VIDEO, pickRandomAuthVideo } from '../../../core/constants/auth-background-videos';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeToggleComponent],
  template: `
    <div class="hero-page font-inter">
      <video autoplay loop muted playsinline preload="auto" class="hero-video" [src]="backgroundVideo"></video>
      <div class="hero-overlay"></div>

      <div class="auth-theme-bar">
        <app-theme-toggle />
      </div>

      <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-screen">
        <div class="max-w-4xl flex flex-col items-center gap-6">
          <div class="animate-fade-in-up hero-pill font-cabin font-medium">
            <span class="inline-flex items-center justify-center bg-[var(--primary)] rounded-[6px] px-2 py-0.5 mr-2 text-[10px] font-bold tracking-widest uppercase text-[var(--on-primary)]">New</span>
            <span>Say Hello to TurfXpert v2.0</span>
          </div>

          <h1 class="animate-fade-in-up animation-delay-100 font-instrument-serif hero-heading text-5xl md:text-[96px] leading-[1.1] tracking-tight max-w-[1000px]">
            Book your perfect turf instantly <span class="italic font-normal mx-2 select-none">and</span> play stress-free
          </h1>

          <p class="animate-fade-in-up animation-delay-200 font-inter hero-subtext text-[18px] max-w-[662px] leading-relaxed">
            Discover handpicked grounds, courts, and arenas across your favorite locations. Enjoy instant slot booking, easy split-billing, and 24/7 coordinator support.
          </p>

          <div class="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center gap-4 mt-4">
            <button (click)="onNavigate('register')" class="hero-btn-primary w-full sm:w-auto font-cabin text-[16px] active:scale-95">
              Book a Turf Slot
            </button>
            <button (click)="onNavigate('login')" class="hero-btn-secondary w-full sm:w-auto font-cabin text-[16px] active:scale-95">
              Explore Near-by Arenas
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
export class WelcomeComponent implements OnInit {
  isOverlayActive = signal(false);
  isTransitioning = signal(false);
  backgroundVideo = pickRandomAuthVideo();

  constructor(private router: Router) {}

  ngOnInit() {}

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
