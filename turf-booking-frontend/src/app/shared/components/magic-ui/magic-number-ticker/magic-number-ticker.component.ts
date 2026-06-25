import { Component, Input, OnChanges, SimpleChanges, signal, OnDestroy, ElementRef, AfterViewInit, NgZone, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
 selector: 'magic-number-ticker',
 standalone: true,
 imports: [CommonModule],
 template: `
 <span class="ticker-wrap" [class.swiped]="swiped()">
 <span class="number-ticker" [class.swipe]="swiped()">{{ display() }}</span>
 <span class="stat-suffix"><ng-content></ng-content></span>
 </span>
 `,
 styles: [`
 .ticker-wrap { display: inline-flex; align-items: baseline; gap: 4px; }
 .ticker-wrap.swiped {
 /* subtle glow on swipe */
 box-shadow: 0 8px 30px rgba(16, 185, 129, 0.08), inset 0 1px 0 rgba(255,255,255,0.02);
 border-radius: 6px;
 padding: 2px 6px;
 background: linear-gradient(180deg, rgba(255,255,255,0.01), rgba(0,0,0,0.01));
 transition: box-shadow 420ms ease, transform 420ms cubic-bezier(.2,.9,.2,1);
 }
 .number-ticker {
 font-variant-numeric: tabular-nums;
 font-weight: 800;
 font-size: inherit;
 color: inherit;
 display: inline-block;
 transition: transform 260ms cubic-bezier(.2,.9,.2,1), opacity 260ms ease;
 }

 .number-ticker.swipe {
 /* subtle swipe/float but remain visible */
 transform: translateX(12px) translateY(-6px) rotate(-1deg) scale(1.02);
 opacity: 1;
 transition: transform 520ms cubic-bezier(.2,.9,.2,1), opacity 300ms ease;
 }

 /* move suffix in sync with number when swiped */
 .number-ticker.swipe + .stat-suffix {
 transform: translateX(12px) translateY(-6px) rotate(-1deg) scale(1.02);
 opacity: 1;
 transition: transform 520ms cubic-bezier(.2,.9,.2,1), opacity 300ms ease;
 display: inline-block;
 }

 /* style suffix: slightly smaller and nudged down for visual balance */
 .stat-suffix {
 font-size: 0.9em; /* closer to main number size */
 transform: translateY(1px); /* slight vertical nudge */
 display: inline-block;
 line-height: 1;
 font-weight: 700;
 opacity: 0.9; /* slightly lighter than the number */
 }

 /* hide suffix while number is empty */
 .number-ticker:empty + .stat-suffix { opacity: 0; }
 /* stat-symbol animation (used by parent cards) */
 :host-context(.hero-stat-card) .stat-symbol { transition: transform 520ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease; }
 :host-context(.hero-stat-card) .stat-symbol { transform: translateY(0); }
 :host-context(.hero-stat-card) .ticker-wrap.swiped ~ .stat-symbol,
 :host-context(.hero-stat-card) .ticker-wrap.swiped + .stat-symbol {
 transform: translateY(-10px) scale(1.05);
 opacity: 1;
 }
 `]
})
export class MagicNumberTickerComponent implements OnChanges, AfterViewInit, OnDestroy {
 @Input() value: number | string = 0;
 @Input() duration = 1200; // ms
 @Input() format: 'full' | 'compact' = 'full';
 @Input() swipeAfter = true;
 @Input() swipeDelay = 300; // ms after animation completes
 // keep blank until visible/animation runs
 private current = signal<string>('');
 private intervalId: any = null;
 private swipeTimeoutId: any = null;
 // public so template can bind .swipe class
 swiped = signal(false);
 @Output() swipedEvent = new EventEmitter<void>();
 private observer: IntersectionObserver | null = null;
 private hasBeenVisible = false;
 private pendingValue: number | string | null = null;
 constructor(private host: ElementRef<HTMLElement>, private ngZone: NgZone) {}

 display = this.current.asReadonly();

 ngOnChanges(changes: SimpleChanges) {
 if ('value' in changes) {
 // if already visible, animate immediately; otherwise store pending value
 this.pendingValue = this.value;
 if (this.hasBeenVisible) {
 this.animateTo(this.value);
 this.pendingValue = null;
 }
 }
 }

 ngAfterViewInit(): void {
 // observe visibility of host element, start animation when visible
 try {
 this.ngZone.runOutsideAngular(() => {
 this.observer = new IntersectionObserver((entries) => {
 for (const entry of entries) {
 if (entry.isIntersecting) {
 this.hasBeenVisible = true;
 // run animation on pending value or current value
 const val = this.pendingValue ?? this.value;
 // ensure animation runs inside Angular zone for signals
 this.ngZone.run(() => this.animateTo(val));
 this.pendingValue = null;
 if (this.observer) {
 this.observer.disconnect();
 this.observer = null;
 }
 break;
 }
 }
 }, { threshold: 0.15 });

 if (this.observer) this.observer.observe(this.host.nativeElement);
 });
 } catch {
 // fallback: if observer fails, animate immediately
 this.animateTo(this.value);
 }
 }

 ngOnDestroy(): void {
 if (this.intervalId) clearInterval(this.intervalId);
 if (this.swipeTimeoutId) clearTimeout(this.swipeTimeoutId);
 if (this.observer) {
 this.observer.disconnect();
 this.observer = null;
 }
 }

 private animateTo(target: number | string) {
 // reset any previously scheduled swipe
 if (this.swipeTimeoutId) {
 clearTimeout(this.swipeTimeoutId);
 this.swipeTimeoutId = null;
 }

 // clear swiped state when starting a new animation
 this.swiped.set(false);

 if (typeof target === 'string') {
 this.current.set(target);
 if (this.swipeAfter) {
 this.swipeTimeoutId = setTimeout(() => this.swiped.set(true), this.swipeDelay);
 }
 return;
 }

 const end = target as number;
 const start = 0;
 const duration = Math.max(200, this.duration);
 const frameRate = 30; // updates per second
 const totalFrames = Math.round((duration / 1000) * frameRate);
 let frame = 0;

 if (this.intervalId) clearInterval(this.intervalId);

 const fmt = this.format;

 this.intervalId = setInterval(() => {
 frame++;
 const progress = frame / totalFrames;
 const eased = this.easeOutCubic(progress);
 const current = Math.round(start + (end - start) * eased);

 if (fmt === 'compact') {
 this.current.set(this.compactFormat(current));
 } else {
 this.current.set(this.numberWithCommas(current));
 }

 if (frame >= totalFrames) {
 clearInterval(this.intervalId);
 this.intervalId = null;

 if (this.swipeAfter) {
 this.swipeTimeoutId = setTimeout(() => {
 this.swiped.set(true);
 // notify parent components
 try { this.swipedEvent.emit(); } catch {}
 this.swipeTimeoutId = null;
 }, this.swipeDelay);
 }
 }
 }, 1000 / frameRate);
 }

 private numberWithCommas(n: number) {
 return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
 }

 private compactFormat(n: number) {
 if (n >= 1_000_000) return (Math.round(n / 100_000) / 10) + 'M';
 if (n >= 1000) return Math.round(n / 1000) + 'k+';
 return n.toString();
 }

 private easeOutCubic(t: number) {
 return 1 - Math.pow(1 - t, 3);
 }
}
