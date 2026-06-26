const fs = require('fs');
let c = fs.readFileSync('src/app/features/auth/register/ui/register-form.component.ts', 'utf8');

c = c.replace(
  `<div class="form-group">\n <label for="email">Email</label>`,
  `<div class="form-group">
 <label for="city">Preferred Location (City)</label>
 <input 
 id="city" 
 type="text" 
 formControlName="city" 
 placeholder="e.g. Thanjavur"
 [class.invalid]="isFieldInvalid('city')"
 (blur)="trimField('city')"
 >
 <span class="error-text" *ngIf="isFieldInvalid('city')">
 Please enter your city
 </span>
 </div>

 <div class="form-group">
 <label for="email">Email</label>`
);

c = c.replace(
  `name: ['', [Validators.required, Validators.minLength(3)]],`,
  `name: ['', [Validators.required, Validators.minLength(3)]],\n city: ['', [Validators.required]],`
);

fs.writeFileSync('src/app/features/auth/register/ui/register-form.component.ts', c, 'utf8');
console.log("Updated frontend registration form");
