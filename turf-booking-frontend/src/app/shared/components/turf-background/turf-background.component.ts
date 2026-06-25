import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector: 'app-turf-background',
 standalone: true,
 imports: [CommonModule],
 template: `
 <div class="turf-background-container">
 <div class="turf-image"></div>
 <div class="vignette"></div>
 </div>
 `,
 styles: [`
 .turf-background-container {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 z-index: 0;
 overflow: hidden;
 background: var(--turf-bg-base, #030704);
 pointer-events: none;
 }
 .turf-image {
 width: 100%;
 height: 100%;
 background-image: url('/images/turf_sports_ground.png');
 background-size: cover;
 background-position: center;
 background-repeat: no-repeat;
 opacity: var(--turf-opacity, 0.75);
 filter: var(--turf-filter, brightness(0.75) contrast(1.1) saturate(1.0));
 transform: scale(1.02);
 }
 .vignette {
 position: absolute;
 inset: 0;
 background: var(--turf-vignette, radial-gradient(circle at center, rgba(3, 7, 4, 0.1) 20%, rgba(3, 7, 4, 0.8) 100%),
 linear-gradient(to bottom, rgba(3, 7, 4, 0.3) 0%, rgba(3, 7, 4, 0.9) 100%));
 pointer-events: none;
 }
 `]
})
export class TurfBackgroundComponent {}
