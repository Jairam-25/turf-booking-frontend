const fs = require('fs');

// Fix login form
let loginPath = 'src/app/features/auth/login/ui/login-form.component.ts';
let loginContent = fs.readFileSync(loginPath, 'utf8');

loginContent = loginContent.replace(
    /const ctrl = this\.loginForm \? this\.loginForm\.get\('emailOrPhone'\) : this\.emailControl;\s*const email = ctrl\?\.value;/,
    "const email = this.loginForm.get('emailOrPhone')?.value;"
);
fs.writeFileSync(loginPath, loginContent);

// Fix register form
let registerPath = 'src/app/features/auth/register/ui/register-form.component.ts';
let registerContent = fs.readFileSync(registerPath, 'utf8');

registerContent = registerContent.replace(
    /const ctrl = this\.loginForm \? this\.loginForm\.get\('emailOrPhone'\) : this\.emailControl;\s*const email = ctrl\?\.value;/,
    "const email = this.emailControl.value;"
);
fs.writeFileSync(registerPath, registerContent);

console.log('Fixed copyEmail methods TS errors');
