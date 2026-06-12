import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthStore } from '../../core/services/auth.store';
import { NotificationService } from '../../core/services/notification.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class ProfileComponent implements OnInit {
  // Account Form
  profileForm: FormGroup;
  isSaving = signal<boolean>(false);
  isDeleting = signal<boolean>(false);
  
  // Profile Picture
  profilePictureUrl = signal<string | null>(null);
  profileImageError = signal(false);
  isUploadingImage = signal<boolean>(false);

  getFullProfilePictureUrl(): string {
    const url = this.profilePictureUrl();
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `https://turf-booking-backend-fixl.onrender.com${url.startsWith('/') ? '' : '/'}${url}`;
  }

  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authStore = inject(AuthStore);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  constructor() {
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: [{ value: '', disabled: true }],
      phoneNumber: [''],
      address: [''],
      state: [''],
      maritalStatus: [''],
      playerType: [''],
      playingLevel: ['']
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    const user = this.authStore.user();
    if (user) {
      this.profileForm.patchValue({
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        state: user.state || '',
        maritalStatus: user.maritalStatus || '',
        playerType: user.playerType || '',
        playingLevel: user.playingLevel || ''
      });
      if (user.profilePictureUrl) {
        this.profilePictureUrl.set(user.profilePictureUrl);
      }
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.notificationService.error('Please fill in all required fields properly.');
      return;
    }

    this.isSaving.set(true);
    const data = this.profileForm.getRawValue();

    this.http.put<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Auth/update-profile', {
      name: data.name,
      phoneNumber: data.phoneNumber,
      address: data.address,
      state: data.state,
      maritalStatus: data.maritalStatus,
      playerType: data.playerType,
      playingLevel: data.playingLevel,
      profilePictureUrl: this.profilePictureUrl()
    }).subscribe({
      next: (res) => {
        this.notificationService.success('Profile updated successfully!');
        
        // Update local state (simulate auth state refresh)
        const currentUser = this.authStore.user() || {};
        this.authStore.updateUser({
          ...currentUser,
          name: data.name,
          phoneNumber: data.phoneNumber,
          address: data.address,
          state: data.state,
          maritalStatus: data.maritalStatus,
          playerType: data.playerType,
          playingLevel: data.playingLevel,
          profilePictureUrl: this.profilePictureUrl() || undefined
        });

        this.isSaving.set(false);
      },
      error: (err) => {
        this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to update profile.');
        this.isSaving.set(false);
      }
    });
  }

  deleteAccount() {
    if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      this.isDeleting.set(true);
      
      this.http.delete('https://turf-booking-backend-fixl.onrender.com/api/v1/Auth/delete-account').subscribe({
        next: () => {
          this.notificationService.success('Account deleted successfully. We\'re sad to see you go!');
          this.isDeleting.set(false);
          this.authStore.clearSession();
          this.router.navigate(['/']);
        },
        error: (err: any) => {
          this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to delete account.');
          this.isDeleting.set(false);
        }
      });
    }
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploadingImage.set(true);
    
    // Clear input so same file can be selected again
    event.target.value = '';

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Upload', formData).subscribe({
      next: (res) => {
        this.profilePictureUrl.set(res.url);
        this.notificationService.success('Profile picture uploaded successfully. Click Save Changes to apply.');
        this.isUploadingImage.set(false);
      },
      error: (err) => {
        this.notificationService.error('Failed to upload profile picture. Please try again.');
        this.isUploadingImage.set(false);
      }
    });
  }
}
