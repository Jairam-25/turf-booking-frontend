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

  toggle(): void {
    const next: AppTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    localStorage.setItem('theme', next);
    this.apply(next);
  }

  private apply(theme: AppTheme): void {
    if (theme === 'light') {
      document.body.setAttribute('data-theme', 'light');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }
}
