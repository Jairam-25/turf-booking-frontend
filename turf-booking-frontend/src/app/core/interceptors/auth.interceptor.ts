import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap } from 'rxjs';
import { AuthStore } from '../services/auth.store';
import { AuthRepository } from '../../domain/repositories/auth.repository';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStore = inject(AuthStore);
  const authRepo = inject(AuthRepository);
  const router = inject(Router);
  const token = authStore.token();

  let modifiedReq = req;
  if (token) {
    modifiedReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(modifiedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/refresh-token')) {
        const currentToken = authStore.token();
        const refreshToken = authStore.refreshToken();
        
        if (currentToken && refreshToken && !isRefreshing) {
          isRefreshing = true;
          return authRepo.refreshToken({ token: currentToken, refreshToken }).pipe(
            switchMap((response) => {
              isRefreshing = false;
              authStore.setSession(response.user, response.auth.token, response.auth.refreshToken);
              const retryReq = req.clone({
                setHeaders: { Authorization: `Bearer ${response.auth.token}` }
              });
              return next(retryReq);
            }),
            catchError((refreshErr) => {
              isRefreshing = false;
              authStore.clearSession();
              router.navigate(['/auth/login']);
              return throwError(() => refreshErr);
            })
          );
        } else {
          authStore.clearSession();
          router.navigate(['/auth/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
