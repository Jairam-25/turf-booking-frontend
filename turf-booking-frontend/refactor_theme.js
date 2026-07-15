const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/app/features/dashboard/dashboard.component.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add ThemeService import
if (!content.includes('import { ThemeService }')) {
    content = content.replace(
        "import { Router } from '@angular/router';",
        "import { Router } from '@angular/router';\nimport { ThemeService } from '../../core/services/theme.service';"
    );
}

// 2. Add ThemeService to constructor
if (!content.includes('public themeService: ThemeService')) {
    content = content.replace(
        'private router: Router',
        'private router: Router,\n  public themeService: ThemeService'
    );
}

// 3. Replace isDarkMode() with themeService.theme() === 'dark' in template
content = content.replace(/isDarkMode\(\)/g, "themeService.theme() === 'dark'");

// 4. Replace toggleTheme() logic with themeService.toggle()
content = content.replace(/toggleTheme\(\) \{[\s\S]*?resetFilters\(\) \{/, 'toggleTheme(event?: MouseEvent) {\n    this.themeService.toggle(event);\n  }\n\n  resetFilters() {');

// 5. Remove manual local storage logic from ngOnInit
content = content.replace(/const savedTheme = localStorage.getItem\('theme'\);[\s\S]*?document\.body\.classList\.remove\('dark'\);\n\s*\}/, '');

fs.writeFileSync(filePath, content);
console.log('Refactored DashboardComponent to use ThemeService');
