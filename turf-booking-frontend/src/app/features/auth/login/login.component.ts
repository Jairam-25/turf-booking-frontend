import { AfterViewInit, Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { AuthStore } from '../../../core/services/auth.store';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginFormComponent } from './ui/login-form.component';
import { ThemeToggleComponent } from '../../../layout/theme-toggle/theme-toggle.component';
import { DEFAULT_AUTH_BACKGROUND_VIDEO } from '../../../core/constants/auth-background-videos';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent, ThemeToggleComponent],
  template: `
    <div class="auth-container" [class.transitioning]="isTransitioning()">
      <div class="auth-theme-bar">
        <app-theme-toggle />
      </div>

      <!-- Sports turf background video (full screen, behind form) -->
      <video
        #bgVideo
        class="auth-bg-video bg-video"
        autoplay
        loop
        muted
        playsinline
        preload="auto"
        src="/videos/turf-bg.mp4"
      ></video>
      <div class="video-overlay"></div>

      <!-- High-End Split Grid Layout -->
      <div class="split-layout">
        
        <!-- Left Side: App Specs & Points -->
        <div class="info-pane">
          <div class="brand-header animate-fade-in-down">
            <div class="app-logo">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--primary)" stroke-width="2.5"/>
                <path d="M12 2V22M2 12H22" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="3 3"/>
                <circle cx="12" cy="12" r="4" stroke="var(--accent)" stroke-width="2"/>
              </svg>
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

        <!-- Right Side: The Interactive Shootout Login Card -->
        <div class="card-pane animate-fade-in-up animation-delay-200">
          <div class="glass auth-card">
            
            <div class="auth-header">
              <h1>Welcome Back</h1>
              <p>Login to manage your turf bookings</p>
            </div>

            <!-- Dynamic Sports Arena (Top header of the form!) -->
            <div class="football-field-preview" 
                 [class.cricket-field]="activeSport() === 'cricket'"
                 [class.pingpong-field]="activeSport() === 'pingpong'">
              
              <!-- Soccer: Goal Post & GK Silhouettes -->
              <div *ngIf="activeSport() === 'football'" class="goal-post" [class.net-shake]="isNetShaking() && isKickedSuccess()">
                <div class="goal-net"></div>
              </div>

              <!-- Soccer: Striker Image -->
              <img *ngIf="activeSport() === 'football'" 
                   class="kicker-player-img" 
                   [class.kick-swing]="isKickedSuccess() || isKickedFailure()" 
                   src="/images/striker.png" 
                   alt="Striker" />

              <!-- Soccer: Goalkeeper Image -->
              <img *ngIf="activeSport() === 'football'" 
                   class="goalkeeper-player-img" 
                   [class.goalkeeper-miss]="isKickedSuccess()" 
                   [class.goalkeeper-save]="isKickedFailure()" 
                   src="/images/goalkeeper.png" 
                   alt="Goalkeeper" />

              <!-- Cricket: Wooden Wickets & Batsman Silhouette -->
              <div *ngIf="activeSport() === 'cricket'" class="cricket-wickets" [class.wickets-shattered]="isNetShaking() && isKickedFailure()">
                <div class="wicket stump-1"></div>
                <div class="wicket stump-2"></div>
                <div class="wicket stump-3"></div>
                <div class="bail bail-1"></div>
                <div class="bail bail-2"></div>
              </div>

              <!-- Cricket: Bowler Image -->
              <img *ngIf="activeSport() === 'cricket'" 
                   class="bowler-player-img" 
                   [class.bowler-release]="isKickedSuccess() || isKickedFailure()" 
                   src="/images/bowler.png" 
                   alt="Bowler" />

              <!-- Cricket: Batsman Image -->
              <img *ngIf="activeSport() === 'cricket'" 
                   class="batsman-player-img" 
                   [class.bat-swing]="isKickedSuccess() || isKickedFailure()" 
                   src="/images/batsman.png" 
                   alt="Batsman" />

              <!-- Ping-Pong: Table Net -->
              <div *ngIf="activeSport() === 'pingpong'" class="pingpong-net" [class.net-shake]="isNetShaking() && (isKickedSuccess() || isKickedFailure())">
                <div class="pingpong-post left-post"></div>
                <div class="pingpong-post right-post"></div>
                <div class="pingpong-net-mesh"></div>
              </div>

              <!-- Ping-Pong: Paddle Image -->
              <img *ngIf="activeSport() === 'pingpong'" 
                   class="pingpong-paddle-img" 
                   [class.paddle-swing]="isKickedSuccess() || isKickedFailure()" 
                   src="/images/pingpong.png" 
                   alt="Paddle" />

              <!-- Penalty markings (Soccer only) -->
              <div *ngIf="activeSport() === 'football'" class="penalty-box"></div>
              <div *ngIf="activeSport() === 'football'" class="penalty-spot"></div>

              <!-- Pitch Line markings (Cricket only) -->
              <div *ngIf="activeSport() === 'cricket'" class="cricket-pitch-line"></div>

              <!-- Table line markings (Ping-pong only) -->
              <div *ngIf="activeSport() === 'pingpong'" class="pingpong-table-line"></div>

              <!-- Interactive Dynamic Ball -->
              <div class="football-wrapper" 
                   [class.kicked-success]="isKickedSuccess() && activeSport() === 'football'" 
                   [class.kicked-failure]="isKickedFailure() && activeSport() === 'football'"
                   [class.cricket-success]="isKickedSuccess() && activeSport() === 'cricket'"
                   [class.cricket-failure]="isKickedFailure() && activeSport() === 'cricket'"
                   [class.pingpong-success]="isKickedSuccess() && activeSport() === 'pingpong'"
                   [class.pingpong-failure]="isKickedFailure() && activeSport() === 'pingpong'">
                
                <!-- Soccer Ball -->
                <svg *ngIf="activeSport() === 'football'" class="football" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" fill="#ffffff" stroke="#1e293b" stroke-width="2.5"/>
                  <polygon points="50,34 35,45 41,61 59,61 65,45" fill="#1e293b"/>
                  <polygon points="50,12 37,2 63,2" fill="#1e293b"/>
                  <polygon points="12,41 2,52 2,28" fill="#1e293b"/>
                  <polygon points="88,41 98,28 98,52" fill="#1e293b"/>
                  <polygon points="26,80 14,92 38,92" fill="#1e293b"/>
                  <polygon points="74,80 62,92 86,92" fill="#1e293b"/>
                  <line x1="50" y1="34" x2="50" y2="12" stroke="#1e293b" stroke-width="2"/>
                  <line x1="35" y1="45" x2="12" y2="41" stroke="#1e293b" stroke-width="2"/>
                  <line x1="41" y1="61" x2="26" y2="80" stroke="#1e293b" stroke-width="2"/>
                  <line x1="59" y1="61" x2="74" y2="80" stroke="#1e293b" stroke-width="2"/>
                  <line x1="65" y1="45" x2="88" y2="41" stroke="#1e293b" stroke-width="2"/>
                  <line x1="37" y1="2" x2="21" y2="16" stroke="#1e293b" stroke-width="2"/>
                  <line x1="63" y1="2" x2="79" y2="16" stroke="#1e293b" stroke-width="2"/>
                  <line x1="2" y1="28" x2="21" y2="16" stroke="#1e293b" stroke-width="2"/>
                  <line x1="98" y1="28" x2="79" y2="16" stroke="#1e293b" stroke-width="2"/>
                  <line x1="2" y1="52" x2="14" y2="64" stroke="#1e293b" stroke-width="2"/>
                  <line x1="98" y1="52" x2="86" y2="64" stroke="#1e293b" stroke-width="2"/>
                  <line x1="14" y1="92" x2="14" y2="64" stroke="#1e293b" stroke-width="2"/>
                  <line x1="86" y1="92" x2="86" y2="64" stroke="#1e293b" stroke-width="2"/>
                  <line x1="38" y1="92" x2="50" y2="82" stroke="#1e293b" stroke-width="2"/>
                  <line x1="62" y1="92" x2="50" y2="82" stroke="#1e293b" stroke-width="2"/>
                  <line x1="26" y1="80" x2="14" y2="64" stroke="#1e293b" stroke-width="2"/>
                  <line x1="74" y1="80" x2="86" y2="64" stroke="#1e293b" stroke-width="2"/>
                  <line x1="12" y1="41" x2="21" y2="16" stroke="#1e293b" stroke-width="2"/>
                  <line x1="88" y1="41" x2="79" y2="16" stroke="#1e293b" stroke-width="2"/>
                </svg>

                <!-- Cricket Ball -->
                <svg *ngIf="activeSport() === 'cricket'" class="cricket-ball" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" fill="#dc2626" stroke="#991b1b" stroke-width="2.5"/>
                  <path d="M12,30 A46,46 0 0,0 88,70" fill="none" stroke="#ef4444" stroke-width="5" opacity="0.4"/>
                  <line x1="50" y1="4" x2="50" y2="96" stroke="#ffffff" stroke-width="3" stroke-dasharray="2 2"/>
                  <line x1="47" y1="4" x2="47" y2="96" stroke="#991b1b" stroke-width="1.5"/>
                  <line x1="53" y1="4" x2="53" y2="96" stroke="#991b1b" stroke-width="1.5"/>
                </svg>

                <!-- Ping-Pong Ball -->
                <svg *ngIf="activeSport() === 'pingpong'" class="pingpong-ball" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="46" fill="#f97316" stroke="#ea580c" stroke-width="2.5"/>
                  <circle cx="38" cy="38" r="14" fill="#ffedd5" opacity="0.65"/>
                </svg>
                
                <div class="football-shadow"></div>
              </div>
              
              <div class="field-grass-texture"></div>
            </div>

            <!-- Login Form component itself -->
            <app-login-form 
              [loading]="isLoading()" 
              (login)="handleLogin($event)"
            ></app-login-form>

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
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, AfterViewInit {
  @ViewChild('bgVideo') bgVideo?: ElementRef<HTMLVideoElement>;
  isLoading = signal(false);
  activeSport = signal<'football' | 'cricket' | 'pingpong'>('football');
  backgroundVideo = signal<string>(DEFAULT_AUTH_BACKGROUND_VIDEO);

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

  ngAfterViewInit() {
    const video = this.bgVideo?.nativeElement;
    if (!video) return;
    video.muted = true;
    void video.play();
  }

  ngOnInit() {
    // 1. Pick randomly from three active sports!
    const sports: ('football' | 'cricket' | 'pingpong')[] = ['football', 'cricket', 'pingpong'];
    this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);

    // Fade out the entry overlay transition after component loads
    setTimeout(() => {
      this.isOverlayActive.set(false);
    }, 150);
  }

  handleLogin(credentials: any) {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    // Reset any previous animation states
    this.isKickedSuccess.set(false);
    this.isKickedFailure.set(false);
    this.isNetShaking.set(false);

    this.authRepository.login(credentials).subscribe({
      next: (response) => {
        if (response && response.auth && response.auth.token) {
          // Play winning animation!
          this.isKickedSuccess.set(true);

          // Net shakes / batsman hits six / crosses net
          setTimeout(() => {
            this.isNetShaking.set(true);
          }, 300);

          // Screen fills with colors
          setTimeout(() => {
            this.isOverlayActive.set(true);
          }, 500);

          // Navigation happens once transition finishes
          setTimeout(() => {
            this.authStore.setSession(response.user, response.auth.token, response.auth.refreshToken);
            this.notificationService.success('Logged in successfully!');
            this.router.navigate(['/home']);
            this.isLoading.set(false);
          }, 1500);
        } else {
          this.playFailureSequence('Login failed. Invalid response from server.');
        }
      },
      error: (err) => {
        let message = 'Login failed. Please check your credentials.';
        if (err.status === 401) {
          message = err.error?.message || 'Invalid email or password.';
        } else if (err.status === 429) {
          message = 'Too many attempts. Please try again later.';
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