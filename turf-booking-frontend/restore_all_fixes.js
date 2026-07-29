const fs = require('fs');

// 1. Restore Bookings Component
let bookingsPath = 'src/app/features/bookings/bookings.component.ts';
let bookings = fs.readFileSync(bookingsPath, 'utf8');
const oldHtml = `
          <div class="booking-body flex-card-body">
            <div class="info-row">
              <span class="label">Date</span>
              <span class="value">{{ formatBookingDate(booking.startTime) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Time</span>
              <span class="value">{{ formatTimeBlocks(booking.rawSlots) }}</span>
            </div>
            <div class="info-row">
              <span class="label">Duration</span>
              <span class="value">{{ booking.durationHours }} Hour{{ booking.durationHours > 1 ? 's' : '' }}</span>
            </div>
            <div class="info-row">
              <span class="label">Price per hour</span>
              <span class="value">
                ₹{{ booking.pricePerHour }} &nbsp;&nbsp;
                <span style="color: var(--primary); font-weight: 700;">{{ booking.durationHours }} hrs ₹{{ booking.totalPrice }}</span>
              </span>
            </div>
          </div>
          
          <div class="booking-actions">
            <button class="btn-share btn-uniform" (click)="shareBooking(booking)" title="Share">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" >
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share
            </button>
            <button class="btn-cancel btn-uniform" (click)="openCancelModal(booking.bookingIds)">Cancel Booking</button>
            <button class="btn-share btn-uniform" style="background: rgba(var(--primary-rgb), 0.1); color: var(--primary); border: 1px solid var(--primary);" (click)="openFeedbackModal(booking)">Rate Turf</button>
          </div>
`;

let bHtmlStart = bookings.indexOf('<div class="booking-body');
let bHtmlEnd = bookings.indexOf('<div class="empty-state glass');
if (bHtmlStart > -1 && bHtmlEnd > -1) {
    bookings = bookings.substring(0, bHtmlStart) + oldHtml + bookings.substring(bHtmlEnd);
}

const oldCss = `
    .booking-card {
      padding: 1.75rem;
      border-radius: 20px;
      min-height: 280px;
      transition: var(--transition-smooth);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
    }
    .booking-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--shadow-lg);
    }
    
    .booking-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .turf-info h3 {
      font-size: 1.25rem;
      font-weight: 800;
      margin: 0 0 0.25rem 0;
      color: var(--text-primary);
    }
    .location-link {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      text-decoration: none;
      transition: var(--transition-smooth);
    }
    .location-link:hover {
      color: var(--primary);
    }
    .location-link svg {
      width: 14px;
      height: 14px;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    
    .flex-card-body {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      padding: 1rem 0;
      border-top: 1px solid var(--border-color);
      border-bottom: 1px solid var(--border-color);
    }
    
    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .label {
      color: var(--text-secondary);
      font-size: 0.85rem;
    }
    .value {
      color: var(--text-primary);
      font-weight: 600;
      font-size: 0.95rem;
    }
    .value.price {
      font-size: 1.1rem;
      color: var(--primary);
    }
    
    .booking-actions {
      display: flex;
      gap: 1rem;
      margin-top: 0.5rem;
    }
    
    .btn-uniform {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      padding: 12px;
      border-radius: 12px;
      font-size: 0.95rem;
      font-weight: 600;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .btn-share {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-color);
      color: var(--text-primary);
    }
    .btn-share:hover {
      background: rgba(255, 255, 255, 0.1);
      transform: translateY(-2px);
    }
    .btn-share svg {
      width: 18px;
      height: 18px;
    }
    
    .btn-cancel {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .btn-cancel:hover {
      background: rgba(239, 68, 68, 0.2);
      transform: translateY(-2px);
    }
`;

let bCssStart = bookings.indexOf('.booking-card {');
let bCssEnd = bookings.indexOf('.empty-state {');
if (bCssStart > -1 && bCssEnd > -1) {
    bookings = bookings.substring(0, bCssStart) + oldCss + bookings.substring(bCssEnd);
}
fs.writeFileSync(bookingsPath, bookings);

