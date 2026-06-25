import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector: 'magic-shiny-button',
 standalone: true,
 imports: [CommonModule],
 template: `
 <button 
 [type]="type"
 [disabled]="disabled || loading"
 (click)="onClick($event)"
 class="magic-shiny-btn font-cabin active:scale-95 transition-all duration-200"
 >
 <!-- Content Container -->
 <span class="btn-content-inner flex items-center justify-center gap-2 relative z-10">
 <span *ngIf="!loading"><ng-content></ng-content></span>
 <div *ngIf="loading" class="dot-wave" aria-hidden="true">
 <span class="dot-wave__dot"></span>
 <span class="dot-wave__dot"></span>
 <span class="dot-wave__dot"></span>
 <span class="dot-wave__dot"></span>
 </div>
 </span>

 <!-- Glowing backdrop -->
 <span class="shiny-glow-backdrop"></span>
 </button>
 `,
 styles: [`
 .magic-shiny-btn {
 position: relative;
 width: 100%;
 height: 48px;
 border-radius: 12px;
 background: linear-gradient(135deg, rgba(var(--primary-rgb), 0.9) 0%, rgba(43, 35, 68, 0.95) 100%);
 color: var(--on-primary);
 border: 1px solid rgba(255, 255, 255, 0.1);
 box-shadow: 0 4px 20px rgba(var(--primary-rgb), 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
 font-weight: 700;
 font-size: 0.95rem;
 letter-spacing: 0.5px;
 cursor: pointer;
 overflow: hidden;
 display: inline-flex;
 align-items: center;
 justify-content: center;
 isolation: isolate;
 }

 /* Moving light shine sweep */
 .magic-shiny-btn::after {
 content: '';
 position: absolute;
 top: 0;
 left: -150%;
 width: 60%;
 height: 100%;
 background: linear-gradient(
 90deg,
 transparent 0%,
 rgba(255, 255, 255, 0) 10%,
 rgba(255, 255, 255, 0.35) 50%,
 rgba(255, 255, 255, 0) 90%,
 transparent 100%
 );
 transform: skewX(-25deg);
 z-index: 2;
 }

 .magic-shiny-btn:hover::after {
 animation: shiny-glow-sweep 1.4s cubic-bezier(0.25, 1, 0.5, 1) infinite;
 }

 /* Auto shine sweep at periodic cycles even without hover */
 .magic-shiny-btn:not(:hover)::after {
 animation: shiny-glow-sweep-auto 6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
 }

 .magic-shiny-btn:hover {
 border-color: rgba(255, 255, 255, 0.25);
 box-shadow: 0 6px 24px rgba(var(--primary-rgb), 0.45), 0 0 15px rgba(255, 255, 255, 0.1);
 transform: translateY(-1px);
 }

 .magic-shiny-btn:disabled {
 opacity: 0.6;
 cursor: not-allowed;
 transform: none !important;
 box-shadow: none !important;
 }

 .shiny-glow-backdrop {
 position: absolute;
 inset: 0;
 background: radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255, 255, 255, 0.15) 0%, transparent 60%);
 opacity: 0;
 transition: opacity 0.3s ease;
 z-index: 1;
 pointer-events: none;
 }

 .magic-shiny-btn:hover .shiny-glow-backdrop {
 opacity: 1;
 }

 /* Loader uses global .dot-wave from styles.css */
 .btn-content-inner .dot-wave { display: inline-flex; }
 `]
})
export class MagicShinyButtonComponent {
 @Input() type: 'button' | 'submit' | 'reset' = 'button';
 @Input() disabled = false;
 @Input() loading = false;
 @Output() btnClick = new EventEmitter<MouseEvent>();

 onClick(event: MouseEvent) {
 if (!this.disabled && !this.loading) {
 this.btnClick.emit(event);
 }
 }
}
