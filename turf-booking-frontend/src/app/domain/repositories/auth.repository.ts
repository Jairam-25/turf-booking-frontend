import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(credentials: any): Observable<AuthResponse>;
  abstract register(data: any): Observable<string>;
  abstract forgotPassword(email: string): Observable<string>;
  abstract resetPassword(data: any): Observable<string>;
  abstract sendOtp(emailOrPhone: string): Observable<string>;
  abstract verifyOtp(emailOrPhone: string, otpCode: string): Observable<AuthResponse>;
  /** Google Sign-In: send idToken to backend; backend sends OTP to registered email */
  abstract sendGoogleOtp(idToken: string, email: string, displayName: string): Observable<string>;
  /** Verify the OTP that was sent after Google account selection */
  abstract verifyGoogleOtp(email: string, otpCode: string): Observable<AuthResponse>;
  abstract refreshToken(data: { token: string, refreshToken: string }): Observable<AuthResponse>;
}
