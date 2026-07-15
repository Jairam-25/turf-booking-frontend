const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/features/offers/offers.component.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Remove backdrop-filter to prevent massive layout thrashing and lag on mobile
content = content.replace('backdrop-filter: blur(12px);', '');
content = content.replace('-webkit-backdrop-filter: blur(12px);', '');

// Also change sticky header background to be more solid since we removed blur
content = content.replace('background: rgba(17, 24, 39, 0.85);', 'background: rgba(17, 24, 39, 0.98);');
content = content.replace('background: rgba(248, 250, 252, 0.85);', 'background: rgba(248, 250, 252, 0.98);');

// Remove glow-blob completely from offers-hero because huge radial gradients on absolute elements cause heavy rasterization lag on scroll
content = content.replace(/<div class="glow-blob.*?<\/div>/g, '');

fs.writeFileSync(filePath, content);
console.log('Offers component optimized for mobile.');
