import { Component, EventEmitter, Input, Output, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MagicShinyButtonComponent } from '../../../../shared/components/magic-ui/magic-shiny-button/magic-shiny-button.component';
import { AuthRepository } from '../../../../domain/repositories/auth.repository';
import { NotificationService } from '../../../../core/services/notification.service';
import { FirebaseAuthService } from '../../../../core/services/firebase-auth.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MagicShinyButtonComponent],
  template: `
    <!-- Google OTP Mode -->
    <div *ngIf="isGoogleOtpMode" class="login-form">
      <!-- Google User Info Card -->
      <div class="google-user-card">
        <img 
          *ngIf="googlePhotoURL" 
          [src]="googlePhotoURL" 
          class="google-avatar" 
          alt="Google account avatar"
          (error)="googlePhotoURL = ''"
        >
        <div *ngIf="!googlePhotoURL" class="google-avatar-placeholder">
          {{ googleDisplayName.charAt(0) || 'G' }}
        </div>
        <div class="google-user-info">
          <div class="google-user-header">
            <span class="google-user-name">{{ googleDisplayName }}</span>
            <button type="button" class="btn-change-account" (click)="reselectGoogleAccount()">
              Change
            </button>
          </div>
          <span class="google-user-email">{{ googleEmail }}</span>
        </div>
      </div>

      <div class="otp-info-message" *ngIf="googleOtpSent">
        OTP sent to your registered email: <strong>{{ maskedEmail }}</strong>
      </div>

      <div class="form-group animate-fade-in-up" *ngIf="googleOtpSent">
        <label for="googleOtpCode">OTP Verification Code</label>
        <input
          id="googleOtpCode"
          type="text"
          [formControl]="googleOtpControl"
          placeholder="Enter 6-digit OTP"
          maxlength="6"
          [class.invalid]="googleOtpControl.invalid && googleOtpControl.touched"
          (keydown.space)="$event.preventDefault()"
          (input)="onGoogleOtpInput($event)"
        >
        <span class="error-text" *ngIf="googleOtpControl.invalid && googleOtpControl.touched">
          Please enter a valid 6-digit OTP code
        </span>
        <div class="otp-timer-container">
          <span class="timer-text" *ngIf="countdown() > 0">Resend OTP in {{ countdown() }}s</span>
          <button type="button" class="btn-resend" *ngIf="countdown() === 0" (click)="sendGoogleOtp()">Resend OTP</button>
        </div>
      </div>

      <magic-shiny-button
        type="button"
        [loading]="loading || googleLoading()"
        (click)="googleOtpSent ? verifyGoogleOtp() : sendGoogleOtp()"
      >
        {{ googleOtpSent ? 'Verify & Sign In' : 'Send OTP to Email' }}
      </magic-shiny-button>

      <div class="form-footer">
        <a href="javascript:void(0)" (click)="cancelGoogleMode()" class="forgot-link">
          ← Back to Login
        </a>
      </div>
    </div>

    <!-- Normal Login Form -->
    <form *ngIf="!isGoogleOtpMode" [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      <div class="form-group">
        <label for="emailOrPhone">Email or Phone Number</label>
        <div class="input-prefix-container">
          <span class="phone-prefix" *ngIf="isPhoneType">🇮🇳 +91</span>
          <input
            id="emailOrPhone"
            type="text"
            formControlName="emailOrPhone"
            placeholder="name@example.com or 9876543210"
            [class.invalid]="isFieldInvalid('emailOrPhone')"
            [class.has-prefix]="isPhoneType"
            (input)="onEmailOrPhoneInput($event)"
            (keydown.space)="$event.preventDefault()"
            (blur)="trimField('emailOrPhone')"
          >
        </div>
        <span class="error-text" *ngIf="isFieldInvalid('emailOrPhone')">
          Please enter a valid email or 10-digit phone number
        </span>
      </div>

      <!-- Password Mode -->
      <div class="form-group animate-fade-in-up" *ngIf="!isOtpMode">
        <label for="password">Password</label>
        <input
          id="password"
          type="password"
          formControlName="password"
          placeholder="••••••••"
          [class.invalid]="isFieldInvalid('password')"
          (keydown.space)="$event.preventDefault()"
          (blur)="trimField('password')"
        >
        <span class="error-text" *ngIf="isFieldInvalid('password')">Password is required</span>
      </div>

      <!-- OTP Mode -->
      <div class="form-group animate-fade-in-up" *ngIf="isOtpMode && otpSent">
        <div class="otp-info-message">
          OTP has been sent to your registered email: <strong>{{ maskedEmail }}</strong>
        </div>
        <label for="otpCode">OTP Verification Code</label>
        <input
          id="otpCode"
          type="text"
          formControlName="otpCode"
          placeholder="Enter 6-digit OTP"
          maxlength="6"
          [class.invalid]="isFieldInvalid('otpCode')"
          (keydown.space)="$event.preventDefault()"
          (input)="onOtpInput($event)"
        >
        <span class="error-text" *ngIf="isFieldInvalid('otpCode')">
          Please enter a valid 6-digit OTP code
        </span>
        <div class="otp-timer-container">
          <span class="timer-text" *ngIf="countdown() > 0">Resend OTP in {{ countdown() }}s</span>
          <button type="button" class="btn-resend" *ngIf="countdown() === 0" (click)="sendOtp()">Resend OTP</button>
        </div>
      </div>

      <magic-shiny-button type="submit" [loading]="loading || sendingOtp || verifyingOtp">
        {{ isOtpMode ? (otpSent ? 'Verify & Sign In' : 'Send OTP') : 'Sign In' }}
      </magic-shiny-button>

      <!-- Google Sign-In Divider -->
      <div class="divider">
        <span>or</span>
      </div>

      <!-- Google Sign-In Button -->
      <button
        type="button"
        class="google-btn"
        [disabled]="googleLoading()"
        (click)="startGoogleSignIn()"
        id="google-signin-btn"
      >
        <span *ngIf="!googleLoading()" class="google-btn-content">
          <svg class="google-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </span>
        <span *ngIf="googleLoading()" class="google-btn-loading">
          <span class="spinner"></span> Connecting to Google...
        </span>
      </button>

      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
        <a href="javascript:void(0)" (click)="toggleMode()" class="forgot-link">
          {{ isOtpMode ? 'Login with Password' : 'Login with OTP' }}
        </a>
        <a routerLink="/auth/forgot-password" class="forgot-link" *ngIf="!isOtpMode">Forgot password?</a>
      </div>
    </form>
  `,
  styles: [`
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      width: 100%;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.3rem;
    }
    label {
      font-size: 0.85rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .input-prefix-container {
      position: relative;
      display: flex;
      align-items: center;
      width: 100%;
    }
    .phone-prefix {
      position: absolute;
      left: 16px;
      font-weight: 600;
      color: var(--text-primary);
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.95rem;
      pointer-events: none;
      z-index: 5;
      animation: slideInLeft 0.25s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    input.has-prefix { padding-left: 78px !important; }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .error-text { font-size: 0.75rem; color: var(--error-color); }
    .invalid { border-color: var(--error-color) !important; }
    .form-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.35rem;
      font-size: 0.825rem;
    }
    .form-footer p { color: var(--text-secondary); }
    .form-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    .form-footer a:hover { color: var(--accent); }
    .forgot-link { font-size: 0.775rem; cursor: pointer; }
    .otp-timer-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.25rem;
    }
    .timer-text { font-size: 0.775rem; color: var(--text-secondary); }
    .btn-resend {
      background: none;
      border: none;
      color: var(--primary);
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
      padding: 0;
      transition: var(--transition-smooth);
    }
    .btn-resend:hover { color: var(--accent); text-decoration: underline; }
    .animate-fade-in-up { animation: fadeInUp 0.3s ease-out forwards; }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .otp-info-message {
      background-color: var(--card-bg, rgba(255,255,255,0.05));
      border: 1px solid rgba(255,255,255,0.1);
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font-size: 0.825rem;
      color: var(--text-secondary);
      margin-bottom: 0.65rem;
    }
    .otp-info-message strong { color: var(--primary); }

    /* ── Divider ── */
    .divider {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: var(--text-secondary);
      font-size: 0.78rem;
    }
    .divider::before, .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255,255,255,0.12);
    }

    /* ── Google Button ── */
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: 0.7rem 1.2rem;
      border-radius: 10px;
      border: 1px solid rgba(255,255,255,0.18);
      background: rgba(255,255,255,0.07);
      color: var(--text-primary);
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s ease;
      backdrop-filter: blur(8px);
      gap: 0.6rem;
    }
    .google-btn:hover:not(:disabled) {
      background: rgba(255,255,255,0.14);
      border-color: rgba(255,255,255,0.3);
      transform: translateY(-1px);
      box-shadow: 0 4px 20px rgba(66,133,244,0.25);
    }
    .google-btn:disabled { opacity: 0.65; cursor: not-allowed; }
    .google-btn-content {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .google-icon { width: 20px; height: 20px; flex-shrink: 0; }
    .google-btn-loading {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid rgba(255,255,255,0.2);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* ── Google User Card ── */
    .google-user-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.85rem 1rem;
      border-radius: 12px;
      background: rgba(66,133,244,0.1);
      border: 1px solid rgba(66,133,244,0.3);
      animation: fadeInUp 0.3s ease-out forwards;
    }
    .google-avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(66,133,244,0.5);
    }
    .google-avatar-placeholder {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #4285F4, #34A853);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      flex-shrink: 0;
    }
    .google-user-info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      flex-grow: 1;
    }
    .google-user-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
    }
    .btn-change-account {
      background: none;
      border: none;
      color: #4285F4;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 6px;
      border-radius: 4px;
      transition: all 0.2s;
    }
    .btn-change-account:hover {
      background: rgba(66, 133, 244, 0.15);
    }
    .google-user-name {
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--text-primary);
    }
    .google-user-email {
      font-size: 0.78rem;
      color: var(--text-secondary);
    }
  `]
})
export class LoginFormComponent implements OnDestroy {
  @Input() loading = false;
  @Output() login = new EventEmitter<any>();

