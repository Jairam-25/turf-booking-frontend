import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';
import { Router, RouterModule } from '@angular/router';
import { AuthStore } from '../../core/services/auth.store';
import { ChangeDetectorRef } from '@angular/core';
import { MagicParticlesComponent } from '../../shared/components/magic-ui/magic-particles/magic-particles.component';

Chart.register(...registerables);

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, MagicParticlesComponent],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {
  isOverlayActive = signal<boolean>(true);
  activeTab = signal<'overview' | 'bookings' | 'settings' | 'offline'>('overview');
  turfName = signal<string>('Loading...');
  turfId = signal<number | null>(null);
  isDropdownOpen = signal<boolean>(false);
  stats = { revenue: 0, bookings: 0, utilization: 0, pending: 0 };
  recentBookings: any[] = [];
  availableSlots: any[] = [];
  ownedTurfs = signal<any[]>([]);
  verificationStatus = signal<string | null>(null);
  selectedDate: string = new Date().toISOString().split('T')[0];
  todayDate: string = new Date().toISOString().split('T')[0];

  // Logout properties
  isLogoutModalOpen = signal<boolean>(false);
  otpSent = signal<boolean>(false);
  isSendingOtp = signal<boolean>(false);
  isVerifyingOtp = signal<boolean>(false);
  remainingDays = signal<number>(365);
  maskedEmail = signal<string>('');
  logoutOtpCode = '';

  // Slot Filters
  statusFilter = signal<'all' | 'available' | 'booked' | 'unavailable'>('all');
  timeFilter = signal<'all' | 'day' | 'afternoon' | 'night'>('all');
  isStatusDropdownOpen = signal<boolean>(false);
  isTimeDropdownOpen = signal<boolean>(false);

  // Cancel Modal State
  isCancelModalOpen = signal(false);
  isCancelling = signal(false);
  cancelReason = '';
  bookingToCancelId: string | null = null;

  // Image State
  imageUrl = signal<string | null>(null);
  isUploadingImage = signal<boolean>(false);

  // Booking State
  isBookingSlotId = signal<number | null>(null);

  get filteredSlots() {
    return this.availableSlots.filter(s => {
      let matchesDate = true;
      let matchesStatus = true;
      let matchesTime = true;

      if (this.selectedDate) {
        const slotDateObj = new Date(s.StartTime || s.startTime);
        const slotDateStr = new Date(slotDateObj.getTime() - (slotDateObj.getTimezoneOffset() * 60000)).toISOString().split('T')[0];
        matchesDate = slotDateStr === this.selectedDate;
      }

      const isBooked = s.IsBooked || s.isBooked;
      const isPast = this.isSlotPast(s);
      
      if (this.statusFilter() === 'available') matchesStatus = !isBooked && !isPast;
      else if (this.statusFilter() === 'booked') matchesStatus = isBooked;
      else if (this.statusFilter() === 'unavailable') matchesStatus = !isBooked && isPast;

      const timeSlotStr = (s.TimeSlot || s.timeSlot || '').toLowerCase();
      if (this.timeFilter() !== 'all') {
        matchesTime = timeSlotStr.includes(this.timeFilter());
      }

      return matchesDate && matchesStatus && matchesTime;
    });
  }

  isSlotPast(slot: any): boolean {
    const st = slot.StartTime || slot.startTime;
    if (!st) return false;
    return new Date(st).getTime() < new Date().getTime();
  }
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);
  private authStore = inject(AuthStore);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  // New mock data properties for analytics
  analyticsStats = {
    totalCustomers: 0,
    monthlyRevenue: 0,
    monthlyCosts: 0,
    pendingBookings: 0,
    dueToday: 0,
    unassigned: 0
  };
  
  chartInstances: any[] = [];

  settingsForm = this.fb.group({
    turfName: [''],
    pricePerHour: [0],
    dayTimePrice: [null],
    afternoonPrice: [null],
    nightTimePrice: [null],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(tId?: number) {
    this.isOverlayActive.set(true);
    let url = 'https://turf-booking-backend-fixl.onrender.com/api/v1/owner/dashboard';
    if (tId) {
      url += `?turfId=${tId}`;
    }

    this.http.get<any>(url).subscribe({
      next: (res: any) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.turfName.set(data.TurfName || data.turfName);
        this.turfId.set(data.TurfId || data.turfId);
        
        const allTurfs = data.OwnedTurfs || data.ownedTurfs;
        if (allTurfs && Array.isArray(allTurfs)) {
          this.ownedTurfs.set(allTurfs);
        }

        this.stats = data.Stats || data.stats;
        this.recentBookings = data.RecentBookings || data.recentBookings;
        this.verificationStatus.set(data.VerificationStatus || data.verificationStatus || null);
        
        const remaining = data.RemainingDays || data.remainingDays;
        if (remaining !== undefined) {
          this.remainingDays.set(remaining);
        }
        
        const analytics = data.Analytics || data.analytics;
        if (analytics) {
          this.analyticsStats = {
            totalCustomers: analytics.TotalCustomers || analytics.totalCustomers || 0,
            monthlyRevenue: analytics.MonthlyRevenue || analytics.monthlyRevenue || 0,
            monthlyCosts: analytics.MonthlyCosts || analytics.monthlyCosts || 0,
            pendingBookings: analytics.PendingBookings || analytics.pendingBookings || 0,
            dueToday: analytics.DueToday || analytics.dueToday || 0,
            unassigned: analytics.Unassigned || analytics.unassigned || 0
          };
        }
        
        this.imageUrl.set(data.ImageUrl || data.imageUrl || null);
        
        this.settingsForm.patchValue({
          turfName: this.turfName(),
          pricePerHour: data.PricePerHour || data.pricePerHour || 100,
          dayTimePrice: data.DayTimePrice || data.dayTimePrice || null,
          afternoonPrice: data.AfternoonPrice || data.afternoonPrice || null,
          nightTimePrice: data.NightTimePrice || data.nightTimePrice || null,
          isActive: true
        });

        // Trigger animation if registered owner (has valid TurfId)
        if (this.turfId()) {
          setTimeout(() => {
            this.isOverlayActive.set(false);
            if (this.activeTab() === 'overview') this.initCharts();
          }, 1500); // Wait 1.5s to show the nice animation for registered owners
        } else {
          // If no turf assigned, remove overlay instantly
          this.isOverlayActive.set(false);
          setTimeout(() => this.initCharts(), 300);
        }
      },
      error: (err: any) => {
        this.notificationService.error('Failed to load dashboard data');
        this.isOverlayActive.set(false);
      }
    });
  }

  switchTurfModel(tId: any) {
    const id = parseInt(tId, 10);
    if (!isNaN(id)) {
      this.isDropdownOpen.set(false);
      this.turfName.set('Loading...');
      this.loadDashboardData(id);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen.update(v => !v);
  }

  setStatusFilter(val: 'all' | 'available' | 'booked' | 'unavailable') {
    this.statusFilter.set(val);
    this.isStatusDropdownOpen.set(false);
  }

  setTimeFilter(val: 'all' | 'day' | 'afternoon' | 'night') {
    this.timeFilter.set(val);
    this.isTimeDropdownOpen.set(false);
  }

  setTab(tab: 'overview' | 'bookings' | 'settings' | 'offline') {
    this.activeTab.set(tab);
    if (tab === 'overview') {
      setTimeout(() => this.initCharts(), 100);
    }
    if (tab === 'offline') {
      this.loadAvailableSlots();
    }
  }

  loadAvailableSlots() {
    const id = this.turfId();
    if (!id) return;

    this.http.get<any>(`https://turf-booking-backend-fixl.onrender.com/api/v1/slot?turfId=${id}`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.availableSlots = Array.isArray(data) ? data : [];
      },
      error: () => this.notificationService.error('Failed to load slots for offline booking')
    });
  }

  bookOffline(slotId: number) {
    this.isBookingSlotId.set(slotId);
    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/booking', { slotId }).subscribe({
      next: (res) => {
        this.isBookingSlotId.set(null);
        this.notificationService.success('Offline booking created successfully!');
        const slot = this.availableSlots.find(s => s.slotId === slotId || s.SlotId === slotId);
        if (slot) {
          slot.IsBooked = true;
          slot.isBooked = true;
          
          const stDate = new Date(slot.StartTime || slot.startTime);
          const enDate = new Date(slot.EndTime || slot.endTime);
          
          this.recentBookings.unshift({
            Id: res.data?.id || res.value?.id || res.Data?.Id || res.Value?.Id || res.id || res.Id || Math.floor(Math.random() * 10000),
            User: 'Offline Booking',
            Date: stDate.toLocaleDateString(),
            Time: `${stDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - ${enDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`,
            Amount: this.settingsForm.value.pricePerHour || 0,
            Status: 'Confirmed'
          });
        }
      },
      error: (err) => {
        this.isBookingSlotId.set(null);
        this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to book slot offline');
      }
    });
  }

  initCharts() {
    // Destroy existing charts to prevent duplication
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];

    const timeLabels = ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM'];
    const onlineData = new Array(10).fill(0);
    const offlineData = new Array(10).fill(0);

    let onlineTotal = 0;
    let offlineTotal = 0;

    this.recentBookings.forEach(booking => {
      const timeStr = booking.Time || booking.time;
      if (timeStr) {
        const startHour = parseInt(timeStr.split(':')[0], 10);
        let index = Math.floor((startHour - 6) / 2);
        if (index < 0) index = 0;
        if (index > 9) index = 9;
        
        if (booking.User === 'Offline Booking') {
          offlineData[index]++;
          offlineTotal++;
        } else {
          onlineData[index]++;
          onlineTotal++;
        }
      }
    });

    // Main Chart: Online vs Offline Bookings (Line + Bar)
    const mainCtx = document.getElementById('mainChart') as HTMLCanvasElement;
    if (mainCtx) {
      const mainChart = new Chart(mainCtx, {
        type: 'bar',
        data: {
          labels: timeLabels,
          datasets: [
            {
              type: 'line',
              label: 'Online Bookings',
              data: onlineData,
              borderColor: '#7b39fc',
              backgroundColor: '#7b39fc',
              borderWidth: 2,
              tension: 0.4,
              pointBackgroundColor: '#fff',
              pointBorderColor: '#7b39fc',
              pointBorderWidth: 2,
              pointRadius: 4
            },
            {
              type: 'bar',
              label: 'Offline Bookings',
              data: offlineData,
              backgroundColor: '#22c55e',
              borderRadius: 4,
              barPercentage: 0.5
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(150, 150, 150, 0.1)' }, ticks: { color: '#8a8a8a' } },
            x: { grid: { display: false }, ticks: { color: '#8a8a8a' } }
          },
          plugins: {
            legend: { display: false } // Hidden to use custom HTML legend
          }
        }
      });
      this.chartInstances.push(mainChart);
    }

    // Donut Chart 1: Traffic Analysis
    const trafficCtx = document.getElementById('trafficChart') as HTMLCanvasElement;
    if (trafficCtx) {
      const totalWeb = Math.round(onlineTotal * 0.6);
      const totalApp = onlineTotal - totalWeb;

      const trafficChart = new Chart(trafficCtx, {
        type: 'doughnut',
        data: {
          labels: ['Web', 'App', 'Direct Walk-in', 'Partners'],
          datasets: [{
            data: [totalWeb, totalApp, offlineTotal, 0],
            backgroundColor: ['#7b39fc', '#20c997', '#ffc107', '#dc3545'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { position: 'right', labels: { color: '#8a8a8a', padding: 15 } }
          }
        }
      });
      this.chartInstances.push(trafficChart);
    }

    // Horizontal Bar: Utilization Time
    const utilCtx = document.getElementById('utilizationChart') as HTMLCanvasElement;
    if (utilCtx) {
      const utilChart = new Chart(utilCtx, {
        type: 'bar',
        data: {
          labels: ['Peak Hours', 'Off-Peak Hours', 'Maintenance'],
          datasets: [{
            label: 'Hours/Week',
            data: [45, 30, 8],
            backgroundColor: '#7b39fc',
            borderRadius: 4,
            barThickness: 10
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { beginAtZero: true, grid: { color: 'rgba(150,150,150,0.1)' }, ticks: { color: '#8a8a8a' } },
            y: { grid: { display: false }, ticks: { color: '#8a8a8a' } }
          },
          plugins: { legend: { display: false } }
        }
      });
      this.chartInstances.push(utilChart);
    }

    // Donut Chart 2: Happiness Ratings
    const ratingCtx = document.getElementById('ratingChart') as HTMLCanvasElement;
    if (ratingCtx) {
      const ratingChart = new Chart(ratingCtx, {
        type: 'doughnut',
        data: {
          labels: ['5 Stars', '4 Stars', '3 Stars & Below'],
          datasets: [{
            data: [80, 15, 5],
            backgroundColor: ['#20c997', '#ffc107', '#dc3545'],
            borderWidth: 0,
            hoverOffset: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { position: 'right', labels: { color: '#8a8a8a', padding: 15 } }
          }
        }
      });
      this.chartInstances.push(ratingChart);
    }
  }

  approveBooking(id: string) {
    const b = this.recentBookings.find(x => x.Id === id || x.id === id);
    if (b) b.Status = b.status = 'Confirmed';
  }

  openCancelModal(id: string) {
    this.bookingToCancelId = id;
    this.cancelReason = '';
    this.isCancelModalOpen.set(true);
  }

  closeCancelModal() {
    this.isCancelModalOpen.set(false);
    this.bookingToCancelId = null;
    this.cancelReason = '';
  }

  confirmCancel() {
    if (!this.bookingToCancelId) return;

    if (!this.cancelReason.trim()) {
      this.notificationService.error('A cancellation reason is required.');
      return;
    }

    const id = this.bookingToCancelId;
    const bookingIdNum = parseInt(id.replace('B-', ''), 10);
    this.isCancelling.set(true);

    this.http.delete(`https://turf-booking-backend-fixl.onrender.com/api/v1/owner/booking/${bookingIdNum}?reason=${encodeURIComponent(this.cancelReason)}`).subscribe({
      next: () => {
        const b = this.recentBookings.find(x => x.Id === id || x.id === id);
        if (b) {
          b.Status = 'Cancelled';
          b.status = 'Cancelled';
        }
        this.notificationService.success('Booking cancelled successfully.');
        this.cdr.detectChanges();
        
        // Refresh slots so the UI shows the slot as Available again
        this.loadAvailableSlots();
        this.isCancelling.set(false);
        this.closeCancelModal();
      },
      error: (err) => {
        this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to cancel booking.');
        this.isCancelling.set(false);
      }
    });
  }

  exportReport() {
    this.notificationService.success('Exporting report...');
    
    if (!this.recentBookings || this.recentBookings.length === 0) {
      this.notificationService.error('No data available to export.');
      return;
    }

    const headers = ['Booking ID', 'User', 'Date', 'Time', 'Amount (INR)', 'Status'];
    const rows = this.recentBookings.map(b => [
      b.Id || b.id,
      b.User || b.user,
      b.Date || b.date,
      b.Time || b.time,
      b.Amount || b.amount,
      b.Status || b.status
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Turf_Bookings_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  saveSettings() {
    if (this.settingsForm.invalid) {
      this.notificationService.error('Please fill all required settings properly.');
      return;
    }
    const payload = {
      ...this.settingsForm.value,
      imageUrl: this.imageUrl()
    };
    this.http.post('https://turf-booking-backend-fixl.onrender.com/api/v1/owner/settings', payload).subscribe({
      next: () => this.notificationService.success('Settings updated successfully.'),
      error: () => this.notificationService.error('Failed to update settings.')
    });
  }

  onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    this.isUploadingImage.set(true);
    this.cdr.detectChanges();
    
    // Clear input so same file can be selected again
    event.target.value = '';

    const formData = new FormData();
    formData.append('file', file);

    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/Upload', formData).subscribe({
      next: (res) => {
        this.imageUrl.set(res.url);
        this.notificationService.success('Image uploaded temporarily. Click Save Changes to apply.');
        this.isUploadingImage.set(false);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notificationService.error('Failed to upload image. Please try again.');
        this.isUploadingImage.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  clearImage() {
    this.imageUrl.set('CLEAR');
    this.notificationService.success('Image cleared temporarily. Click Save Changes to apply.');
    this.cdr.detectChanges();
  }

  openLogoutModal() {
    this.logoutOtpCode = '';
    this.otpSent.set(false);
    this.isLogoutModalOpen.set(true);
  }

  closeLogoutModal() {
    this.isLogoutModalOpen.set(false);
  }

  sendLogoutOtp() {
    this.isSendingOtp.set(true);
    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/owner/send-logout-otp', {}).subscribe({
      next: (res: any) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.maskedEmail.set(data.email || 'your email');
        this.otpSent.set(true);
        this.notificationService.success('Logout verification OTP sent successfully!');
        this.isSendingOtp.set(false);
      },
      error: (err: any) => {
        this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to send OTP email.');
        this.isSendingOtp.set(false);
      }
    });
  }

  resendOtp() {
    this.sendLogoutOtp();
  }

  verifyAndLogout() {
    if (!this.logoutOtpCode.trim()) {
      this.notificationService.error('Please enter the OTP.');
      return;
    }
    this.isVerifyingOtp.set(true);
    this.http.post<any>('https://turf-booking-backend-fixl.onrender.com/api/v1/owner/verify-logout-otp', { otpCode: this.logoutOtpCode }).subscribe({
      next: (res) => {
        this.isVerifyingOtp.set(false);
        this.isLogoutModalOpen.set(false);
        this.notificationService.success(res.message || res.Message || 'Partnership cancelled successfully.');
        // Update role locally without logging out of the app entirely
        this.authStore.updateUser({ role: 'User', Role: 'User' } as any);
        this.router.navigate(['/home']);
      },
      error: (err: any) => {
        this.notificationService.error(err.error?.Message || err.error?.message || 'Invalid or expired OTP.');
        this.isVerifyingOtp.set(false);
      }
    });
  }
}
