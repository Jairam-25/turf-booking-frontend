const fs = require('fs');

let loginPath = 'src/app/features/auth/login/login.component.ts';
let loginContent = fs.readFileSync(loginPath, 'utf8');

// 1. Add inputs to <app-login-form>
if (!loginContent.includes('[initialEmail]="initialEmail"')) {
    loginContent = loginContent.replace(
        '[loading]="isLoading()"',
        '[loading]="isLoading()" \n  [initialEmail]="initialEmail" \n  [initialPassword]="initialPassword"'
    );
}

// 2. Add class variables and update ngOnInit
if (!loginContent.includes('initialEmail =')) {
    loginContent = loginContent.replace(
        'errorMessage = signal<string>(\'\');',
        'errorMessage = signal<string>(\'\');\n\n  initialEmail = \'\';\n  initialPassword = \'\';'
    );
}

if (!loginContent.includes('this.initialEmail = params[\'email\'];')) {
    loginContent = loginContent.replace(
        "const sports: ('football' | 'cricket' | 'pingpong')[] = ['football', 'cricket', 'pingpong'];\n  this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);",
        "const sports: ('football' | 'cricket' | 'pingpong')[] = ['football', 'cricket', 'pingpong'];\n  this.activeSport.set(sports[Math.floor(Math.random() * sports.length)]);\n\n  this.route.queryParams.subscribe(params => {\n    if (params['email']) this.initialEmail = params['email'];\n    if (params['password']) this.initialPassword = params['password'];\n  });"
    );
}
fs.writeFileSync(loginPath, loginContent);
console.log('Updated login.component.ts');
