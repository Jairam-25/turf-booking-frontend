import { Injectable, signal } from '@angular/core';

export type AppTheme = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<AppTheme>('dark');

  init(): void {
    const saved = localStorage.getItem('theme') as AppTheme | null;
    const resolved =
      saved ?? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    this.theme.set(resolved);
    this.apply(resolved);
  }

  toggle(event?: MouseEvent): void {
    const isDark = this.theme() === 'dark';
    const next: AppTheme = isDark ? 'light' : 'dark';

    // Check if View Transitions API is supported and we have an event for coordinates
    if (!document.startViewTransition || !event) {
      this.setTheme(next);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      this.setTheme(next);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`
      ];

      document.documentElement.classList.remove('theme-transition-light', 'theme-transition-dark');
      document.documentElement.classList.add(isDark ? 'theme-transition-light' : 'theme-transition-dark');

      document.documentElement.animate(
        {
          clipPath: isDark ? [...clipPath].reverse() : clipPath,
        },
        {
          duration: 500,
          easing: 'ease-in-out',
          pseudoElement: isDark ? '::view-transition-old(root)' : '::view-transition-new(root)',
        }
      ).finished.then(() => {
        document.documentElement.classList.remove('theme-transition-light', 'theme-transition-dark');
      });
    });
  }

  private setTheme(theme: AppTheme): void {
    this.theme.set(theme);
    localStorage.setItem('theme', theme);
    this.apply(theme);
  }

  private apply(theme: AppTheme): void {
    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }
}
