const fs = require('fs');

let formPath = 'src/app/features/auth/login/ui/login-form.component.ts';
let formContent = fs.readFileSync(formPath, 'utf8');

// 1. Add @Input variables
if (!formContent.includes('@Input() initialEmail = \'\';')) {
    formContent = formContent.replace(
        '@Input() loading = false;',
        '@Input() loading = false;\n  @Input() initialEmail = \'\';\n  @Input() initialPassword = \'\';'
    );
}

// 2. Use them in ngOnInit or ngOnChanges
// Check if ngOnInit exists
if (formContent.includes('ngOnInit() {')) {
    if (!formContent.includes('this.initialEmail')) {
        formContent = formContent.replace(
            'ngOnInit() {',
            'ngOnInit() {\n    if (this.initialEmail) {\n      this.loginForm.patchValue({ emailOrPhone: this.initialEmail });\n    }\n    if (this.initialPassword) {\n      this.loginForm.patchValue({ password: this.initialPassword });\n    }'
        );
    }
} else {
    // Add ngOnInit
    if (formContent.includes('import { Component')) {
        if (!formContent.includes('OnInit')) {
            formContent = formContent.replace('import { Component', 'import { Component, OnInit');
        }
        formContent = formContent.replace(
            'export class LoginFormComponent implements OnDestroy {',
            'export class LoginFormComponent implements OnInit, OnDestroy {\n  ngOnInit() {\n    if (this.initialEmail) {\n      this.loginForm.patchValue({ emailOrPhone: this.initialEmail });\n    }\n    if (this.initialPassword) {\n      this.loginForm.patchValue({ password: this.initialPassword });\n    }\n  }'
        );
    }
}

fs.writeFileSync(formPath, formContent);
console.log('Updated login-form.component.ts to patch values');
