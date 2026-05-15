import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="glass auth-card floating">
        <div class="auth-header">
          <h1>Forgot Password?</h1>
          <p>No worries! Enter your email and we'll send you reset instructions.</p>
        </div>

        <form [formGroup]="forgetForm" (ngSubmit)="onSubmit()" class="auth-form" *ngIf="!emailSent()">
          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email" 
              type="email" 
              formControlName="email" 
              placeholder="name@example.com"
              [class.invalid]="isFieldInvalid('email')"
            >
          </div>

          <button type="submit" class="btn-premium" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Send Reset Link</span>
            <span *ngIf="isLoading()" class="spinner"></span>
          </button>
        </form>

        <div class="success-message" *ngIf="emailSent()">
          <div class="icon">✓</div>
          <h2>Check your email</h2>
          <p>We've sent a password reset link to <strong>{{ forgetForm.value.email }}</strong></p>
          <button class="btn-premium" routerLink="/auth/login" style="margin-top: 1.5rem;">Back to Login</button>
        </div>

        <div class="error-banner" *ngIf="errorMessage()">
          {{ errorMessage() }}
        </div>

        <div class="form-footer" *ngIf="!emailSent()">
          <a routerLink="/auth/login">Back to Login</a>
        </div>
      </div>

      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
  `,
  styleUrls: ['../login/login.component.css'],
  styles: [`
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .success-message {
      text-align: center;
      padding: 1rem 0;
    }
    .icon {
      font-size: 3rem;
      color: #10b981;
      margin-bottom: 1rem;
    }
    .success-message h2 {
      margin-bottom: 0.5rem;
    }
    .success-message p {
      color: var(--text-secondary);
    }
  `]
})
export class ForgotPasswordComponent {
  isLoading = signal(false);
  emailSent = signal(false);
  errorMessage = signal<string | null>(null);
  forgetForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authRepository: AuthRepository
  ) {
    this.forgetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.forgetForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.forgetForm.invalid) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authRepository.forgotPassword(this.forgetForm.value.email).subscribe({
      next: () => {
        this.emailSent.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Something went wrong. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
