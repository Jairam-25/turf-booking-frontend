const fs = require('fs');

let ts = fs.readFileSync('src/app/app.ts', 'utf8');

if (!ts.includes('CapacitorApp.addListener')) {
  // Add Location import if not present
  if (!ts.includes("import { Location } from '@angular/common';")) {
    ts = ts.replace(/import \{ filter \} from 'rxjs\/operators';/, `import { filter } from 'rxjs/operators';\nimport { Location } from '@angular/common';\nimport { inject } from '@angular/core';`);
  }

  // Inject location in class
  if (!ts.includes('private location = inject(Location);')) {
    ts = ts.replace(/export class App implements OnInit \{/, `export class App implements OnInit {\n  private location = inject(Location);`);
  }

  // Add backButton listener in ngOnInit
  const backButtonLogic = `
    import('@capacitor/app').then(({ App: CapacitorApp }) => {
      import('@capacitor/core').then(({ Capacitor }) => {
        if (Capacitor.isNativePlatform()) {
          CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            const url = this.router.url.split('?')[0];
            const rootPaths = ['/dashboard', '/home', '/auth/login', '/auth/welcome', '/profile', '/bookings'];
            
            if (rootPaths.includes(url)) {
              CapacitorApp.exitApp();
            } else {
              this.location.back();
            }
          });
        }
      });
    });
`;

  ts = ts.replace(/ngOnInit\(\) \{/, `ngOnInit() {${backButtonLogic}`);
  
  fs.writeFileSync('src/app/app.ts', ts);
  console.log('Added hardware back button handler to app.ts');
} else {
  console.log('back button handler already exists');
}
