const fs = require('fs');

let content = fs.readFileSync('src/app/features/profile/profile.ts', 'utf8');

// I will just use string replacement on the exact corrupted part.
const corruptedPart = ` error: (err) => {
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
 }`;

const correctPart = ` error: (err) => {
 this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to update profile.');
 this.isSaving.set(false);
 }
 });
 }

 logout() {
   this.isLogoutModalOpen.set(true);
 }

 confirmLogout() {
   this.isLogoutModalOpen.set(false);
   this.authStore.clearSession();
   this.router.navigate(['/auth/login']);
 }

 deleteAccount() {
 if (confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
 this.isDeleting.set(true);
 
 this.http.delete('https://turf-booking-backend-fixl.onrender.com/api/v1/Auth/delete-account').subscribe({
 next: () => {
 this.notificationService.success('Account deleted successfully. We\\'re sad to see you go!');
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
 }`;

if (content.includes(corruptedPart)) {
  content = content.replace(corruptedPart, correctPart);
  fs.writeFileSync('src/app/features/profile/profile.ts', content);
  console.log('Restored profile.ts');
} else {
  console.log('Could not find corrupted part to replace');
}
