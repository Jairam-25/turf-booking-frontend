const fs = require('fs');

const appHtmlPath = 'src/app/app.html';
let appHtml = fs.readFileSync(appHtmlPath, 'utf8');

const htmlStart = appHtml.indexOf('@if (showAppSplash()) {');
const htmlEnd = appHtml.indexOf('}\n@if (!hideNavbar()) {');

if (htmlStart !== -1 && htmlEnd !== -1) {
    const newHtml = `@if (showAppSplash()) {
  <div class="custom-splash-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden">
    <!-- Gradient Background -->
    <div class="splash-background"></div>
    
    <div class="z-10 relative flex flex-col items-center justify-center h-full w-full">
      <div class="splash-content">
        <!-- Bouncing Ball -->
        <div class="splash-ball">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/></svg>
        </div>
        
        <!-- Logo -->
        <div class="splash-logo">
          TurfXpert
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

const cssPath = 'src/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');

const cssStart = css.indexOf('.bubble:nth-child(1)');
const cssEnd = css.indexOf('body.is-mobile-app .announcement-banner');

if (cssStart !== -1 && cssEnd !== -1) {
    const newCss = `/* Splash Screen Animations */
.custom-splash-screen {
  background: #0f172a;
  animation: splashFadeOut 0.5s ease-in-out 2.2s forwards;
}

.splash-background {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, var(--primary) 0%, rgba(15,23,42,1) 100%);
  opacity: 0.15;
}

.splash-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.splash-logo {
  font-size: 3rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 0.05em;
  background: linear-gradient(to right, #fff, #e2e8f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: logoEntrance 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  transform: scale(0);
}

.splash-ball {
  width: 48px;
  height: 48px;
  color: var(--primary);
  margin-bottom: 1rem;
  animation: ballBounce 0.8s cubic-bezier(0.36, 0, 0.66, -0.56) forwards;
  transform: translateY(-150px) scale(0);
  opacity: 0;
}
.splash-ball svg { width: 100%; height: 100%; }

.splash-tagline {
  margin-top: 0.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255,255,255,0.8);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0;
  animation: taglineFadeIn 0.6s ease-out 0.8s forwards;
}

@keyframes logoEntrance {
  0% { transform: scale(0); }
  100% { transform: scale(1); }
}

@keyframes ballBounce {
  0% { transform: translateY(-150px) scale(0) rotate(-180deg); opacity: 0; }
  60% { transform: translateY(20px) scale(1.1) rotate(0deg); opacity: 1; }
  80% { transform: translateY(-15px) scale(1) rotate(0deg); opacity: 1; }
  100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
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
