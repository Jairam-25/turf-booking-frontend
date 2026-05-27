import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MagicShinyButtonComponent } from '../../../../shared/components/magic-ui/magic-shiny-button/magic-shiny-button.component';
import { AuthRepository } from '../../../../domain/repositories/auth.repository';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MagicShinyButtonComponent],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
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

      <!-- Password Mode Input -->
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
        <span class="error-text" *ngIf="isFieldInvalid('password')">
          Password is required
        </span>
      </div>

      <!-- OTP Mode Verification Input -->
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
          <span class="timer-text" *ngIf="countdown > 0">Resend OTP in {{ countdown }}s</span>
          <button type="button" class="btn-resend" *ngIf="countdown === 0" (click)="sendOtp()">Resend OTP</button>
        </div>
      </div>

      <magic-shiny-button 
        type="submit" 
        [loading]="loading || sendingOtp || verifyingOtp"
      >
        {{ isOtpMode ? (otpSent ? 'Verify & Sign In' : 'Send OTP') : 'Sign In' }}
      </magic-shiny-button>

      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
        
        <a href="javascript:void(0)" (click)="toggleMode()" class="forgot-link">
          <i class="bi bi-unlock-fill"></i> {{ isOtpMode ? 'Login with Password' : 'Login with OTP' }}
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
    input.has-prefix {
      padding-left: 78px !important;
    }
    @keyframes slideInLeft {
      from { opacity: 0; transform: translateX(-10px); }
      to { opacity: 1; transform: translateX(0); }
    }
    .error-text {
      font-size: 0.75rem;
      color: var(--error-color);
    }
    .invalid {
      border-color: var(--error-color) !important;
    }
    .form-footer {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.35rem;
      font-size: 0.825rem;
    }
    .form-footer p {
      color: var(--text-secondary);
    }
    .form-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      transition: var(--transition-smooth);
    }
    .form-footer a:hover {
      color: var(--accent);
    }
    .forgot-link {
      font-size: 0.775rem;
      cursor: pointer;
    }
    .otp-timer-container {
      display: flex;
      justify-content: flex-end;
      margin-top: 0.25rem;
    }
    .timer-text {
      font-size: 0.775rem;
      color: var(--text-secondary);
    }
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
    .btn-resend:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.3s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .otp-info-message {
      background-color: var(--card-bg, rgba(255, 255, 255, 0.05));
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 0.6rem 0.8rem;
      border-radius: 6px;
      font-size: 0.825rem;
      color: var(--text-secondary);
      margin-bottom: 0.65rem;
    }
    .otp-info-message strong {
      color: var(--primary);
    }
  `]
})
export class LoginFormComponent implements OnDestroy {
  @Input() loading = false;
  @Output() login = new EventEmitter<any>();

  loginForm: FormGroup;
  isPhoneType = false; // Start as false since field is empty
  isOtpMode = true; // OTP Mode is default per requirements
  otpSent = false;
  maskedEmail = '';
  
  sendingOtp = false;
  verifyingOtp = false;
  countdown = 60;
  countdownInterval: any;

  constructor(
    private fb: FormBuilder,
    private authRepository: AuthRepository,
    private notificationService: NotificationService
  ) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required, this.emailOrPhoneValidator()]],
      password: [''],
      otpCode: ['']
    });
  }

  ngOnDestroy() {
    this.clearInterval();
  }

  emailOrPhoneValidator() {
    return (control: any) => {
      const val = control.value;
      if (!val) return null;
      
      if (val.includes('@')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(val) ? null : { invalidEmail: true };
      } else {
        const phoneRegex = /^[6-9]\d{9}$/;
        return phoneRegex.test(val) ? null : { invalidPhone: true };
      }
    };
  }

  toggleMode() {
    this.isOtpMode = !this.isOtpMode;
    this.otpSent = false;
    this.maskedEmail = '';
    this.clearInterval();
    this.loginForm.patchValue({ emailOrPhone: '', password: '', otpCode: '' });
    
    // Clear flag state
    this.isPhoneType = false;
    
    const emailOrPhoneControl = this.loginForm.get('emailOrPhone');
    const passwordControl = this.loginForm.get('password');
    const otpControl = this.loginForm.get('otpCode');
    
    if (this.isOtpMode) {
      passwordControl?.clearValidators();
      otpControl?.clearValidators();
    } else {
      otpControl?.clearValidators();
      passwordControl?.setValidators([Validators.required]);
    }
    
    emailOrPhoneControl?.updateValueAndValidity();
    passwordControl?.updateValueAndValidity();
    otpControl?.updateValueAndValidity();
  }

  onEmailOrPhoneInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let val = inputElement.value;

    if (!val) {
      this.isPhoneType = false;
      this.loginForm.get('emailOrPhone')?.setValue('');
      return;
    }

    // Strip spaces
    val = val.replace(/\s+/g, '');
    const isOnlyDigits = /^[0-9]+$/.test(val);

    if (isOnlyDigits) {
      this.isPhoneType = true;
      val = val.substring(0, 10);
    } else {
      this.isPhoneType = false;
    }

    // Update form control and input element value
    this.loginForm.get('emailOrPhone')?.setValue(val);
    inputElement.value = val;
  }

  onOtpInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let val = inputElement.value.replace(/\D/g, '').substring(0, 6);
    this.loginForm.get('otpCode')?.setValue(val);
    inputElement.value = val;
  }

  trimField(field: string) {
    const control = this.loginForm.get(field);
    if (control && typeof control.value === 'string') {
      control.setValue(control.value.trim());
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  sendOtp() {
    const emailOrPhoneControl = this.loginForm.get('emailOrPhone');
    emailOrPhoneControl?.updateValueAndValidity();
    if (emailOrPhoneControl?.invalid) {
      emailOrPhoneControl.markAsTouched();
      return;
    }

    let val = emailOrPhoneControl?.value?.trim() || '';
    if (!val.includes('@')) {
      if (val.length === 10 && /^\d+$/.test(val)) {
        val = `+91${val}`;
      }
    }

    this.sendingOtp = true;
    this.authRepository.sendOtp(val).subscribe({
      next: (maskedEmail: string) => {
        this.sendingOtp = false;
        this.otpSent = true;
        this.maskedEmail = maskedEmail || 'your registered email';
        this.startTimer();
        this.notificationService.success(`OTP sent to ${this.maskedEmail}`);
        
        const otpControl = this.loginForm.get('otpCode');
        otpControl?.setValidators([Validators.required, Validators.pattern(/^\d{6}$/)]);
        otpControl?.updateValueAndValidity();
      },
      error: (err) => {
        this.sendingOtp = false;
        const msg = err.error?.message || err.error?.Message || 'Failed to send OTP. Please try again.';
        this.notificationService.error(msg);
      }
    });
  }

  verifyOtp() {
    const otpControl = this.loginForm.get('otpCode');
    if (otpControl?.invalid) {
      otpControl.markAsTouched();
      return;
    }

    let emailOrPhone = this.loginForm.value.emailOrPhone;
    if (!emailOrPhone.includes('@') && emailOrPhone.length === 10 && /^\d+$/.test(emailOrPhone)) {
      emailOrPhone = `+91${emailOrPhone}`;
    }

    const otpCode = this.loginForm.value.otpCode;

    this.verifyingOtp = true;
    this.authRepository.verifyOtp(emailOrPhone, otpCode).subscribe({
      next: (response) => {
        this.verifyingOtp = false;
        this.notificationService.success('OTP verified successfully!');
        this.login.emit(response);
      },
      error: (err) => {
        this.verifyingOtp = false;
        const msg = err.error?.message || err.error?.Message || 'Invalid or expired OTP. Please try again.';
        this.notificationService.error(msg);
      }
    });
  }

  startTimer() {
    this.countdown = 60;
    this.clearInterval();
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.clearInterval();
      }
    }, 1000);
  }

  clearInterval() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onSubmit() {
    Object.keys(this.loginForm.controls).forEach(key => {
      this.trimField(key);
    });

    if (this.isOtpMode) {
      if (!this.otpSent) {
        this.sendOtp();
      } else {
        this.verifyOtp();
      }
    } else {
      if (this.loginForm.get('emailOrPhone')?.invalid || this.loginForm.get('password')?.invalid) {
        this.loginForm.markAllAsTouched();
        return;
      }
      
      let emailOrPhone = this.loginForm.value.emailOrPhone;
      if (!emailOrPhone.includes('@') && emailOrPhone.length === 10 && /^\d+$/.test(emailOrPhone)) {
        emailOrPhone = `+91${emailOrPhone}`;
      }

      this.login.emit({
        emailOrPhone: emailOrPhone,
        password: this.loginForm.value.password
      });
    }
  }
}
