import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthRepository } from '../../../domain/repositories/auth.repository';
import { AuthStore } from '../../../core/services/auth.store';
import { NotificationService } from '../../../core/services/notification.service';
import { LoginFormComponent } from './ui/login-form.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LoginFormComponent],
  template: `
    <div class="auth-container">
      <div class="glass auth-card floating fade-in">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Login to manage your turf bookings</p>
        </div>

        <app-login-form 
          [loading]="isLoading()" 
          (login)="handleLogin($event)"
        ></app-login-form>
      </div>

      <!-- Decorative Elements for Antigravity Theme -->
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
    </div>
  `,
  styleUrl: './login.component.css'
})
export class LoginComponent {
  isLoading = signal(false);

  constructor(
    private authRepository: AuthRepository,
    private authStore: AuthStore,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  handleLogin(credentials: any) {
    this.isLoading.set(true);

    this.authRepository.login(credentials).subscribe({
      next: (response) => {
        this.authStore.setSession(response.user, response.auth.token, response.auth.refreshToken);
        this.notificationService.success('Logged in successfully!');
        this.router.navigate(['/home']);
        this.isLoading.set(false);
      },
      error: (err) => {
        let message = 'Login failed. Please check your credentials.';
        
        if (err.status === 401) {
          message = 'Invalid email or password.';
        } else if (err.status === 429) {
          message = 'Too many attempts. Please try again later.';
        }

        this.notificationService.error(message);
        this.isLoading.set(false);
      }
    });
  }
}