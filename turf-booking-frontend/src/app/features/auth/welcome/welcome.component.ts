import { Component, signal } from '@angular/core';
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

      <!-- Welcome Glass Card -->
      <div class="glass welcome-card fade-in">
        <div class="header-section">
          <div class="app-logo">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="var(--primary)" stroke-width="2"/>
              <path d="M12 2V22M2 12H22" stroke="var(--primary)" stroke-width="1.5" stroke-dasharray="3 3"/>
              <circle cx="12" cy="12" r="4" stroke="var(--accent)" stroke-width="2"/>
            </svg>
          </div>
          <h1 class="glow-text">TurfXpert</h1>
          <p class="subtitle">Book Premium Turfs • Play with Passion</p>
        </div>

        <!-- Interactive Penalty Shootout Field -->
        <div class="football-field-preview">
          <!-- Goal Net Outline -->
          <div class="goal-post" [class.net-shake]="isNetShaking()">
            <div class="goal-net"></div>
          </div>

          <!-- Penalty Line/Box markings -->
          <div class="penalty-box"></div>
          <div class="penalty-spot"></div>

          <!-- Muscular Kicking Footballer Silhouette -->
          <div class="footballer-container" [class.run-kick]="isKicked()">
            <svg class="footballer" viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg">
              <!-- Standing Leg (Realistic quad & calf) -->
              <path class="standing-thigh" d="M 50 60 L 42 90" stroke="#ffffff" stroke-width="12.5" stroke-linecap="round" fill="none" />
              <path class="standing-calf" d="M 42 90 L 46 110" stroke="#ffffff" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round" fill="none" />

              <!-- Left Arm (extended backwards, thick and realistic) -->
              <path class="player-arm-back" d="M 53 35 L 32 45 C 27 47, 24 43, 22 38" stroke="var(--accent)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8" />

              <!-- Torso / Spine (Thick athletic chest & core) -->
              <path class="player-spine" d="M 50 60 L 53 30" stroke="#ffffff" stroke-width="16" stroke-linecap="round" fill="none" />

              <!-- Head -->
              <circle class="player-head" cx="54" cy="16" r="9.5" fill="#ffffff" />

              <!-- Right Arm (extended forwards for balance) -->
              <path class="player-arm-front" d="M 53 35 L 72 40 L 82 52" stroke="var(--accent)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.8" />

              <!-- Kicking Leg (swings forward around hip) -->
              <g class="kicking-leg-group">
                <!-- Kicking Thigh -->
                <path class="kicking-thigh" d="M 50 60 L 26 76" stroke="var(--primary)" stroke-width="13.5" stroke-linecap="round" fill="none" />
                <!-- Kicking Calf -->
                <path class="kicking-calf" d="M 26 76 L 14 100" stroke="var(--primary)" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none" />
              </g>
            </svg>
          </div>

          <!-- The Football -->
          <div class="football-wrapper" [class.kicked]="isBallKicked()">
            <svg class="football" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#1e293b" stroke-width="3"/>
              <path d="M50,30 L38,38 L43,54 L57,54 L62,38 Z" fill="#0f172a" stroke="#1e293b" stroke-width="2"/>
              <path d="M50,30 L50,8 M38,38 L22,28 M43,54 L32,72 M57,54 L68,72 M62,38 L78,28" stroke="#1e293b" stroke-width="2"/>
              <path d="M50,8 L32,14 L22,28" fill="none" stroke="#1e293b" stroke-width="2"/>
              <path d="M22,28 L12,46 L17,62 L32,72" fill="none" stroke="#1e293b" stroke-width="2"/>
              <path d="M32,72 L50,80 L68,72" fill="none" stroke="#1e293b" stroke-width="2"/>
              <path d="M68,72 L83,62 L88,46 L78,28" fill="none" stroke="#1e293b" stroke-width="2"/>
              <path d="M78,28 L68,14 L50,8" fill="none" stroke="#1e293b" stroke-width="2"/>
              <path d="M32,14 L38,38 M68,14 L62,38 M12,46 L22,28 M88,46 L78,28 M17,62 L43,54 M83,62 L57,54" stroke="#1e293b" stroke-width="2"/>
            </svg>
            <div class="football-shadow"></div>
          </div>
          
          <div class="field-grass-texture"></div>
        </div>

        <p class="instruction-text" *ngIf="!isKicked()">Choose your action to kick off!</p>
        <p class="instruction-text kicking-text" *ngIf="isKicked()">GOAL!!! Connecting...</p>

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

      <!-- Transition Overlay -->
      <div class="goal-overlay" [class.active]="isOverlayActive()">
        <div class="welcome-text-popup" [class.visible]="isOverlayActive()">
          <span class="welcome-tag">Welcome!</span>
          <span class="app-brand">TurfXpert</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container {
      min-height: calc(100vh - 80px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
      perspective: 1000px;
    }

    .welcome-card {
      width: 100%;
      max-width: 480px;
      padding: 3rem 2.5rem;
      z-index: 10;
      box-shadow: var(--shadow-float);
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
      position: relative;
      overflow: hidden;
    }

    .header-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

    .app-logo {
      width: 60px;
      height: 60px;
      margin-bottom: 0.5rem;
      animation: float 4s ease-in-out infinite;
    }

    .glow-text {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: 2px;
      background: linear-gradient(135deg, var(--text-primary) 30%, var(--primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 0 20px rgba(99, 102, 241, 0.2);
    }

    .subtitle {
      color: var(--text-secondary);
      font-size: 0.95rem;
      font-weight: 500;
    }

    /* Football Field Preview Styling */
    .football-field-preview {
      width: 100%;
      height: 200px;
      background: linear-gradient(180deg, #15803d 0%, #166534 100%);
      border-radius: 20px;
      border: 2px solid rgba(255, 255, 255, 0.1);
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.4);
      display: flex;
      justify-content: center;
      align-items: flex-end;
      padding-bottom: 25px;
    }

    .field-grass-texture {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.02) 0px, rgba(255, 255, 255, 0.02) 20px, transparent 20px, transparent 40px);
      pointer-events: none;
      z-index: 1;
    }

    /* Goal Post */
    .goal-post {
      position: absolute;
      top: 0;
      width: 120px;
      height: 45px;
      border: 3px solid #ffffff;
      border-top: none;
      border-radius: 0 0 8px 8px;
      z-index: 2;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      left: 50%;
      transform: translateX(-50%);
    }

    .goal-net {
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%),
        linear-gradient(-45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, rgba(255, 255, 255, 0.15) 75%),
        linear-gradient(-45deg, transparent 75%, rgba(255, 255, 255, 0.15) 75%);
      background-size: 8px 8px;
      background-position: 0 0, 0 4px, 4px -4px, -4px 0px;
      opacity: 0.8;
      transition: all 0.15s ease-in-out;
    }

    .net-shake {
      animation: shake 0.4s ease-in-out 3;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(-50%) translateY(0); }
      25% { transform: translateX(-50%) translateY(3px) skewX(-2deg); }
      75% { transform: translateX(-50%) translateY(-2px) skewX(2deg); }
    }

    /* Penalty Box and Spot */
    .penalty-box {
      position: absolute;
      top: 0;
      width: 200px;
      height: 90px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top: none;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 1;
    }

    .penalty-spot {
      position: absolute;
      bottom: 75px;
      width: 8px;
      height: 8px;
      background-color: rgba(255, 255, 255, 0.7);
      border-radius: 50%;
      left: 50%;
      transform: translateX(-50%);
      pointer-events: none;
      z-index: 2;
    }

    /* Footballer Silhouette Styling */
    .footballer-container {
      position: absolute;
      bottom: 15px;
      left: calc(50% - 65px);
      width: 55px;
      height: 66px;
      z-index: 3;
      pointer-events: none;
      filter: drop-shadow(0 0 6px rgba(165, 180, 252, 0.6));
      transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .footballer {
      width: 100%;
      height: 100%;
    }

    .kicking-leg-group {
      transform-origin: 50px 60px;
      transition: transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    .kicking-calf {
      transform-origin: 26px 76px;
      transition: transform 0.22s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* Kicking Animation States */
    .footballer-container.run-kick {
      transform: translateX(18px) translateY(-2px) scale(0.95);
    }

    .footballer-container.run-kick .kicking-leg-group {
      transform: rotate(85deg);
    }

    .footballer-container.run-kick .kicking-calf {
      transform: rotate(-35deg);
    }

    /* Football Styling */
    .football-wrapper {
      width: 45px;
      height: 45px;
      position: relative;
      z-index: 4;
      cursor: pointer;
      transition: transform 0.2s ease-out;
    }

    .football-wrapper:hover:not(.kicked) {
      transform: scale(1.1) translateY(-2px);
    }

    .football {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
      animation: float-ball 3s ease-in-out infinite alternate;
    }

    .football-shadow {
      position: absolute;
      bottom: -4px;
      left: 5%;
      width: 90%;
      height: 6px;
      background: rgba(0, 0, 0, 0.35);
      border-radius: 50%;
      filter: blur(2px);
      z-index: -1;
      transition: all 0.3s ease;
    }

    @keyframes float-ball {
      0% { transform: translateY(0); }
      100% { transform: translateY(-4px); }
    }

    /* Kick Animation */
    .football-wrapper.kicked {
      pointer-events: none;
      animation: kick 0.7s cubic-bezier(0.25, 1, 0.5, 1) forwards;
    }

    .football-wrapper.kicked .football {
      animation: spin-ball 0.7s linear forwards;
    }

    .football-wrapper.kicked .football-shadow {
      opacity: 0;
      transform: scale(0.1);
    }

    @keyframes kick {
      0% {
        transform: translateY(0) scale(1);
      }
      20% {
        transform: translateY(-20px) scale(1.2);
        filter: blur(0.5px);
      }
      100% {
        transform: translateY(-135px) scale(0.35);
        filter: blur(2px);
        opacity: 0.1;
      }
    }

    @keyframes spin-ball {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(1440deg); }
    }

    .instruction-text {
      color: var(--text-secondary);
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .kicking-text {
      color: var(--primary);
      font-weight: 600;
      animation: pulse 1s ease-in-out infinite;
    }

    /* Button Group styling */
    .btn-group {
      display: flex;
      gap: 1rem;
      width: 100%;
    }

    .btn-kick {
      flex: 1;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      letter-spacing: 1px;
    }

    .btn-secondary-glass {
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
      color: var(--text-primary);
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition-smooth);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    }

    .btn-secondary-glass:hover:not(:disabled) {
      background: rgba(99, 102, 241, 0.08);
      border-color: var(--primary);
      color: var(--primary);
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 25px rgba(99, 102, 241, 0.15);
    }

    .btn-kick:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none !important;
      box-shadow: none !important;
    }

    /* Goal transition overlay */
    .goal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: radial-gradient(circle, #22c55e 10%, #15803d 80%);
      z-index: 9999;
      pointer-events: none;
      opacity: 0;
      transform: scale(0);
      border-radius: 50%;
      transition: transform 0.6s cubic-bezier(0.7, 0, 0.3, 1), opacity 1.10s ease-in-out;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .goal-overlay.active {
      transform: scale(3);
      opacity: 1;
    }

    .welcome-text-popup {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      color: white;
      text-align: center;
      transform: scale(0.1);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }

    .welcome-text-popup.visible {
      transform: scale(0.35); /* Scale down relative to overlay scale of 3 */
      opacity: 1;
    }

    .welcome-tag {
      font-size: 3rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.95);
      letter-spacing: 2px;
      text-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .app-brand {
      font-size: 5rem;
      font-weight: 900;
      letter-spacing: 4px;
      background: linear-gradient(135deg, #ffffff 40%, #a5b4fc 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 40px rgba(255, 255, 255, 0.6);
      font-style: italic;
    }

    /* Background Orbs */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      z-index: 1;
      opacity: 0.35;
    }

    .orb-1 {
      width: 450px;
      height: 450px;
      background: var(--primary);
      top: -150px;
      right: -100px;
      animation: float 12s ease-in-out infinite alternate;
    }

    .orb-2 {
      width: 350px;
      height: 350px;
      background: var(--secondary);
      bottom: -100px;
      left: -80px;
      animation: float 9s ease-in-out infinite alternate-reverse;
    }

    .orb-3 {
      width: 250px;
      height: 250px;
      background: var(--accent);
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.15;
    }

    @media (max-width: 640px) {
      .welcome-card {
        padding: 2.5rem 1.5rem;
        gap: 1.5rem;
      }
      .glow-text {
        font-size: 2.15rem;
      }
      .btn-group {
        flex-direction: column;
      }
    }
  `]
})
export class WelcomeComponent {
  isKicked = signal(false);
  isBallKicked = signal(false);
  isNetShaking = signal(false);
  isOverlayActive = signal(false);
  isTransitioning = signal(false);

  constructor(private router: Router) {}

  onKickoff(action: 'login' | 'register') {
    if (this.isKicked()) return;

    // 1. Trigger the player running and leg swing animation
    this.isKicked.set(true);

    // 2. At 200ms (moment of impact), the ball takes flight!
    setTimeout(() => {
      this.isBallKicked.set(true);
    }, 200);

    // 3. At 500ms, the ball hits the net -> Net Shakes
    setTimeout(() => {
      this.isNetShaking.set(true);
    }, 500);

    // 4. At 700ms, start the circular welcome overlay filling the screen
    setTimeout(() => {
      this.isOverlayActive.set(true);
    }, 700);

    // 5. At 1700ms, when the overlay has fully scaled and covers the screen, navigate to page
    setTimeout(() => {
      this.router.navigate([`/auth/${action}`]).then(() => {
        // Reset local states in case the user navigates back
        this.isKicked.set(false);
        this.isBallKicked.set(false);
        this.isNetShaking.set(false);
        this.isOverlayActive.set(false);
      });
    }, 1700);
  }
}

