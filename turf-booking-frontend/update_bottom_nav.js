const fs = require('fs');

let c = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

const newStyles = `
 .bottom-nav {
 display: none;
 position: fixed;
 bottom: 1.5rem;
 left: 1rem;
 right: 1rem;
 z-index: 1000;
 background: var(--bg-card);
 border-radius: 2rem;
 box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
 border: 1px solid var(--border-color);
 padding: 0.5rem;
 transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
 }
 .bottom-nav.hidden {
 transform: translateY(150%);
 }
 .nav-items {
 display: flex;
 justify-content: space-around;
 align-items: center;
 height: 60px;
 padding: 0;
 }
 .nav-item {
 display: flex;
 flex-direction: column;
 align-items: center;
 justify-content: center;
 gap: 4px;
 color: var(--text-secondary);
 text-decoration: none;
 width: 100%;
 height: 100%;
 transition: all 0.2s ease;
 position: relative;
 border-radius: 1.5rem;
 }
 .nav-item:active {
 transform: scale(0.92);
 }
 .nav-icon {
 width: 24px;
 height: 24px;
 transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), stroke 0.2s ease;
 }
 .nav-label {
 font-size: 0.7rem;
 font-weight: 600;
 transition: color 0.2s ease;
 }
 .nav-item.active {
 color: var(--on-primary);
 background: var(--primary);
 }
 .nav-item.active .nav-icon {
 stroke: var(--on-primary);
 transform: translateY(-1px);
 }
 .nav-item.active .nav-label {
 color: var(--on-primary);
 }
 @media (min-width: 0px) {
 .bottom-nav {
 display: block;
 }
 }
`;

c = c.replace(/styles: \[`[\s\S]*?`\]\n\}\)/, `styles: [\`${newStyles}\`]\n})`);

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', c);
console.log("Updated bottom nav styles.");
