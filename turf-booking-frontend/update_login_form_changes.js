const fs = require('fs');

let formPath = 'src/app/features/auth/login/ui/login-form.component.ts';
let formContent = fs.readFileSync(formPath, 'utf8');

if (!formContent.includes('OnChanges')) {
    formContent = formContent.replace('import { Component, OnInit, OnDestroy', 'import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges');
    formContent = formContent.replace('implements OnInit, OnDestroy', 'implements OnInit, OnDestroy, OnChanges');
    
    const changesMethod = `
  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialEmail'] && changes['initialEmail'].currentValue) {
      this.loginForm.patchValue({ emailOrPhone: changes['initialEmail'].currentValue });
    }
    if (changes['initialPassword'] && changes['initialPassword'].currentValue) {
      this.loginForm.patchValue({ password: changes['initialPassword'].currentValue });
    }
  }
`;
    formContent = formContent.replace('ngOnInit() {', changesMethod + '\n  ngOnInit() {');
    fs.writeFileSync(formPath, formContent);
    console.log('Added ngOnChanges to login form');
}