// 2. InboxService
let inboxPath = 'src/app/core/services/inbox.service.ts';
let inbox = fs.readFileSync(inboxPath, 'utf8');
if (!inbox.includes('addNotification(')) {
    inbox = inbox.replace(
        "markAsRead(id: string) {",
        "addNotification(notification: Omit<InboxNotification, 'id' | 'date' | 'read' | 'actionLink'> & { actionLink?: string }) {\n    const newNotification: InboxNotification = {\n      id: Math.random().toString(36).substring(2, 9),\n      date: new Date(),\n      read: false,\n      ...notification\n    };\n    this.notifications.update(n => [newNotification, ...n]);\n  }\n\n  markAsRead(id: string) {"
    );
    fs.writeFileSync(inboxPath, inbox);
}

// 3. Login Component
let loginPath = 'src/app/features/auth/login/login.component.ts';
let login = fs.readFileSync(loginPath, 'utf8');
if (!login.includes('InAppNotificationService')) {
    login = login.replace(
        "import { Router, ActivatedRoute } from '@angular/router';",
        "import { Router, ActivatedRoute } from '@angular/router';\nimport { InAppNotificationService } from '../../../core/services/in-app-notification.service';\nimport { InboxService } from '../../../core/services/inbox.service';\nimport { FcmNotificationService } from '../../../core/services/fcm-notification.service';"
    );
    login = login.replace(
        "private route: ActivatedRoute\n  ) { }",
        "private route: ActivatedRoute,\n    private inAppNotificationService: InAppNotificationService,\n    private inboxService: InboxService,\n    private fcmService: FcmNotificationService\n  ) { }"
    );
    login = login.replace(
        "this.router.navigate(['/dashboard']);",
        "this.inAppNotificationService.addNotification('Login Successful', 'Welcome back to TurfXpert!', 'success');\n        this.inboxService.addNotification({ title: 'Login Successful', message: 'Welcome back to TurfXpert!', type: 'success' });\n        this.fcmService.requestNotificationPermission();\n        this.router.navigate(['/dashboard']);"
    );
    fs.writeFileSync(loginPath, login);
}

// 4. Payment Component
let paymentPath = 'src/app/features/dashboard/payment/payment.component.ts';
let payment = fs.readFileSync(paymentPath, 'utf8');
if (!payment.includes('InAppNotificationService')) {
    payment = payment.replace(
        "import { NotificationService } from '../../../core/services/notification.service';",
        "import { NotificationService } from '../../../core/services/notification.service';\nimport { InAppNotificationService } from '../../../core/services/in-app-notification.service';\nimport { InboxService } from '../../../core/services/inbox.service';\nimport { FcmNotificationService } from '../../../core/services/fcm-notification.service';"
    );
    payment = payment.replace(
        "private router: Router\n  ) {",
        "private router: Router,\n    private inAppNotificationService: InAppNotificationService,\n    private inboxService: InboxService,\n    private fcmNotificationService: FcmNotificationService\n  ) {"
    );
    payment = payment.replace(
        "this.notificationService.success('Payment successful! Your booking is confirmed.');",
        "this.notificationService.success('Payment successful! Your booking is confirmed.');\n          \n          this.inAppNotificationService.addNotification(\n            'Booking Confirmed!',\n            `Your slot at ${this.bookingDetails.turfName} is confirmed for ${this.formatDate(this.bookingDetails.date)}.`,\n            'success'\n          );\n          \n          this.inboxService.addNotification({\n            title: 'Booking Confirmed!',\n            message: `Your slot at ${this.bookingDetails.turfName} is confirmed for ${this.formatDate(this.bookingDetails.date)}.`,\n            type: 'booking'\n          });\n          \n          this.fcmNotificationService.showLocalNotification(\n            'Booking Confirmed!',\n            `Your slot at ${this.bookingDetails.turfName} is confirmed.`\n          );"
    );
    fs.writeFileSync(paymentPath, payment);
}

