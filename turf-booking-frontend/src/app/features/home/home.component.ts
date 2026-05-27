import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TurfBackgroundComponent } from '../../shared/components/turf-background/turf-background.component';
import { MagicAnimatedBeamComponent } from '../../shared/components/magic-ui/magic-animated-beam/magic-animated-beam.component';
import { MagicNumberTickerComponent } from '../../shared/components/magic-ui/magic-number-ticker/magic-number-ticker.component';
import { LottieHeroComponent } from '../../shared/components/magic-ui/lottie-hero/lottie-hero.component';
import { MagicBorderBeamComponent } from '../../shared/components/magic-ui/magic-border-beam/magic-border-beam.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TurfBackgroundComponent, MagicAnimatedBeamComponent, MagicNumberTickerComponent, LottieHeroComponent, MagicBorderBeamComponent],
  template: `
    <div class="hero-page font-inter overflow-x-hidden">
      <!-- Custom realistic animated turf background -->
      <app-turf-background></app-turf-background>

      <div class="hero-overlay"></div>

      <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-80px)]">
        <div class="max-w-4xl flex flex-col items-center gap-6">
          <div class="flex items-center gap-6">
            <app-lottie-hero [width]="96" [height]="96" [src]="'https://assets2.lottiefiles.com/packages/lf20_jcikwtux.json'" ></app-lottie-hero>
            <div class="animate-fade-in-up hero-pill font-cabin font-medium">
            <span class="inline-flex items-center justify-center bg-[var(--primary)] rounded-[6px] px-2 py-0.5 mr-2 text-[10px] font-bold tracking-widest uppercase text-[var(--on-primary)]">Ready</span>
            <span>Choose from 50+ Premium Arenas</span>
            </div>
          </div>

          <h1 class="animate-fade-in-up animation-delay-100 font-instrument-serif hero-heading text-5xl md:text-[96px] leading-[1.1] tracking-tight max-w-[1000px]">
            Book your perfect turf instantly <span class="italic font-normal mx-2 select-none">and</span> play stress-free
          </h1>

          <p class="animate-fade-in-up animation-delay-200 font-inter hero-subtext text-[18px] max-w-[662px] leading-relaxed">
            Select your preferred slot, split the cost with your team, and show up to play. Elite sports facilities are just a click away.
          </p>

          <div class="animate-fade-in-up animation-delay-300 flex flex-col sm:flex-row items-center gap-4 mt-4">
            <a routerLink="/dashboard" class="hero-btn-primary w-full sm:w-auto text-center font-cabin text-[16px] active:scale-95">
              Go to Dashboard
            </a>
            <a routerLink="/bookings" class="hero-btn-secondary w-full sm:w-auto text-center font-cabin text-[16px] active:scale-95">
              My Bookings
            </a>
          </div>
        </div>
      </div>

      <!-- How it Works section with Magic Animated Beam -->
      <section class="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 text-center animate-fade-in-up animation-delay-400">
        <h2 class="font-instrument-serif text-3xl md:text-5xl mb-8">Instant Booking Flow</h2>
        <div class="glass p-4 sm:p-6 rounded-3xl backdrop-blur-md relative overflow-hidden">
          <magic-border-beam [duration]="'6s'" [borderWidth]="3"></magic-border-beam>
          <magic-animated-beam></magic-animated-beam>
        </div>
      </section>

      <section class="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group animate-scroll-fade-in animation-delay-300 hero-stat-card flex flex-col items-center text-center hover:border-[var(--primary)]/50 transition-all duration-300 relative overflow-hidden" [class.lifted]="turfSwiped()">
            <magic-border-beam [duration]="'6s'" [borderWidth]="2"></magic-border-beam>
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" style="background: rgba(var(--primary-rgb), 0.1);">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 class="font-manrope font-bold text-4xl text-[var(--primary)] mb-2">
              <magic-number-ticker [value]="50" [format]="'full'" [swipeDelay]="400">+</magic-number-ticker>
            </h3>
            <h4 class="font-manrope font-semibold text-lg mb-2">Premium Turfs</h4>
            <p class="font-inter text-sm">Top-tier football, cricket, and badminton arenas in your vicinity.</p>
          </div>

          <div class="group animate-scroll-fade-in animation-delay-400 hero-stat-card flex flex-col items-center text-center hover:border-[var(--primary)]/50 transition-all duration-300 relative overflow-hidden" [class.lifted]="playersSwiped()">
            <magic-border-beam [duration]="'6s'" [borderWidth]="2"></magic-border-beam>
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" style="background: rgba(var(--primary-rgb), 0.1);">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 class="font-manrope font-bold text-4xl text-[var(--primary)] mb-2">
              <magic-number-ticker [value]="10000" [format]="'compact'" [swipeDelay]="600"></magic-number-ticker>
            </h3>
            <h4 class="font-manrope font-semibold text-lg mb-2">Happy Players</h4>
            <p class="font-inter text-sm">An active community of sports enthusiasts playing daily.</p>
          </div>

          <div class="group animate-scroll-fade-in animation-delay-500 hero-stat-card flex flex-col items-center text-center hover:border-[var(--primary)]/50 transition-all duration-300 relative overflow-hidden" [class.lifted]="slotsSwiped()">
            <magic-border-beam [duration]="'6s'" [borderWidth]="2"></magic-border-beam>
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-300 relative z-10" style="background: rgba(var(--primary-rgb), 0.1);">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="font-manrope font-bold text-4xl text-[var(--primary)] mb-2">
              <magic-number-ticker [value]="24" [format]="'full'" [swipeDelay]="800">/7</magic-number-ticker>
            </h3>
            <h4 class="font-manrope font-semibold text-lg mb-2">Instant Slots</h4>
            <p class="font-inter text-sm">Book slots and verify availability instantly, day or night.</p>
          </div>
        </div>
      </section>

      <div class="goal-overlay" [class.active]="isOverlayActive()">
        <div class="transition-content">
          <span class="overlay-label">Welcome To</span>
          <span class="overlay-brand">TurfXpert</span>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .stat-symbol { transition: transform 520ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease; }
    .stat-symbol.active { transform: translateY(-12px) scale(1.12); opacity: 1; filter: drop-shadow(0 6px 18px rgba(16,185,129,0.12)); }
    .hero-stat-card.lifted { transform: translateY(-8px); box-shadow: 0 12px 30px rgba(2,6,23,0.06); }
    `
  ]
})
export class HomeComponent implements OnInit {
  isOverlayActive = signal(true);
  turfSwiped = signal(false);
  playersSwiped = signal(false);
  slotsSwiped = signal(false);

  ngOnInit() {
    setTimeout(() => {
      this.isOverlayActive.set(false);
    }, 100);
  }
}

