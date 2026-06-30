import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';

@Component({
 selector: 'app-terms-of-service',
 imports: [],
 templateUrl: './terms-of-service.html',
 styleUrl: './terms-of-service.css',
})
export class TermsOfService {
  private location = inject(Location);

  goBack() {
    this.location.back();
  }
}
