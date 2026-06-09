import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../domain/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private _user = signal<User | null>(this.loadUserFromStorage());
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _refreshToken = signal<string | null>(localStorage.getItem('refreshToken'));

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem('user');
    return userJson ? JSON.parse(userJson) : null;
  }

  user = this._user.asReadonly();
  token = this._token.asReadonly();
  refreshToken = this._refreshToken.asReadonly();
  isLoggedIn = computed(() => !!this._token());

  setSession(user: User, token: string, refreshToken: string) {
    this._user.set(user);
    this._token.set(token);
    this._refreshToken.set(refreshToken);
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
  }

  clearSession() {
    this._user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  updateUser(updates: Partial<User>) {
    const currentUser = this._user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this._user.set(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  }

  // Optional: Add logic to fetch user profile if token exists but user is null
}
