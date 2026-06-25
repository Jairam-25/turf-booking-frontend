const fs = require('fs');

// 1. Fix uncentered active dot in bottom-nav.component.ts
let navContent = fs.readFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', 'utf8');
navContent = navContent.replace(
  /nav-item\.active::after \{\s*content: '';\s*position: absolute;\s*bottom: 6px;\s*width: 4px;\s*height: 4px;\s*border-radius: 50%;\s*background: var\(--primary\);\s*\}/,
  `nav-item.active::after {\n content: '';\n position: absolute;\n bottom: 6px;\n left: 50%;\n transform: translateX(-50%);\n width: 4px;\n height: 4px;\n border-radius: 50%;\n background: var(--primary);\n }`
);
fs.writeFileSync('src/app/layout/bottom-nav/bottom-nav.component.ts', navContent);

// 2. Fix Chatbot overlapping bottom nav in chatbot.component.ts
let chatContent = fs.readFileSync('src/app/layout/chatbot/chatbot.component.ts', 'utf8');
chatContent = chatContent.replace(
  /\.chatbot-wrapper \{\s*position: fixed;\s*bottom: 2rem;\s*right: 2rem;\s*z-index: 1001;\s*font-family: 'Manrope', sans-serif;\s*\}/,
  `.chatbot-wrapper {\n position: fixed;\n bottom: calc(64px + env(safe-area-inset-bottom) + 1rem);\n right: 1.5rem;\n z-index: 1001;\n font-family: 'Manrope', sans-serif;\n }`
);
fs.writeFileSync('src/app/layout/chatbot/chatbot.component.ts', chatContent);
