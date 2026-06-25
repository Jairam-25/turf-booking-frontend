const fs = require('fs');

const path = './src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add Offers tab near search input
content = content.replace(
  '<div class="search-container">',
  `<div class="search-container">
 <div class="flex justify-between items-center mb-3 px-2">
 <h2 class="text-white text-lg font-bold">Discover</h2>
 <a routerLink="/offers" class="bg-[#f59e0b] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform" style="text-decoration: none;">
 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path></svg>
 Promo Offers
 </a>
 </div>`
);

// 2. Change mobile grid to show 3 turfs on one row
// The mobile query has: grid-template-columns: repeat(1, 1fr);
content = content.replace(
  /grid-template-columns: repeat\(1, 1fr\);/,
  `display: flex;
 overflow-x: auto;
 scroll-snap-type: x mandatory;
 padding-bottom: 1rem;
 gap: 0.75rem;
 /* grid-template-columns: repeat(3, 1fr); */`
);

// We also need to style the app-turf-card inside the turf-grid for mobile to be 1/3 width
// Add this inside the mobile @media block
content = content.replace(
  /.turf-grid \{[\s\S]*?\}/,
  (match) => {
    return match + `\n .turf-grid > app-turf-card { min-width: calc(33.333% - 0.5rem); scroll-snap-align: start; }`;
  }
);


fs.writeFileSync(path, content, 'utf8');
console.log('Updated dashboard.component.ts');
