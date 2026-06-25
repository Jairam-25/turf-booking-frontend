import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TurfRepository } from '../../domain/repositories/turf.repository';
import { NotificationService } from '../../core/services/notification.service';
import { FcmNotificationService } from '../../core/services/fcm-notification.service';
import { of } from 'rxjs';

import { vi } from 'vitest';

describe('DashboardComponent', () => {
 let component: DashboardComponent;
 let fixture: ComponentFixture<DashboardComponent>;
 
 let mockTurfRepo = {
 getAll: vi.fn().mockReturnValue(of({ items: [], totalCount: 0, pageNumber: 1, pageSize: 10 }))
 };

 let mockNotificationService = {
 error: vi.fn()
 };

 let mockFcmService = {
 requestNotificationPermission: vi.fn(),
 listenForMessages: vi.fn()
 };

 beforeEach(async () => {
 await TestBed.configureTestingModule({
 imports: [DashboardComponent, HttpClientTestingModule],
 providers: [
 { provide: TurfRepository, useValue: mockTurfRepo },
 { provide: NotificationService, useValue: mockNotificationService },
 { provide: FcmNotificationService, useValue: mockFcmService }
 ]
 }).compileComponents();

 fixture = TestBed.createComponent(DashboardComponent);
 component = fixture.componentInstance;
 fixture.detectChanges();
 });

 it('should create', () => {
 expect(component).toBeTruthy();
 });

 it('should format nested district location correctly', () => {
 component.statesList.set(['Tamil Nadu']);
 component.districtsMap.set(new Map([['Tamil Nadu', new Set(['Thanjavur'])]]));

 // Act: User selects district
 const event = new Event('click');
 component.selectLocation(event, 'Tamil Nadu', 'Thanjavur');

 // Assert
 expect(component.selectedState()).toBe('Tamil Nadu');
 expect(component.selectedDistrict()).toBe('Thanjavur');
 expect(component.selectedLocation()).toBe('Thanjavur, Tamil Nadu');
 expect(component.isLocationSelectOpen()).toBe(false);
 expect(mockTurfRepo.getAll).toHaveBeenCalled();
 });

 it('should handle state only selection', () => {
 const event = new Event('click');
 component.selectLocation(event, 'Tamil Nadu', '');
 
 expect(component.selectedState()).toBe('Tamil Nadu');
 expect(component.selectedDistrict()).toBe('');
 expect(component.selectedLocation()).toBe('Tamil Nadu');
 });
});
