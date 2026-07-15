const fs = require('fs');

// Update app.html
const appHtmlPath = 'src/app/app.html';
let appHtml = fs.readFileSync(appHtmlPath, 'utf8');

const htmlStart = appHtml.indexOf('@if (showAppSplash()) {');
const htmlEnd = appHtml.indexOf('}\n@if (!hideNavbar()) {');

if (htmlStart !== -1 && htmlEnd !== -1) {
    const newHtml = `@if (showAppSplash()) {
  <div class="custom-splash-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden">
    <div class="z-10 relative flex flex-col items-center justify-center h-full w-full">
      <div class="splash-content">
        <!-- Letter-by-letter Logo -->
        <div class="splash-logo" aria-label="TurfXpert">
          <span style="animation-delay: 0.05s">T</span>
          <span style="animation-delay: 0.13s">u</span>
          <span style="animation-delay: 0.21s">r</span>
          <span style="animation-delay: 0.29s">f</span>
          <span style="animation-delay: 0.37s">X</span>
          <span style="animation-delay: 0.45s">p</span>
          <span style="animation-delay: 0.53s">e</span>
          <span style="animation-delay: 0.61s">r</span>
          <span style="animation-delay: 0.69s">t</span>
        </div>
        
        <!-- Tagline -->
        <div class="splash-tagline">
          Book. Play. Repeat.
        </div>
      </div>
    </div>
  </div>
`;
    appHtml = appHtml.substring(0, htmlStart) + newHtml + appHtml.substring(htmlEnd);
    fs.writeFileSync(appHtmlPath, appHtml);
    console.log("Updated app.html");
} else {
    console.log("Could not find boundaries in app.html");
}

// Update styles.css
const cssPath = 'src/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const cssStart = css.indexOf('/* Splash Screen Animations */');
const cssEnd = css.indexOf('body.is-mobile-app .announcement-banner');

if (cssStart !== -1 && cssEnd !== -1) {
    const newCss = `/* Splash Screen Animations */
.custom-splash-screen {
  background: linear-gradient(-45deg, var(--bg-card), var(--primary), #38bdf8, #7b39fc);
  background-size: 300% 300%;
  animation: gradientFlow 5s ease infinite, splashFadeOut 0.4s ease-in-out 1.8s forwards;
}

@keyframes gradientFlow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.splash-logo {
  font-size: 3.5rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.05em;
  display: flex;
}

.splash-logo span {
  display: inline-block;
  opacity: 0;
  transform: translateY(15px);
  animation: letterReveal 0.4s ease-out forwards;
}

.splash-tagline {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255,255,255,0.9);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  animation: taglineFadeIn 0.4s ease-out 1.1s forwards; /* Starts 200ms after last letter completes (0.69 + 0.2) */
}

@keyframes letterReveal {
  0% { opacity: 0; transform: translateY(15px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes taglineFadeIn {
  0% { opacity: 0; transform: translateY(10px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes splashFadeOut {
  from { opacity: 1; visibility: visible; }
  to { opacity: 0; visibility: hidden; }
}

`;
    css = css.substring(0, cssStart) + newCss + css.substring(cssEnd);
    fs.writeFileSync(cssPath, css);
    console.log("Updated styles.css");
} else {
    console.log("Could not find boundaries in styles.css");
}

// Update app.ts
const appTsPath = 'src/app/app.ts';
let appTs = fs.readFileSync(appTsPath, 'utf8');

const s = appTs.indexOf("    import('@capacitor/splash-screen').then(({ SplashScreen }) => {");
const e = appTs.indexOf(" this.themeService.init();");

if (s !== -1 && e !== -1) {
    const newAppTsCode = `    import('@capacitor/splash-screen').then(({ SplashScreen }) => {
      import('@capacitor/core').then(({ Capacitor }) => {
        if (Capacitor.isNativePlatform()) {
          // Hide native splash immediately (0ms delay) to avoid static blank screen
          SplashScreen.hide(); 
        }
      });
    });

    // Start our web-animated splash screen
    this.showAppSplash.set(true);
    // Destroy component at 2200ms (1.8s animation + 0.4s fadeout)
    setTimeout(() => this.showAppSplash.set(false), 2200);

`;
    appTs = appTs.substring(0, s) + newAppTsCode + appTs.substring(e);
    fs.writeFileSync(appTsPath, appTs);
    console.log("Updated app.ts");
} else {
    console.log("Could not find boundaries in app.ts", s, e);
}
