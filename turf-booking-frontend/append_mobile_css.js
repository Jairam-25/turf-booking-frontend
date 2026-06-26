const fs = require('fs');

const css = `
/* =========================================================
   SPOTZ-INSPIRED MOBILE APP OVERRIDES (NO EFFECT ON WEB)
   ========================================================= */

body.is-mobile-app {
  --glass-bg: var(--bg-card);
  --glass-border: var(--border-color);
}

body.is-mobile-app .glass, 
body.is-mobile-app .auth-card,
body.is-mobile-app .magic-card-inner {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  background: var(--bg-card) !important;
  border: 1px solid var(--border-color) !important;
}

/* Clean Solid Header for Mobile App */
body.is-mobile-app .navbar-shell {
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  background: var(--bg-card) !important;
  border-bottom: none !important;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05) !important;
  padding-top: env(safe-area-inset-top, 12px) !important;
}

/* Floating Pill Bottom Navigation for Mobile App */
body.is-mobile-app .bottom-nav {
  bottom: 1.5rem !important;
  left: 1rem !important;
  right: 1rem !important;
  border-radius: 2rem !important;
  background: var(--bg-card) !important;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
  border: 1px solid var(--border-color) !important;
  padding-bottom: 0 !important; /* Ignore safe area bottom since it's floating */
  margin-bottom: env(safe-area-inset-bottom, 0px) !important;
}

body.is-mobile-app .nav-items {
  height: 60px !important;
}

body.is-mobile-app .nav-item {
  border-radius: 1.5rem !important;
  padding: 4px !important;
}

body.is-mobile-app .nav-item.active {
  background: var(--primary) !important;
  color: var(--on-primary) !important;
}

body.is-mobile-app .nav-item.active .nav-icon {
  stroke: var(--on-primary) !important;
  transform: translateY(-2px) !important;
}

body.is-mobile-app .nav-item.active .nav-label {
  color: var(--on-primary) !important;
}

/* Hide the little dot indicator for active tab */
body.is-mobile-app .nav-item.active::after {
  display: none !important;
}
`;

fs.appendFileSync('src/styles.css', css);
console.log("Appended mobile CSS overrides.");
