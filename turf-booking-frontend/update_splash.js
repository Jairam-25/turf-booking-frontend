const fs = require('fs');

// 1. Update capacitor.config.ts
let capConfig = fs.readFileSync('capacitor.config.ts', 'utf8');
if (!capConfig.includes('SplashScreen')) {
  capConfig = capConfig.replace('};', `,
  plugins: {
    SplashScreen: {
      backgroundColor: "#0f172a",
      launchAutoHide: false,
      showSpinner: false,
      splashFullScreen: true,
      splashImmersive: true
    }
  }
};`);
  fs.writeFileSync('capacitor.config.ts', capConfig);
}

// 2. Update app.ts
let appTs = fs.readFileSync('src/app/app.ts', 'utf8');
if (!appTs.includes('showAppSplash')) {
  appTs = appTs.replace('hideBottomNav = signal(false);', 'hideBottomNav = signal(false);\n  showAppSplash = signal(false);');
  
  appTs = appTs.replace('ngOnInit() {', `ngOnInit() {
    import('@capacitor/splash-screen').then(({ SplashScreen }) => {
      import('@capacitor/core').then(({ Capacitor }) => {
        if (Capacitor.isNativePlatform()) {
          this.showAppSplash.set(true);
          setTimeout(() => {
            SplashScreen.hide(); // Hide native splash to show our custom web splash
            setTimeout(() => this.showAppSplash.set(false), 3000); // Run web animation for 3s
          }, 500); // Wait 500ms before hiding native splash
        }
      });
    });`);
  fs.writeFileSync('src/app/app.ts', appTs);
}

// 3. Update app.html
let appHtml = fs.readFileSync('src/app/app.html', 'utf8');
if (!appHtml.includes('custom-splash-screen')) {
  const splashHtml = `
@if (showAppSplash()) {
  <div class="custom-splash-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#0f172a]">
    <div class="splash-logo-container relative mb-6">
       <!-- App icon (the one we generated) -->
       <img src="/images/app-icon.jpg" alt="Logo" class="w-28 h-28 rounded-3xl shadow-[0_0_30px_rgba(123,57,252,0.4)] animate-float">
    </div>
    <div class="typing-container">
      <h1 class="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#7b39fc] to-[#38bdf8] tracking-wider">
        TurfXpert
      </h1>
    </div>
  </div>
}
`;
  appHtml = splashHtml + appHtml;
  fs.writeFileSync('src/app/app.html', appHtml);
}

// 4. Update styles.css
let stylesCss = fs.readFileSync('src/styles.css', 'utf8');
if (!stylesCss.includes('typing-container')) {
  stylesCss += `
/* Custom Splash Screen Animations */
.animate-float {
  animation: float 3s ease-in-out infinite;
}
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.typing-container {
  overflow: hidden;
  white-space: nowrap;
  border-right: 3px solid #38bdf8;
  animation: typing 1.5s steps(30, end), blink-caret .75s step-end infinite;
  margin: 0 auto;
}
@keyframes typing {
  from { width: 0 }
  to { width: 100% }
}
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: #38bdf8; }
}
.custom-splash-screen {
  animation: fadeOut 0.5s ease-in-out 2.5s forwards;
}
@keyframes fadeOut {
  from { opacity: 1; visibility: visible; }
  to { opacity: 0; visibility: hidden; }
}
`;
  fs.writeFileSync('src/styles.css', stylesCss);
}

console.log('Splash screen updated successfully!');
