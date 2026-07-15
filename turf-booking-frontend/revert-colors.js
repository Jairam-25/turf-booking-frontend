const fs = require('fs');

function replaceColors(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  // Replace profile header green gradient with purple gradient
  c = c.replace(/from-\[#4ade80\] to-\[#22c55e\]/g, 'from-[#7b39fc] to-[#5a24c3]');
  
  // Replace solid green with purple
  c = c.replace(/bg-\[#4ade80\]/g, 'bg-[#7b39fc]');
  c = c.replace(/border-\[#4ade80\]/g, 'border-[#7b39fc]');
  c = c.replace(/border-t-\[#4ade80\]/g, 'border-t-[#7b39fc]');
  c = c.replace(/text-\[#4ade80\]/g, 'text-[#7b39fc]');
  
  fs.writeFileSync(filePath, c);
}

replaceColors('src/app/features/profile/profile.html');
replaceColors('src/app/features/dashboard/dashboard.component.ts');

console.log("Colors reverted to purple.");
