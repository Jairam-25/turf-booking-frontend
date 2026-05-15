import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-container fade-in">
      <section class="hero glass floating">
        <div class="hero-content">
          <h1>Experience the Best Turfs</h1>
          <p>Book your perfect game in seconds. Professional turfs, easy scheduling, and premium facilities.</p>
          <div class="hero-actions">
            <a routerLink="/dashboard" class="btn-premium">Go to Dashboard</a>
            <a routerLink="/bookings" class="btn-premium secondary">My Bookings</a>
          </div>
        </div>
      </section>

      <!-- Stats section for "Real-App" feel -->
      <div class="stats-grid">
        <div class="stat-card glass scale-in">
          <h3>50+</h3>
          <p>Premium Turfs</p>
        </div>
        <div class="stat-card glass scale-in">
          <h3>10k+</h3>
          <p>Happy Players</p>
        </div>
        <div class="stat-card glass scale-in">
          <h3>24/7</h3>
          <p>Support</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .home-container {
      padding: 4rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 4rem;
    }
    .hero {
      padding: 5rem 3rem;
      text-align: center;
      background: rgba(255, 255, 255, 0.05);
    }
    .hero h1 {
      font-size: 4rem;
      margin-bottom: 1.5rem;
      background: linear-gradient(to right, #fff, var(--text-secondary));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
    }
    .hero p {
      font-size: 1.25rem;
      color: var(--text-secondary);
      max-width: 600px;
      margin: 0 auto 2.5rem;
    }
    .hero-actions {
      display: flex;
      gap: 1.5rem;
      justify-content: center;
    }
    .btn-premium.secondary {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--glass-border);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 2rem;
    }
    .stat-card {
      padding: 2.5rem;
      text-align: center;
    }
    .stat-card h3 {
      font-size: 2.5rem;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .stat-card p {
      color: var(--text-secondary);
      font-weight: 500;
    }
    @media (max-width: 768px) {
      .hero h1 { font-size: 2.5rem; }
      .hero-actions { flex-direction: column; }
    }
  `]
})
export class HomeComponent {}
