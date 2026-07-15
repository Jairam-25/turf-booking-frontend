const fs = require('fs');

// 1. Update app.routes.ts
const routesPath = 'src/app/app.routes.ts';
let routesStr = fs.readFileSync(routesPath, 'utf8');

routesStr = routesStr.replace(
`  {
  path: 'home',
  loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },`,
`  {
  path: 'home',
  loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
  canActivate: [authGuard]
  },`
);

routesStr = routesStr.replace(
`  { 
  path: 'dashboard', 
  loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },`,
`  { 
  path: 'dashboard', 
  loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  canActivate: [authGuard]
  },`
);

routesStr = routesStr.replace(
`  {
  path: 'about',
  loadComponent: () => import('./features/about/about').then(m => m.About)
  },`,
`  {
  path: 'about',
  loadComponent: () => import('./features/about/about').then(m => m.About),
  canActivate: [authGuard]
  },`
);

routesStr = routesStr.replace(
`  {
  path: 'privacy-policy',
  loadComponent: () => import('./features/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy)
  },`,
`  {
  path: 'privacy-policy',
  loadComponent: () => import('./features/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy),
  canActivate: [authGuard]
  },`
);

routesStr = routesStr.replace(
`  {
  path: 'terms-conditions',
  loadComponent: () => import('./features/terms-conditions/terms-conditions').then(m => m.TermsConditions)
  }`,
`  {
  path: 'terms-conditions',
  loadComponent: () => import('./features/terms-conditions/terms-conditions').then(m => m.TermsConditions),
  canActivate: [authGuard]
  }`
);

fs.writeFileSync(routesPath, routesStr);
console.log("Updated app.routes.ts");

// 2. Update auth.guard.ts
const authGuardPath = 'src/app/core/guards/auth.guard.ts';
let authGuardStr = fs.readFileSync(authGuardPath, 'utf8');
authGuardStr = authGuardStr.replace(`router.navigate(['/auth']`, `router.navigate(['/auth/login']`);
fs.writeFileSync(authGuardPath, authGuardStr);
console.log("Updated auth.guard.ts");

// 3. Update app.ts
const appPath = 'src/app/app.ts';
let appStr = fs.readFileSync(appPath, 'utf8');

const appReplaceTarget = `  } else {
  if (this.router.url === '/home' || this.router.url === '/') {
             this.router.navigate(['/dashboard']);
           }
  }`;

const appReplaceWith = `  } else {
    this.router.navigate(['/auth/login']);
  }`;

appStr = appStr.replace(appReplaceTarget, appReplaceWith);

// Also replace the token refresh error navigation in app.ts
appStr = appStr.replace(`this.router.navigate(['/auth/login']); // or /auth`, `this.router.navigate(['/auth/login']);`);

fs.writeFileSync(appPath, appStr);
console.log("Updated app.ts");
