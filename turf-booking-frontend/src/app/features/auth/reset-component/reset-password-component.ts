import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password-component',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reset-password-component.html',
  styleUrl: './reset-password-component.css',
})
export class ResetPasswordComponent {
   form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.form = this.fb.group({
      token: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

  }

  onSubmit() {

    if (this.form.invalid) return;

    this.authService.resetPassword(this.form.value)
      .subscribe({
        next: (res) => {
          console.log('Password reset success:', res);
        },
        error: (err) => {
          console.log(err.error);
        }
      });

  }
}
