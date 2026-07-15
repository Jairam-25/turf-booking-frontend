const fs = require('fs');
const path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  "if (!sessionStorage.getItem('dashboard_locationStr')) {",
  "if (!sessionStorage.getItem('dashboard_has_prompted_location')) {\n    sessionStorage.setItem('dashboard_has_prompted_location', 'true');"
);

fs.writeFileSync(path, content);
console.log('Fixed location prompt check');
