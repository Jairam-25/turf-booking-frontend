const fs = require('fs');
const path = 'src/styles.css';
let content = fs.readFileSync(path, 'utf8');

// Find the index of .spacing-vertical-24
const idx24 = content.indexOf('.spacing-vertical-24');
if (idx24 > -1) {
  content = content.replace(
    /(\.spacing-vertical-24\s*\{\s*)padding-top:\s*24px;(\s*padding-bottom:\s*24px;\s*\})/g,
    '$1padding-top: calc(24px + env(safe-area-inset-top));$2'
  );
}

const idx48 = content.indexOf('.spacing-vertical-48');
if (idx48 > -1) {
  content = content.replace(
    /(\.spacing-vertical-48\s*\{\s*)padding-top:\s*48px;(\s*padding-bottom:\s*48px;\s*\})/g,
    '$1padding-top: calc(48px + env(safe-area-inset-top));$2'
  );
}

fs.writeFileSync(path, content);
console.log('Fixed styles.css padding!');
