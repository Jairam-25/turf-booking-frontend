import { Component, EventEmitter, Input, Output, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MagicShinyButtonComponent } from '../../../../shared/components/magic-ui/magic-shiny-button/magic-shiny-button.component';
import { AuthRepository } from '../../../../domain/repositories/auth.repository';
import { NotificationService } from '../../../../core/services/notification.service';

const STATE_DATA: Record<string, Record<string, string>> = {
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
};

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MagicShinyButtonComponent],
  template: `
  <div class="register-form">
    <!-- Step 1: Email Verification -->
    <div *ngIf="currentStep() === 1" class="step-container animate-fade-in-up">
      <div class="form-group">
        <label for="email">Enter Email for Verification</label>
        <input 
          id="email" 
          type="email" 
          [formControl]="emailControl" 
          placeholder="name@example.com"
          (keydown.space)="$event.preventDefault()"
        >
      </div>
      <magic-shiny-button [loading]="isSendingOtp()" (click)="sendOtp()" [disabled]="emailControl.invalid">
        Send OTP
      </magic-shiny-button>
      <div class="form-footer" style="display: flex; flex-direction: column; gap: 0.4rem; align-items: center; margin-top: 1rem;">
        <p style="margin: 0;">Already have an account? <a routerLink="/auth/login" style="color: #3b82f6; font-weight: 600;">Sign in</a></p>
      </div>
    </div>

    <!-- Step 2: OTP Entry -->
    <div *ngIf="currentStep() === 2" class="step-container animate-fade-in-up">
      <p class="text-sm text-[var(--text-secondary)] mb-4">An OTP has been sent to 
  <strong (click)="copyEmail()" title="Click to copy email" style="cursor: pointer; text-decoration: underline; display: inline-flex; align-items: center; gap: 4px;">
    {{ emailControl.value }}
    <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
  </strong>. Please enter it below.</p>
      <div class="form-group">
        <label>Enter 6-digit OTP</label>
        <input 
          type="text" 
          [formControl]="otpControl" 
          placeholder="123456"
          maxlength="6"
        >
      </div>
      <magic-shiny-button [loading]="isVerifyingOtp()" (click)="verifyOtp()" [disabled]="otpControl.invalid || otpControl.value?.length !== 6">
        Verify OTP
      </magic-shiny-button>
      <div class="text-center mt-3">
        <button class="text-xs text-[var(--primary)] hover:underline bg-transparent border-none cursor-pointer" (click)="currentStep.set(1)">Change Email</button>
      </div>
    </div>

    <!-- Step 3: Registration Form -->
    <form *ngIf="currentStep() === 3" [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="animate-fade-in-up flex flex-col gap-3">
      
      <div class="form-group">
        <label>Full Name</label>
        <input type="text" formControlName="name" placeholder="John Doe">
      </div>

      <div class="form-group">
        <label>Phone Number</label>
        <div class="phone-input-group">
          <select class="country-code glass" formControlName="countryCode">
            <option value="+91">🇮🇳 +91</option>
            <option value="+971">🇦🇪 +971</option>
          </select>
          <input type="tel" formControlName="phoneNumber" placeholder="9876543210">
        </div>
      </div>

      <div class="form-group">
        <label>State</label>
        <select formControlName="state" class="glass-select" (change)="onStateChange()">
          <option value="">Select State</option>
          <option *ngFor="let state of availableStates" [value]="state">{{ state }}</option>
        </select>
      </div>

      <div class="flex gap-2 w-full">
        <div class="form-group flex-1">
          <label>District</label>
          <select formControlName="district" class="glass-select" (change)="onDistrictChange()">
            <option value="">Select District</option>
            <option *ngFor="let dist of availableDistricts" [value]="dist">{{ dist }}</option>
          </select>
        </div>
        <div class="form-group flex-1">
          <label>Pincode</label>
          <input type="text" formControlName="pincode" placeholder="600001" readonly class="bg-black/20 text-[var(--text-secondary)]">
        </div>
      </div>

      <div class="form-group">
        <label>Create Password</label>
        <div class="password-input-container">
          <input [type]="showPassword() ? 'text' : 'password'" formControlName="password" placeholder="••••••••">
          <button type="button" class="eye-btn" (click)="showPassword.set(!showPassword())" tabindex="-1">
            <svg *ngIf="!showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <svg *ngIf="showPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>Confirm Password</label>
        <div class="password-input-container">
          <input [type]="showConfirmPassword() ? 'text' : 'password'" formControlName="confirmPassword" placeholder="••••••••">
          <button type="button" class="eye-btn" (click)="showConfirmPassword.set(!showConfirmPassword())" tabindex="-1">
            <svg *ngIf="!showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            <svg *ngIf="showConfirmPassword()" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
          </button>
        </div>
      </div>

      <p *ngIf="errorMessage()" class="error-text text-center">{{ errorMessage() }}</p>

      <magic-shiny-button type="submit" [loading]="loading">
        Complete Registration
      </magic-shiny-button>
    </form>
  </div>
  `,
  styles: [`
  .register-form {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .step-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  input, .glass-select {
    padding: 12px 16px;
    font-size: 0.95rem;
    background: rgba(0, 0, 0, 0.05);
    border: 1px solid var(--border-color);
    color: var(--text-primary);
    border-radius: 12px;
    outline: none;
    transition: all 0.3s;
    width: 100%;
  }
  .dark input, .dark .glass-select {
    background: rgba(255, 255, 255, 0.05);
  }
  input:focus, .glass-select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(123, 57, 252, 0.15);
  }
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .phone-input-group {
    display: flex;
    gap: 8px;
  }
  .country-code {
    width: 100px;
  }
  .password-input-container {
    position: relative;
    display: flex;
    align-items: center;
  }
  .eye-btn {
    position: absolute;
    right: 12px;
    background: transparent;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .eye-btn svg { width: 20px; height: 20px; }
  .error-text { color: #ef4444; font-size: 0.8rem; margin-top: 0.2rem; }
  `]
})
export class RegisterFormComponent implements OnInit {
  @Input() loading = false;
  @Input() initialEmail = '';
  @Input() initialName = '';
  @Input() initialPhone = '';
  @Output() register = new EventEmitter<any>();

