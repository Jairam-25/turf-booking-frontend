const fs = require('fs');
let c = fs.readFileSync('src/app/features/dashboard/dashboard.component.ts', 'utf8');

c = c.replace(
  /bottom-\[90px\]/,
  'bottom-[120px]'
);

// Add scroll down to Categories "See All"
c = c.replace(
  /\(click\)="selectGame\('All'\)"/,
  `(click)="selectAllGamesAndScroll()"`
);

// Add selectAllGamesAndScroll method
if (!c.includes('selectAllGamesAndScroll() {')) {
  c = c.replace(
    /resetFilters\(\) \{/,
    `selectAllGamesAndScroll() {
    this.selectGame('All');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  resetFilters() {`
  );
}

// Add scroll down to Nearby Arenas "See All"
c = c.replace(
  /\(click\)="resetFilters\(\)"/,
  `(click)="resetFiltersAndScroll()"`
);

if (!c.includes('resetFiltersAndScroll() {')) {
  c = c.replace(
    /resetFilters\(\) \{/,
    `resetFiltersAndScroll() {
    this.resetFilters();
    window.scrollTo({ top: 500, behavior: 'smooth' });
  }

  resetFilters() {`
  );
}

fs.writeFileSync('src/app/features/dashboard/dashboard.component.ts', c);
