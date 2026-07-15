const fs = require('fs');
let c = fs.readFileSync('src/styles.css', 'utf8');
c = c.replace(/body\[data-theme="light"\] \.bottom-nav,\s*body\[data-theme="light"\] \.navbar-shell,\s*body\[data-theme="light"\] \.glass/g, 'body.is-mobile-app[data-theme="light"] .bottom-nav, \n  body.is-mobile-app[data-theme="light"] .navbar-shell,\n  body.is-mobile-app[data-theme="light"] .glass');
c = c.replace(/body:not\(\[data-theme="light"\]\) \.bottom-nav,\s*body:not\(\[data-theme="light"\]\) \.navbar-shell,\s*body:not\(\[data-theme="light"\]\) \.glass/g, 'body.is-mobile-app:not([data-theme="light"]) .bottom-nav, \n  body.is-mobile-app:not([data-theme="light"]) .navbar-shell,\n  body.is-mobile-app:not([data-theme="light"]) .glass');
c = c.replace(/\.glow-blob \{/g, 'body.is-mobile-app .glow-blob {');
c = c.replace(/\.hero-stat-card:hover, \.offer-card:hover \{/g, 'body.is-mobile-app .hero-stat-card:hover, body.is-mobile-app .offer-card:hover {');
fs.writeFileSync('src/styles.css', c);
console.log('Fixed styles.css global optimizations');
