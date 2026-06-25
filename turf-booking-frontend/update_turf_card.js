const fs = require('fs'); 
const content = fs.readFileSync('src/app/features/dashboard/ui/turf-card.component.ts', 'utf8'); 
const start = content.indexOf('template: `') + 11; 
const end = content.indexOf('export class TurfCardComponent'); 

const newTemplate = `
  <div class="turf-card">
    <div class="card-image-wrapper">
      <magic-pixel-image [src]="getImageSrc()"></magic-pixel-image>
      
      <!-- Badges -->
      <div class="rating-badge" *ngIf="turf.rating && turf.rating > 0">
        <svg class="star-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
        {{ turf.rating?.toFixed(1) }}
      </div>
      <div class="rating-badge new-badge" *ngIf="!turf.rating || turf.rating === 0">New</div>
      
      <button class="like-btn" [class.liked]="isLiked" (click)="toggleLike($event)" title="Like Turf">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.fill-current]="isLiked"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
      </button>
    </div>
    
    <div class="card-body">
      <h3 class="turf-name">{{ turf.name }}</h3>
      
      <div class="turf-location" *ngIf="turf.location">
        <svg class="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25C4.5 6.63 7.858 3.5 12 3.5s7.5 3.13 7.5 7v.5z" />
          <circle cx="12" cy="10.5" r="2.5" />
        </svg>
        <span class="loc-text truncate">{{ turf.location }}</span>
      </div>

      <div class="price-row">
        <span class="price-val">₹{{ turf.pricePerHour }}<span class="price-unit">/hr</span></span>
      </div>

      <button class="btn-book" (click)="onBook()">Book Now</button>
    </div>
  </div>
  \`,
  styles: [\`
    .turf-card {
      background-color: #12172B;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      border: 1px solid rgba(255,255,255,0.03);
    }
    .turf-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
    }
    .card-image-wrapper {
      position: relative;
      width: 100%;
      padding-top: 56.25%;
      background-color: #0A0E1A;
    }
    .card-image-wrapper magic-pixel-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .like-btn {
      position: absolute;
      top: 12px;
      left: 12px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(10,14,26,0.5);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255,255,255,0.1);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      cursor: pointer;
      z-index: 10;
    }
    .like-btn.liked { color: #ef4444; }
    .rating-badge {
      position: absolute;
      top: 12px;
      right: 12px;
      background: rgba(10, 14, 26, 0.7);
      backdrop-filter: blur(8px);
      padding: 4px 10px;
      border-radius: 12px;
      color: #fff;
      font-weight: 700;
      font-size: 13px;
      display: flex;
      align-items: center;
      gap: 4px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .star-icon { width: 14px; height: 14px; color: #FBBF24; }
    .new-badge { background: #7b39fc; border: none; }
    .card-body {
      padding: 16px;
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      gap: 8px;
    }
    .turf-name {
      margin: 0;
      color: #ffffff;
      font-size: 18px;
      font-weight: 700;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .turf-location {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #94A3B8;
      font-size: 13px;
    }
    .loc-icon { width: 14px; height: 14px; flex-shrink: 0; }
    .loc-text { flex-grow: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .price-row { margin-top: 4px; margin-bottom: 12px; }
    .price-val { color: #10B981; font-size: 18px; font-weight: 800; }
    .price-unit { font-size: 13px; font-weight: 500; color: #64748B; margin-left: 2px; }
    .btn-book {
      margin-top: auto;
      width: 100%;
      padding: 14px;
      border-radius: 12px;
      border: none;
      background: linear-gradient(135deg, #7b39fc 0%, #6025c0 100%);
      color: white;
      font-weight: 700;
      font-size: 15px;
      cursor: pointer;
      transition: opacity 0.2s ease;
    }
    .btn-book:active { opacity: 0.8; }
  \`]
})
`; 
fs.writeFileSync('src/app/features/dashboard/ui/turf-card.component.ts', content.substring(0, start) + newTemplate + content.substring(end), 'utf8');
