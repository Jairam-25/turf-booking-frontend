import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { ThemeToggleComponent } from '../../../layout/theme-toggle/theme-toggle.component';
import { MagicCardDirective } from '../../../shared/directives/magic-card.directive';
import { MagicHexagonComponent } from '../../../shared/components/magic-ui/magic-hexagon/magic-hexagon.component';

@Component({
 selector: 'app-forget-password',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule, RouterModule, ThemeToggleComponent, MagicCardDirective, MagicHexagonComponent],
 template: `
 <div class="auth-container">
 <div class="auth-theme-bar absolute top-4 right-4 z-50">
 <app-theme-toggle />
 </div>
 
 <!-- Magic Hexagon Background filling the ENTIRE page -->
 <div class="absolute inset-0 pointer-events-none z-0">
 <app-magic-hexagon [size]="32" color="#7b39fc" [backgroundColor]="'transparent'" [animationSpeed]="0.05"></app-magic-hexagon>
 </div>

 <div class="split-layout">
 
 <!-- Left Side: App Specs & Points for Password Recovery -->
 <div class="info-pane relative z-10">
 <div class="brand-header animate-fade-in-down">
 <div class="app-logo">
 <img src="/images/logo.png" alt="TurfXpert Logo" class="h-full w-auto object-contain">
 </div>
 <p class="brand-tagline">Account Recovery</p>
 </div>

 <div class="specs-list">
 <div class="spec-item animate-fade-in-up animation-delay-100">
 <div class="spec-icon" title="Action">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
 <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z" />
 </svg>
 </div>
 <div class="spec-details">
 <h3>Secure Reset</h3>
 <p>We take your account security seriously. Reset your password safely via email.</p>
 </div>
 </div>

 <div class="spec-item animate-fade-in-up animation-delay-200">
 <div class="spec-icon" title="Back">
 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
 <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
 </svg>
 </div>
 <div class="spec-details">
 <h3>Fast Recovery</h3>
 <p>Receive your link instantly and get right back to booking your favorite turfs.</p>
 </div>
 </div>
 </div>
 </div>

 <!-- Right Side: Forgot Password Card -->
 <div class="card-pane relative z-10 animate-fade-in-up animation-delay-200">
 <div class="magic-card w-full max-w-[460px] rounded-[2rem]">
 <div class="magic-card-inner auth-card border-none">
 
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
 style="margin-top: 0.5rem;"
 >
 </div>

 <div class="form-actions" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
 <button type="submit" class="btn-premium btn-uniform" [disabled]="isLoading()">
 <span *ngIf="!isLoading()">Send Reset Link</span>
 <span *ngIf="isLoading()" class="spinner"></span>
 </button>
 
 <button type="button" class="btn-premium secondary btn-uniform" routerLink="/auth/login">
 Back to Login
 </button>
 </div>
 </form>

 <div class="success-message" *ngIf="emailSent()">
 <div class="icon">✓</div>
 <h2>Check your email</h2>
 <p>We've sent a password reset link to <strong>{{ forgetForm.value.email }}</strong></p>
 <button class="btn-premium btn-uniform" routerLink="/auth/login" style="margin-top: 2rem;">Back to Login</button>
 </div>

 <div class="error-banner" *ngIf="errorMessage()" style="margin-top: 1.5rem;">
 {{ errorMessage() }}
 </div>
 
 </div>
 </div>
 </div>

 </div>
 </div>
 `,
 styleUrls: ['../login/login.component.css'],
 styles: [`
 .auth-form {
 display: flex;
 flex-direction: column;
 gap: 2rem; /* Increased gap */
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
