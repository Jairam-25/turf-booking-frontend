const fs = require('fs');

let regPath = 'src/app/features/auth/register/register.component.ts';
let regContent = fs.readFileSync(regPath, 'utf8');

regContent = regContent.replace(
    'let queryParams: any = { email: data.email, password: data.password };\n  if (returnUrl) queryParams.returnUrl = returnUrl;\n  this.router.navigate([\'/auth/login\'], { queryParams });',
    'let navigationExtras: any = { state: { email: data.email, password: data.password } };\n  if (returnUrl) navigationExtras.queryParams = { returnUrl };\n  this.router.navigate([\'/auth/login\'], navigationExtras);'
);

fs.writeFileSync(regPath, regContent);
console.log('Fixed register component state routing');

let loginPath = 'src/app/features/auth/login/login.component.ts';
let loginContent = fs.readFileSync(loginPath, 'utf8');

const queryRepl = `const state = window.history.state;
    if (state && state.email) this.initialEmail = state.email;
    if (state && state.password) this.initialPassword = state.password;

    this.route.queryParams.subscribe(params => {
      if (params['email'] && !this.initialEmail) this.initialEmail = params['email'];
      // We removed reading password from queryParams for security
    });`;

loginContent = loginContent.replace(
    /this\.route\.queryParams\.subscribe\(params => \{\s*if \(params\['email'\]\) this\.initialEmail = params\['email'\];\s*if \(params\['password'\]\) this\.initialPassword = params\['password'\];\s*\}\);/,
    queryRepl
);

fs.writeFileSync(loginPath, loginContent);
console.log('Fixed login component state reading');
