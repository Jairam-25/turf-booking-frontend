const fs = require('fs');

let ts = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

// 1. Update CSS for .bottom-nav-mobile to be edge-to-edge
const oldCss = `.bottom-nav-mobile {
    display: none;
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    z-index: 1000;
    background: rgba(10, 14, 26, 0.85);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }`;

const newCss = `.bottom-nav-mobile {
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    background: rgba(10, 14, 26, 0.95);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.4);
    padding-bottom: env(safe-area-inset-bottom);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  }`;

if (ts.includes('.bottom-nav-mobile {')) {
  ts = ts.replace(/\.bottom-nav-mobile\s*\{[^}]+\}/, newCss);
}

// 2. Adjust .nav-items-mobile height to accommodate edge-to-edge
const oldItemsCss = `.nav-items-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 70px;
    padding: 0 16px;
  }`;

const newItemsCss = `.nav-items-mobile {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 64px;
    padding: 0 16px;
  }`;

if (ts.includes('.nav-items-mobile {')) {
  ts = ts.replace(/\.nav-items-mobile\s*\{[^}]+\}/, newItemsCss);
}

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', ts);
console.log('Fixed bottom nav to full edge-to-edge');