// 5. Dashboard Component Notifications
let dashPath = 'src/app/features/dashboard/dashboard.component.ts';
let dash = fs.readFileSync(dashPath, 'utf8');
if (!dash.includes('isNotificationsOpen')) {
    dash = dash.replace(
        "import { NotificationService } from '../../core/services/notification.service';",
        "import { NotificationService } from '../../core/services/notification.service';\nimport { InAppNotificationService, AppNotification } from '../../core/services/in-app-notification.service';"
    );
    dash = dash.replace(
        'isLocationSelectOpen = signal(false);',
        'isLocationSelectOpen = signal(false);\n  isNotificationsOpen = signal(false);\n  inAppNotifications = inject(InAppNotificationService);'
    );
    dash = dash.replace(
        '*ngIf="hasNotifications()"',
        '*ngIf="inAppNotifications.getUnreadCount() > 0"'
    );
    if (dash.includes('this.hasNotifications.set(false);')) {
        dash = dash.replace(
        `  navigateToNotifications() {
    this.hasNotifications.set(false);
    this.notificationService.info('No notifications found');
  }`,
        `  navigateToNotifications() {
    this.isNotificationsOpen.set(true);
  }
  
  closeNotifications() {
    this.isNotificationsOpen.set(false);
  }
  
  markAsRead(id: string, event: Event) {
    event.stopPropagation();
    this.inAppNotifications.markAsRead(id);
  }
  
  markAllAsRead() {
    this.inAppNotifications.markAllAsRead();
  }`
        );
    }
    const modalHTML = `
      <!-- Notifications Modal -->
      <div *ngIf="isNotificationsOpen()" class="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm fade-in" (click)="closeNotifications()">
        <div class="bg-white dark:bg-[#0f172a] w-full sm:w-[400px] h-full sm:h-auto sm:max-h-[85vh] sm:rounded-l-2xl shadow-2xl flex flex-col animate-slide-left" (click)="$event.stopPropagation()">
          
          <div class="p-5 border-b border-white/5 flex justify-between items-center" style="padding-top: calc(1rem + env(safe-area-inset-top));">
            <h2 class="text-xl font-black">Notifications</h2>
            <div class="flex gap-3 items-center">
              <button *ngIf="inAppNotifications.getUnreadCount() > 0" class="text-xs font-bold text-[#7b39fc]" (click)="markAllAsRead()">Mark all as read</button>
              <button class="text-slate-400 hover:text-slate-200" (click)="closeNotifications()">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
          </div>
          
          <div class="flex-grow overflow-y-auto p-2 scrollbar-hide">
            <div *ngIf="inAppNotifications.notifications().length === 0" class="flex flex-col items-center justify-center h-48 text-slate-500">
              <svg class="w-12 h-12 mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
              <p>No notifications yet</p>
            </div>
            
            <div *ngFor="let n of inAppNotifications.notifications()" 
                 class="p-4 mb-2 rounded-xl border border-white/5 transition-colors relative cursor-pointer"
                 [ngClass]="n.read ? 'bg-transparent opacity-70' : 'bg-[#7b39fc]/5 border-[#7b39fc]/20'"
                 (click)="markAsRead(n.id, $event)">
              <div *ngIf="!n.read" class="absolute top-4 right-4 w-2 h-2 bg-[#ea5b5b] rounded-full"></div>
              <h3 class="font-bold text-sm mb-1 pr-6" [ngClass]="n.read ? 'text-slate-400' : 'text-[#7b39fc]'">{{ n.title }}</h3>
              <p class="text-xs text-slate-500">{{ n.body }}</p>
              <span class="text-[10px] text-slate-600 mt-2 block">{{ n.date | date:'short' }}</span>
            </div>
          </div>
          
        </div>
      </div>
`;
    const splitToken = '</main>\n  </div>\n  `,\n  styles: [`';
    const splitIndex = dash.indexOf(splitToken);
    if (splitIndex !== -1) {
        dash = dash.substring(0, splitIndex) + modalHTML + '\n  ' + splitToken + dash.substring(splitIndex + splitToken.length);
    }
    fs.writeFileSync(dashPath, dash);
}

// 6. Bottom Nav Padding Height
let navPath = 'src/app/layout/bottom-nav/bottom-nav.component.ts';
let nav = fs.readFileSync(navPath, 'utf8');
if (nav.includes('height: 64px;')) {
    nav = nav.replace(/height: 64px;/g, 'height: 72px;');
    nav = nav.replace(/padding-bottom: env\(safe-area-inset-bottom\);/g, 'padding-bottom: calc(8px + env(safe-area-inset-bottom));');
    fs.writeFileSync(navPath, nav);
}

console.log('Restored all fixes!');
