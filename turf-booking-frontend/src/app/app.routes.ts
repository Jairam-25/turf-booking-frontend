import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/auth/welcome/welcome.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const authRoutes: Routes = [
  { path: '', component: WelcomeComponent, canActivate: [guestGuard] },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'reset-password', component: ResetPasswordComponent }
];

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    children: authRoutes
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'bookings',
    loadComponent: () => import('./features/bookings/bookings.component').then(m => m.BookingsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'offers',
    loadComponent: () => import('./features/offers/offers.component').then(m => m.OffersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'reviews',
    loadComponent: () => import('./features/reviews/reviews.component').then(m => m.ReviewsComponent),
    canActivate: [authGuard]
  },
  {
    path: 'support',
    loadComponent: () => import('./features/support/support.component').then(m => m.SupportComponent),
    canActivate: [authGuard]
  },
  {
    path: 'dashboard/turf/:id',
    loadComponent: () => import('./features/dashboard/turf-detail/turf-detail.component').then(m => m.TurfDetailComponent),
    canActivate: [authGuard]
  }
];