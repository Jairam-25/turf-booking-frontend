const fs = require('fs');

function fixFile(path) {
    let content = fs.readFileSync(path, 'utf8');
    
    // Check if copyEmail is already in there and remove it if it's placed wrongly
    if (content.includes('copyEmail() {')) {
        content = content.replace(/\s*copyEmail\(\) \{\s*const email.*?\s*if \(email\) \{\s*navigator\.clipboard.*?success.*?\}\s*\}\s*\}/g, '');
        content = content.replace(/\s*copyEmail\(\) \{[\s\S]*?\}\s*\}\s*togglePasswordVisibility/g, '\n\n  togglePasswordVisibility');
        content = content.replace(/\s*copyEmail\(\) \{[\s\S]*?\}\s*\}\s*isSendingOtp/g, '\n\n  isSendingOtp');
    }
    
    // Add copyEmail method properly before constructor
    if (!content.includes('copyEmail() {')) {
        content = content.replace('constructor(', `
  copyEmail() {
    const ctrl = this.loginForm ? this.loginForm.get('emailOrPhone') : this.emailControl;
    const email = ctrl?.value;
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        this.notificationService.success('Email copied to clipboard!');
      });
    }
  }

  constructor(`);
    }
    fs.writeFileSync(path, content);
}

fixFile('src/app/features/auth/login/ui/login-form.component.ts');
fixFile('src/app/features/auth/register/ui/register-form.component.ts');
console.log('Fixed copyEmail methods');