  private fb = inject(FormBuilder);
  private authRepo = inject(AuthRepository);
  private notificationService = inject(NotificationService);

  currentStep = signal<1 | 2 | 3>(1);
  isSendingOtp = signal(false);
  isVerifyingOtp = signal(false);
  errorMessage = signal('');

  emailControl = this.fb.control('', [Validators.required, Validators.email]);
  otpControl = this.fb.control('', [Validators.required, Validators.minLength(6)]);

  registerForm: FormGroup;
  showPassword = signal(false);
  showConfirmPassword = signal(false);

  availableStates = Object.keys(STATE_DATA);
  availableDistricts: string[] = [];

  constructor() {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: [''], // Will be set after verification
      countryCode: ['+91'],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[6-9]\\d{9}$')]],
      state: ['', Validators.required],
      district: ['', Validators.required],
      pincode: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required]
    });
  }

  ngOnInit() {
    if (this.initialEmail) {
      this.emailControl.setValue(this.initialEmail);
    }
  }

  sendOtp() {
    if (this.emailControl.invalid) return;
    this.isSendingOtp.set(true);
    
    this.authRepo.sendRegistrationOtp(this.emailControl.value!).subscribe({
      next: () => {
        this.isSendingOtp.set(false);
        this.currentStep.set(2);
        this.errorMessage.set('');
      },
      error: (err) => {
        this.isSendingOtp.set(false);
        this.notificationService.show(err.error?.message || 'Failed to send OTP. User might already exist.', 'error');
      }
    });
  }

  verifyOtp() {
    if (this.otpControl.invalid) return;
    this.isVerifyingOtp.set(true);

    this.authRepo.verifyRegistrationOtp(this.emailControl.value!, this.otpControl.value!).subscribe({
      next: () => {
        this.isVerifyingOtp.set(false);
        this.currentStep.set(3);
        this.registerForm.patchValue({ email: this.emailControl.value });
        this.errorMessage.set('');
      },
      error: (err) => {
        this.isVerifyingOtp.set(false);
        this.notificationService.show(err.error?.message || 'Invalid OTP', 'error');
      }
    });
  }

  onStateChange() {
    const state = this.registerForm.get('state')?.value;
    if (state && STATE_DATA[state]) {
      this.availableDistricts = Object.keys(STATE_DATA[state]);
      this.registerForm.patchValue({ district: '', pincode: '' });
    } else {
      this.availableDistricts = [];
    }
  }

  onDistrictChange() {
    const state = this.registerForm.get('state')?.value;
    const district = this.registerForm.get('district')?.value;
    if (state && district && STATE_DATA[state][district]) {
      this.registerForm.patchValue({ pincode: STATE_DATA[state][district] });
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.errorMessage.set('Passwords do not match');
        return;
      }
      this.errorMessage.set('');
      this.register.emit(this.registerForm.value);
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
