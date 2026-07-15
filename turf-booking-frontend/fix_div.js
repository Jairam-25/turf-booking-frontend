const fs = require('fs');

let path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace('    <!-- DESKTOP WEB LAYOUT -->', '  </div>\n\n    <!-- DESKTOP WEB LAYOUT -->');

fs.writeFileSync(path, content);
console.log('Fixed missing closing div');
