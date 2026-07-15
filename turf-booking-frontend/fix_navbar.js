const fs = require('fs');

let c = fs.readFileSync('src/app/layout/navbar/navbar.component.html', 'utf8');

c = c.replace('<div class="hidden items-center gap-4 mr-auto ml-6">', '<div class="hidden md:flex items-center gap-4 mr-auto ml-6">');
c = c.replace('<div class="hidden items-center gap-4">', '<div class="hidden md:flex items-center gap-4">');
c = c.replace('hidden items-center justify-center group" aria-label="Liked Turfs"', 'hidden md:flex items-center justify-center group" aria-label="Liked Turfs"');
c = c.replace('<div class="w-px h-5 bg-[var(--border-color)] mx-1 hidden"></div>', '<div class="w-px h-5 bg-[var(--border-color)] mx-1 hidden md:block"></div>');
c = c.replace('<div class="relative group cursor-pointer hidden items-center">', '<div class="relative group cursor-pointer hidden md:flex items-center">');
c = c.replace(/<!-- Action Controls \(Mobile\/Tablet Only\) -->\s*<div class="flex items-center gap-2">/, '<!-- Action Controls (Mobile/Tablet Only) -->\n  <div class="flex md:hidden items-center gap-2">');

fs.writeFileSync('src/app/layout/navbar/navbar.component.html', c);
console.log('Fixed navbar desktop layout');
