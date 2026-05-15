import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
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
          >
        </div>
        <span class="error-text" *ngIf="isFieldInvalid('phoneNumber')">
          Enter a valid 10-digit number (starts with 6-9)
        </span>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="password">Password</label>
          <input 
            id="password" 
            type="password" 
            formControlName="password" 
            placeholder="••••••••"
            [class.invalid]="isFieldInvalid('password')"
          >
          <span class="error-text" *ngIf="isFieldInvalid('password')">
            Min 8 chars, with A-Z, a-z, 0-9 & special char
          </span>
        </div>
        <div class="form-group">
          <label for="confirmPassword">Confirm</label>
          <input 
            id="confirmPassword" 
            type="password" 
            formControlName="confirmPassword" 
            placeholder="••••••••"
            [class.invalid]="isFieldInvalid('confirmPassword')"
          >
          <span class="error-text" *ngIf="isFieldInvalid('confirmPassword')">
            Passwords must match
          </span>
        </div>
      </div>

      <button type="submit" class="btn-premium" [disabled]="loading">
        <span *ngIf="!loading">Create Account</span>
        <span *ngIf="loading" class="spinner"></span>
      </button>

      <div class="form-footer">
        <p>Already have an account? <a routerLink="/auth/login">Sign in</a></p>
      </div>
    </form>
  `,
  styles: [`
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      width: 100%;
    }
    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .phone-input-group {
      display: flex;
      gap: 0.5rem;
    }
    .country-code {
      width: 110px;
      padding: 0 0.75rem;
      border: 1px solid var(--glass-border);
      border-radius: 12px;
      color: var(--text-primary);
      font-weight: 600;
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='white'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: right 0.75rem center;
      background-size: 1rem;
    }
    .country-code:focus {
      border-color: var(--primary);
      outline: none;
    }
    .country-code option {
      background: #0f172a;
      color: white;
      padding: 10px;
    }
    label {
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    .error-text {
      font-size: 0.75rem;
      color: var(--secondary);
    }
    .invalid {
      border-color: var(--secondary) !important;
    }
    .form-footer {
      display: flex;
      justify-content: center;
      margin-top: 1rem;
      font-size: 0.875rem;
    }
    .form-footer p {
      color: var(--text-secondary);
    }
    .form-footer a {
      color: var(--primary);
      text-decoration: none;
      font-weight: 600;
      margin-left: 0.5rem;
    }
    .btn-premium {
      width: 100%;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 0.5rem;
    }
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 0.8s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 480px) {
      .form-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterFormComponent {
  @Input() loading = false;
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
