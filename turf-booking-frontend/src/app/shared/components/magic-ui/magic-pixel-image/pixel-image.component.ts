import { Component, Input, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector: 'magic-pixel-image',
 standalone: true,
 imports: [CommonModule],
 template: `
 <div class="pixel-wrap">
 <canvas></canvas>
 <img class="visually-hidden" loading="lazy" [src]="src" (error)="onError()" />
 </div>
 `,
 styles: [`
 :host { display: block; width: 100%; height: 100%; }
 .pixel-wrap { width: 100%; height: 100%; position: relative; overflow: hidden; }
 canvas { width: 100%; height: 100%; display: block; }
 .visually-hidden { display: none; }
 `]
})
export class PixelImageComponent implements AfterViewInit, OnDestroy {
 @Input() src?: string;
 @Input() fallbackSrc: string = '/images/turf_sports_ground.png';
 @Input() duration = 700; // animation duration in ms
 @Input() minPixel = 4; // biggest pixel size
 @Input() steps = 8;

 private canvas!: HTMLCanvasElement;
 private ctx!: CanvasRenderingContext2D | null;
 private img = new Image();
 private rafId: any = null;
 private startTime = 0;
 private destroyed = false;

 ngAfterViewInit(): void {
 this.canvas = this.host.nativeElement.querySelector('canvas') as HTMLCanvasElement;
 this.ctx = this.canvas.getContext('2d');
 if (!this.ctx) return;

 this.img.crossOrigin = 'anonymous';
 this.img.onload = () => this.startAnimation();
 this.img.onerror = () => this.drawFallback();
 if (this.src) this.img.src = this.src;
 else this.drawFallback();
 }

 constructor(private host: ElementRef<HTMLElement>) {}

 private startAnimation() {
 if (!this.ctx || !this.img) return;
 const canvas = this.canvas;
 const dpr = Math.max(1, window.devicePixelRatio || 1);
 const rect = canvas.getBoundingClientRect();
 canvas.width = Math.round(rect.width * dpr);
 canvas.height = Math.round(rect.height * dpr);
 this.ctx!.imageSmoothingEnabled = false;

 this.startTime = performance.now();
 const duration = Math.max(80, this.duration);

 const frame = (now: number) => {
 if (this.destroyed) return;
 const t = Math.min(1, (now - this.startTime) / duration);
 // pixel size decreases from minPixel to 1
 const px = Math.max(1, Math.round(this.minPixel * (1 - t)));

 // draw small version then scale up to create pixelation
 const sw = Math.max(1, Math.round(canvas.width / px));
 const sh = Math.max(1, Math.round(canvas.height / px));

 // draw to small offscreen canvas
 const off = document.createElement('canvas');
 off.width = sw; off.height = sh;
 const offCtx = off.getContext('2d');
 if (!offCtx) return;
 // draw source image to offscreen scaled
 offCtx.drawImage(this.img, 0, 0, sw, sh);

 // clear main and draw scaled up
 this.ctx!.clearRect(0, 0, canvas.width, canvas.height);
 // disable smoothing to preserve pixelation
 this.ctx!.imageSmoothingEnabled = false;
 this.ctx!.drawImage(off, 0, 0, sw, sh, 0, 0, canvas.width, canvas.height);

 if (t < 1) this.rafId = requestAnimationFrame(frame);
 };

 this.rafId = requestAnimationFrame(frame);
 }

 private drawFallback() {
 if (!this.ctx) return;
 if (this.fallbackSrc) {
 const fallbackImg = new Image();
 fallbackImg.onload = () => {
 if (!this.ctx) return;
 const canvas = this.canvas;
 const dpr = Math.max(1, window.devicePixelRatio || 1);
 const rect = canvas.getBoundingClientRect();
 canvas.width = Math.round(rect.width * dpr);
 canvas.height = Math.round(rect.height * dpr);
 this.ctx.drawImage(fallbackImg, 0, 0, canvas.width, canvas.height);
 };
 fallbackImg.onerror = () => {
 if (!this.ctx) return;
 this.ctx.fillStyle = '#e5e7eb';
 this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
 };
 fallbackImg.src = this.fallbackSrc;
 } else {
 this.ctx.fillStyle = '#e5e7eb';
 this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
 }
 }

 onError() { this.drawFallback(); }

 ngOnDestroy(): void {
 this.destroyed = true;
 if (this.rafId) cancelAnimationFrame(this.rafId);
 }
}
