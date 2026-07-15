const fs = require('fs');
let c = fs.readFileSync('src/app/app.ts', 'utf8');

c = c.replace(/if \(!this\.router\.url\.startsWith\('\/auth'\)\) \{\s*this\.router\.navigate\(\['\/auth\/login'\]\);\s*\}/, 
  `if (this.router.url === '/home' || this.router.url === '/') {
            this.router.navigate(['/dashboard']);
          }`);

fs.writeFileSync('src/app/app.ts', c);
