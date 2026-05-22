import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MagicShinyButtonComponent } from '../../../../shared/components/magic-ui/magic-shiny-button/magic-shiny-button.component';

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
          Please enter a valid email or phone number
        </span>
      </div>

      <div class="form-group">
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

      <magic-shiny-button 
        type="submit" 
        [loading]="loading"
      >
        Sign In
      </magic-shiny-button>

      <div class="form-footer">
        <p>Don't have an account? <a routerLink="/auth/register">Sign up</a></p>
        <a routerLink="/auth/forgot-password" class="forgot-link">Forgot password?</a>
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
      gap: 0.3rem;
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
    }
    .btn-premium {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.35);
      border-radius: 50%;
      border-top-color: var(--on-primary);
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginFormComponent {
  @Input() loading = false;
  @Output() login = new EventEmitter<any>();

  loginForm: FormGroup;
  isPhoneType = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onEmailOrPhoneInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let val = inputElement.value;

    if (!val) {
      this.isPhoneType = false;
      this.loginForm.get('emailOrPhone')?.setValue('', { emitEvent: false });
      return;
    }

    // Strip all spaces
    val = val.replace(/\s+/g, '');

    // Check if the entire string consists ONLY of digits
    const isOnlyDigits = /^[0-9]+$/.test(val);

    if (isOnlyDigits) {
      this.isPhoneType = true;
      // Limit to 10 digits
      val = val.substring(0, 10);
    } else {
      this.isPhoneType = false;
    }

    // Update form control and input element value
    this.loginForm.get('emailOrPhone')?.setValue(val, { emitEvent: false });
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

  onSubmit() {
    // Trim all fields in the form to ignore whitespaces
    Object.keys(this.loginForm.controls).forEach(key => {
      this.trimField(key);
    });

    if (this.loginForm.valid) {
      const credentials = { ...this.loginForm.value };
      // Prepend +91 if it's phone number
      if (this.isPhoneType) {
        credentials.emailOrPhone = `+91${credentials.emailOrPhone}`;
      }
      this.login.emit(credentials);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
