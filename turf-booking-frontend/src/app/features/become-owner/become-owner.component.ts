import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

interface DocumentUpload {
 type: string;
 file: File | null;
 url: string;
 uploading: boolean;
}

@Component({
 selector: 'app-become-owner',
 standalone: true,
 imports: [CommonModule, ReactiveFormsModule],
 templateUrl: './become-owner.component.html',
 styleUrls: ['./become-owner.component.css']
})
export class BecomeOwnerComponent implements OnInit {
 private fb = inject(FormBuilder);
 private http = inject(HttpClient);
 private notificationService = inject(NotificationService);
 private router = inject(Router);
 private route = inject(ActivatedRoute);
 private cdr = inject(ChangeDetectorRef);

 // Flow step: 1 = Owner Info, 2 = Payment, 3 = Turf Details, 4 = Verification Status
 currentStep = signal<number>(1);
 isAddingSecondaryTurf = signal<boolean>(false);
 onboardingStatus = signal<string>('NotRegistered');
 ownerId = signal<number | null>(null);
 turfId = signal<number | null>(null);
 rejectionReason = signal<string | null>(null);
 isCheckingStatus = signal<boolean>(false);

 isSubmitting = false;

 // Step 1 Form: Owner Information
 ownerForm = this.fb.group({
 fullName: ['', [Validators.required, Validators.minLength(3)]],
 mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
 email: ['', [Validators.required, Validators.email]],
 address: ['', Validators.required],
 termsAccepted: [false, Validators.requiredTrue]
 });

