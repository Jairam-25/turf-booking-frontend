const fs = require('fs');

let intfPath = 'src/app/domain/repositories/auth.repository.ts';
let intfContent = fs.readFileSync(intfPath, 'utf8');
if (!intfContent.includes('sendRegistrationOtp')) {
    intfContent = intfContent.replace('abstract sendOtp(emailOrPhone: string): Observable<string>;', 
        'abstract sendOtp(emailOrPhone: string): Observable<string>;\n  abstract sendRegistrationOtp(emailOrPhone: string): Observable<string>;\n  abstract verifyRegistrationOtp(emailOrPhone: string, otpCode: string): Observable<boolean>;');
    fs.writeFileSync(intfPath, intfContent);
}

let implPath = 'src/app/data/repositories/auth.repository.impl.ts';
let implContent = fs.readFileSync(implPath, 'utf8');
if (!implContent.includes('sendRegistrationOtp')) {
    const methods = `
  sendRegistrationOtp(emailOrPhone: string): Observable<string> {
    return this.http.post<any>(\`\${this.apiUrl}/send-registration-otp\`, { emailOrPhone })
      .pipe(map(res => res.data));
  }

  verifyRegistrationOtp(emailOrPhone: string, otpCode: string): Observable<boolean> {
    return this.http.post<any>(\`\${this.apiUrl}/verify-registration-otp\`, { emailOrPhone, otpCode })
      .pipe(map(res => res.data));
  }
`;
    implContent = implContent.replace('sendOtp(emailOrPhone: string)', methods + '\n  sendOtp(emailOrPhone: string)');
    fs.writeFileSync(implPath, implContent);
}
console.log('Updated frontend auth repository');
