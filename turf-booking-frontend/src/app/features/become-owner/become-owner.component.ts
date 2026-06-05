import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { NotificationService } from '../../core/services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-become-owner',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './become-owner.component.html',
  styleUrls: ['./become-owner.component.css']
})
export class BecomeOwnerComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  ownerForm = this.fb.group({
    turfId: ['', Validators.required],
    businessName: ['', Validators.required],
    contactNumber: ['', Validators.required],
    proofDocumentUrl: ['https://dummyimage.com/600x400/000/fff&text=Proof+Document', Validators.required]
  });

  isSubmitting = false;

  submitRequest() {
    if (this.ownerForm.invalid) {
      this.notificationService.error('Please fill all required fields');
      return;
    }

    this.isSubmitting = true;
    
    const payload = {
      ...this.ownerForm.value,
      turfId: Number(this.ownerForm.value.turfId)
    };

    this.http.post<any>('https://localhost:7273/api/v1/OwnerRequest', payload).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.notificationService.success('Owner request submitted successfully! Awaiting SuperAdmin approval.');
          this.router.navigate(['/dashboard']);
        });
      },
      error: (err) => {
        setTimeout(() => {
          this.notificationService.error(err.error?.Message || err.error?.title || 'An owner request for this turf is already pending.');
          this.isSubmitting = false;
        });
      }
    });
  }
}
