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
 <div class="turf-card flex-card-layout glass scale-in">
 <div class="card-image">
 <magic-pixel-image [src]="getImageSrc()"></magic-pixel-image>
 <button class="like-btn" [class.liked]="isLiked" (click)="toggleLike($event)" title="Like Turf">
 <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.fill-current]="isLiked"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
 </button>
 <img class="fallback" [src]="getImageSrc()" [alt]="turf.name" (error)="onImageError($event)" style="display:none;">
 <div class="rating-badge">Γÿà {{ turf.rating?.toFixed(1) }}</div>
 </div>
 
 <div class="card-content flex-card-body">
 <div class="card-header">
 <h3>{{ turf.name }}</h3>
 <span class="price">Γé╣{{ turf.pricePerHour }}<small>/hr</small></span>
 </div>
 
 <div class="card-info">
 <a *ngIf="turf.location" [href]="'https://www.google.com/maps/search/?api=1&query=' + turf.location" target="_blank" class="location" title="Open in Google Maps" style="text-decoration: none; cursor: pointer;">
 <svg class="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 14px; height: 14px; display: inline; vertical-align: middle; margin-right: 4px; padding-bottom: 2px;">
 <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" />
 <circle cx="12" cy="10.5" r="2.5" />
 </svg>
 Location View Γåù
 </a>
 </div>

 <p class="description">{{ turf.description }}</p>

 <button class="btn-premium btn-uniform" (click)="onBook()">
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
 .like-btn {
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
 .like-btn:hover {
 background: rgba(0, 0, 0, 0.6);
 transform: scale(1.1);
 }
 .like-btn.liked {
 background: rgba(239, 68, 68, 0.2);
 border-color: rgba(239, 68, 68, 0.5);
 color: #ef4444;
 }
 .like-btn.liked svg {
 fill: #ef4444;
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
 transition: color 0.2s;
 }
 .location:hover {
 color: var(--primary);
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
 @media (max-width: 768px) {
 .card-image {
 height: 200px;
 }
 .card-content {
 padding: 0.75rem;
 gap: 0.5rem;
 }
 .card-header {
 flex-direction: column;
 align-items: center;
 text-align: center;
 gap: 4px;
 }
 .card-header h3 {
 font-size: 0.95rem;
 white-space: nowrap;
 overflow: hidden;
 text-overflow: ellipsis;
 width: 100%;
 }
 .price {
 font-size: 0.9rem;
 }
 .price small {
 display: inline;
 font-size: 0.65rem;
 }
 .location {
 display: flex;
 font-size: 0.75rem;
 justify-content: center;
 margin-top: -4px;
 }
 .description {
 display: none;
 }
 .rating-badge {
 font-size: 0.7rem;
 padding: 2px 6px;
 top: 6px;
 right: 6px;
 }
 .btn-premium {
 height: 32px;
 min-height: 32px !important;
 font-size: 0.8rem;
 padding: 0 8px;
 margin-top: auto;
 }
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
 // Add to liked
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
 // Remove from liked
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


