const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

// 1. Add hasNotifications signal
if (!c.includes('hasNotifications = signal')) {
  c = c.replace(/isDarkMode = signal<boolean>\(false\);/, `isDarkMode = signal<boolean>(false);\n  hasNotifications = signal<boolean>(true);`);
}

// 2. Change the red dot to only show if hasNotifications() is true
c = c.replace(
  /<div class="absolute top-0 right-1 w-2 h-2 bg-\[#ea5b5b\] rounded-full"><\/div>/,
  `<div class="absolute top-0 right-1 w-2 h-2 bg-[#ea5b5b] rounded-full" *ngIf="hasNotifications()"></div>`
);

// 3. Update navigateToNotifications() to not navigate, but instead clear dot and show message
c = c.replace(
  /navigateToNotifications\(\) \{\s*this\.router\.navigate\(\['\/notifications'\]\);\s*\}/,
  `navigateToNotifications() {
    this.hasNotifications.set(false);
    this.notificationService.info('No notifications found');
  }`
);

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
