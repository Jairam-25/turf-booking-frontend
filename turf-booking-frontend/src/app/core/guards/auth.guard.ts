import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../services/auth.store';

export const authGuard: CanActivateFn = (route, state) => {
 const router = inject(Router);
 const authStore = inject(AuthStore);
 const token = authStore.token();

 if (token && !authStore.isTokenExpired()) {
 return true;
 }

 // Clean up expired/invalid token and redirect to sign-in
 if (token) {
 authStore.clearSession();
 }
 router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
 return false;
};
