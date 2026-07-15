const fs = require('fs');
const path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Import InAppNotificationService
content = content.replace(
  "import { NotificationService } from '../../core/services/notification.service';",
  "import { NotificationService } from '../../core/services/notification.service';\nimport { InAppNotificationService, AppNotification } from '../../core/services/in-app-notification.service';"
);

// 2. Inject InAppNotificationService and add isNotificationsOpen signal
content = content.replace(
  'isLocationSelectOpen = signal(false);',
  'isLocationSelectOpen = signal(false);\n  isNotificationsOpen = signal(false);\n  inAppNotifications = inject(InAppNotificationService);'
);

// 3. Update the notification bell red dot logic
content = content.replace(
  '*ngIf="hasNotifications()"',
  '*ngIf="inAppNotifications.getUnreadCount() > 0"'
);

// 4. Update navigateToNotifications method
content = content.replace(
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

// 5. Add the Notifications Modal HTML at the end of the template (before </ng-container> or similar)
const notificationModalHTML = `
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

// Insert the modal HTML right before the final closing div of mobile-app-layout
const lastDivIndex = content.lastIndexOf('</div>');
if (lastDivIndex !== -1) {
  content = content.substring(0, lastDivIndex) + notificationModalHTML + '\n' + content.substring(lastDivIndex);
}

fs.writeFileSync(path, content);
console.log('Updated dashboard.component.ts with InApp Notification UI');
