import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login-component/login-component';
import { RegisterComponent } from './features/auth/register-component/register-component';
import { FogetPasswordComponent } from './features/auth/forget-component/foget-password-component';
import { ResetPasswordComponent } from './features/auth/reset-component/reset-password-component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: FogetPasswordComponent },
  { path: 'reset-password', component: ResetPasswordComponent }
];

export const routes: Routes = [
  {
    path: 'auth',
    children: authRoutes
  }
];