import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector: 'app-dot-pattern',
 standalone: true,
 imports: [CommonModule],
 template: `
 <svg
 [ngClass]="['absolute inset-0 h-full w-full pointer-events-none', className]"
 aria-hidden="true"
 >
 <defs>
 <pattern
 [id]="id"
 [attr.width]="width"
 [attr.height]="height"
 patternUnits="userSpaceOnUse"
 [attr.x]="x"
 [attr.y]="y"
 >
 <circle 
 [attr.cx]="cx" 
 [attr.cy]="cy" 
 [attr.r]="cr" 
 class="dot-pattern-fill" 
 />
 </pattern>
 </defs>
 <rect width="100%" height="100%" [attr.fill]="'url(#' + id + ')'" />
 </svg>
 `,
 styles: [`
 .dot-pattern-fill {
 fill: var(--text-primary);
 opacity: 0.3;
 }
 `]
})
export class DotPatternComponent {
 @Input() width = 16;
 @Input() height = 16;
 @Input() x = 0;
 @Input() y = 0;
 @Input() cx = 1;
 @Input() cy = 1;
 @Input() cr = 1;
 @Input() className = '';

 id = 'dot-pattern-' + Math.random().toString(36).substring(2, 9);
}
