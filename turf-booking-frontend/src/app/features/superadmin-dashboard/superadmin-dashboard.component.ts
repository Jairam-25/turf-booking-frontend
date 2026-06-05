import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  activeTab = signal<'overview' | 'users' | 'turfs' | 'requests'>('overview');
  
  stats = {
    users: 1450,
    owners: 12,
    turfs: 45,
    bookings: 3450,
    revenue: 1250000
  };

  ownerRequests: any[] = [];

  ngOnInit(): void {
    this.http.get<any>('https://localhost:7273/api/v1/SuperAdmin/owner-requests').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.ownerRequests = data || [];
      },
      error: (err) => {
        this.notificationService.error('Failed to load owner requests');
      }
    });
  }

  setTab(tab: 'overview' | 'users' | 'turfs' | 'requests') {
    this.activeTab.set(tab);
  }

  approveRequest(id: number) {
    this.http.post<any>('https://localhost:7273/api/v1/SuperAdmin/approve-owner', { requestId: id }).subscribe({
      next: (res) => {
        const req = this.ownerRequests.find(r => r.id === id);
        if (req) req.status = 'Approved';
        this.notificationService.success('Owner request approved successfully!');
      },
      error: (err) => {
        this.notificationService.error(err.error?.Message || 'Failed to approve request');
      }
    });
  }

  rejectRequest(id: number) {
    const req = this.ownerRequests.find(r => r.id === id);
    if (req) req.status = 'Rejected';
  }
}
