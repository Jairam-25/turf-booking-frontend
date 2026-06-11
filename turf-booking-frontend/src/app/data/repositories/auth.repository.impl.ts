import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthResponse } from '../../domain/models/user.model';
import { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from '../dtos/auth.dto';
import { AuthMapper } from '../mappers/auth.mapper';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
  private apiUrl = `${environment.apiUrl}/Auth`;

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequestDto): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => AuthMapper.fromDto(response))
      );
  }

  register(data: RegisterRequestDto): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/register`, data);
  }

  forgotPassword(email: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(data: any): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset-password`, data);
  }

  sendOtp(emailOrPhone: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/send-otp`, { emailOrPhone });
  }

  verifyOtp(emailOrPhone: string, otpCode: string): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/verify-otp`, { emailOrPhone, otpCode })
      .pipe(
        map(response => AuthMapper.fromDto(response))
      );
  }

  /**
   * Step 1 of Google login: sends an OTP to the selected Gmail address using standard OTP.
   */
  sendGoogleOtp(idToken: string, email: string, displayName: string): Observable<string> {
    return this.sendOtp(email);
  }

  /**
   * Step 2 of Google login: verifies the OTP using the standard OTP endpoint.
   */
  verifyGoogleOtp(email: string, otpCode: string): Observable<AuthResponse> {
    return this.verifyOtp(email, otpCode);
  }

  refreshToken(data: { token: string, refreshToken: string }): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, data).pipe(
      map(response => AuthMapper.fromDto(response))
    );
  }
}
