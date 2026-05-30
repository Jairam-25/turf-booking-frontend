import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MagicBorderBeamComponent } from '../../shared/components/magic-ui/magic-border-beam/magic-border-beam.component';
import { MagicShinyButtonComponent } from '../../shared/components/magic-ui/magic-shiny-button/magic-shiny-button.component';

@Component({
  selector: 'app-footer-component',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MagicBorderBeamComponent,
    MagicShinyButtonComponent,
  ],
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.css',
})
export class FooterComponent {
  email = signal('');
  isSubscribed = signal(false);
  isSubmitting = signal(false);

  subscribeNewsletter() {
    const emailVal = this.email().trim();
    if (!emailVal || !emailVal.includes('@')) return;

    this.isSubmitting.set(true);
    // Simulate API request
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.isSubscribed.set(true);
      this.email.set('');
      
      // Reset after some time
      setTimeout(() => {
        this.isSubscribed.set(false);
      }, 5000);
    }, 1500);
  }
}
