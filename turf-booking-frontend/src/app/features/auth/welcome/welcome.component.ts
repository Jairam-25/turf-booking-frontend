import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="welcome-container" [class.transitioning]="isTransitioning()">
      <!-- Background Orbs -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>

      <!-- High-End Split Grid Layout -->
      <div class="split-layout">
        
        <!-- Left Side: App Specs & Points -->
        <div class="info-pane fade-in">
          <div class="brand-header">
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

          <!-- Refined Points matching user requirements -->
          <div class="specs-list">
            <div class="spec-item">
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

            <div class="spec-item">
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

            <div class="spec-item">
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

        <!-- Right Side: The Interactive Shootout Card -->
        <div class="card-pane scale-in">
          <div class="glass welcome-card">
            
            <div class="header-section">
              <h2 class="card-title">Ready to Play?</h2>
              <p class="subtitle">Complete the dynamic shot to enter</p>
            </div>

            <!-- Sports Arena Preview -->
            <div class="football-field-preview" 
                 [class.cricket-field]="activeSport() === 'cricket'"
                 [class.pingpong-field]="activeSport() === 'pingpong'">
              
              <!-- Soccer: Goal Post & GK Silhouettes -->
              <div *ngIf="activeSport() === 'football'" class="goal-post" [class.net-shake]="isNetShaking()">
                <div class="goal-net"></div>
              </div>

              <!-- Soccer Kicker Silhouette -->
              <svg *ngIf="activeSport() === 'football'" class="kicker-player" [class.kick-swing]="isKicked()" viewBox="0 0 64 64" fill="currentColor">
                <circle cx="28" cy="12" r="4"/>
                <path d="M 28,16 C 24,20 20,28 18,34 L 14,32 L 16,42 L 24,38 L 26,26 L 32,32 L 36,44 L 42,42 L 36,30 L 32,20 Z" />
                <path d="M 28,16 L 38,18 L 44,14 L 46,18 L 38,24 Z"/>
                <path class="kicking-leg" d="M 26,26 L 32,36 L 40,40 L 42,37 L 34,32 Z"/>
              </svg>

              <!-- Soccer Goalkeeper Silhouette (dives/misses on landing page!) -->
              <svg *ngIf="activeSport() === 'football'" class="goalkeeper-player" [class.goalkeeper-miss]="isKicked()" viewBox="0 0 64 64" fill="currentColor">
                <circle cx="32" cy="12" r="4"/>
                <path d="M 32,16 C 26,18 22,24 22,30 L 26,45 L 30,45 L 30,32 L 34,32 L 34,45 L 38,45 L 42,30 C 42,24 38,18 32,16 Z"/>
                <path class="gk-left-arm" d="M 22,18 L 10,14 L 8,18 L 20,24 Z"/>
                <path class="gk-right-arm" d="M 42,18 L 54,14 L 56,18 L 44,24 Z"/>
              </svg>

              <!-- Cricket: Wooden Wickets & Batsman Silhouette -->
              <div *ngIf="activeSport() === 'cricket'" class="cricket-wickets">
                <div class="wicket stump-1"></div>
                <div class="wicket stump-2"></div>
                <div class="wicket stump-3"></div>
                <div class="bail bail-1"></div>
                <div class="bail bail-2"></div>
              </div>

              <svg *ngIf="activeSport() === 'cricket'" class="batsman-player" [class.bat-swing]="isKicked()" viewBox="0 0 64 64" fill="currentColor">
                <circle cx="36" cy="12" r="4"/>
                <path d="M 36,16 C 30,18 24,24 22,32 L 18,48 L 24,48 L 28,36 L 34,36 L 36,48 L 42,48 L 44,32 Z"/>
                <path class="batting-arms" d="M 32,18 L 22,24 L 20,32 Z"/>
                <rect class="cricket-bat" x="14" y="24" width="6" height="24" rx="2" transform="rotate(-35 14 24)" />
              </svg>

              <!-- Ping-Pong: Table Net & Paddle Silhouette -->
              <div *ngIf="activeSport() === 'pingpong'" class="pingpong-net" [class.net-shake]="isNetShaking()">
                <div class="pingpong-post left-post"></div>
                <div class="pingpong-post right-post"></div>
                <div class="pingpong-net-mesh"></div>
              </div>

              <svg *ngIf="activeSport() === 'pingpong'" class="pingpong-paddle" [class.paddle-swing]="isKicked()" viewBox="0 0 64 64" fill="currentColor">
                <circle cx="36" cy="24" r="14" />
                <rect x="33" y="34" width="6" height="18" rx="2" transform="rotate(-25 33 34)" />
              </svg>

              <!-- Penalty markings (Soccer only) -->
              <div *ngIf="activeSport() === 'football'" class="penalty-box"></div>
              <div *ngIf="activeSport() === 'football'" class="penalty-spot"></div>

              <!-- Pitch Line markings (Cricket only) -->
              <div *ngIf="activeSport() === 'cricket'" class="cricket-pitch-line"></div>

              <!-- Table line markings (Ping-pong only) -->
              <div *ngIf="activeSport() === 'pingpong'" class="pingpong-table-line"></div>

              <!-- Interactive Dynamic Ball -->
              <div class="football-wrapper" 
                   [class.kicked-success]="isKicked() && activeSport() === 'football'"
                   [class.cricket-success]="isKicked() && activeSport() === 'cricket'"
                   [class.pingpong-success]="isKicked() && activeSport() === 'pingpong'">
                
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

            <!-- Contextual action instruction text -->
            <p class="instruction-text" *ngIf="!isKicked()">
              Ready to swing?
            </p>
            <p class="instruction-text kicking-text" *ngIf="isKicked()">
              SUCCESS!!! Connecting...
            </p>

            <!-- Dynamic Action Buttons -->
            <div class="btn-group">
              <button (click)="onKickoff('login')" class="btn-premium btn-kick" [disabled]="isKicked()">
                <span>SIGN IN</span>
              </button>
              
              <button (click)="onKickoff('register')" class="btn-secondary-glass btn-kick" [disabled]="isKicked()">
                <span>REGISTER</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <!-- Transition Overlay with dynamic sport backgrounds -->
      <div class="goal-overlay" 
           [class.active]="isOverlayActive()"
           [class.football-bg]="activeSport() === 'football'"
           [class.cricket-bg]="activeSport() === 'cricket'"
           [class.pingpong-bg]="activeSport() === 'pingpong'">
        <div class="goal-text-popup" [class.visible]="isOverlayActive()">
          <span class="welcome-tag">Welcome!</span>
          <span class="app-brand">TurfXpert</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['../login/login.component.css']
})
export class WelcomeComponent implements OnInit {
  isKicked = signal(false);
  isNetShaking = signal(false);
  isOverlayActive = signal(false);
  isTransitioning = signal(false);
  activeSport = signal<'football' | 'cricket' | 'pingpong'>('football');

  constructor(private router: Router) { }

  ngOnInit() {
    // Pick randomly from all three sports
    const sports: ('football' | 'cricket' | 'pingpong')[] = ['football', 'cricket', 'pingpong'];
    this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);
  }

  onKickoff(action: 'login' | 'register') {
    if (this.isKicked()) return;

    this.isKicked.set(true);

    // 1. Shakes net / hits boundary / paddle hits table
    setTimeout(() => {
      this.isNetShaking.set(true);
    }, 300);

    // 2. Triggers screen-filling circular colored overlay
    setTimeout(() => {
      this.isOverlayActive.set(true);
    }, 500);

    // 3. Navigation happens after transition is complete
    setTimeout(() => {
      this.router.navigate([`/auth/${action}`]).then(() => {
        this.isKicked.set(false);
        this.isNetShaking.set(false);
        this.isOverlayActive.set(false);
      });
    }, 1500);
  }
}
