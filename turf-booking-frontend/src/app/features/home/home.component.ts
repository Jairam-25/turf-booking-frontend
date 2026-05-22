import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { getRandomHomeVideo } from '../../core/constants/home-background-videos';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="hero-page font-inter overflow-x-hidden">
      <video autoplay loop muted playsinline preload="auto" class="hero-video" [src]="selectedVideoUrl()"></video>

      <div class="hero-overlay"></div>

      <div class="relative z-10 flex flex-col items-center justify-center text-center px-6 min-h-[calc(100vh-80px)]">
        <div class="max-w-4xl flex flex-col items-center gap-6">
          <div class="animate-fade-in-up hero-pill font-cabin font-medium">
            <span class="inline-flex items-center justify-center bg-[var(--primary)] rounded-[6px] px-2 py-0.5 mr-2 text-[10px] font-bold tracking-widest uppercase text-[var(--on-primary)]">Ready</span>
            <span>Choose from 50+ Premium Arenas</span>
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

      <section class="relative z-10 w-full max-w-6xl mx-auto px-6 py-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="group animate-scroll-fade-in animation-delay-300 hero-stat-card flex flex-col items-center text-center hover:border-[var(--primary)]/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-300" style="background: rgba(var(--primary-rgb), 0.1);">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            </div>
            <h3 class="font-manrope font-bold text-4xl text-[var(--primary)] mb-2">50+</h3>
            <h4 class="font-manrope font-semibold text-lg mb-2">Premium Turfs</h4>
            <p class="font-inter text-sm">Top-tier football, cricket, and badminton arenas in your vicinity.</p>
          </div>

          <div class="group animate-scroll-fade-in animation-delay-400 hero-stat-card flex flex-col items-center text-center hover:border-[var(--primary)]/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-300" style="background: rgba(var(--primary-rgb), 0.1);">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            </div>
            <h3 class="font-manrope font-bold text-4xl text-[var(--primary)] mb-2">10k+</h3>
            <h4 class="font-manrope font-semibold text-lg mb-2">Happy Players</h4>
            <p class="font-inter text-sm">An active community of sports enthusiasts playing daily.</p>
          </div>

          <div class="group animate-scroll-fade-in animation-delay-500 hero-stat-card flex flex-col items-center text-center hover:border-[var(--primary)]/50 transition-all duration-300">
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-[var(--primary)] mb-6 group-hover:scale-110 transition-transform duration-300" style="background: rgba(var(--primary-rgb), 0.1);">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <h3 class="font-manrope font-bold text-4xl text-[var(--primary)] mb-2">24/7</h3>
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
  styles: []
})
export class HomeComponent implements OnInit {
  isOverlayActive = signal(true);
  selectedVideoUrl = signal('');

  ngOnInit() {
    // Select a random Football or Cricket background video
    const video = getRandomHomeVideo();
    this.selectedVideoUrl.set(video.url);

    setTimeout(() => {
      this.isOverlayActive.set(false);
    }, 100);
  }
}
