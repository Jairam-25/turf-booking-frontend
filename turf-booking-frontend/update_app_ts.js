const fs = require('fs');

const path = 'src/app/app.ts';
let content = fs.readFileSync(path, 'utf8');

const s = content.indexOf('    import(\\'@capacitor/splash-screen\\').then(({ SplashScreen }) => {');
const e = content.indexOf('  this.themeService.init();');

if (s !== -1 && e !== -1) {
    const newCode = `    this.showAppSplash.set(true);
    setTimeout(() => this.showAppSplash.set(false), 2700);

    import('@capacitor/splash-screen').then(({ SplashScreen }) => {
      import('@capacitor/core').then(({ Capacitor }) => {
        if (Capacitor.isNativePlatform()) {
          setTimeout(() => {
            SplashScreen.hide(); // Hide native splash to show our custom web splash
          }, 500); // Wait 500ms before hiding native splash
        }
      });
    });
`;
    content = content.substring(0, s) + newCode + content.substring(e);
    fs.writeFileSync(path, content);
    console.log("Updated app.ts");
} else {
    console.log("Could not find boundaries in app.ts", s, e);
}
