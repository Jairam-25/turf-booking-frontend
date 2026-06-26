const fs = require('fs');

let c = fs.readFileSync('src/app/app.html', 'utf8');

const regex = /<div class="custom-splash-screen fixed inset-0 z-\[99999\] flex flex-col items-center justify-center bg-slate-900" style="background-color: #0f172a;">/;

const replacement = `<div class="custom-splash-screen fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-slate-900 overflow-hidden" style="background-color: #0f172a;">
    <!-- Animated Bubbles Background -->
    <div class="bubbles-container absolute inset-0 z-0 pointer-events-none">
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
      <div class="bubble"></div>
    </div>
    
    <div class="z-10 relative flex flex-col items-center">`;

c = c.replace(regex, replacement);

c = c.replace(/<\/div>\s*<\/div>\s*}\s*@if \(!hideNavbar\(\)\)/, `</div>\n    </div>\n  </div>\n}\n@if (!hideNavbar())`);

fs.writeFileSync('src/app/app.html', c, 'utf8');
