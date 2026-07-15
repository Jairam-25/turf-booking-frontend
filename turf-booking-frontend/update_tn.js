const fs = require('fs');

let filePath = 'src/app/features/auth/register/ui/register-form.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

const newTN = `'Tamil Nadu': {
    'Ariyalur': '621704',
    'Chengalpattu': '603001',
    'Chennai': '600001',
    'Coimbatore': '641001',
    'Cuddalore': '607001',
    'Dharmapuri': '636701',
    'Dindigul': '624001',
    'Erode': '638001',
    'Kallakurichi': '606202',
    'Kanchipuram': '631501',
    'Kanyakumari': '629001',
    'Karur': '639001',
    'Krishnagiri': '635001',
    'Madurai': '625001',
    'Mayiladuthurai': '609001',
    'Nagapattinam': '611001',
    'Namakkal': '637001',
    'Nilgiris': '643001',
    'Perambalur': '621212',
    'Pudukkottai': '622001',
    'Ramanathapuram': '623501',
    'Ranipet': '632401',
    'Salem': '636001',
    'Sivaganga': '630561',
    'Tenkasi': '627811',
    'Thanjavur': '613001',
    'Theni': '625531',
    'Thoothukudi': '628001',
    'Tiruchirappalli': '620001',
    'Tirunelveli': '627001',
    'Tirupathur': '635601',
    'Tiruppur': '641601',
    'Tiruvallur': '602001',
    'Tiruvannamalai': '606601',
    'Tiruvarur': '610001',
    'Vellore': '632001',
    'Viluppuram': '605602',
    'Virudhunagar': '626001'
  }`;

content = content.replace(/'Tamil Nadu':\s*\{[^}]+\}/, newTN);

fs.writeFileSync(filePath, content);
console.log('Updated Tamil Nadu with all 38 districts.');
