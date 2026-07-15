const fs = require('fs');

const path = 'src/app/layout/bottom-nav/bottom-nav.component.ts';
let code = fs.readFileSync(path, 'utf8');

// Replace background and border
code = code.replace(
`    background: rgba(10, 14, 26, 0.95);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-top: 1px solid rgba(255, 255, 255, 0.1);`,
`    background: var(--bg-card);
    border-top: 1px solid var(--border-color);`
);

// Replace active text color
code = code.replace(
`  .nav-item-mobile.active {
    color: #fff;
  }`,
`  .nav-item-mobile.active {
    color: var(--text-primary);
  }`
);

// Replace badge border color
code = code.replace(
`    border: 2px solid rgba(10, 14, 26, 1);`,
`    border: 2px solid var(--bg-card);`
);

fs.writeFileSync(path, code);
console.log("Updated bottom-nav.component.ts");
