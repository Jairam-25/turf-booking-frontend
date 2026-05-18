import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { AuthResponse } from '../../domain/models/user.model';
import { AuthResponseDto, LoginRequestDto, RegisterRequestDto } from '../dtos/auth.dto';
import { AuthMapper } from '../mappers/auth.mapper';

@Injectable({
  providedIn: 'root'
})
export class AuthRepositoryImpl implements AuthRepository {
  private apiUrl = 'https://localhost:7273/api/Auth';

  constructor(private http: HttpClient) {}

  login(credentials: LoginRequestDto): Observable<AuthResponse> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(
        map(response => {
          const dto = response.data || response.Data || response.value || response.Value;
          return AuthMapper.fromDto(dto);
        })
      );
  }

  register(data: RegisterRequestDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, data)
      .pipe(
        map(response => response.data || response.Data || response.value || response.Value)
      );
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/forgot-password`, { email })
      .pipe(map(response => response.data || response.Data || response.value || response.Value || response.message || response.Message || response));
  }

  resetPassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/reset-password`, data)
      .pipe(map(response => response.data || response.Data || response.value || response.Value || response.message || response.Message || response));
  }
}
