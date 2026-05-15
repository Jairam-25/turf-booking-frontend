import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  }

  // Redirect to login if not authenticated
  router.navigate(['/auth/login'], { queryParams: { returnUrl: state.url } });
  return false;
};