 // Step 3 Form: Turf Details
 turfForm = this.fb.group({
 turfName: ['', [Validators.required, Validators.minLength(3)]],
 description: ['', [Validators.required, Validators.minLength(10)]],
 turfType: ['Football', Validators.required], // Football, Cricket, Badminton, Multi Sports
 address: ['', Validators.required],
 city: ['', Validators.required],
 state: ['', Validators.required],
 pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]],
 googleMapLocation: ['', Validators.required],
 contactNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]]
 });

 // Media state
 turfImages = signal<string[]>([]);
 isUploadingImage = false;

 requiredDocs: DocumentUpload[] = [
 { type: 'Property Proof / Rental Agreement', file: null, url: '', uploading: false },
 { type: 'Electricity / Water Bill', file: null, url: '', uploading: false },
 { type: 'Owner ID Proof', file: null, url: '', uploading: false },
 { type: 'Business Registration (Optional)', file: null, url: '', uploading: false }
 ];

 ngOnInit() {
 this.route.queryParams.subscribe(params => {
 if (params['action'] === 'add-turf') {
 this.isAddingSecondaryTurf.set(true);
 }
 this.checkStatus();
 });
 }

 checkStatus(showUserFeedback: boolean = false) {
 if (showUserFeedback) this.isCheckingStatus.set(true);
 
 this.http.get<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/OwnerOnboarding/status').subscribe({
 next: (res) => {
 if (showUserFeedback) this.isCheckingStatus.set(false);
 
 const data = res.data || res.Data || res;
 this.onboardingStatus.set(data.status);
 this.ownerId.set(data.ownerId || null);
 this.turfId.set(data.turfId || null);
 this.rejectionReason.set(data.rejectionReason || null);
 
 if (showUserFeedback && (data.status === 'Pending Verification' || data.status === 'Under Review')) {
 this.notificationService.success(`Status refreshed. Your application is still ${data.status}.`);
 }

 if (this.isAddingSecondaryTurf()) {
 this.currentStep.set(3);
 } else {
 if (data.status === 'NotRegistered') {
 this.currentStep.set(1);
 } else if (data.status === 'PendingPayment') {
 this.currentStep.set(2);
 } else if (data.status === 'PendingTurfDetails') {
 this.currentStep.set(3);
 } else {
 // Pending Verification, Under Review, Approved, Rejected
 this.currentStep.set(4);
 if (data.status === 'Approved') {
 this.notificationService.success('Your account is approved! Redirecting...');
 setTimeout(() => this.router.navigate(['/owner-dashboard']), 2000);
 }
 }
 }
 },
 error: () => {
 if (showUserFeedback) this.isCheckingStatus.set(false);
 this.notificationService.error('Failed to retrieve onboarding status');
 }
 });
 }

 // Step 1: Register Owner Details
 submitOwnerInfo() {
 if (this.ownerForm.invalid) {
 this.notificationService.error('Please fill all required fields correctly');
 return;
 }

 this.isSubmitting = true;
 const payload = this.ownerForm.value;

 this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/OwnerOnboarding/register', payload).subscribe({
 next: (res) => {
 const data = res.data || res.Data || res;
 this.ownerId.set(data.ownerId);
 this.notificationService.success('Owner profile created. Proceed to payment.');
 this.isSubmitting = false;
 this.cdr.detectChanges();
 this.checkStatus();
 },
 error: (err) => {
 this.notificationService.error(err.error?.Message || 'Failed to submit registration details');
 this.isSubmitting = false;
 this.cdr.detectChanges();
 }
 });
 }

 // Step 2: Payment
 loadRazorpayScript(): Promise<boolean> {
 return new Promise((resolve) => {
 if ((window as any).Razorpay) {
 resolve(true);
 return;
 }
 const script = document.createElement('script');
 script.src = 'https://checkout.razorpay.com/v1/checkout.js';
 script.onload = () => resolve(true);
 script.onerror = () => resolve(false);
 document.body.appendChild(script);
 });
 }

 async payWithRazorpay() {
 const loaded = await this.loadRazorpayScript();
 if (!loaded) {
 this.notificationService.error('Failed to load payment gateway checkout script');
 return;
 }

 const options = {
 key: 'rzp_test_dummykey',
 amount: 100000, // ₹1000 in paise
 currency: 'INR',
 name: 'TurfXpert Partner',
 description: 'Owner Registration Fee',
 image: '/images/logo.png',
 handler: (response: any) => {
 this.submitPayment(response.razorpay_payment_id);
 },
 prefill: {
 name: this.ownerForm.value.fullName || '',
 email: this.ownerForm.value.email || '',
 contact: this.ownerForm.value.mobileNumber || ''
 },
 theme: {
 color: '#146ef5'
 }
 };

 const rzp = new (window as any).Razorpay(options);
 rzp.open();
 }

 simulatePaymentSuccess() {
 const dummyPaymentId = 'pay_' + Math.random().toString(36).substring(2, 11).toUpperCase();
 this.submitPayment(dummyPaymentId);
 }

 submitPayment(paymentId: string) {
 this.isSubmitting = true;
 const payload = {
 ownerId: this.ownerId(),
 razorpayPaymentId: paymentId,
 amount: 1000.00,
 status: 'Success'
 };

 this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/OwnerOnboarding/payment', payload).subscribe({
 next: () => {
 this.notificationService.success('Payment received successfully!');
 this.isSubmitting = false;
 this.cdr.detectChanges();
 this.checkStatus();
 },
 error: () => {
 this.notificationService.error('Failed to record payment details');
 this.isSubmitting = false;
 this.cdr.detectChanges();
 }
 });
 }

 // Step 3: File Uploads & Turf Details
 onImageSelected(event: any) {
 const file: File = event.target.files[0];
 if (!file) return;

 this.isUploadingImage = true;
 this.cdr.detectChanges();
 
 // Clear input so same file can be selected again
 event.target.value = '';

 const formData = new FormData();
 formData.append('file', file);

 this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Upload', formData).subscribe({
 next: (res) => {
 this.turfImages.update(imgs => [...imgs, res.url]);
 this.notificationService.success('Image uploaded successfully');
 this.isUploadingImage = false;
 this.cdr.detectChanges();
 },
 error: (err) => {
 this.notificationService.error(err.error?.message || 'Failed to upload image');
 this.isUploadingImage = false;
 this.cdr.detectChanges();
 }
 });
 }

 removeImage(index: number) {
 this.turfImages.update(imgs => imgs.filter((_, i) => i !== index));
 }

 onDocSelected(event: any, docIndex: number) {
 const file: File = event.target.files[0];
 if (!file) return;

 this.requiredDocs[docIndex].file = file;
 this.requiredDocs[docIndex].uploading = true;
 this.requiredDocs = [...this.requiredDocs];
 this.cdr.detectChanges();

 // Clear input so same file can be selected again
 event.target.value = '';

 const formData = new FormData();
 formData.append('file', file);

 this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Upload', formData).subscribe({
 next: (res) => {
 this.requiredDocs[docIndex].url = res.url;
 this.requiredDocs[docIndex].uploading = false;
 this.requiredDocs = [...this.requiredDocs];
 this.notificationService.success(`${this.requiredDocs[docIndex].type} uploaded successfully`);
 this.cdr.detectChanges();
 },
 error: (err) => {
 this.notificationService.error(err.error?.message || 'Failed to upload document');
 this.requiredDocs[docIndex].uploading = false;
 this.requiredDocs = [...this.requiredDocs];
 this.cdr.detectChanges();
 }
 });
 }

 submitTurfDetails() {
 if (this.turfForm.invalid) {
 this.notificationService.error('Please fill all required turf details correctly');
 return;
 }

 // Must have at least 3 images
 if (this.turfImages().length < 3) {
 this.notificationService.error('Please upload at least 3 turf images');
 return;
 }

 // Validate required documents are uploaded
 const missingDocs = this.requiredDocs.filter(d => !d.url && d.type !== 'Business Registration (Optional)');
 if (missingDocs.length > 0) {
 this.notificationService.error(`Please upload the following required documents: ${missingDocs.map(d => d.type).join(', ')}`);
 return;
 }

 this.isSubmitting = true;

 const payload = {
 ownerId: this.ownerId(),
 isNewTurf: this.isAddingSecondaryTurf(),
 ...this.turfForm.value,
 images: this.turfImages(),
 documents: this.requiredDocs
 .filter(d => d.url)
 .map(d => ({ documentType: d.type, fileUrl: d.url }))
 };

 this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/OwnerOnboarding/submit-turf', payload).subscribe({
 next: () => {
 this.notificationService.success('Turf details and documents submitted for verification!');
 this.isSubmitting = false;
 this.cdr.detectChanges();
 if (this.isAddingSecondaryTurf()) {
 this.router.navigate(['/owner-dashboard']);
 } else {
 this.checkStatus();
 }
 },
 error: (err) => {
 // Submit turf error
 const errorMsg = err.error?.message || err.error?.Message || err.error?.title || 'Failed to submit turf details';
 this.notificationService.error(errorMsg);
 this.isSubmitting = false;
 this.cdr.detectChanges();
 }
 });
 }

 // Step 4: Re-upload/Resubmit
 prepareResubmission() {
 // Navigate back to step 3
 this.currentStep.set(3);
 // Prep forms
 this.turfForm.enable();
 }
}
