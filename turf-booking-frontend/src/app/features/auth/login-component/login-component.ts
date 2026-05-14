import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth-service';
import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',

  imports: [
    CommonModule,
    ReactiveFormsModule
  ],

  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})

export class LoginComponent {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {

    this.loginForm = this.fb.group({

      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required, Validators.minLength(6)]

    });

  }

  onSubmit() {

    console.log(this.loginForm.value);

  }

}