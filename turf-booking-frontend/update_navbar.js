const fs = require('fs');

let html = fs.readFileSync('src/app/layout/navbar/navbar.component.html', 'utf8');

html = html.replace(
  'navbar-shell sticky top-0 z-50 flex items-center justify-between w-full py-2 .5 px-4 ] backdrop-blur-xl border-b font-manrope transition-all duration-300',
  'navbar-shell sticky top-0 z-50 flex items-center justify-between w-full py-3 px-5 bg-[var(--bg-background)] font-manrope transition-all duration-300'
);

// We can also ensure the logo image has no weird drop shadow if they want flat design.
html = html.replace(
  'origin-left drop-shadow-[0_0_8px_rgba(20,110,245,0.4)]',
  'origin-left drop-shadow-sm'
);

fs.writeFileSync('src/app/layout/navbar/navbar.component.html', html);
console.log("Updated navbar.component.html styling");
