import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthStore } from '../services/auth.store';

describe('authGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authStoreSpy: jasmine.SpyObj<AuthStore>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authStoreSpy = jasmine.createSpyObj('AuthStore', ['token', 'isTokenExpired', 'clearSession']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthStore, useValue: authStoreSpy }
      ]
    });
  });

  it('should allow access when user is logged in and token is not expired', () => {
    authStoreSpy.token.and.returnValue('valid-token');
    authStoreSpy.isTokenExpired.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login when token is expired', () => {
    authStoreSpy.token.and.returnValue('expired-token');
    authStoreSpy.isTokenExpired.and.returnValue(true);

    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as ActivatedRouteSnapshot, { url: '/protected' } as RouterStateSnapshot)
    );

    expect(result).toBeFalse();
    expect(authStoreSpy.clearSession).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { returnUrl: '/protected' } });
  });

  it('should deny access and redirect to login when no token exists', () => {
    authStoreSpy.token.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => 
      authGuard({} as ActivatedRouteSnapshot, { url: '/protected' } as RouterStateSnapshot)
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login'], { queryParams: { returnUrl: '/protected' } });
  });
});
