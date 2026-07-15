const fs = require('fs');

let html = fs.readFileSync('src/app/features/become-owner/become-owner.component.html', 'utf8');

// Replace blues with purples
html = html.replace(/bg-\[#146ef5\]/g, 'bg-[#7b39fc]');
html = html.replace(/shadow-\[0_0_15px_rgba\(20,110,245,0\.5\)\]/g, 'shadow-[0_0_15px_rgba(123,57,252,0.5)]');
html = html.replace(/from-blue-500\/5 to-purple-500\/5/g, 'from-purple-500/10 to-indigo-500/10');
html = html.replace(/shadow-\[\#146ef5\]\/20/g, 'shadow-[#7b39fc]/20');
html = html.replace(/text-\[\#146ef5\]/g, 'text-[#7b39fc]');

// Fix Razorpay button color
html = html.replace(/shadow-lg shadow-\[\#146ef5\]\/20/g, 'shadow-lg shadow-[#7b39fc]/30');

// Make it look more professional
html = html.replace(/<div class="glass rounded-2xl p-5 sm:p-8 fade-in">/g, '<div class="glass rounded-3xl p-6 sm:p-10 fade-in border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-xl bg-white/5 dark:bg-[#121212]/60">\n      <div class="absolute -top-32 -right-32 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>');

fs.writeFileSync('src/app/features/become-owner/become-owner.component.html', html);
console.log('Fixed become owner styling');
