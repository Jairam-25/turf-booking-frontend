const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/styles.css');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/body\[data-theme="light"\]/g, ':root:not(.dark), body[data-theme="light"]');

fs.writeFileSync(filePath, content);
console.log('Fixed CSS variable scoping.');
