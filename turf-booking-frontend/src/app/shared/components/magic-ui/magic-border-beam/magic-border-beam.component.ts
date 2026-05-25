import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'magic-border-beam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      class="absolute inset-0 w-full h-full pointer-events-none rounded-[inherit] overflow-visible" 
      preserveAspectRatio="none"
      [style.border-radius]="'inherit'"
    >
      <rect
        class="border-beam-path"
        x="0" y="0"
        width="100%" height="100%"
        rx="inherit" ry="inherit"
        fill="none"
        [attr.stroke]="'url(#' + beamGradientId + ')'"
        [attr.stroke-width]="borderWidth"
        [style.animation-duration]="duration"
      />
      <defs>
        <linearGradient [id]="beamGradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" [attr.stop-color]="colorFrom" stop-opacity="0" />
          <stop offset="50%" [attr.stop-color]="colorFrom" stop-opacity="1" />
          <stop offset="100%" [attr.stop-color]="colorTo" stop-opacity="1" />
        </linearGradient>
      </defs>
    </svg>
  `,
  styles: [`
    :host {
      position: absolute;
      inset: 0;
      pointer-events: none;
      display: block;
      border-radius: inherit;
    }
    .border-beam-path {
      stroke-dasharray: 180 500;
      animation: border-beam-svg-flow 8s linear infinite;
    }
    @keyframes border-beam-svg-flow {
      0% { stroke-dashoffset: 680; }
      100% { stroke-dashoffset: 0; }
    }
  `]
})
export class MagicBorderBeamComponent implements OnInit {
  @Input() duration = '8s';
  @Input() borderWidth = 2.5;
  @Input() colorFrom = 'var(--primary)';
  @Input() colorTo = 'var(--accent)';

  beamGradientId = 'beam-gradient-' + Math.random().toString(36).substring(2, 9);

  ngOnInit() {}
}
