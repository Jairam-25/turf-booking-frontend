import { Component, OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { AuthStore } from '../../../core/services/auth.store';
import { NotificationService } from '../../../core/services/notification.service';
import { RegisterFormComponent } from './ui/register-form.component';
import { ThemeToggleComponent } from '../../../layout/theme-toggle/theme-toggle.component';
import { TurfBackgroundComponent } from '../../../shared/components/turf-background/turf-background.component';
import { MagicBorderBeamComponent } from '../../../shared/components/magic-ui/magic-border-beam/magic-border-beam.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent, ThemeToggleComponent, TurfBackgroundComponent, MagicBorderBeamComponent],

  template: `
    <div class="auth-container" [class.transitioning]="isTransitioning()">
      <div class="auth-theme-bar">
        <app-theme-toggle />
      </div>

      <!-- Custom realistic animated turf background -->
      <app-turf-background></app-turf-background>
      <div class="video-overlay"></div>

      <!-- High-End Split Grid Layout -->
      <div class="split-layout">
        
        <!-- Left Side: App Specs & Points -->
        <div class="info-pane">
          <div class="brand-header animate-fade-in-down">
            <div class="app-logo">
              <img src="/images/logo.png" alt="TurfXpert Logo" class="h-full w-auto object-contain">
            </div>
            <h1 class="glow-brand-title">TurfXpert</h1>
            <p class="brand-tagline">Elite Arena Booking</p>
          </div>

          <!-- Specs matching user requirements -->
          <div class="specs-list">
            <div class="spec-item animate-fade-in-up animation-delay-100">
              <div class="spec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>
              <div class="spec-details">
                <h3>Fast & Efficient</h3>
                <p>Browse and secure your favorite sports arenas in just a few seamless taps.</p>
              </div>
            </div>

            <div class="spec-item animate-fade-in-up animation-delay-200">
              <div class="spec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <div class="spec-details">
                <h3>Book Slots & Enjoy</h3>
                <p>Select your perfect date and time, call your squad, and dive into action.</p>
              </div>
            </div>

            <div class="spec-item animate-fade-in-up animation-delay-300">
              <div class="spec-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" />
                </svg>
              </div>
              <div class="spec-details">
                <h3>Near-by Turf Checker</h3>
                <p>Instantly explore premium grounds and courts in your immediate neighborhood.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Side: The Interactive Shootout Register Card -->
        <div class="card-pane animate-fade-in-up animation-delay-200">
          <div class="glass auth-card">
            <!-- Glowing Magic Border Beam -->
            <magic-border-beam [duration]="'6s'" [borderWidth]="3"></magic-border-beam>
            
            <div class="auth-header">
              <h1>Create Account</h1>
              <p>Join us to start booking your favorite turfs</p>
            </div>



            <!-- Register Form component itself -->
            <app-register-form 
              [loading]="isLoading()" 
              (register)="handleRegister($event)"
            ></app-register-form>

            <!-- Inline error banner for clean aesthetics -->
            <div class="error-banner" *ngIf="errorMessage()">
              {{ errorMessage() }}
            </div>
          </div>
        </div>

      </div>

      <!-- Global Animated Circular Transition Overlay -->
      <div class="goal-overlay" [class.active]="isOverlayActive()">
        <div class="transition-content">
          <span class="overlay-label">Welcome To</span>
          <span class="overlay-brand">TurfXpert</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent implements OnInit {
  isLoading = signal(false);
  activeSport = signal<'football' | 'cricket' | 'pingpong'>('football');

  isKickedSuccess = signal(false);
  isKickedFailure = signal(false);
  isNetShaking = signal(false);
  isOverlayActive = signal(true);
  isTransitioning = signal(false);
  errorMessage = signal<string>('');

  constructor(
    private authRepository: AuthRepository,
    private authStore: AuthStore,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit() {
    // 1. Pick randomly from three active sports!
    const sports: ('football' | 'cricket' | 'pingpong')[] = ['football', 'cricket', 'pingpong'];
    this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);

    // Fade out the entry overlay transition after component loads
    setTimeout(() => {
      this.isOverlayActive.set(false);
    }, 150);
  }

  handleRegister(data: any) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    // Reset previous states
    this.isKickedSuccess.set(false);
    this.isKickedFailure.set(false);
    this.isNetShaking.set(false);

    this.authRepository.register(data).subscribe({
      next: (message) => {
        // Play winning animation!
        this.isKickedSuccess.set(true);

        // Net shakes / batsman hits six / paddle smash
        setTimeout(() => {
          this.isNetShaking.set(true);
        }, 300);

        // Screen fills with colors
        setTimeout(() => {
          this.isOverlayActive.set(true);
        }, 500);

        // Transition complete -> route to Login
        setTimeout(() => {
          this.notificationService.success(message || 'Registration successful! Please login.');
          this.router.navigate(['/auth/login']);
          this.isLoading.set(false);
        }, 1500);
      },
      error: (err) => {
        let message = 'Registration failed. Please try again.';
        
        // Handle specific "Email already exists" from backend
        if (err.error?.message?.includes('Email already exists')) {
          message = 'Email already exists. Please use a different email.';
        } else if (err.status === 400) {
          message = 'Please check your input and try again.';
        }

        this.playFailureSequence(message);
      }
    });
  }

  private playFailureSequence(message: string) {
    // Play losing animation!
    this.isKickedFailure.set(true);

    // Glove blocks / wickets shatter / net hit
    setTimeout(() => {
      this.isNetShaking.set(true);
    }, 300);

    // Show the error message inside the card
    this.errorMessage.set(message);
    this.notificationService.error(message);
    this.isLoading.set(false);

    // Reset the ball's positioning so they can try again
    setTimeout(() => {
      this.isKickedFailure.set(false);
      this.isNetShaking.set(false);
    }, 2500);
  }
}
