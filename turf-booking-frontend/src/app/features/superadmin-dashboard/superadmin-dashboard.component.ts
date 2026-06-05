import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

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

  isOverlayActive = signal<boolean>(true);
  activeTab = signal<'overview' | 'users' | 'turfs' | 'requests'>('overview');
  
  stats = {
    users: 0,
    owners: 0,
    turfs: 0,
    bookings: 0,
    revenue: 0
  };

  ownerRequests: any[] = [];
  radialChartInstance: any = null;

  ngOnInit(): void {
    // Load real metrics
    this.http.get<any>('https://localhost:7273/api/v1/SuperAdmin/dashboard-metrics').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.stats = {
          users: data.users || data.Users || 0,
          owners: data.owners || data.Owners || 0,
          turfs: data.turfs || data.Turfs || 0,
          bookings: data.bookings || data.Bookings || 0,
          revenue: data.revenue || data.Revenue || 0
        };
        // Initialize chart with real data if on overview tab
        if (this.activeTab() === 'overview') {
          setTimeout(() => this.initRadialChart(), 100);
        }
      },
      error: () => this.notificationService.error('Failed to load system metrics')
    });

    // Load owner requests
    this.http.get<any>('https://localhost:7273/api/v1/SuperAdmin/owner-requests').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.ownerRequests = data || [];
        setTimeout(() => {
          this.isOverlayActive.set(false);
        }, 1500);
      },
      error: (err) => {
        this.notificationService.error('Failed to load owner requests');
        setTimeout(() => {
          this.isOverlayActive.set(false);
        }, 1500);
      }
    });
  }

  setTab(tab: 'overview' | 'users' | 'turfs' | 'requests') {
    this.activeTab.set(tab);
    if (tab === 'overview') {
      setTimeout(() => this.initRadialChart(), 100);
    }
  }

  initRadialChart() {
    if (this.radialChartInstance) {
      this.radialChartInstance.destroy();
    }

    const ctx = document.getElementById('radialChart') as HTMLCanvasElement;
    if (!ctx) return;

    // Background track color (subtle gray)
    const bgTrack = 'rgba(150, 150, 150, 0.1)';

    this.radialChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Users', 'Turfs', 'Owners'],
        datasets: [
          {
            // Inner Ring: Owners (Goal: 50)
            data: [this.stats.owners, 50 - this.stats.owners],
            backgroundColor: ['#eab308', bgTrack],
            borderWidth: 0,
            circumference: 360,
            weight: 1
          },
          {
            // Middle Ring: Turfs (Goal: 100)
            data: [this.stats.turfs, 100 - this.stats.turfs],
            backgroundColor: ['#ec4899', bgTrack],
            borderWidth: 0,
            circumference: 360,
            weight: 1
          },
          {
            // Outer Ring: Users (Goal: 2000)
            data: [this.stats.users, 2000 - this.stats.users],
            backgroundColor: ['#a855f7', bgTrack],
            borderWidth: 0,
            circumference: 360,
            weight: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '45%', // Makes rings appropriately thick
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.datasetIndex === 0 ? 'Owners' : context.datasetIndex === 1 ? 'Turfs' : 'Users';
                if (context.dataIndex === 0) return `${label} Active: ${context.raw}`;
                return `${label} Remaining: ${context.raw}`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true,
          duration: 2500,
          easing: 'easeOutExpo'
        }
      }
    });
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
