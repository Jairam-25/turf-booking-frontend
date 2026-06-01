import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(credentials: any): Observable<AuthResponse>;
  abstract register(data: any): Observable<any>;
  abstract forgotPassword(email: string): Observable<any>;
  abstract resetPassword(data: any): Observable<any>;
  abstract sendOtp(emailOrPhone: string): Observable<any>;
  abstract verifyOtp(emailOrPhone: string, otpCode: string): Observable<AuthResponse>;
  /** Google Sign-In: send idToken to backend; backend sends OTP to registered email */
  abstract googleSignIn(idToken: string, email: string, displayName: string): Observable<any>;
  /** Verify the OTP that was sent after Google account selection */
  abstract googleVerifyOtp(email: string, otpCode: string): Observable<AuthResponse>;
}
