import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NotificationService } from '../../core/services/notification.service';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './owner-dashboard.component.html',
  styleUrls: ['./owner-dashboard.component.css']
})
export class OwnerDashboardComponent implements OnInit {
  isOverlayActive = signal<boolean>(true);
  activeTab = signal<'overview' | 'bookings' | 'settings' | 'offline'>('overview');
  turfName = signal<string>('Loading...');
  turfId = signal<number | null>(null);
  stats = { revenue: 0, bookings: 0, utilization: 0, pending: 0 };
  recentBookings: any[] = [];
  availableSlots: any[] = [];
  selectedDate: string = new Date().toISOString().split('T')[0];
  todayDate: string = new Date().toISOString().split('T')[0];

  get filteredSlots() {
    return this.availableSlots.filter(s => {
      const st = s.StartTime || s.startTime;
      if (!st) return false;
      const slotDate = new Date(st).toISOString().split('T')[0];
      return slotDate === this.selectedDate;
    }).sort((a, b) => new Date(a.StartTime || a.startTime).getTime() - new Date(b.StartTime || b.startTime).getTime());
  }

  isSlotPast(slot: any): boolean {
    const st = slot.StartTime || slot.startTime;
    if (!st) return false;
    return new Date(st).getTime() < new Date().getTime();
  }
  
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private notificationService = inject(NotificationService);

  // New mock data properties for analytics
  analyticsStats = {
    totalCustomers: 1827,
    monthlyRevenue: 24450,
    monthlyCosts: 8630,
    pendingBookings: 9,
    dueToday: 0,
    unassigned: 2
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
    this.http.get<any>('https://localhost:7273/api/v1/owner/dashboard').subscribe({
      next: (res: any) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.turfName.set(data.TurfName || data.turfName);
        this.turfId.set(data.TurfId || data.turfId);
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
      error: (err: any) => this.notificationService.error('Failed to load dashboard data')
    });
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

    this.http.get<any>(`https://localhost:7273/api/v1/slot?turfId=${id}`).subscribe({
      next: (res) => {
        const data = res.data || res.Data || res.value || res.Value || res;
        this.availableSlots = Array.isArray(data) ? data : [];
      },
      error: () => this.notificationService.error('Failed to load slots for offline booking')
    });
  }

  bookOffline(slotId: number) {
    this.http.post<any>('https://localhost:7273/api/v1/booking', { slotId }).subscribe({
      next: (res) => {
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
        this.notificationService.error(err.error?.Message || err.error?.message || 'Failed to book slot offline');
      }
    });
  }

  initCharts() {
    // Destroy existing charts to prevent duplication
    this.chartInstances.forEach(chart => chart.destroy());
    this.chartInstances = [];

    // Main Chart: Online vs Offline Bookings (Line + Bar)
    const mainCtx = document.getElementById('mainChart') as HTMLCanvasElement;
    if (mainCtx) {
      const mainChart = new Chart(mainCtx, {
        type: 'bar',
        data: {
          labels: ['6 AM', '8 AM', '10 AM', '12 PM', '2 PM', '4 PM', '6 PM', '8 PM', '10 PM', '12 AM'],
          datasets: [
            {
              type: 'line',
              label: 'Online Bookings',
              data: [5, 10, 25, 40, 35, 50, 80, 60, 45, 15],
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
              data: [10, 20, 15, 30, 25, 45, 60, 50, 40, 10],
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
      const trafficChart = new Chart(trafficCtx, {
        type: 'doughnut',
        data: {
          labels: ['Web', 'App', 'Direct Walk-in', 'Partners'],
          datasets: [{
            data: [435, 251, 138, 85],
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

  cancelBooking(id: string) {
    const b = this.recentBookings.find(x => x.Id === id || x.id === id);
    if (b) b.Status = b.status = 'Cancelled';
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
