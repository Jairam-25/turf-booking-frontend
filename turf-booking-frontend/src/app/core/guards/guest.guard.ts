import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    // If logged in, redirect to dashboard or home
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
