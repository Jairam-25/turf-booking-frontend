const fs = require('fs');
const path = 'src/app/core/services/fcm-notification.service.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "import { NotificationService } from './notification.service';",
  "import { NotificationService } from './notification.service';\nimport { InAppNotificationService } from './in-app-notification.service';"
);

content = content.replace(
  "private notificationService = inject(NotificationService);",
  "private notificationService = inject(NotificationService);\n private inAppNotificationService = inject(InAppNotificationService);"
);

content = content.replace(
  "this.notificationService.show(",
  "this.inAppNotificationService.addNotification(notification.title, notification.body);\n         this.notificationService.show("
);

content = content.replace(
  "// Handle notification click if needed (e.g. routing to booking details)",
  "// Handle notification click if needed\n       if (notification.notification.title && notification.notification.body) {\n         this.inAppNotificationService.addNotification(notification.notification.title, notification.notification.body);\n       }"
);

content = content.replace(
  "new Notification(payload.notification.title || 'Notification', {",
  "this.inAppNotificationService.addNotification(payload.notification.title || 'Notification', payload.notification.body || '');\n         new Notification(payload.notification.title || 'Notification', {"
);

fs.writeFileSync(path, content);
console.log('Updated fcm-notification.service.ts to use InAppNotificationService');
