import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { AuthStore } from '../../../core/services/auth.store';
import { NotificationService } from '../../../core/services/notification.service';
import { RegisterFormComponent } from './ui/register-form.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RegisterFormComponent],
  template: `
    <div class="auth-container">
      <div class="glass auth-card floating fade-in">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join us to start booking your favorite turfs</p>
        </div>

        <app-register-form 
          [loading]="isLoading()" 
          (register)="handleRegister($event)"
        ></app-register-form>
      </div>

      <!-- Decorative Elements for Antigravity Theme -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
  `,
  styleUrls: ['../login/login.component.css']
})
export class RegisterComponent {
  isLoading = signal(false);

  constructor(
    private authRepository: AuthRepository,
    private authStore: AuthStore,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  handleRegister(data: any) {
    this.isLoading.set(true);

    this.authRepository.register(data).subscribe({
      next: (message) => {
        this.notificationService.success(message || 'Registration successful! Please login.');
        this.router.navigate(['/auth/login']);
        this.isLoading.set(false);
      },
      error: (err) => {
        let message = 'Registration failed. Please try again.';
        
        // Handle specific "Email already exists" from backend (500 with message or custom format)
        if (err.error?.message?.includes('Email already exists')) {
          message = 'Email already exists. Please use a different email.';
        } else if (err.status === 400) {
          message = 'Please check your input and try again.';
        }

        this.notificationService.error(message);
        this.isLoading.set(false);
      }
    });
  }
}
