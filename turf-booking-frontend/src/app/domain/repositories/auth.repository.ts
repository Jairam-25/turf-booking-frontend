import { Observable } from 'rxjs';
import { AuthResponse } from '../models/user.model';

export abstract class AuthRepository {
  abstract login(credentials: any): Observable<AuthResponse>;
  abstract register(data: any): Observable<any>;
  abstract forgotPassword(email: string): Observable<any>;
  abstract resetPassword(data: any): Observable<any>;
}
