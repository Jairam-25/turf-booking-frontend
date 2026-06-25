import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/auth/welcome/welcome.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { roleGuard } from './core/guards/role.guard';

export const authRoutes: Routes = [
 { path: '', component: WelcomeComponent, canActivate: [guestGuard] },
 { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
 { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
 { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
 { path: 'reset-password', component: ResetPasswordComponent }
];

export const routes: Routes = [
 { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
 {
 path: 'auth',
 children: authRoutes
 },
 {
 path: 'home',
 loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
 },
 {
 path: 'bookings',
 loadComponent: () => import('./features/bookings/bookings.component').then(m => m.BookingsComponent),
 canActivate: [authGuard]
 },
 { 
 path: 'dashboard', 
 loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
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
 },
 {
 path: 'payment',
 loadComponent: () => import('./features/dashboard/payment/payment.component').then(m => m.PaymentComponent),
 canActivate: [authGuard]
 },
 {
 path: 'profile',
 loadComponent: () => import('./features/profile/profile').then(m => m.ProfileComponent),
 canActivate: [authGuard]
 },
 {
 path: 'liked-turfs',
 loadComponent: () => import('./features/liked-turfs/liked-turfs').then(m => m.LikedTurfsComponent),
 canActivate: [authGuard]
 },
 {
 path: 'leaderboard',
 loadComponent: () => import('./features/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent),
 canActivate: [authGuard]
 },
 {
 path: 'owner-dashboard',
 loadComponent: () => import('./features/owner-dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent),
 canActivate: [authGuard, roleGuard],
 data: { roles: ['Owner', 'SuperAdmin'] }
 },
 {
 path: 'superadmin',
 loadComponent: () => import('./features/superadmin-dashboard/superadmin-dashboard.component').then(m => m.SuperadminDashboardComponent),
 canActivate: [authGuard, roleGuard],
 data: { roles: ['SuperAdmin'] }
 },
 {
 path: 'become-owner',
 loadComponent: () => import('./features/become-owner/become-owner.component').then(m => m.BecomeOwnerComponent),
 canActivate: [authGuard]
 },
 {
 path: 'about',
 loadComponent: () => import('./features/about/about').then(m => m.About)
 },
 {
 path: 'privacy-policy',
 loadComponent: () => import('./features/privacy-policy/privacy-policy').then(m => m.PrivacyPolicy)
 },
 {
 path: 'terms-of-service',
 loadComponent: () => import('./features/terms-of-service/terms-of-service').then(m => m.TermsOfService)
 }
];
