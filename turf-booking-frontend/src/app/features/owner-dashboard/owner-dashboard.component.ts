import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {
  activeTab = signal<'overview' | 'bookings' | 'settings'>('overview');
  turfName = signal<string>('Loading...');
  stats = { revenue: 0, bookings: 0, utilization: 0, pending: 0 };
  recentBookings: any[] = [];
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  settingsForm = this.fb.group({
    turfName: [''],
    pricePerHour: [0],
    dayTimePrice: [null],
    afternoonPrice: [null],
    nightTimePrice: [null],
    isActive: [true]
  });

  ngOnInit(): void {
    this.http.get<any>('https://localhost:7273/api/v1/owner/dashboard').subscribe({
      next: (res: any) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.turfName.set(data.TurfName || data.turfName);
        this.stats = data.Stats || data.stats;
        this.recentBookings = data.RecentBookings || data.recentBookings;
        
        this.settingsForm.patchValue({
          turfName: this.turfName(),
          pricePerHour: data.PricePerHour || data.pricePerHour || 100,
          dayTimePrice: data.DayTimePrice || data.dayTimePrice || null,
          afternoonPrice: data.AfternoonPrice || data.afternoonPrice || null,
          nightTimePrice: data.NightTimePrice || data.nightTimePrice || null,
          isActive: true
        });
      },
      error: (err: any) => this.notificationService.error('Failed to load dashboard data')
    });
  }

  setTab(tab: 'overview' | 'bookings' | 'settings') {
    this.activeTab.set(tab);
  }

  approveBooking(id: string) {
    const b = this.recentBookings.find(x => x.Id === id || x.id === id);
    if (b) b.Status = b.status = 'Confirmed';
  }

  cancelBooking(id: string) {
    const b = this.recentBookings.find(x => x.Id === id || x.id === id);
    if (b) b.Status = b.status = 'Cancelled';
  }

  exportReport() {
    this.notificationService.success('Exporting report...');
  }

  saveSettings() {
    if (this.settingsForm.invalid) return;
    
    const payload = this.settingsForm.value;
    
    this.http.post<any>('https://localhost:7273/api/v1/owner/settings', payload).subscribe({
      next: (res) => {
        this.notificationService.success('Turf settings updated successfully!');
        if (payload.turfName) this.turfName.set(payload.turfName);
      },
      error: (err) => {
        this.notificationService.error('Failed to update turf settings.');
      }
    });
  }
}
