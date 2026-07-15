const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

if (!c.includes("import { Router }")) {
    c = c.replace("import { TurfRepository }", "import { Router } from '@angular/router';\nimport { TurfRepository }");
}

c = c.replace(/isLoading = signal\(true\);\s*userName = signal<string>\('Guest'\);/, "isLoading = signal(true);");
c = c.replace(/isLoading = signal\(true\);/, "isLoading = signal(true);\n  userName = signal<string>('Guest');");

c = c.replace(/constructor\(\s*private turfRepository: TurfRepository,\s*private notificationService: NotificationService,\s*private fcmService: FcmNotificationService\s*\) \{\}/, 
`constructor(
  private turfRepository: TurfRepository,
  private notificationService: NotificationService,
  private fcmService: FcmNotificationService,
  private authStore: AuthStore,
  private router: Router
  ) {}`);

c = c.replace(/ngOnInit\(\) \{\s*this\.loadInitialLocationsAndTurfs\(\);\s*this\.startTypingAnimation\(\);\s*\/\/ Ask for Push Notification permission and save token to DB\s*this\.fcmService\.requestNotificationPermission\(\);\s*this\.fcmService\.listenForMessages\(\);\s*\}/, 
`ngOnInit() {
  this.loadInitialLocationsAndTurfs();
  this.startTypingAnimation();
  
  const user = this.authStore.user();
  if (user && user.name) {
    this.userName.set(user.name.split(' ')[0]);
  }

  // Ask for Push Notification permission and save token to DB
  this.fcmService.requestNotificationPermission();
  this.fcmService.listenForMessages();
  }

  navigateToLiked() {
    this.router.navigate(['/liked-turfs']);
  }

  navigateToNotifications() {
    this.router.navigate(['/notifications']);
  }`);

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
