import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { Chart, registerables } from 'chart.js';
import { MagicParticlesComponent } from '../../shared/components/magic-ui/magic-particles/magic-particles.component';

Chart.register(...registerables);

@Component({
  selector: 'app-superadmin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MagicParticlesComponent],
  templateUrl: './superadmin-dashboard.component.html',
  styleUrls: ['./superadmin-dashboard.component.css']
})
export class SuperadminDashboardComponent implements OnInit {
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  isOverlayActive = signal<boolean>(true);
  activeTab = signal<'overview' | 'users' | 'turfs' | 'requests' | 'verifications'>('overview');
  
  stats = {
    users: 0,
    owners: 0,
    turfs: 0,
    bookings: 0,
    revenue: 0
  };

  ownerRequests: any[] = [];
  verifications = signal<any[]>([]);
  radialChartInstance: any = null;

  // Rejection modal state
  isRejectionModalOpen = signal<boolean>(false);
  selectedOwnerId = signal<number | null>(null);
  rejectionReason = '';

  // Edit modal state
  isEditModalOpen = signal<boolean>(false);
  editOwnerData = { ownerId: 0, fullName: '', mobileNumber: '', email: '', address: '' };

  ngOnInit(): void {
    this.loadStats();
    this.loadOwnerRequests();
    this.loadVerifications();
  }

  loadStats() {
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
        if (this.activeTab() === 'overview') {
          setTimeout(() => this.initRadialChart(), 100);
        }
      },
      error: () => this.notificationService.error('Failed to load system metrics')
    });
  }

  loadOwnerRequests() {
    this.http.get<any>('https://localhost:7273/api/v1/SuperAdmin/owner-requests').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.ownerRequests = data || [];
        setTimeout(() => {
          this.isOverlayActive.set(false);
        }, 1500);
      },
      error: () => {
        this.notificationService.error('Failed to load owner requests');
        setTimeout(() => {
          this.isOverlayActive.set(false);
        }, 1500);
      }
    });
  }

  loadVerifications() {
    this.http.get<any>('https://localhost:7273/api/v1/SuperAdmin/verifications').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res;
        this.verifications.set(data || []);
      },
      error: () => this.notificationService.error('Failed to load owner verifications')
    });
  }

  setTab(tab: 'overview' | 'users' | 'turfs' | 'requests' | 'verifications') {
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

    const bgTrack = 'rgba(150, 150, 150, 0.1)';

    this.radialChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Users', 'Turfs', 'Owners'],
        datasets: [
          {
            data: [this.stats.owners, 50 - this.stats.owners],
            backgroundColor: ['#eab308', bgTrack],
            borderWidth: 0,
            circumference: 360,
            weight: 1
          },
          {
            data: [this.stats.turfs, 100 - this.stats.turfs],
            backgroundColor: ['#ec4899', bgTrack],
            borderWidth: 0,
            circumference: 360,
            weight: 1
          },
          {
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
        cutout: '45%',
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
      next: () => {
        const req = this.ownerRequests.find(r => r.id === id);
        if (req) req.status = 'Approved';
        this.notificationService.success('Owner request approved successfully!');
        this.loadStats();
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

  // Verification actions
  approveVerification(ownerId: number, turfId?: number) {
    this.submitVerificationStatus(ownerId, 'Approved', '', turfId);
  }

  selectedTurfId = signal<number | null>(null);

  openRejectionModal(ownerId: number, turfId?: number) {
    this.selectedOwnerId.set(ownerId);
    this.selectedTurfId.set(turfId || null);
    this.rejectionReason = '';
    this.isRejectionModalOpen.set(true);
  }

  closeRejectionModal() {
    this.isRejectionModalOpen.set(false);
    this.selectedOwnerId.set(null);
    this.selectedTurfId.set(null);
  }

  submitRejection() {
    if (!this.rejectionReason.trim()) {
      this.notificationService.error('Please enter a rejection reason.');
      return;
    }
    const ownerId = this.selectedOwnerId();
    const turfId = this.selectedTurfId();
    if (ownerId) {
      this.submitVerificationStatus(ownerId, 'Rejected', this.rejectionReason, turfId || undefined);
      this.closeRejectionModal();
    }
  }

  submitVerificationStatus(ownerId: number, status: string, reason: string = '', turfId?: number) {
    const payload = {
      ownerId: ownerId,
      turfId: turfId,
      status: status,
      rejectionReason: reason
    };

    this.http.post<any>('https://localhost:7273/api/v1/SuperAdmin/verify', payload).subscribe({
      next: () => {
        this.notificationService.success(`Verification set to '${status}' successfully.`);
        this.loadVerifications();
        this.loadStats();
      },
      error: (err) => {
        this.notificationService.error(err.error?.Message || 'Failed to update verification status');
      }
    });
  }

  openEditModal(owner: any) {
    this.editOwnerData = {
      ownerId: owner.ownerId,
      fullName: owner.fullName || '',
      mobileNumber: owner.mobileNumber || '',
      email: owner.email || '',
      address: owner.address || ''
    };
    this.isEditModalOpen.set(true);
  }

  closeEditModal() {
    this.isEditModalOpen.set(false);
  }

  submitEdit() {
    if (!this.editOwnerData.fullName.trim() || !this.editOwnerData.email.trim()) {
      this.notificationService.error('Full Name and Email are required.');
      return;
    }

    this.http.post<any>('https://localhost:7273/api/v1/SuperAdmin/edit-owner', this.editOwnerData).subscribe({
      next: () => {
        this.notificationService.success('Owner information updated successfully.');
        this.loadVerifications();
        this.closeEditModal();
      },
      error: (err) => {
        this.notificationService.error(err.error?.Message || 'Failed to update owner details');
      }
    });
  }

  removeOwner(ownerId: number) {
    if (confirm('Are you sure you want to remove this owner? All associated turf listings, documents, and payments will be permanently deleted.')) {
      this.http.post<any>('https://localhost:7273/api/v1/SuperAdmin/remove-owner', { ownerId }).subscribe({
        next: () => {
          this.notificationService.success('Owner and associated turf removed successfully.');
          this.loadVerifications();
          this.loadStats();
        },
        error: (err) => {
          this.notificationService.error(err.error?.Message || 'Failed to remove owner');
        }
      });
    }
  }
}
