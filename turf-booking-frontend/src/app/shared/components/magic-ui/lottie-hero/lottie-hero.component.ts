import { Component, ElementRef, Input, AfterViewInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-lottie-hero',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  template: `
    <div class="lottie-wrap" #wrap>
      <lottie-player
        *ngIf="visible"
        [src]="src"
        [loop]="loop"
        [autoplay]="autoplay"
        background="transparent"
        [style.width.px]="width"
        [style.height.px]="height"
      ></lottie-player>
    </div>
  `,
  styles: [
    `:host { display: block; }
    .lottie-wrap { display: flex; align-items: center; justify-content: center; }
    lottie-player { display: block; }
    `
  ]
})
export class LottieHeroComponent implements AfterViewInit, OnDestroy {
  @Input() src = 'https://assets10.lottiefiles.com/packages/lf20_tfb3estd.json';
  @Input() width = 320;
  @Input() height = 320;
  @Input() loop = true;
  @Input() autoplay = true;

  visible = false;
  private observer?: IntersectionObserver;

  constructor(private host: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          this.visible = true;
          this.observer?.disconnect();
        }
      }
    }, { threshold: 0.15 });

    this.observer.observe(this.host.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
