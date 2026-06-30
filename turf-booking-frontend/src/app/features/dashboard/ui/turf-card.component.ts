import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Turf } from '../../../domain/models/turf.model';
import { PixelImageComponent } from '../../../shared/components/magic-ui/magic-pixel-image/pixel-image.component';

@Component({
  selector: 'app-turf-card',
  standalone: true,
  imports: [CommonModule, PixelImageComponent],
  template: `
  <!-- WEB VIEW (Original Glassmorphic Design) -->
  <div class="web-view-only h-full">
    <div class="turf-card-web flex-card-layout glass scale-in h-full">
      <div class="card-image-web">
        <magic-pixel-image [src]="getImageSrc()"></magic-pixel-image>
        <button class="like-btn-web" [class.liked]="isLiked" (click)="toggleLike($event)" title="Like Turf">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.fill-current]="isLiked"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
        <img class="fallback" [src]="getImageSrc()" [alt]="turf.name" (error)="onImageError($event)" style="display:none;">
        <div class="rating-badge-web">★ {{ turf.rating?.toFixed(1) || '0.0' }}</div>
      </div>
      
      <div class="card-content-web flex-card-body flex flex-col grow">
        <div class="card-header-web flex justify-between items-start">
          <h3 class="font-bold text-lg text-[var(--text-primary)]">{{ turf.name }}</h3>
          <span class="price-web text-[var(--primary)] font-extrabold text-lg">₹{{ turf.pricePerHour }}<small class="text-xs text-[var(--text-secondary)] font-medium">/hr</small></span>
        </div>
        
        <div class="card-info-web mt-2">
          <a *ngIf="turf.location" [href]="'https://www.google.com/maps/search/?api=1&query=' + turf.location" target="_blank" class="location-web text-sm text-[var(--text-secondary)] flex items-center gap-2 hover:text-[var(--primary)] transition-colors" title="Open in Google Maps" style="text-decoration: none; cursor: pointer;">
            <svg class="loc-icon-web w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" />
              <circle cx="12" cy="10.5" r="2.5" />
            </svg>
            Location View ↗
          </a>
        </div>

        <p class="description-web text-sm text-[var(--text-secondary)] leading-relaxed mt-2 mb-4">{{ turf.description }}</p>

        <button class="btn-premium btn-uniform w-full h-[44px] mt-auto" (click)="onBook()">
          Book Now
        </button>
      </div>
    </div>
  </div>

  <!-- MOBILE APP VIEW (TurfXpert Premium) -->
  <div class="mobile-app-view-only h-full">
    <div class="turf-card-mobile h-full cursor-pointer" (click)="onBook()">
      <div class="card-image-wrapper-mobile">
        <magic-pixel-image [src]="getImageSrc()"></magic-pixel-image>
        
        <!-- Badges -->
        <div class="rating-badge-mobile" *ngIf="turf.rating && turf.rating > 0">
          <svg class="star-icon-mobile" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
          {{ turf.rating.toFixed(1) }}
        </div>
        <div class="rating-badge-mobile new-badge-mobile" *ngIf="!turf.rating || turf.rating === 0">New</div>
        
        <button class="like-btn-mobile" [class.liked]="isLiked" (click)="toggleLike($event)" title="Like Turf">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.fill-current]="isLiked"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
        </button>
      </div>
      
      <div class="card-body-mobile flex flex-col grow">
        <h3 class="turf-name-mobile">{{ turf.name }}</h3>
        
        <div class="turf-location-mobile" *ngIf="turf.location">
          <svg class="loc-icon-mobile" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" />
            <circle cx="12" cy="10.5" r="2.5" />
          </svg>
          <span class="loc-text-mobile truncate">{{ turf.location }}</span>
        </div>

        <div class="price-row-mobile">
          <span class="price-val-mobile">₹{{ turf.pricePerHour }}<span class="price-unit-mobile">/hr</span></span>
        </div>

        <button class="btn-book-mobile" (click)="onBook()">Book Now</button>
      </div>
    </div>
  </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }
    .web-view-only {
      display: block;
    }
    .mobile-app-view-only {
      display: none;
    }
    :host-context(body.is-mobile-app) .web-view-only {
      display: none;
    }
    :host-context(body.is-mobile-app) .mobile-app-view-only {
      display: block;
    }

    /* --- WEB VIEW CSS (Glassmorphic) --- */
    .turf-card-web {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      transition: var(--transition-smooth);
    }
    .turf-card-web:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 12px 30px rgba(var(--primary-rgb), 0.2), var(--shadow-float);
      border-color: var(--primary);
    }
    .card-image-web {
      position: relative;
      height: 200px;
    }
    .rating-badge-web {
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
    .like-btn-web {
      position: absolute;
      top: 1rem;
      left: 1rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 10;
    }
    .like-btn-web:hover {
      background: rgba(0, 0, 0, 0.6);
      transform: scale(1.1);
    }
    .like-btn-web.liked {
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.5);
      color: #ef4444;
    }
    .like-btn-web.liked svg {
      fill: #ef4444;
    }
    .card-content-web {
      padding: 1.5rem;
    }

    @media (max-width: 768px) {
      .card-image-web {
        height: 200px;
      }
      .card-content-web {
        padding: 0.75rem;
        gap: 0.5rem;
      }
      .card-header-web {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 4px;
      }
      .card-header-web h3 {
        font-size: 0.95rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
      }
      .price-web { font-size: 0.9rem; }
      .price-web small { display: inline; font-size: 0.65rem; }
      .location-web { display: flex; font-size: 0.75rem; justify-content: center; margin-top: -4px; }
      .description-web { display: none; }
      .rating-badge-web { font-size: 0.7rem; padding: 2px 6px; top: 6px; right: 6px; }
      .btn-premium { height: 32px; min-height: 32px !important; font-size: 0.8rem; padding: 0 8px; margin-top: auto; }
    }


    /* --- MOBILE APP CSS (TurfXpert Premium) --- */
    .turf-card-mobile {
      display: flex;
      flex-direction: column;
      background: #ffffff;
      border-radius: 24px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    
      cursor: pointer;
    }
    :host-context(body.dark) .turf-card-mobile {
      background: rgba(30, 41, 59, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    }
    .card-image-wrapper-mobile {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background-color: #0c0f1a;
    }
    .card-image-wrapper-mobile magic-pixel-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .like-btn-mobile {
      position: absolute;
      bottom: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      cursor: pointer;
      z-index: 10;
    }
    :host-context(body.dark) .like-btn-mobile {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
    }
    .like-btn-mobile:active { transform: scale(0.9); }
    .like-btn-mobile.liked { color: #ef4444; border-color: rgba(239, 68, 68, 0.3); background: rgba(239, 68, 68, 0.1); }
    .rating-badge-mobile {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(12, 15, 26, 0.8);
      backdrop-filter: blur(12px);
      padding: 6px 12px;
      border-radius: 12px;
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    }
    .star-icon-mobile { width: 14px; height: 14px; color: #FBBF24; }
    .new-badge-mobile { background: var(--primary); border: none; color: white; box-shadow: 0 4px 15px rgba(var(--primary-rgb), 0.4); }
    .card-body-mobile {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 8px;
    }
    .turf-name-mobile {
      font-size: 15px;
      font-weight: 800;
      color: #121212;
      margin-bottom: 4px;
      line-height: 1.3;
    }
    :host-context(body.dark) .turf-name-mobile {
      color: white;
    }
    .turf-location-mobile {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #94A3B8;
      font-size: 13px;
    }
    .loc-icon-mobile { width: 14px; height: 14px; flex-shrink: 0; }
    .loc-text-mobile { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .price-row-mobile { margin-top: 4px; margin-bottom: 12px; }
    .price-val-mobile {
      font-size: 14px;
      font-weight: 800;
      color: #121212;
    }
    :host-context(body.dark) .price-val-mobile {
      color: white;
    }
    .price-unit-mobile { font-size: 13px; font-weight: 500; color: #64748B; margin-left: 2px; }
    .btn-book-mobile {
      display: none; /* User's image has no book button on the card! */
    }
    .btn-book-mobile:active {
      transform: scale(0.98);
      box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
    }
  `]
})
export class TurfCardComponent implements OnInit {
  @Input({ required: true }) turf!: Turf;
  isLiked = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkIfLiked();
  }

  checkIfLiked() {
    const liked = localStorage.getItem('likedTurfs');
    if (liked) {
      try {
        const parsed = JSON.parse(liked);
        this.isLiked = parsed.some((t: any) => t.id === this.turf.id);
      } catch (e) {}
    }
  }

  toggleLike(event: Event) {
    event.stopPropagation();
    this.isLiked = !this.isLiked;
    
    let likedTurfs = [];
    const likedStr = localStorage.getItem('likedTurfs');
    if (likedStr) {
      try { likedTurfs = JSON.parse(likedStr); } catch (e) {}
    }

    if (this.isLiked) {
      if (!likedTurfs.some((t: any) => t.id === this.turf.id)) {
        likedTurfs.push({
          id: this.turf.id,
          name: this.turf.name,
          location: this.turf.location,
          imageUrl: this.getImageSrc(),
          pricePerHour: this.turf.pricePerHour,
          rating: this.turf.rating,
          description: this.turf.description
        });
      }
    } else {
      likedTurfs = likedTurfs.filter((t: any) => t.id !== this.turf.id);
    }
    
    localStorage.setItem('likedTurfs', JSON.stringify(likedTurfs));
  }

  getImageSrc(): string {
    return (this.turf?.imageUrl && this.turf.imageUrl.trim() !== '') ? this.turf.imageUrl : '/images/turf_sports_ground.png';
  }

  onBook() {
    this.router.navigate(['/dashboard/turf', this.turf.id]);
  }

  onImageError(event: any) {
    event.target.src = '/images/turf_sports_ground.png';
  }
}
