const fs = require('fs');
const path = 'src/app/features/auth/login/ui/login-form.component.ts';
let content = fs.readFileSync(path, 'utf8');

const insertionPoint = `    .password-input-container {`;
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
    .password-input-container {`;

if (!content.includes('.form-options {')) {
  content = content.replace(insertionPoint, cssStyles);
  fs.writeFileSync(path, content);
  console.log('Added CSS successfully!');
} else {
  console.log('CSS already added');
}
