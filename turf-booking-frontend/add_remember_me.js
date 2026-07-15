const fs = require('fs');
const path = 'src/app/features/auth/login/ui/login-form.component.ts';
let content = fs.readFileSync(path, 'utf8');

// 1. Add rememberMe to the FormGroup
if (!content.includes("rememberMe: [false]")) {
  content = content.replace(
    "otpCode: ['']",
    "otpCode: [''],\n      rememberMe: [false]"
  );
}

// 2. Add the Remember me checkbox HTML before the submit button
if (!content.includes('class="remember-me"')) {
  const submitButtonStart = '<magic-shiny-button type="submit" [loading]="loading || sendingOtp || verifyingOtp">';
  const rememberMeHtml = `
      <!-- Options: Remember Me -->
      <div class="form-options" *ngIf="!isOtpMode">
        <label class="remember-me">
          <input type="checkbox" formControlName="rememberMe">
          <span class="checkmark"></span>
          Remember me
        </label>
      </div>

      `;
  content = content.replace(submitButtonStart, rememberMeHtml + submitButtonStart);
}

// 3. Add CSS for remember-me
if (!content.includes('.form-options {')) {
  const cssInsertion = `
    .password-input-container {
`;
  const cssStyles = `
    .form-options {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin-top: -0.25rem;
      margin-bottom: 0.5rem;
    }
    .remember-me {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .remember-me input {
      accent-color: var(--primary);
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .password-input-container {
`;
  content = content.replace(cssInsertion, cssStyles);
}

fs.writeFileSync(path, content);
console.log('Remember me added to login-form.component.ts');
