import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(credentials: any): Observable<AuthResponse>;
  abstract register(data: any): Observable<string>;
  abstract forgotPassword(email: string): Observable<string>;
  abstract resetPassword(data: any): Observable<string>;
  abstract sendOtp(emailOrPhone: string): Observable<string>;
  abstract verifyOtp(emailOrPhone: string, otpCode: string): Observable<AuthResponse>;
  /** Google Sign-In: directly authenticate via idToken */
  abstract googleSignIn(idToken: string): Observable<any>;
  abstract refreshToken(data: { token: string, refreshToken: string }): Observable<AuthResponse>;
}
