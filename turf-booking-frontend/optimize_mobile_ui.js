const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

// Mobile token mapping
const replacements = [
  // Padding & Margins reduction
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-8\b/g, replace: '$1-4' },
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-10\b/g, replace: '$1-5' },
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-12\b/g, replace: '$1-6' },
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-16\b/g, replace: '$1-6' },
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-20\b/g, replace: '$1-6' },
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-24\b/g, replace: '$1-8' },
  { regex: /\b(p|m|px|py|mx|my|pt|pb|mt|mb|pl|pr|ml|mr)-32\b/g, replace: '$1-8' },
  
  // Gap reduction
  { regex: /\bgap-8\b/g, replace: 'gap-4' },
  { regex: /\bgap-10\b/g, replace: 'gap-4' },
  { regex: /\bgap-12\b/g, replace: 'gap-5' },
  { regex: /\bgap-16\b/g, replace: 'gap-6' },
  
  // Font sizes optimization
  { regex: /\btext-5xl\b/g, replace: 'text-3xl' },
  { regex: /\btext-6xl\b/g, replace: 'text-3xl' },
  { regex: /\btext-7xl\b/g, replace: 'text-4xl' },
  { regex: /\btext-8xl\b/g, replace: 'text-4xl' },
  
  // Height/Touch targets optimization (min 48px)
  { regex: /\bh-10\b/g, replace: 'h-12' },
  { regex: /\bh-8\b/g, replace: 'h-12' },
  { regex: /\bw-10\b/g, replace: 'w-12' },
  { regex: /\bw-8\b/g, replace: 'w-12' },

  // Make flex directions column for extreme responsive layout
  // Wait, if it was flex-row before and md:flex-col... 
  // It's probably safer to not blindly replace flex-row.
];

walkDir('./src/app', function(filePath) {
  if (filePath.endsWith('.html') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    replacements.forEach(r => {
      content = content.replace(r.regex, r.replace);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Optimized Mobile UI in ${filePath}`);
    }
  }
});
