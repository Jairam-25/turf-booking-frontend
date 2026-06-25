const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const responsivePrefixes = ['sm:', 'md:', 'lg:', 'xl:', '2xl:'];

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Regex to match Tailwind classes with responsive prefixes
    // e.g., md:hidden, lg:flex, sm:p-4, hover:md:bg-red-500
    // We want to replace these with empty strings.
    const regex = /\b(sm|md|lg|xl|2xl):[a-zA-Z0-9\-\_\[\]\/]+\b/g;
    
    // Also handle stacked prefixes like hover:md:
    const regexStacked = /\b[a-zA-Z\-]+:(sm|md|lg|xl|2xl):[a-zA-Z0-9\-\_\[\]\/]+\b/g;

    content = content.replace(regexStacked, '');
    content = content.replace(regex, '');

    // Cleanup double spaces left by removing classes
    content = content.replace(/  +/g, ' ');
    // Cleanup space before closing quote
    content = content.replace(/ "/g, '"');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${filePath}`);
    }
  }
});

// Also let's clean up styles.css
const cssPath = './src/styles.css';
let css = fs.readFileSync(cssPath, 'utf8');
// Remove @media blocks for min-width
const mediaRegex = /@media\s*\([^)]*min-width[^)]*\)\s*\{([\s\S]*?})\s*}/g;
// Wait, regex for nested blocks is tricky. A simple regex might break CSS.
// Let's just do a naive replacement if possible, or leave styles.css mostly alone.
// We'll leave styles.css alone for now and let Tailwind's removal do the heavy lifting.
