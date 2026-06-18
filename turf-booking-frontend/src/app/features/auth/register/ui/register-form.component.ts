import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MagicShinyButtonComponent } from '../../../../shared/components/magic-ui/magic-shiny-button/magic-shiny-button.component';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MagicShinyButtonComponent],
  template: `
    <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
      <div class="form-group">
        <label for="name">Full Name</label>
        <input 
          id="name" 
          type="text" 
          formControlName="name" 
          placeholder="John Doe"
          [class.invalid]="isFieldInvalid('name')"
          (blur)="trimField('name')"
        >
        <span class="error-text" *ngIf="isFieldInvalid('name')">
          Full name is required
        </span>
      </div>

      <div class="form-group">
        <label for="email">Email</label>
        <input 
          id="email" 
          type="email" 
          formControlName="email" 
          placeholder="name@example.com"
          [class.invalid]="isFieldInvalid('email')"
          (input)="onEmailInput($event)"
          (keydown.space)="$event.preventDefault()"
          (blur)="trimField('email')"
        >
        <span class="error-text" *ngIf="isFieldInvalid('email')">
          Please enter a valid email address
        </span>
      </div>

      <div class="form-group">
        <label for="phoneNumber">Phone Number</label>
        <div class="phone-input-group">
          <select class="country-code glass" formControlName="countryCode">
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
          </select>
          <input 
            id="phoneNumber" 
            type="tel" 
            formControlName="phoneNumber" 
            placeholder="9876543210"
            [class.invalid]="isFieldInvalid('phoneNumber')"
            (input)="onPhoneInput($event)"
            (keydown.space)="$event.preventDefault()"
            (blur)="trimField('phoneNumber')"
          >
        </div>
        <span class="error-text" *ngIf="isFieldInvalid('phoneNumber')">
          Enter a valid 10-digit number (starts with 6-9)
        </span>
      </div>

      <div class="form-group">
        <label for="password">Create Password</label>
        <input 
          id="password" 
          type="password" 
          formControlName="password" 
          placeholder="••••••••"
          [class.invalid]="isFieldInvalid('password')"
          (blur)="trimField('password')"
        >
        <span class="error-text" *ngIf="isFieldInvalid('password')">
          Min 8 chars, with A-Z, a-z, 0-9 & special char
        </span>
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input 
          id="confirmPassword" 
          type="password" 
          formControlName="confirmPassword" 
          placeholder="••••••••"
          [class.invalid]="isFieldInvalid('confirmPassword')"
          (blur)="trimField('confirmPassword')"
        >
        <span class="error-text" *ngIf="isFieldInvalid('confirmPassword')">
          Passwords must match
        </span>
      </div>

      <magic-shiny-button 
        type="submit" 
        [loading]="loading"
      >
        Create Account
      </magic-shiny-button>

      <div class="form-footer" style="display: flex; flex-direction: column; gap: 0.4rem; align-items: center;">
        <p style="margin: 0;">Already have an account? <a routerLink="/auth/login">Sign in</a></p>
        <p style="margin: 0;"><a routerLink="/auth/login" style="font-size: 0.8rem; font-weight: 600; color: var(--primary);"><i class="bi bi-phone"></i> Sign up / Login instantly with OTP</a></p>
      </div>
    </form>
  `,
  styles: [`
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }
    .register-form input {
      padding: 12px 16px;
      font-size: 0.95rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }
    .phone-input-group {
      display: flex;
      gap: 0.4rem;
    }
    .country-code {
      width: 96px;
      height: 48px;
      padding: 0 1rem 0 0.4rem;
      border: 1px solid var(--border-color);
      border-radius: 8px;
      color: var(--text-primary);
      font-weight: 600;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.4rem center;
      background-size: 0.75rem;
      background-color: var(--bg-card);
    }
    .country-code:focus {
      border-color: var(--primary);
      outline: none;
    }
    .country-code option {
      background: var(--bg-card);
      color: var(--text-primary);
      padding: 6px;
    }
    label {
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .error-text {
      font-size: 0.675rem;
      color: var(--error-color);
      margin-top: 1px;
    }
    .invalid {
      border-color: var(--error-color) !important;
    }
    .form-footer {
      display: flex;
      justify-content: center;
      margin-top: 0.15rem;
      font-size: 0.8rem;
    }
    .form-footer p {
      color: var(--text-secondary);
    }
    .form-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      margin-left: 0.4rem;
    }
    .btn-premium {
      width: 100%;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.15rem;
      font-size: 0.9rem;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: var(--on-primary);
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class RegisterFormComponent implements OnInit {
  @Input() loading = false;
  @Input() initialEmail = '';
  @Input() initialName = '';
  @Input() initialPhone = '';
  @Output() register = new EventEmitter<any>();

  registerForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      countryCode: ['+91'],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[6-9][0-9]{9}$/)]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    if (this.initialEmail) {
      this.registerForm.get('email')?.setValue(this.initialEmail);
    }
    if (this.initialName) {
      this.registerForm.get('name')?.setValue(this.initialName);
    }
    if (this.initialPhone) {
      this.registerForm.get('phoneNumber')?.setValue(this.initialPhone);
    }
  }

  trimField(field: string) {
    const control = this.registerForm.get(field);
    if (control && typeof control.value === 'string') {
      control.setValue(control.value.trim());
    }
  }

  onEmailInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let val = inputElement.value;
    // Strip all spaces
    val = val.replace(/\s+/g, '');
    this.registerForm.get('email')?.setValue(val, { emitEvent: false });
    inputElement.value = val;
  }

  onPhoneInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let val = inputElement.value;
    // Strip all non-digits
    val = val.replace(/\D/g, '');
    // Limit to 10 digits
    val = val.substring(0, 10);
    this.registerForm.get('phoneNumber')?.setValue(val, { emitEvent: false });
    inputElement.value = val;
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { 'mismatch': true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    if (field === 'confirmPassword' && this.registerForm.hasError('mismatch') && control?.touched) {
      return true;
    }
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    // Trim all fields in the form to ignore whitespaces
    Object.keys(this.registerForm.controls).forEach(key => {
      this.trimField(key);
    });

    if (this.registerForm.valid) {
      const { countryCode, phoneNumber, ...otherData } = this.registerForm.value;
      this.register.emit({
        ...otherData,
        phoneNumber: `${countryCode}${phoneNumber}`
      });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
