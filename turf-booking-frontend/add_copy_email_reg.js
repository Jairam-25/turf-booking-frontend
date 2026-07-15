const fs = require('fs');

let path = 'src/app/features/auth/register/ui/register-form.component.ts';
let content = fs.readFileSync(path, 'utf8');

const oldMsg = `<p class="text-sm text-[var(--text-secondary)] mb-4">An OTP has been sent to <strong>{{ emailControl.value }}</strong>. Please enter it below.</p>`;

const newMsg = `<p class="text-sm text-[var(--text-secondary)] mb-4">An OTP has been sent to 
  <strong (click)="copyEmail()" title="Click to copy email" style="cursor: pointer; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;">
    {{ emailControl.value }}
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  </strong>. Please enter it below.</p>`;

content = content.replace(oldMsg, newMsg);

if (!content.includes('copyEmail()')) {
    const copyMethod = `
  copyEmail() {
    const email = this.emailControl.value;
    if (email) {
      navigator.clipboard.writeText(email).then(() => {
        this.notificationService.success('Email copied to clipboard!');
      });
    }
  }

  isSendingOtp`;
    content = content.replace('isSendingOtp', copyMethod);
}

fs.writeFileSync(path, content);
console.log('Added copy email feature to register form');
