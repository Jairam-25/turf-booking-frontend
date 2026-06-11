import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthStore } from '../services/auth.store';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authStore = inject(AuthStore);
  const token = authStore.token();

  if (token && !authStore.isTokenExpired()) {
    // If logged in, redirect to dashboard or home
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
