import { Component, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Sparkle {
 id: string;
 x: string;
 y: string;
 color: string;
 delay: number;
 scale: number;
 lifespan: number;
}

@Component({
 selector: 'app-sparkles-text',
 standalone: true,
 imports: [CommonModule],
 template: `
 <div class="relative inline-block">
 <!-- Sparkles -->
 <ng-container *ngFor="let sparkle of sparkles()">
 <svg
 class="absolute animate-sparkle pointer-events-none z-0"
 [style.left]="sparkle.x"
 [style.top]="sparkle.y"
 [style.color]="sparkle.color"
 [style.animation-delay]="sparkle.delay + 's'"
 [style.animation-duration]="sparkle.lifespan + 'ms'"
 [style.transform]="'scale(' + sparkle.scale + ')'"
 width="15"
 height="15"
 viewBox="0 0 160 160"
 fill="none"
 xmlns="http://www.w3.org/2000/svg"
 >
 <path
 d="M80 0C80 0 84.2846 41.2925 101.496 58.504C118.707 75.7154 160 80 160 80C160 80 118.707 84.2846 101.496 101.496C84.2846 118.707 80 160 80 160C80 160 75.7154 118.707 58.504 101.496C41.2925 84.2846 0 80 0 80C0 80 41.2925 75.7154 58.504 58.504C75.7154 41.2925 80 0 80 0Z"
 fill="currentColor"
 />
 </svg>
 </ng-container>

 <!-- The Text -->
 <span class="relative z-10 inline-block" [ngClass]="className">{{ text }}</span>
 </div>
 `,
 styles: [
 `
 @keyframes sparkle {
 0%, 100% {
 opacity: 0;
 transform: scale(0) rotate(0deg);
 }
 50% {
 opacity: 1;
 transform: scale(1) rotate(90deg);
 }
 }
 .animate-sparkle {
 animation: sparkle 1500ms ease-in-out infinite;
 transform-origin: center center;
 }
 `
 ]
})
export class SparklesTextComponent implements OnInit {
 @Input({ required: true }) text!: string;
 @Input() colors: string[] = ['#A07CFE', '#FE8FB5', '#FFBE7B'];
 @Input() sparklesCount = 10;
 @Input() className = '';

 sparkles = signal<Sparkle[]>([]);

 ngOnInit() {
 this.generateSparkles();
 }

 private generateSparkles() {
 const newSparkles = Array.from({ length: this.sparklesCount }).map(() =>
 this.createSparkle()
 );
 this.sparkles.set(newSparkles);

 // Occasionally regenerate sparkles
 setInterval(() => {
 if (typeof document !== 'undefined' && !document.hidden) {
 const current = this.sparkles();
 if (current.length > 0) {
 const indexToReplace = Math.floor(Math.random() * current.length);
 const updated = [...current];
 updated[indexToReplace] = this.createSparkle();
 this.sparkles.set(updated);
 }
 }
 }, 400); // Replace one sparkle every 400ms to keep it dynamic
 }

 private createSparkle(): Sparkle {
 return {
 id: Math.random().toString(36).substring(2, 9),
 x: Math.random() * 100 + '%',
 y: Math.random() * 100 + '%',
 color: this.colors[Math.floor(Math.random() * this.colors.length)],
 delay: Math.random() * 2,
 scale: Math.random() * 0.5 + 0.5,
 lifespan: Math.random() * 1000 + 1000,
 };
 }
}
