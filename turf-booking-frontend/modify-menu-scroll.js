const fs = require('fs');
let c = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');

c = c.replace(
  /<div class="flex flex-col gap-2">/,
  `<div class="flex flex-col gap-2 max-h-[60vh] overflow-y-auto scrollbar-hide pb-10">`
);

fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', c);
