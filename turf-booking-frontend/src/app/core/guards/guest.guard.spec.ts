import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { guestGuard } from './guest.guard';
import { AuthStore } from '../services/auth.store';

describe('guestGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authStoreSpy: jasmine.SpyObj<AuthStore>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authStoreSpy = jasmine.createSpyObj('AuthStore', ['token', 'isTokenExpired']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthStore, useValue: authStoreSpy }
      ]
    });
  });

  it('should allow access when user is not logged in', () => {
    authStoreSpy.token.and.returnValue(null);

    const result = TestBed.runInInjectionContext(() => 
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBeTrue();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to dashboard when user is logged in', () => {
    authStoreSpy.token.and.returnValue('valid-token');
    authStoreSpy.isTokenExpired.and.returnValue(false);

    const result = TestBed.runInInjectionContext(() => 
      guestGuard({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot)
    );

    expect(result).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
