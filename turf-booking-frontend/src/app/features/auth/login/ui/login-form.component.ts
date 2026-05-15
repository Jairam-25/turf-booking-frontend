import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
      <div class="form-group">
        <label for="emailOrPhone">Email or Phone Number</label>
        <input 
          id="emailOrPhone" 
          type="text" 
          formControlName="emailOrPhone" 
          placeholder="name@example.com or 1234567890"
          [class.invalid]="isFieldInvalid('emailOrPhone')"
        >
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
        >
        <span class="error-text" *ngIf="isFieldInvalid('password')">
          Password is required
        </span>
      </div>

      <button type="submit" class="btn-premium" [disabled]="loading">
        <span *ngIf="!loading">Sign In</span>
        <span *ngIf="loading" class="spinner"></span>
      </button>

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
      gap: 1.5rem;
      width: 100%;
    }
    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
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
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
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
      transition: var(--transition-smooth);
    }
    .form-footer a:hover {
      color: var(--accent);
    }
    .forgot-link {
      font-size: 0.8125rem;
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
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      border-top-color: white;
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

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.login.emit(this.loginForm.value);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        control?.markAsTouched();
      });
    }
  }
}
