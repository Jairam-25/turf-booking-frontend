const fs = require('fs');
const path = 'src/app/core/services/fcm-notification.service.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  'await PushNotifications.register();',
  `// Create a notification channel for Android 8.0+
       await PushNotifications.createChannel({
         id: 'fcm_default_channel',
         name: 'TurfXpert Notifications',
         description: 'General app notifications',
         importance: 5,
         visibility: 1
       });
       
       await PushNotifications.register();`
);

fs.writeFileSync(path, content);
console.log('Added Android push notification channel creation logic');
