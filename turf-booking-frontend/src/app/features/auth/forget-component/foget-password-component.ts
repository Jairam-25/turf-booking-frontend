import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-foget-password-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './foget-password-component.html',
  styleUrl: './foget-password-component.css',
})
export class FogetPasswordComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

  }

  onSubmit() {

    if (this.form.invalid) return;

    this.authService.forgotPassword(this.form.value.email)
      .subscribe({
        next: (res) => {
          console.log('Reset token generated:', res);
        },
        error: (err) => {
          console.log(err.error);
        }
      });

  }
}
