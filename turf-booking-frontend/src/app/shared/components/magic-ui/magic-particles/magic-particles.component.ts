import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, HostListener, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-magic-particles',
  standalone: true,
  imports: [CommonModule],
  host: {
    'class': 'absolute inset-0 pointer-events-none block overflow-hidden',
    'style': 'z-index: 0;'
  },
  template: `
    <canvas #canvas class="block w-full h-full pointer-events-none"></canvas>
  `
})
export class MagicParticlesComponent implements OnInit, OnDestroy {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  
  @Input() color: string = '#7b39fc'; // Primary color
  @Input() quantity: number = 100;
  @Input() staticity: number = 50;
  @Input() ease: number = 50;

  private ctx!: CanvasRenderingContext2D | null;
  private particles: any[] = [];
  private animationFrame!: number;
  private canvasSize = { w: 0, h: 0 };
  private mouse = { x: 0, y: 0 };
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object, private ngZone: NgZone) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      this.initCanvas();
      this.createParticles();
      // Run outside angular to avoid CD triggers every frame
      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
    }
  }

  ngOnDestroy() {
    if (this.isBrowser) {
      cancelAnimationFrame(this.animationFrame);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (this.isBrowser) {
      this.initCanvas();
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent) {
    if (!this.isBrowser) return;
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    this.mouse.x = e.clientX - rect.left;
    this.mouse.y = e.clientY - rect.top;
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) return;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    this.ctx.scale(dpr, dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    this.canvasSize.w = rect.width;
    this.canvasSize.h = rect.height;
  }

  private createParticles() {
    this.particles = [];
    for (let i = 0; i < this.quantity; i++) {
      this.particles.push({
        x: Math.random() * this.canvasSize.w,
        y: Math.random() * this.canvasSize.h,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
  }

  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 123, g: 57, b: 252 }; // Default primary color
  }

  private animate() {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
    
    const rgb = this.hexToRgb(this.color);

    for (let p of this.particles) {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > this.canvasSize.w) p.vx *= -1;
      if (p.y < 0 || p.y > this.canvasSize.h) p.vy *= -1;

      // Mouse repel / attract (staticity effect)
      const dx = this.mouse.x - p.x;
      const dy = this.mouse.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 150) {
        // Subtle push away from mouse
        p.x -= dx * 0.01;
        p.y -= dy * 0.01;
        p.alpha = Math.min(p.alpha + 0.02, 0.8);
      } else {
        p.alpha = Math.max(p.alpha - 0.01, 0.2);
      }

      // Draw
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      
      this.ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${p.alpha})`;
      this.ctx.fill();
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}
