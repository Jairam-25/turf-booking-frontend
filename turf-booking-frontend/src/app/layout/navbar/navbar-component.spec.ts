import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { InboxService } from '../../core/services/inbox.service';
import { AuthStore } from '../../core/services/auth.store';
import { SuperadminStateService } from '../../core/services/superadmin-state.service';
import { RouterTestingModule } from '@angular/router/testing';

import { vi } from 'vitest';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockInboxService = {
    unreadCount: vi.fn().mockReturnValue(2),
    notifications: vi.fn().mockReturnValue([])
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, RouterTestingModule],
      providers: [
        { provide: InboxService, useValue: mockInboxService },
        { provide: AuthStore, useValue: { user: () => null, isAuthenticated: () => false } },
        { provide: SuperadminStateService, useValue: { pendingVerificationsCount: () => 0 } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle notification dropdown', () => {
    expect(component.isNotificationsOpen).toBe(false);
    component.toggleNotifications();
    expect(component.isNotificationsOpen).toBe(true);
    expect(component.isMobileMenuOpen).toBe(false);
  });

  it('should close dropdowns on closeDropdowns call', () => {
    component.isNotificationsOpen = true;
    component.isMobileMenuOpen = true;
    
    component.closeDropdowns();
    
    expect(component.isNotificationsOpen).toBe(false);
    expect(component.isMobileMenuOpen).toBe(false);
  });
});
