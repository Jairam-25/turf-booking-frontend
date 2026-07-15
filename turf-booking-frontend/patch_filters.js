const fs = require('fs');
const path = 'src/app/features/bookings/bookings.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Filter HTML right after tabs container
const filterHtml = `
      <!-- Filters for Booking History -->
      <div *ngIf="activeTab() === 'history'" class="flex gap-2 mb-4 overflow-x-auto scrollbar-hide py-1 snap-x">
        <div class="relative flex-1 min-w-[150px]">
          <input type="text" [ngModel]="historySearchQuery()" (ngModelChange)="historySearchQuery.set($event)" placeholder="Search turf..." class="w-full bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)] pl-8 text-[var(--text-primary)]">
          <svg class="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </div>
        <select [ngModel]="historyDateFilter()" (ngModelChange)="historyDateFilter.set($event)" class="bg-black/5 dark:bg-white/5 border border-[var(--border-color)] rounded-full px-3 py-1.5 text-xs outline-none focus:border-[var(--primary)] text-[var(--text-primary)] min-w-[100px]">
          <option value="all">All Time</option>
          <option value="last30">Last 30 Days</option>
          <option value="last90">Last 90 Days</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>
`;

const tabsEnd = content.indexOf('</div>\n\n      <div class="bookings-list"');
if (tabsEnd !== -1) {
    content = content.slice(0, tabsEnd + 6) + filterHtml + content.slice(tabsEnd + 6);
} else {
    console.log("Could not find tabsEnd");
}

// 2. Add signals and update bookings computed
const bookingsStart = content.indexOf('bookings = computed(() => {');
const bookingsEnd = content.indexOf('  });\n\n  cancelReason');

if (bookingsStart !== -1 && bookingsEnd !== -1) {
    const newBookingsCode = `historySearchQuery = signal<string>('');
  historyDateFilter = signal<'all' | 'last30' | 'last90' | 'thisYear'>('all');
  
  bookings = computed(() => {
    const all = this.allBookings();
    if (this.activeTab() === 'history') {
      let filtered = all;
      const query = this.historySearchQuery().toLowerCase();
      if (query) {
        filtered = filtered.filter(b => b.turfName.toLowerCase().includes(query) || b.location.toLowerCase().includes(query));
      }
      
      const dateFilter = this.historyDateFilter();
      if (dateFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(b => {
          const bDate = new Date(b.startTime);
          if (dateFilter === 'last30') {
            const diffTime = Math.abs(now.getTime() - bDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 30;
          }
          if (dateFilter === 'last90') {
            const diffTime = Math.abs(now.getTime() - bDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
            return diffDays <= 90;
          }
          if (dateFilter === 'thisYear') {
            return bDate.getFullYear() === now.getFullYear();
          }
          return true;
        });
      }
      
      // Sort history by date descending
      return filtered.sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return all.filter(b => {
        const bookingDate = new Date(b.startTime);
        bookingDate.setHours(0, 0, 0, 0);
        return bookingDate.getTime() === today.getTime();
      });
    }
  });`;

    content = content.slice(0, bookingsStart) + newBookingsCode + content.slice(bookingsEnd + 5);
} else {
    console.log("Could not find bookings computed block");
}

fs.writeFileSync(path, content);
console.log("Updated bookings component with filters");
