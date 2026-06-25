const fs = require('fs');
let c = fs.readFileSync('src/app/layout/navbar/navbar.component.html', 'utf8');
c = c.replace(/<a routerLink="\/profile" class="relative p-2[^>]*>\s*<svg[^>]*>.*?<\/svg>\s*<\/a>/s, '');
fs.writeFileSync('src/app/layout/navbar/navbar.component.html', c);
