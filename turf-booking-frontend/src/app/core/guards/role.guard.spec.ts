import { TestBed } from '@angular/core/testing';
import { Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthStore } from '../services/auth.store';
import { NotificationService } from '../services/notification.service';
import { User } from '../../domain/models/user.model';

describe('roleGuard', () => {
  let routerSpy: jasmine.SpyObj<Router>;
  let authStoreSpy: jasmine.SpyObj<AuthStore>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authStoreSpy = jasmine.createSpyObj('AuthStore', ['user']);
    notificationServiceSpy = jasmine.createSpyObj('NotificationService', ['error']);

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthStore, useValue: authStoreSpy },
        { provide: NotificationService, useValue: notificationServiceSpy }
      ]
    });
  });

  it('should allow access when user has the required role', () => {
    authStoreSpy.user.and.returnValue({ role: 'Admin' } as User);
    const route = { data: { roles: ['Admin', 'SuperAdmin'] } } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as RouterStateSnapshot));

    expect(result).toBeTrue();
  });

  it('should deny access when user does not have the required role', () => {
    authStoreSpy.user.and.returnValue({ role: 'User' } as User);
    const route = { data: { roles: ['Admin'] } } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as RouterStateSnapshot));

    expect(result).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should deny access when route roles are undefined', () => {
    authStoreSpy.user.and.returnValue({ role: 'Admin' } as User);
    const route = { data: {} } as unknown as ActivatedRouteSnapshot;

    const result = TestBed.runInInjectionContext(() => roleGuard(route, {} as RouterStateSnapshot));

    expect(result).toBeFalse();
    expect(notificationServiceSpy.error).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });
});
