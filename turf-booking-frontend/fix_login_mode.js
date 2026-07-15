const fs = require('fs');

let formPath = 'src/app/features/auth/login/ui/login-form.component.ts';
let formContent = fs.readFileSync(formPath, 'utf8');

const replacement = `  ngOnChanges(changes: SimpleChanges) {
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

formContent = formContent.replace(/ngOnChanges\s*\([\s\S]*?ngOnInit\s*\(\)\s*\{[\s\S]*?\}/, replacement);

fs.writeFileSync(formPath, formContent);
console.log('Fixed login auto-fill mode switch');
