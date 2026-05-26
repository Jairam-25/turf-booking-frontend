import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turf, TurfResponse } from '../../domain/models/turf.model';
import { TurfCardComponent } from './ui/turf-card.component';
import { NotificationService } from '../../core/services/notification.service';
import { TurfRepository } from '../../domain/repositories/turf.repository';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TurfCardComponent],
  template: `
    <div class="dashboard-page fade-in">
      <!-- ... existing template ... -->
      <header class="dashboard-header glass">
        <div class="header-content">
          <h1>Find Your Perfect Game</h1>
          <div class="search-bar glass">
            <input 
              type="text" 
              placeholder="Search by name or location..." 
              class="search-input"
              (input)="onSearch($event)"
            >
            <button class="btn-search">Search</button>
          </div>
        </div>
      </header>

      <!-- Turf Grid -->
      <main class="turf-grid-container">
        <div class="grid-header">
          <h2>Available Turfs <span class="badge">{{ turfs().length }}</span></h2>
        </div>

        <div class="turf-grid" *ngIf="!isLoading(); else loadingTemplate">
          <app-turf-card 
            *ngFor="let turf of turfs()" 
            [turf]="turf"
          ></app-turf-card>
        </div>

        <!-- Empty State -->
        <div class="empty-state glass" *ngIf="!isLoading() && turfs().length === 0">
          <h3>No turfs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>

        <ng-template #loadingTemplate>
          <div class="turf-grid">
            <div class="glass card skeleton" *ngFor="let i of [1,2,3,4]"></div>
          </div>
        </ng-template>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 3rem;
    }
    .dashboard-header {
      padding: 4rem 2rem;
      border-radius: 24px;
      text-align: center;
      background:
        linear-gradient(rgba(var(--primary-rgb), 0.35), rgba(15, 23, 42, 0.75)),
        url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2000&auto=format&fit=crop');
      background-size: cover;
      background-position: center;
    }
    .header-content h1 {
      font-size: 3rem;
      margin-bottom: 2.5rem;
      color: var(--on-primary);
      text-shadow: 0 4px 12px rgba(0, 0, 0, 0.45);
    }
    .search-bar {
      max-width: 600px;
      margin: 0 auto;
      padding: 8px;
      display: flex;
      gap: 0.5rem;
      background: var(--glass-bg);
      border: 1px solid var(--glass-border);
    }
    .search-bar input {
      flex-grow: 1;
      background: transparent;
      border: none;
      color: var(--text-primary);
      padding: 0 1rem;
      font-size: 1rem;
    }
    .search-bar input::placeholder {
      color: var(--text-secondary);
    }
    .btn-search {
      padding: 10px 24px;
      border-radius: 12px;
      background: var(--primary);
      color: var(--on-primary);
      border: none;
      font-weight: 600;
      cursor: pointer;
    }

    :host-context(body[data-theme="light"]) .dashboard-header {
      background:
        linear-gradient(rgba(255, 255, 255, 0.75), rgba(248, 250, 252, 0.9)),
        url('https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=2000&auto=format&fit=crop');
    }

    :host-context(body[data-theme="light"]) .header-content h1 {
      color: var(--text-primary);
      text-shadow: none;
    }

    .turf-grid-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .grid-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .grid-header h2 {
      font-size: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .badge {
      background: rgba(99, 102, 241, 0.1);
      color: var(--primary);
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 0.875rem;
    }

    .turf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 2rem;
    }

    .skeleton {
      height: 400px;
      animation: pulse 1.5s infinite ease-in-out;
    }

    .empty-state {
      padding: 5rem;
      text-align: center;
      color: var(--text-secondary);
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    @media (max-width: 768px) {
      .dashboard-header { padding: 3rem 1rem; }
      .header-content h1 { font-size: 2rem; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  turfs = signal<Turf[]>([]);
  isLoading = signal(true);
  constructor(
    private turfRepository: TurfRepository,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.loadTurfs();
  }

  loadTurfs(search?: string) {
    this.isLoading.set(true);
    this.turfRepository.getAll({ search }).subscribe({
      next: (response: TurfResponse) => {
        let items = response.items;
        // Failsafe client-side filtering to guarantee exact match search results
        if (search) {
          const query = search.toLowerCase().trim();
          items = items.filter(t => 
            t.name.toLowerCase().includes(query) || 
            t.location.toLowerCase().includes(query) ||
            (t.description && t.description.toLowerCase().includes(query))
          );
        }
        this.turfs.set(items);
        this.isLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load turfs. Please try again later.');
        this.isLoading.set(false);
      }
    });
  }

  onSearch(event: any) {
    const term = event.target.value;
    this.loadTurfs(term);
  }
}
