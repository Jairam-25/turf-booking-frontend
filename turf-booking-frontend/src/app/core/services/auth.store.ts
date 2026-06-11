import { Injectable, signal, computed } from '@angular/core';
import { User } from '../../domain/models/user.model';
import { STORAGE_KEYS } from '../constants/storage.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthStore {
  private _user = signal<User | null>(this.loadUserFromStorage());
  private _token = signal<string | null>(localStorage.getItem(STORAGE_KEYS.TOKEN));
  private _refreshToken = signal<string | null>(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN));

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem(STORAGE_KEYS.USER);
    if (!userJson) return null;
    try {
      return JSON.parse(userJson);
    } catch (e) {
      localStorage.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  }

  user = this._user.asReadonly();
  token = this._token.asReadonly();
  refreshToken = this._refreshToken.asReadonly();
  isLoggedIn = computed(() => !!this._token());

  isTokenExpired(): boolean {
    const t = this._token();
    if (!t) return true;
    try {
      const payload = JSON.parse(atob(t.split('.')[1]));
      return Date.now() >= payload.exp * 1000;
    } catch (e) {
      return true;
    }
  }

  setSession(user: User, token: string, refreshToken: string) {
    this._user.set(user);
    this._token.set(token);
    this._refreshToken.set(refreshToken);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  clearSession() {
    this._user.set(null);
    this._token.set(null);
    this._refreshToken.set(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  updateUser(updates: Partial<User>) {
    const currentUser = this._user();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      this._user.set(updatedUser);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updatedUser));
    }
  }

  // Optional: Add logic to fetch user profile if token exists but user is null
}
