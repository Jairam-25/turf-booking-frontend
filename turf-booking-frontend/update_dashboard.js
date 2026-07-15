const fs = require('fs');

let dashboardPath = 'src/app/features/dashboard/dashboard.component.ts';
if (fs.existsSync(dashboardPath)) {
    let content = fs.readFileSync(dashboardPath, 'utf8');
    if (!content.includes('user.district')) {
        content = content.replace(
            `    const user = this.authStore.user();\n    if (user && user.name) {\n      this.userName.set(user.name.split(' ')[0]);\n    }`,
            `    const user = this.authStore.user();\n    if (user && user.name) {\n      this.userName.set(user.name.split(' ')[0]);\n      \n      if (user.district && user.pincode && !sessionStorage.getItem('dashboard_locationStr')) {\n        this.selectedLocation.set(\`\${user.district}, \${user.pincode}\`);\n        this.selectedDistrict.set(user.district);\n        this.selectedState.set(user.state || '');\n      }\n    }`
        );
        fs.writeFileSync(dashboardPath, content);
        console.log('Updated Dashboard Component to load user district and pincode');
    }
}
