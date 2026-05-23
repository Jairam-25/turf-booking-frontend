import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Turf } from '../../../domain/models/turf.model';
import { PixelImageComponent } from '../../../shared/components/magic-ui/magic-pixel-image/pixel-image.component';

@Component({
  selector: 'app-turf-card',
  standalone: true,
  imports: [CommonModule, PixelImageComponent],
  template: `
    <div class="turf-card glass scale-in">
      <div class="card-image">
        <magic-pixel-image [src]="getImageSrc()"></magic-pixel-image>
        <img class="fallback" [src]="getImageSrc()" [alt]="turf.name" (error)="onImageError($event)" style="display:none;">
        <div class="rating-badge">★ {{ turf.rating?.toFixed(1) }}</div>
      </div>
      
      <div class="card-content">
        <div class="card-header">
          <h3>{{ turf.name }}</h3>
          <span class="price">₹{{ turf.pricePerHour }}<small>/hr</small></span>
        </div>
        
        <div class="card-info">
          <span class="location">
            <i class="icon-location"></i> {{ turf.location }}
          </span>
        </div>

        <p class="description">{{ turf.description }}</p>

        <button class="btn-premium" (click)="onBook()">
          Book Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    .turf-card {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: var(--transition-smooth);
    }
    .turf-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 30px rgba(var(--primary-rgb), 0.2), var(--shadow-float);
      border-color: var(--primary);
    }
    .card-image {
      position: relative;
      height: 200px;
    }
    .card-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .rating-badge {
      position: absolute;
      top: 1rem;
      right: 1rem;
      background: var(--glass-bg);
      backdrop-filter: blur(4px);
      padding: 4px 10px;
      border-radius: 20px;
      color: var(--accent);
      font-weight: 700;
      font-size: 0.8125rem;
      border: 1px solid var(--glass-border);
    }
    .card-content {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 1rem;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .card-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-primary);
    }
    .price {
      color: var(--primary);
      font-weight: 800;
      font-size: 1.125rem;
    }
    .price small {
      font-size: 0.75rem;
      color: var(--text-secondary);
      font-weight: 500;
    }
    .location {
      font-size: 0.875rem;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .description {
      font-size: 0.875rem;
      color: var(--text-secondary);
      line-height: 1.5;
      margin: 0;
    }
    .btn-premium {
      margin-top: auto;
      width: 100%;
      height: 44px;
    }
  `]
})
export class TurfCardComponent {
  @Input({ required: true }) turf!: Turf;
  @Output() book = new EventEmitter<Turf>();

  getImageSrc(): string {
    return this.turf?.imageUrl ?? '/images/turf_sports_ground.png';
  }

  onBook() {
    this.book.emit(this.turf);
  }

  onImageError(event: any) {
    event.target.src = '/images/turf_sports_ground.png';
  }
}
