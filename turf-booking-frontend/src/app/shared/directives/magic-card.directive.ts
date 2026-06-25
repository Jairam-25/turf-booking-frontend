import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
 selector: '.magic-card',
 standalone: true
})
export class MagicCardDirective {
 constructor(private el: ElementRef) {}

 @HostListener('mousemove', ['$event'])
 onMouseMove(e: MouseEvent) {
 const rect = this.el.nativeElement.getBoundingClientRect();
 const x = e.clientX - rect.left;
 const y = e.clientY - rect.top;
 this.el.nativeElement.style.setProperty('--mouse-x', `${x}px`);
 this.el.nativeElement.style.setProperty('--mouse-y', `${y}px`);
 }
}
