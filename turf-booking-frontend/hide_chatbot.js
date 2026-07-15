const fs = require('fs');

// 1. Update app.ts
const appPath = 'src/app/app.ts';
let appCode = fs.readFileSync(appPath, 'utf8');

// Add signal
if (!appCode.includes('hideChatbot = signal')) {
  appCode = appCode.replace(
    'hideBottomNav = signal(false);',
    'hideBottomNav = signal(false);\n hideChatbot = signal(false);'
  );
}

// Update updateVisibility
appCode = appCode.replace(
  'this.hideFooter.set(isAuth || cleanUrl.startsWith(\'/payment\') || isMobile);',
  'this.hideFooter.set(isAuth || cleanUrl.startsWith(\'/payment\') || isMobile);\n    const isTurfDetails = cleanUrl.includes(\'/dashboard/turf/\');\n    this.hideChatbot.set(isAuth || isTurfDetails);'
);

fs.writeFileSync(appPath, appCode);
console.log('Updated app.ts');

// 2. Update app.html
const appHtmlPath = 'src/app/app.html';
let appHtmlCode = fs.readFileSync(appHtmlPath, 'utf8');
if (!appHtmlCode.includes('@if (!hideChatbot())')) {
  appHtmlCode = appHtmlCode.replace(
    '<app-chatbot></app-chatbot>',
    '@if (!hideChatbot()) {\n<app-chatbot></app-chatbot>\n}'
  );
}
fs.writeFileSync(appHtmlPath, appHtmlCode);
console.log('Updated app.html');
