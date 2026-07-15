const fs = require('fs');
let c = fs.readFileSync('src/app/features/auth/register/ui/register-form.component.ts', 'utf8');

c = c.replace(/<input \s*id="password" \s*type="password" \s*formControlName="password" \s*placeholder="••••••••"\s*\[class\.invalid\]="isFieldInvalid\('password'\)"\s*\(blur\)="trimField\('password'\)"\s*>/g,
  `<div class="password-input-container">
 <input 
 id="password" 
 [type]="showPassword() ? 'text' : 'password'" 
 formControlName="password" 
 placeholder="••••••••"
 [class.invalid]="isFieldInvalid('password')"
 (blur)="trimField('password')"
 >
 <button type="button" class="eye-btn" (click)="togglePasswordVisibility()" tabindex="-1">
 <svg *ngIf="!showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 <svg *ngIf="showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
 </svg>
 </button>
 </div>`);

c = c.replace(/<input \s*id="confirmPassword" \s*type="password" \s*formControlName="confirmPassword" \s*placeholder="••••••••"\s*\[class\.invalid\]="isFieldInvalid\('confirmPassword'\)"\s*\(blur\)="trimField\('confirmPassword'\)"\s*>/g,
  `<div class="password-input-container">
 <input 
 id="confirmPassword" 
 [type]="showConfirmPassword() ? 'text' : 'password'" 
 formControlName="confirmPassword" 
 placeholder="••••••••"
 [class.invalid]="isFieldInvalid('confirmPassword')"
 (blur)="trimField('confirmPassword')"
 >
 <button type="button" class="eye-btn" (click)="toggleConfirmPasswordVisibility()" tabindex="-1">
 <svg *ngIf="!showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
 <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
 </svg>
 <svg *ngIf="showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
 <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
 </svg>
 </button>
 </div>`);

fs.writeFileSync('src/app/features/auth/register/ui/register-form.component.ts', c);
