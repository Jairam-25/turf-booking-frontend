const fs = require('fs');
const path = 'src/app/features/privacy-policy/privacy-policy.html';
let content = fs.readFileSync(path, 'utf8');

const buttonHtml = `      <button (click)="goBack()" class="flex items-center gap-2 text-[#7b39fc] text-sm font-bold bg-[#7b39fc]/10 px-4 py-2 rounded-lg hover:bg-[#7b39fc]/20 transition-colors mb-6 w-max">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        Go Back
      </button>
      <div class="flex items-center gap-4 mb-8 border-b`;

content = content.replace('<div class="flex items-center gap-4 mb-8 border-b', buttonHtml);

fs.writeFileSync(path, content);
console.log('Added Go Back button to privacy policy');
