const fs = require('fs');
const path = 'src/index.html';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
);

fs.writeFileSync(path, content);
console.log('Fixed viewport meta tag in index.html');
