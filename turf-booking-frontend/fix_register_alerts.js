const fs = require('fs');

let filePath = 'src/app/features/auth/register/ui/register-form.component.ts';
let content = fs.readFileSync(filePath, 'utf8');

// 1. Inject NotificationService
if (!content.includes('NotificationService')) {
    content = content.replace(
        "import { AuthRepository } from '../../../../domain/repositories/auth.repository';",
        "import { AuthRepository } from '../../../../domain/repositories/auth.repository';\nimport { NotificationService } from '../../../../core/services/notification.service';"
    );
    
    content = content.replace(
        "private authRepo = inject(AuthRepository);",
        "private authRepo = inject(AuthRepository);\n  private notificationService = inject(NotificationService);"
    );
}

// 2. Replace alerts
content = content.replace(
    "alert(err.error?.message || 'Failed to send OTP. User might already exist.');",
    "this.notificationService.show(err.error?.message || 'Failed to send OTP. User might already exist.', 'error');"
);
content = content.replace(
    "alert(err.error?.message || 'Invalid OTP');",
    "this.notificationService.show(err.error?.message || 'Invalid OTP', 'error');"
);

// 3. Replace STATE_DATA with a massive dictionary
const massiveStateData = `const STATE_DATA: Record<string, Record<string, string>> = {
  'Andhra Pradesh': {
    'Visakhapatnam': '530001', 'Vijayawada': '520001', 'Guntur': '522001', 'Nellore': '524001', 'Kurnool': '518001', 'Tirupati': '517501'
  },
  'Arunachal Pradesh': {
    'Itanagar': '791111', 'Tawang': '790104', 'Pasighat': '791102'
  },
  'Assam': {
    'Guwahati': '781001', 'Silchar': '788001', 'Dibrugarh': '786001', 'Jorhat': '785001', 'Tezpur': '784001'
  },
  'Bihar': {
    'Patna': '800001', 'Gaya': '823001', 'Bhagalpur': '812001', 'Muzaffarpur': '842001', 'Purnia': '854301'
  },
  'Chhattisgarh': {
    'Raipur': '492001', 'Bhilai': '490006', 'Bilaspur': '495001', 'Korba': '495677'
  },
  'Goa': {
    'Panaji': '403001', 'Margao': '403601', 'Vasco da Gama': '403802'
  },
  'Gujarat': {
    'Ahmedabad': '380001', 'Surat': '395001', 'Vadodara': '390001', 'Rajkot': '360001', 'Gandhinagar': '382010'
  },
  'Haryana': {
    'Gurugram': '122001', 'Faridabad': '121001', 'Panipat': '132103', 'Ambala': '133001', 'Rohtak': '124001'
  },
  'Himachal Pradesh': {
    'Shimla': '171001', 'Dharamshala': '176215', 'Mandi': '175001', 'Solan': '173212'
  },
  'Jharkhand': {
    'Ranchi': '834001', 'Jamshedpur': '831001', 'Dhanbad': '826001', 'Bokaro': '827001'
  },
  'Karnataka': {
    'Bengaluru': '560001', 'Mysuru': '570001', 'Mangaluru': '575001', 'Hubballi': '580001', 'Belagavi': '590001', 'Kalaburagi': '585101'
  },
  'Kerala': {
    'Thiruvananthapuram': '695001', 'Kochi': '682001', 'Kozhikode': '673001', 'Thrissur': '680001', 'Kollam': '691001', 'Kannur': '670001'
  },
  'Madhya Pradesh': {
    'Indore': '452001', 'Bhopal': '462001', 'Jabalpur': '482001', 'Gwalior': '474001', 'Ujjain': '456001'
  },
  'Maharashtra': {
    'Mumbai': '400001', 'Pune': '411001', 'Nagpur': '440001', 'Nashik': '422001', 'Thane': '400601', 'Aurangabad': '431001'
  },
  'Manipur': {
    'Imphal': '795001', 'Churachandpur': '795128', 'Thoubal': '795138'
  },
  'Meghalaya': {
    'Shillong': '793001', 'Tura': '794001', 'Jowai': '793150'
  },
  'Mizoram': {
    'Aizawl': '796001', 'Lunglei': '796701', 'Champhai': '796321'
  },
  'Nagaland': {
    'Kohima': '797001', 'Dimapur': '797112', 'Mokokchung': '798601'
  },
  'Odisha': {
    'Bhubaneswar': '751001', 'Cuttack': '753001', 'Rourkela': '769001', 'Berhampur': '760001', 'Sambalpur': '768001'
  },
  'Punjab': {
    'Ludhiana': '141001', 'Amritsar': '143001', 'Jalandhar': '144001', 'Patiala': '147001', 'Bathinda': '151001'
  },
  'Rajasthan': {
    'Jaipur': '302001', 'Jodhpur': '342001', 'Kota': '324001', 'Bikaner': '334001', 'Udaipur': '313001'
  },
  'Sikkim': {
    'Gangtok': '737101', 'Namchi': '737126', 'Gyalshing': '737111'
  },
  'Tamil Nadu': {
    'Chennai': '600001', 'Coimbatore': '641001', 'Madurai': '625001', 'Tiruchirappalli': '620001', 'Salem': '636001', 'Tirunelveli': '627001', 'Vellore': '632001', 'Erode': '638001', 'Thoothukudi': '628001'
  },
  'Telangana': {
    'Hyderabad': '500001', 'Warangal': '506001', 'Nizamabad': '503001', 'Karimnagar': '505001', 'Khammam': '507001'
  },
  'Tripura': {
    'Agartala': '799001', 'Dharmanagar': '799250', 'Udaipur': '799120'
  },
  'Uttar Pradesh': {
    'Lucknow': '226001', 'Kanpur': '208001', 'Ghaziabad': '201001', 'Agra': '282001', 'Varanasi': '221001', 'Meerut': '250001', 'Prayagraj': '211001'
  },
  'Uttarakhand': {
    'Dehradun': '248001', 'Haridwar': '249401', 'Roorkee': '247667', 'Haldwani': '263139', 'Rudrapur': '263153'
  },
  'West Bengal': {
    'Kolkata': '700001', 'Howrah': '711101', 'Darjeeling': '734101', 'Siliguri': '734001', 'Asansol': '713301', 'Durgapur': '713201'
  },
  'Delhi': {
    'New Delhi': '110001', 'North Delhi': '110007', 'South Delhi': '110016', 'East Delhi': '110092', 'West Delhi': '110027'
  },
  'Jammu and Kashmir': {
    'Srinagar': '190001', 'Jammu': '180001', 'Anantnag': '192101', 'Baramulla': '193101'
  }
};`;

// Replace the old STATE_DATA block
content = content.replace(/const STATE_DATA: Record<string, Record<string, string>> = \{[\s\S]*?\};\n\n@Component/, massiveStateData + '\n\n@Component');

fs.writeFileSync(filePath, content);
console.log('Fixed register alerts and injected massive State/District list.');
