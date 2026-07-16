import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';
import { SuperadminStateService } from '../../core/services/superadmin-state.service';
import { Chart, registerables } from 'chart.js';
import { MagicParticlesComponent } from '../../shared/components/magic-ui/magic-particles/magic-particles.component';
import { environment } from '../../../environments/environment';

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
  public superadminStateService = inject(SuperadminStateService);

  isOverlayActive = signal<boolean>(true);
  activeTab = signal<'overview' | 'users' | 'turfs' | 'requests' | 'verifications'>('overview');
  expandedOwnerId = signal<number | null>(null);
  
  stats = {
    users: 0,
    owners: 0,
    turfs: 0,
    bookings: 0,
    revenue: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    blockedUsers: 0
  };

  verifications = signal<any[]>([]);
  radialChartInstance: any = null;

  // Users State
  usersList = signal<any[]>([]);
  userSearchQuery = signal<string>('');
  userStatusFilter = signal<string>('All');
  
  filteredUsers = computed(() => {
    let users = this.usersList();
    
    if (this.userStatusFilter() !== 'All') {
      users = users.filter(u => u.status === this.userStatusFilter());
    }
    
    const query = this.userSearchQuery().toLowerCase().trim();
    if (query) {
      users = users.filter(u => 
        (u.name && u.name.toLowerCase().includes(query)) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        (u.phoneNumber && u.phoneNumber.includes(query))
      );
    }
    
    return users;
  });

  // Rejection modal state
  isRejectionModalOpen = signal<boolean>(false);
  selectedOwnerId = signal<number | null>(null);
  rejectionReason = '';

  // Edit modal state
  isEditModalOpen = signal<boolean>(false);
  editOwnerData = { ownerId: 0, fullName: '', mobileNumber: '', email: '', address: '' };

  ngOnInit(): void {
    this.loadStats();
    this.loadVerifications();
    this.loadUsers();
    this.loadTurfs();
  }

  loadStats() {
    this.http.get<any>(`${environment.apiUrl}/SuperAdmin/dashboard-metrics`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.stats = {
          ...this.stats,
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

  loadTurfs() {
    this.http.get<any>(`${environment.apiUrl}/SuperAdmin/turfs`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res;
        this.turfsList.set(data || []);
      },
      error: () => this.notificationService.error('Failed to load turfs list')
    });
  }

  viewTurfBookings(turf: any) {
    this.selectedTurfForBookings.set(turf);
    this.isTurfBookingsModalOpen.set(true);
    this.isTurfBookingsLoading.set(true);
    this.turfBookingsList.set([]); // Clear previous
    this.turfSlotsList.set([]);
    this.turfBookingSearchQuery.set('');
    this.turfBookingDateFilter.set('All');
    this.turfBookingSortOrder.set('Latest');
    
    this.http.get<any>(`${environment.apiUrl}/SuperAdmin/turfs/${turf.id}/bookings`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        if (data) {
          this.turfSlotsList.set(data.slots || []);
          this.turfBookingsList.set(data.bookings || []);
        }
        this.isTurfBookingsLoading.set(false);
      },
      error: () => {
        this.notificationService.error('Failed to load turf bookings');
        this.isTurfBookingsLoading.set(false);
      }
    });
  }

  closeTurfBookingsModal() {
    this.isTurfBookingsModalOpen.set(false);
    this.selectedTurfForBookings.set(null);
  }

  loadUsers() {
    this.http.get<any>(`${environment.apiUrl}/SuperAdmin/users`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res;
        this.usersList.set(data || []);
        
        // Update user stats
        this.stats.activeUsers = data.filter((u: any) => u.status === 'Active').length;
        this.stats.inactiveUsers = data.filter((u: any) => u.status === 'Inactive').length;
        this.stats.blockedUsers = data.filter((u: any) => u.status === 'Blocked').length;
      },
      error: () => this.notificationService.error('Failed to load users')
    });
  }

  // User Status Modal
  isUserStatusModalOpen = signal<boolean>(false);
  selectedUserIdForStatus = signal<number | null>(null);
  selectedUserStatus = signal<string>('');
  userStatusReason = '';

  // User Bookings Modal
  isUserBookingsModalOpen = signal<boolean>(false);
  selectedUserForBookings = signal<any>(null);
  userBookingsList = signal<any[]>([]);
  bookingSearchQuery = signal<string>('');
  bookingFilter = signal<string>('All');
  bookingSortOrder = signal<string>('Latest'); // New sort filter

  filteredUserBookings = computed(() => {
    let bookings = this.userBookingsList();
    
    if (this.bookingFilter() !== 'All') {
      const now = new Date();
      if (this.bookingFilter() === 'Upcoming') {
        bookings = bookings.filter(b => new Date(b.startTime) > now);
      } else if (this.bookingFilter() === 'Past') {
        bookings = bookings.filter(b => new Date(b.startTime) <= now);
      }
    }
    
    const query = this.bookingSearchQuery().toLowerCase().trim();
    if (query) {
      bookings = bookings.filter(b => 
        (b.turfName && b.turfName.toLowerCase().includes(query)) ||
        (b.location && b.location.toLowerCase().includes(query))
      );
    }
    
    // Sort
    bookings.sort((a, b) => {
      const dateA = new Date(a.bookingDate).getTime();
      const dateB = new Date(b.bookingDate).getTime();
      return this.bookingSortOrder() === 'Latest' ? dateB - dateA : dateA - dateB;
    });

    return bookings;
  });

  // Turfs List & Turf Bookings
  turfsList = signal<any[]>([]);
  isTurfBookingsModalOpen = signal<boolean>(false);
  isTurfBookingsLoading = signal<boolean>(false);
  selectedTurfForBookings = signal<any>(null);
  turfBookingsList = signal<any[]>([]);
  turfSlotsList = signal<any[]>([]);
  turfBookingSearchQuery = signal<string>('');
  turfBookingDateFilter = signal<string>('All'); // 'All', 'Today', 'Upcoming'
  turfBookingSortOrder = signal<string>('Latest');

  turfSchedule = computed(() => {
    const slots = this.turfSlotsList();
    const bookings = this.turfBookingsList();
    
    // We want to display all slots for the next 7 days (or any dates that have bookings).
    const datesSet = new Set<string>();
    
    // 1. Add next 7 days to the set by default so SuperAdmin can see future empty slots
    const today = new Date();
    today.setHours(0,0,0,0);
    for (let i = 0; i < 7; i++) {
      const futureDate = new Date(today);
      futureDate.setDate(today.getDate() + i);
      datesSet.add(futureDate.toDateString());
    }

    // 2. Add any other dates that actually have bookings (past or future > 7 days)
    bookings.forEach(b => {
      if (b.bookingDate) datesSet.add(new Date(b.bookingDate).toDateString());
    });

    let groupedSchedule: { date: Date, slots: any[] }[] = [];

    Array.from(datesSet).forEach(dateStr => {
      const d = new Date(dateStr);
      
      // Date filtering
      if (this.turfBookingDateFilter() === 'Today' && d.toDateString() !== today.toDateString()) return;
      if (this.turfBookingDateFilter() === 'Upcoming' && d < today) return;

      let dailySlots: any[] = [];
      
      const standardSlots = [
        { startTime: '06:00:00', endTime: '07:00:00', timeDisplay: '06:00 AM to 07:00 AM' },
        { startTime: '07:00:00', endTime: '08:00:00', timeDisplay: '07:00 AM to 08:00 AM' },
        { startTime: '08:00:00', endTime: '09:00:00', timeDisplay: '08:00 AM to 09:00 AM' },
        { startTime: '09:00:00', endTime: '10:00:00', timeDisplay: '09:00 AM to 10:00 AM' },
        { startTime: '10:00:00', endTime: '11:00:00', timeDisplay: '10:00 AM to 11:00 AM' },
        { startTime: '11:00:00', endTime: '12:00:00', timeDisplay: '11:00 AM to 12:00 PM' },
        { startTime: '12:00:00', endTime: '13:00:00', timeDisplay: '12:00 PM to 01:00 PM' },
        { startTime: '13:00:00', endTime: '14:00:00', timeDisplay: '01:00 PM to 02:00 PM' },
        { startTime: '14:00:00', endTime: '15:00:00', timeDisplay: '02:00 PM to 03:00 PM' },
        { startTime: '15:00:00', endTime: '16:00:00', timeDisplay: '03:00 PM to 04:00 PM' },
        { startTime: '16:00:00', endTime: '17:00:00', timeDisplay: '04:00 PM to 05:00 PM' },
        { startTime: '17:00:00', endTime: '18:00:00', timeDisplay: '05:00 PM to 06:00 PM' },
        { startTime: '18:00:00', endTime: '19:00:00', timeDisplay: '06:00 PM to 07:00 PM' },
        { startTime: '19:00:00', endTime: '20:00:00', timeDisplay: '07:00 PM to 08:00 PM' },
        { startTime: '20:00:00', endTime: '21:00:00', timeDisplay: '08:00 PM to 09:00 PM' },
        { startTime: '21:00:00', endTime: '22:00:00', timeDisplay: '09:00 PM to 10:00 PM' }
      ];

      standardSlots.forEach(standardSlot => {
        // Find if this standard slot exists in the turf's actual slots, and if it's booked
        const actualSlot = slots.find(s => s.startTime === standardSlot.startTime);
        
        let booking = null;
        if (actualSlot) {
          booking = bookings.find(b => b.slotId === actualSlot.id && new Date(b.bookingDate).toDateString() === dateStr);
        } else {
          // Sometimes the backend might not send slots properly, but we can still try to match bookings by their startTime if they have it
          booking = bookings.find(b => {
             return new Date(b.bookingDate).toDateString() === dateStr && b.startTime === standardSlot.startTime;
          });
        }
        
        dailySlots.push({
          timeDisplay: standardSlot.timeDisplay,
          startTime: standardSlot.startTime,
          endTime: standardSlot.endTime,
          isBooked: !!booking,
          userName: booking ? booking.userName : 'No booked',
          userEmail: booking ? booking.userEmail : '-',
          userPhone: booking ? booking.userPhone : '-',
          price: booking ? booking.price : '-',
          status: booking ? booking.status : '-'
        });
      });

      // Search filtering for the daily slots
      const query = this.turfBookingSearchQuery().toLowerCase().trim();
      if (query) {
        dailySlots = dailySlots.filter(r => 
          r.userName.toLowerCase().includes(query) ||
          r.userEmail.toLowerCase().includes(query)
        );
      }

      // If we have slots after search filtering, add the group
      if (dailySlots.length > 0) {

        groupedSchedule.push({
          date: d,
          slots: dailySlots
        });
      }
    });

    // Sort dates - default to Ascending so Today is at the top
    groupedSchedule.sort((a, b) => {
      // 'Latest' now means chronological order (Today -> Tomorrow)
      // 'Oldest' means reverse chronological (Next week -> Today)
      return this.turfBookingSortOrder() === 'Latest' ? a.date.getTime() - b.date.getTime() : b.date.getTime() - a.date.getTime();
    });

    return groupedSchedule;
  });

  updateUserStatusPrompt(userId: number, newStatus: string) {
    if (newStatus === 'Active') {
      // For active, we might not need a reason, just activate immediately
      this.updateUserStatus(userId, newStatus, '');
    } else {
      this.selectedUserIdForStatus.set(userId);
      this.selectedUserStatus.set(newStatus);
      this.userStatusReason = '';
      this.isUserStatusModalOpen.set(true);
    }
  }

  closeUserStatusModal() {
    this.isUserStatusModalOpen.set(false);
    this.selectedUserIdForStatus.set(null);
    this.selectedUserStatus.set('');
  }

  submitUserStatusUpdate() {
    if (!this.userStatusReason.trim()) {
      this.notificationService.error('Please enter a reason.');
      return;
    }
    const userId = this.selectedUserIdForStatus();
    if (userId) {
      this.updateUserStatus(userId, this.selectedUserStatus(), this.userStatusReason);
      this.closeUserStatusModal();
    }
  }

  updateUserStatus(userId: number, newStatus: string, reason: string = '') {
    this.http.post<any>(`${environment.apiUrl}/SuperAdmin/users/${userId}/status`, { status: newStatus, reason: reason }).subscribe({
      next: () => {
        this.notificationService.success(`User marked as ${newStatus}`);
        this.loadUsers();
      },
      error: (err) => this.notificationService.error(err.error?.Message || 'Failed to update user status')
    });
  }

  viewUserBookings(user: any) {
    this.selectedUserForBookings.set(user);
    this.isUserBookingsModalOpen.set(true);
    this.userBookingsList.set([]); // Clear previous
    this.bookingSearchQuery.set('');
    this.bookingFilter.set('All');
    
    this.http.get<any>(`${environment.apiUrl}/SuperAdmin/users/${user.id}/bookings`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.userBookingsList.set(data || []);
      },
      error: () => this.notificationService.error('Failed to load user bookings')
    });
  }

  closeUserBookingsModal() {
    this.isUserBookingsModalOpen.set(false);
    this.selectedUserForBookings.set(null);
  }



  loadVerifications() {
    this.http.get<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/SuperAdmin/verifications').subscribe({
      next: (res) => {
        const data = res.data || res.Data || res;
        
        if (Array.isArray(data)) {
          data.forEach(ver => {
            const activeTurfs = ver.turfs ? ver.turfs.filter((t: any) => t.verificationStatus === 'Approved') : [];
            const pendingTurfs = ver.turfs ? ver.turfs.filter((t: any) => t.verificationStatus === 'Pending Verification' || t.verificationStatus === 'Under Review') : [];
            ver.activeTurfsCount = activeTurfs.length;
            ver.activeTurfNames = activeTurfs.map((t: any) => t.turfName).join(', ');
            ver.pendingTurfsCount = pendingTurfs.length;
          });
        }

        this.verifications.set(data || []);
        setTimeout(() => {
          this.isOverlayActive.set(false);
        }, 1500);
      },
      error: () => {
        this.notificationService.error('Failed to load owner verifications');
        setTimeout(() => {
          this.isOverlayActive.set(false);
        }, 1500);
      }
    });
  }

  setTab(tab: 'overview' | 'users' | 'turfs' | 'requests' | 'verifications') {
    this.activeTab.set(tab);
    if (tab === 'overview') {
      setTimeout(() => this.initRadialChart(), 100);
    }
    if (tab === 'verifications') {
      this.superadminStateService.markAsViewed();
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

  toggleExpandedOwner(ownerId: number) {
    if (this.expandedOwnerId() === ownerId) {
      this.expandedOwnerId.set(null);
    } else {
      this.expandedOwnerId.set(ownerId);
    }
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

    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/SuperAdmin/verify', payload).subscribe({
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

    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/SuperAdmin/edit-owner', this.editOwnerData).subscribe({
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
      this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/SuperAdmin/remove-owner', { ownerId }).subscribe({
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
