import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthStore } from '../services/auth.store';
import { NotificationService } from '../services/notification.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  const expectedRoles = route.data['roles'] as Array<string> | undefined;
  const user = authStore.user();

  if (!user || !user.role || !expectedRoles?.includes(user.role)) {
    notificationService.error("You're not authorized to access this page.");
    router.navigate(['/dashboard']);
    return false;
  }

  return true;
};
