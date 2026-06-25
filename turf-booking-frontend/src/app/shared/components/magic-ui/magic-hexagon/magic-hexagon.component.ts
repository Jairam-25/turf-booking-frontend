import { Component, ElementRef, Input, OnInit, OnDestroy, ViewChild, HostListener, Inject, PLATFORM_ID, NgZone } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
 selector: 'app-magic-hexagon',
 standalone: true,
 imports: [CommonModule],
 host: {
 'class': 'absolute inset-0 pointer-events-none block overflow-hidden',
 'style': 'z-index: 0;'
 },
 template: `
 <canvas #canvas class="block w-full h-full pointer-events-auto"></canvas>
 `
})
export class MagicHexagonComponent implements OnInit, OnDestroy {
 @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
 
 @Input() size: number = 32;
 @Input() color: string = '#7b39fc';
 @Input() backgroundColor: string = 'transparent';
 @Input() strokeWidth: number = 1;
 @Input() animationSpeed: number = 0.05;

 private ctx!: CanvasRenderingContext2D | null;
 private animationFrame!: number;
 private canvasSize = { w: 0, h: 0 };
 private mouse = { x: -1000, y: -1000 };
 private hexagons: any[] = [];
 private isBrowser: boolean;

 constructor(@Inject(PLATFORM_ID) platformId: Object, private ngZone: NgZone) {
 this.isBrowser = isPlatformBrowser(platformId);
 }

 ngOnInit() {
 if (this.isBrowser) {
 this.initCanvas();
 this.createHexagons();
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
 this.createHexagons();
 }
 }

 @HostListener('mousemove', ['$event'])
 onMouseMove(e: MouseEvent) {
 if (!this.isBrowser) return;
 const rect = this.canvasRef.nativeElement.getBoundingClientRect();
 this.mouse.x = e.clientX - rect.left;
 this.mouse.y = e.clientY - rect.top;
 }

 @HostListener('mouseleave')
 onMouseLeave() {
 this.mouse.x = -1000;
 this.mouse.y = -1000;
 }

 private initCanvas() {
 const canvas = this.canvasRef.nativeElement;
 this.ctx = canvas.getContext('2d');
 if (!this.ctx) return;
 
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

 private createHexagons() {
 this.hexagons = [];
 const hexHeight = this.size * Math.sqrt(3);
 const hexWidth = this.size * 2;
 const vertDist = hexHeight;
 const horizDist = hexWidth * 0.75;
 
 const cols = Math.ceil(this.canvasSize.w / horizDist) + 1;
 const rows = Math.ceil(this.canvasSize.h / vertDist) + 1;

 for (let row = 0; row < rows; row++) {
 for (let col = 0; col < cols; col++) {
 let x = col * horizDist;
 let y = row * vertDist;
 if (col % 2 === 1) {
 y += vertDist / 2;
 }
 
 // Some random initial opacity for a cool effect
 const baseOpacity = Math.random() > 0.8 ? Math.random() * 0.1 : 0;
 
 this.hexagons.push({
 x, y,
 opacity: baseOpacity,
 targetOpacity: baseOpacity,
 isHighlight: baseOpacity > 0
 });
 }
 }
 }

 private hexToRgb(hex: string): { r: number, g: number, b: number } {
 const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
 hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
 const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
 return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : { r: 123, g: 57, b: 252 };
 }

 private drawHexagon(x: number, y: number, r: number) {
 if (!this.ctx) return;
 this.ctx.beginPath();
 for (let i = 0; i < 6; i++) {
 const angle_deg = 60 * i;
 const angle_rad = Math.PI / 180 * angle_deg;
 const hx = x + r * Math.cos(angle_rad);
 const hy = y + r * Math.sin(angle_rad);
 if (i === 0) this.ctx.moveTo(hx, hy);
 else this.ctx.lineTo(hx, hy);
 }
 this.ctx.closePath();
 }

 private animate() {
 if (!this.ctx) return;

 this.ctx.clearRect(0, 0, this.canvasSize.w, this.canvasSize.h);
 if (this.backgroundColor !== 'transparent') {
 this.ctx.fillStyle = this.backgroundColor;
 this.ctx.fillRect(0, 0, this.canvasSize.w, this.canvasSize.h);
 }
 
 const rgb = this.hexToRgb(this.color);
 
 // Draw edges
 this.ctx.lineWidth = this.strokeWidth;
 
 for (let hex of this.hexagons) {
 // Distance from mouse
 const dx = this.mouse.x - hex.x;
 const dy = this.mouse.y - hex.y;
 const dist = Math.sqrt(dx * dx + dy * dy);
 
 // Update target opacity based on mouse proximity
 if (dist < 120) {
 hex.targetOpacity = 0.5 - (dist / 120) * 0.3;
 } else {
 hex.targetOpacity = hex.isHighlight ? 0.05 : 0;
 }

 // Ease opacity
 hex.opacity += (hex.targetOpacity - hex.opacity) * this.animationSpeed;

 this.drawHexagon(hex.x, hex.y, this.size - 1);
 
 // Fill
 if (hex.opacity > 0.01) {
 this.ctx.fillStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${hex.opacity})`;
 this.ctx.fill();
 }
 
 // Stroke (very light baseline, brightens on hover)
 const strokeOpacity = 0.02 + (hex.opacity * 0.8);
 this.ctx.strokeStyle = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${strokeOpacity})`;
 this.ctx.stroke();
 }

 this.animationFrame = requestAnimationFrame(() => this.animate());
 }
}
