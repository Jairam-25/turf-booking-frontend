const fs = require('fs');
const path = 'src/app/features/dashboard/dashboard.component.ts';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  '<h2 class="text-white text-lg font-bold">Discover</h2>',
  '<h2 class="text-slate-900 dark:text-white text-lg font-bold">Discover</h2>'
);

content = content.replace(
  '<a routerLink="/offers" class="bg-[#f59e0b] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform" style="text-decoration: none;">',
  '<button (click)="navigateToOffers()" class="bg-[#f59e0b] text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 hover:scale-105 transition-transform border-none outline-none cursor-pointer">'
);

content = content.replace(
  /Promo Offers\s+<\/a>/,
  'Promo Offers\n        </button>'
);

fs.writeFileSync(path, content);
console.log('Fixed discover text and promo offers link');
