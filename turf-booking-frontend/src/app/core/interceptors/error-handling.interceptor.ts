import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

export const errorHandlingInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Auth interceptor handles 401
      if (error.status !== 401) {
        let message = 'An unexpected error occurred';
        if (error.error) {
          if (typeof error.error === 'string') {
            message = error.error;
          } else {
            message = error.error.message || error.error.Message || error.message || message;
          }
        } else if (error.message) {
          message = error.message;
        }

        // Offline / network-error handling
        if (error.status === 0) {
          message = 'Network error. Please check your internet connection.';
        }
        notificationService.error(message);
      }
      return throwError(() => error);
    })
  );
};
