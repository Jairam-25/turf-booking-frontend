const fs = require('fs');

let loginPath = 'src/app/features/auth/login/login.component.ts';
let loginContent = fs.readFileSync(loginPath, 'utf8');

if (!loginContent.includes('params[\'copy\']')) {
    const repl = `this.route.queryParams.subscribe(params => {
      if (params['email'] && !this.initialEmail) this.initialEmail = params['email'];
      
      // Auto-copy OTP feature from Email Click
      if (params['copy']) {
        const otpCode = params['copy'];
        navigator.clipboard.writeText(otpCode).then(() => {
          this.notificationService.success('✅ OTP ' + otpCode + ' copied to clipboard!');
        }).catch(err => {
          this.notificationService.info('OTP is: ' + otpCode);
        });
      }
    });`;
    
    loginContent = loginContent.replace(
        /this\.route\.queryParams\.subscribe\(params => \{\s*if \(params\['email'\] && !this\.initialEmail\) this\.initialEmail = params\['email'\];\s*\/\/ We removed reading password from queryParams for security\s*\}\);/,
        repl
    );
    fs.writeFileSync(loginPath, loginContent);
    console.log('Added auto-copy to login');
}

let regPath = 'src/app/features/auth/register/register.component.ts';
let regContent = fs.readFileSync(regPath, 'utf8');

if (!regContent.includes('params[\'copy\']')) {
    const repl = `this.route.queryParams.subscribe(params => {
      if (params['email']) this.initialEmail = params['email'];
      if (params['name']) this.initialName = params['name'];
      if (params['phone']) this.initialPhone = params['phone'];
      
      // Auto-copy OTP feature from Email Click
      if (params['copy']) {
        const otpCode = params['copy'];
        navigator.clipboard.writeText(otpCode).then(() => {
          this.notificationService.success('✅ OTP ' + otpCode + ' copied to clipboard!');
        }).catch(err => {
          this.notificationService.info('OTP is: ' + otpCode);
        });
      }
    });`;
    
    regContent = regContent.replace(
        /this\.route\.queryParams\.subscribe\(params => \{\s*if \(params\['email'\]\) this\.initialEmail = params\['email'\];\s*if \(params\['name'\]\) this\.initialName = params\['name'\];\s*if \(params\['phone'\]\) this\.initialPhone = params\['phone'\];\s*\}\);/,
        repl
    );
    fs.writeFileSync(regPath, regContent);
    console.log('Added auto-copy to register');
}
