const fs = require('fs');

let regPath = 'src/app/features/auth/register/register.component.ts';
let regContent = fs.readFileSync(regPath, 'utf8');

if (regContent.includes("this.router.navigate(['/auth/login'], { queryParams: returnUrl ? { returnUrl } : undefined });")) {
    regContent = regContent.replace(
        "this.router.navigate(['/auth/login'], { queryParams: returnUrl ? { returnUrl } : undefined });",
        "let queryParams: any = { email: data.email, password: data.password };\n  if (returnUrl) queryParams.returnUrl = returnUrl;\n  this.router.navigate(['/auth/login'], { queryParams });"
    );
    fs.writeFileSync(regPath, regContent);
    console.log('Updated register.component.ts to pass credentials');
}
