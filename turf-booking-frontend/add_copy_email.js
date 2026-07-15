const fs = require('fs');

let path = 'src/app/features/auth/login/ui/login-form.component.ts';
let content = fs.readFileSync(path, 'utf8');

const oldOtpMsg = `<div class="otp-info-message">
          OTP has been sent to your registered email: <strong>{{ maskedEmail }}</strong>
        </div>`;

const newOtpMsg = `<div class="otp-info-message">
          OTP has been sent to your registered email: 
          <strong (click)="copyEmail()" title="Click to copy email" style="cursor: pointer; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;">
            {{ maskedEmail }}
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          </strong>
        </div>`;

content = content.replace(oldOtpMsg, newOtpMsg);

// add copyEmail method
if (!content.includes('copyEmail()')) {
    const copyMethod = `
  copyEmail() {
    const email = this.loginForm.get('emailOrPhone')?.value;
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        this.notificationService.success('Email copied to clipboard!');
      });
    }
  }

  togglePasswordVisibility`;
    content = content.replace('togglePasswordVisibility', copyMethod);
}

fs.writeFileSync(path, content);
console.log('Added copy email feature');
