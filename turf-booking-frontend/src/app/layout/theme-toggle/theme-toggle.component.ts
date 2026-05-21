import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      type="button"
      class="theme-toggle-btn"
      (click)="themeService.toggle()"
      [attr.aria-label]="themeService.theme() === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      @if (themeService.theme() === 'dark') {
        <svg viewBox="0 0 24 24" fill="none" class="w-5 h-5 text-amber-400" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="5"/>
          <path d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" stroke-linecap="round"/>
        </svg>
      } @else {
        <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-sky-500">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      }
    </button>
  `,
})
export class ThemeToggleComponent {
  constructor(public themeService: ThemeService) {}
}
