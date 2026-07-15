const fs = require('fs');
let path = 'src/app/features/auth/login/ui/login-form.component.ts';
let lines = fs.readFileSync(path, 'utf8').split('\n');

// Find start and end of garbage
let startIndex = -1;
let endIndex = -1;
for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('export class LoginFormComponent')) {
        startIndex = i;
    }
    if (lines[i].includes('@Input() loading = false;')) {
        endIndex = i;
        break;
    }
}

if (startIndex !== -1 && endIndex !== -1) {
    const replacement = `export class LoginFormComponent implements OnInit, OnDestroy, OnChanges {
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialEmail'] && changes['initialEmail'].currentValue) {
      this.loginForm.patchValue({ emailOrPhone: changes['initialEmail'].currentValue });
    }
    if (changes['initialPassword'] && changes['initialPassword'].currentValue) {
      this.loginForm.patchValue({ password: changes['initialPassword'].currentValue });
      this.setModeToPassword();
    }
  }

  ngOnInit() {
    if (this.initialEmail) {
      this.loginForm.patchValue({ emailOrPhone: this.initialEmail });
    }
    if (this.initialPassword) {
      this.loginForm.patchValue({ password: this.initialPassword });
      this.setModeToPassword();
    }
  }

  setModeToPassword() {
    this.isOtpMode = false;
    this.otpSent = false;
    this.maskedEmail = '';
    this.clearInterval();
    const pw = this.loginForm.get('password');
    const otp = this.loginForm.get('otpCode');
    otp?.clearValidators();
    pw?.setValidators([Validators.required]);
    pw?.updateValueAndValidity();
    otp?.updateValueAndValidity();
    this.loginForm.get('emailOrPhone')?.updateValueAndValidity();
  }
`;
    lines.splice(startIndex, endIndex - startIndex, replacement);
    fs.writeFileSync(path, lines.join('\n'));
    console.log('Fixed syntax error');
}
