import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { ThemeToggleComponent } from '../../../layout/theme-toggle/theme-toggle.component';
import { pickRandomAuthVideo } from '../../../core/constants/auth-background-videos';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent],
  template: `
    <div class="auth-container">
      <div class="auth-theme-bar">
        <app-theme-toggle />
      </div>
      <video class="auth-bg-video bg-video" autoplay loop muted playsinline preload="auto" [src]="backgroundVideo"></video>
      <div class="video-overlay"></div>
      <div class="glass auth-card floating">
        <div class="auth-header">
          <h1>Reset Password</h1>
          <p>Create a new strong password for your account.</p>
        </div>

        <form [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="auth-form" *ngIf="!resetSuccess()">
          <div class="form-group">
            <label for="password">New Password</label>
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
            <label for="confirmPassword">Confirm Password</label>
            <input 
              id="confirmPassword" 
              type="password" 
              formControlName="confirmPassword" 
              placeholder="••••••••"
              [class.invalid]="isFieldInvalid('confirmPassword')"
            >
          </div>

          <button type="submit" class="btn-premium" [disabled]="isLoading()">
            <span *ngIf="!isLoading()">Reset Password</span>
            <span *ngIf="isLoading()" class="spinner"></span>
          </button>
        </form>

        <div class="success-message" *ngIf="resetSuccess()">
          <div class="icon">✓</div>
          <h2>Password Reset!</h2>
          <p>Your password has been successfully updated. You can now login with your new password.</p>
          <button class="btn-premium" routerLink="/auth/login" style="margin-top: 1.5rem;">Go to Login</button>
        </div>

        <div class="error-banner" *ngIf="errorMessage()">
          {{ errorMessage() }}
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
      color: var(--primary);
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
export class ResetPasswordComponent implements OnInit {
  backgroundVideo = pickRandomAuthVideo();
  isLoading = signal(false);
  resetSuccess = signal(false);
  errorMessage = signal<string | null>(null);
  resetForm: FormGroup;
  token: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authRepository: AuthRepository,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).*$/)
      ]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.errorMessage.set('Invalid or missing reset token.');
    }
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  isFieldInvalid(field: string): boolean {
    const control = this.resetForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const data = {
      token: this.token,
      newPassword: this.resetForm.value.password
    };

    this.authRepository.resetPassword(data).subscribe({
      next: () => {
        this.resetSuccess.set(true);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Failed to reset password. Link might be expired.');
        this.isLoading.set(false);
      }
    });
  }
}