  loginForm: FormGroup;
  isPhoneType = false;
  isOtpMode = true;
  otpSent = false;
  maskedEmail = '';
  sendingOtp = false;
  verifyingOtp = false;
  countdown = signal(60);
  countdownInterval: any;

  // Google OTP state
  isGoogleOtpMode = false;
  googleLoading = signal(false);
  googleOtpSent = false;
  googleEmail = '';
  googleDisplayName = '';
  googlePhotoURL = '';
  googleIdToken = '';
  googleOtpControl: ReturnType<FormBuilder['control']>;

  constructor(
    private fb: FormBuilder,
    private authRepository: AuthRepository,
    private notificationService: NotificationService,
    private firebaseAuth: FirebaseAuthService
  ) {
    this.googleOtpControl = this.fb.control('', [Validators.required, Validators.pattern(/^\d{6}$/)]);
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required, this.emailOrPhoneValidator()]],
      password: [''],
      otpCode: ['']
    });
  }

  ngOnDestroy() { this.clearInterval(); }

  // ── Google Sign-In Flow ──────────────────────────────────────────────────

  startGoogleSignIn() {
    this.googleLoading.set(true);
    this.firebaseAuth.signInWithGoogle().subscribe({
      next: (user) => {
        this.googleEmail = user.email || '';
        this.googleDisplayName = user.displayName || '';
        this.googlePhotoURL = user.photoURL || '';
        this.googleIdToken = user.idToken;
        this.isGoogleOtpMode = true;
        this.googleLoading.set(false);
        this.sendGoogleOtp();
      },
      error: (err) => {
        this.googleLoading.set(false);
        const code: string = err.code || '';
        if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
          return;
        }
        const errorMessages: Record<string, string> = {
          'auth/invalid-api-key':         '⚙️ Firebase API key is invalid. Update environment.ts with your real credentials.',
          'auth/configuration-not-found': '⚙️ Google sign-in not set up. Go to Firebase Console → Authentication → Sign-in method → enable Google.',
          'auth/operation-not-allowed':   '⚙️ Google sign-in is not enabled in Firebase Console.',
          'auth/unauthorized-domain':     '⚙️ This domain is not authorized in Firebase Console → Authentication → Settings → Authorized domains.',
          'auth/network-request-failed':  '🌐 Network error. Check your internet connection.',
          'auth/popup-blocked':           '🚫 Popup was blocked. Please allow popups for this site.',
          'auth/internal-error':          '⚙️ Firebase internal error. Check your Firebase project configuration.',
        };
        const msg = errorMessages[code]
          || `Google sign-in failed (${code || 'unknown'}). Check console for details.`;
        console.error('[Google Sign-In Error]', err);
        this.notificationService.error(msg);
      }
    });
  }

  sendGoogleOtp() {
    this.googleLoading.set(true);
    this.authRepository.googleSignIn(this.googleIdToken, this.googleEmail, this.googleDisplayName).subscribe({
      next: (maskedEmail: string) => {
        setTimeout(() => {
          this.googleLoading.set(false);
          this.googleOtpSent = true;
          this.maskedEmail = (typeof maskedEmail === 'string' && maskedEmail.includes('@'))
            ? maskedEmail
            : this.googleEmail.replace(/(.{2}).+(@.+)/, '$1****$2');
          this.startTimer();
          this.notificationService.success(`OTP sent to ${this.maskedEmail}`);
          this.googleOtpControl.reset();
        }, 0);
      },
      error: (err) => {
        this.googleLoading.set(false);
        const msg = err.error?.message || err.error?.Message || 'Failed to send OTP. Please try again.';
        this.notificationService.error(msg);
      }
    });
  }

  verifyGoogleOtp() {
    if (this.googleOtpControl.invalid) {
      this.googleOtpControl.markAsTouched();
      return;
    }
    this.googleLoading.set(true);
    this.authRepository.googleVerifyOtp(this.googleEmail, this.googleOtpControl.value as string).subscribe({
      next: (response) => {
        this.googleLoading.set(false);
        this.clearInterval();
        this.login.emit(response);
      },
      error: (err) => {
        this.googleLoading.set(false);
        const msg = err.error?.message || err.error?.Message || 'Invalid or expired OTP. Please try again.';
        this.notificationService.error(msg);
      }
    });
  }

  onGoogleOtpInput(event: Event) {
    const el = event.target as HTMLInputElement;
    const val = el.value.replace(/\D/g, '').substring(0, 6);
    this.googleOtpControl.setValue(val);
    el.value = val;
  }

  cancelGoogleMode() {
    this.isGoogleOtpMode = false;
    this.googleOtpSent = false;
    this.googleEmail = '';
    this.googleDisplayName = '';
    this.googlePhotoURL = '';
    this.googleIdToken = '';
    this.maskedEmail = '';
    this.googleOtpControl.reset();
    this.clearInterval();
  }

  reselectGoogleAccount() {
    this.googleOtpSent = false;
    this.maskedEmail = '';
    this.googleOtpControl.reset();
    this.clearInterval();
    this.startGoogleSignIn();
  }

  // ── OTP / Password Login Flow ────────────────────────────────────────────

  emailOrPhoneValidator() {
    return (control: any) => {
      const val = control.value;
      if (!val) return null;
      if (val.includes('@')) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : { invalidEmail: true };
      } else {
        return /^[6-9]\d{9}$/.test(val) ? null : { invalidPhone: true };
      }
    };
  }

  toggleMode() {
    this.isOtpMode = !this.isOtpMode;
    this.otpSent = false;
    this.maskedEmail = '';
    this.clearInterval();
    this.loginForm.patchValue({ emailOrPhone: '', password: '', otpCode: '' });
    this.isPhoneType = false;
    const pw = this.loginForm.get('password');
    const otp = this.loginForm.get('otpCode');
    if (this.isOtpMode) {
      pw?.clearValidators(); otp?.clearValidators();
    } else {
      otp?.clearValidators(); pw?.setValidators([Validators.required]);
    }
    pw?.updateValueAndValidity(); otp?.updateValueAndValidity();
    this.loginForm.get('emailOrPhone')?.updateValueAndValidity();
  }

  onEmailOrPhoneInput(event: Event) {
    const el = event.target as HTMLInputElement;
    let val = el.value.replace(/\s+/g, '');
    if (!val) { this.isPhoneType = false; this.loginForm.get('emailOrPhone')?.setValue(''); return; }
    if (/^[0-9]+$/.test(val)) {
      this.isPhoneType = true; val = val.substring(0, 10);
    } else {
      this.isPhoneType = false;
    }
    this.loginForm.get('emailOrPhone')?.setValue(val);
    el.value = val;
  }

  onOtpInput(event: Event) {
    const el = event.target as HTMLInputElement;
    const val = el.value.replace(/\D/g, '').substring(0, 6);
    this.loginForm.get('otpCode')?.setValue(val);
    el.value = val;
  }

  trimField(field: string) {
    const c = this.loginForm.get(field);
    if (c && typeof c.value === 'string') c.setValue(c.value.trim());
  }

  isFieldInvalid(field: string): boolean {
    const c = this.loginForm.get(field);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  sendOtp() {
    const ctrl = this.loginForm.get('emailOrPhone');
    ctrl?.updateValueAndValidity();
    if (ctrl?.invalid) { ctrl.markAsTouched(); return; }
    let val = ctrl?.value?.trim() || '';
    if (!val.includes('@') && val.length === 10 && /^\d+$/.test(val)) val = `+91${val}`;
    this.sendingOtp = true;
    this.authRepository.sendOtp(val).subscribe({
      next: (maskedEmail: string) => {
        this.sendingOtp = false;
        this.otpSent = true;
        this.maskedEmail = maskedEmail || 'your registered email';
        this.startTimer();
        this.notificationService.success(`OTP sent to ${this.maskedEmail}`);
        const otp = this.loginForm.get('otpCode');
        otp?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
        otp?.updateValueAndValidity();
      },
      error: (err) => {
        this.sendingOtp = false;
        this.notificationService.error(err.error?.message || err.error?.Message || 'Failed to send OTP.');
      }
    });
  }

  verifyOtp() {
    const otp = this.loginForm.get('otpCode');
    if (otp?.invalid) { otp.markAsTouched(); return; }
    let emailOrPhone = this.loginForm.value.emailOrPhone;
    if (!emailOrPhone.includes('@') && emailOrPhone.length === 10 && /^\d+$/.test(emailOrPhone)) {
      emailOrPhone = `+91${emailOrPhone}`;
    }
    this.verifyingOtp = true;
    this.authRepository.verifyOtp(emailOrPhone, this.loginForm.value.otpCode).subscribe({
      next: (response) => { this.verifyingOtp = false; this.login.emit(response); },
      error: (err) => {
        this.verifyingOtp = false;
        this.notificationService.error(err.error?.message || err.error?.Message || 'Invalid or expired OTP.');
      }
    });
  }

  startTimer() {
    this.countdown.set(60);
    this.clearInterval();
    this.countdownInterval = setInterval(() => {
      if (this.countdown() > 0) { this.countdown.update(c => c - 1); } else { this.clearInterval(); }
    }, 1000);
  }

  clearInterval() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
  }

  onSubmit() {
    Object.keys(this.loginForm.controls).forEach(k => this.trimField(k));
    if (this.isOtpMode) {
      if (!this.otpSent) { this.sendOtp(); } else { this.verifyOtp(); }
    } else {
      if (this.loginForm.get('emailOrPhone')?.invalid || this.loginForm.get('password')?.invalid) {
        this.loginForm.markAllAsTouched(); return;
      }
      let emailOrPhone = this.loginForm.value.emailOrPhone;
      if (!emailOrPhone.includes('@') && emailOrPhone.length === 10 && /^\d+$/.test(emailOrPhone)) {
        emailOrPhone = `+91${emailOrPhone}`;
      }
      this.login.emit({ emailOrPhone, password: this.loginForm.value.password });
    }
  }
}
