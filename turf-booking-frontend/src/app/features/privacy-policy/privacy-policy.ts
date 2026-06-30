import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
 selector: 'app-privacy-policy',
 imports: [],
 templateUrl: './privacy-policy.html',
 styleUrl: './privacy-policy.css',
})
export class PrivacyPolicy {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
