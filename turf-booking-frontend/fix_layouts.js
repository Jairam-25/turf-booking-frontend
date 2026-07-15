const fs = require('fs');

// 1. Update app.ts
const appPath = 'src/app/app.ts';
let appCode = fs.readFileSync(appPath, 'utf8');
appCode = appCode.replace(
  'this.hideBottomNav.set(isAuth);',
  'this.hideBottomNav.set(isAuth || !isMobile);'
);
fs.writeFileSync(appPath, appCode);
console.log('Updated app.ts');

// 2. Update bottom-nav.component.ts
const navPath = 'src/app/layout/bottom-nav/bottom-nav.component.ts';
let navCode = fs.readFileSync(navPath, 'utf8');
navCode = navCode.replace(
  '  .bottom-nav-mobile {\n    display: none;',
  '  .bottom-nav-mobile {\n    display: block;'
);
navCode = navCode.replace(
  `  @media (max-width: 768px) {
    .bottom-nav-mobile {
      display: block;
    }
  }`,
  ``
);
fs.writeFileSync(navPath, navCode);
console.log('Updated bottom-nav.component.ts');

// 3. Update turf-detail.component.ts
const turfPath = 'src/app/features/dashboard/turf-detail/turf-detail.component.ts';
let turfCode = fs.readFileSync(turfPath, 'utf8');

// Replace the @media block that controls the sticky bar
turfCode = turfCode.replace(
`    @media (max-width: 768px) {
      .detail-page-container {
        padding: 1rem;
        padding-bottom: 120px; /* Space for the sticky bar */
      }
      .detail-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .mobile-sticky-booking-bar {
        display: flex;
      }
      
      /* Hide some less critical elements on mobile to shorten the page */
      .pricing-rules-card, .booking-steps-indicator {
        display: none; /* Make it more compact */
      }
      .turf-details-content {
        padding: 1.5rem 1rem;
      }
      .booking-panel {
        padding: 1.5rem 1rem;
      }
      .slots-grid-view {
        grid-template-columns: repeat(3, 1fr) !important;
      }
      /* Hide the desktop confirm button */
      .booking-panel .actions {
        display: none;
      }
    }`,
`    /* Native App Specific Layouts */
    :host-context(body.is-mobile-app) .mobile-sticky-booking-bar {
      display: flex;
    }
    :host-context(body.is-mobile-app) .detail-page-container {
      padding-bottom: 120px; /* Space for the sticky bar */
    }
    :host-context(body.is-mobile-app) .pricing-rules-card,
    :host-context(body.is-mobile-app) .booking-steps-indicator,
    :host-context(body.is-mobile-app) .booking-panel .actions {
      display: none; /* Make it more compact on native app */
    }

    /* Standard Responsive Web Layouts */
    @media (max-width: 768px) {
      .detail-page-container {
        padding: 1rem;
      }
      .detail-grid {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      .turf-details-content {
        padding: 1.5rem 1rem;
      }
      .booking-panel {
        padding: 1.5rem 1rem;
      }
      .slots-grid-view {
        grid-template-columns: repeat(3, 1fr) !important;
      }
    }`
);
fs.writeFileSync(turfPath, turfCode);
console.log('Updated turf-detail.component.ts');
