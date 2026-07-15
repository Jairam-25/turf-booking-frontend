import { Injectable, signal } from '@angular/core';

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  date: Date;
  read: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class InAppNotificationService {
  private _notifications = signal<AppNotification[]>([]);
  public notifications = this._notifications.asReadonly();
  
  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('turfxpert_notifications');
      if (stored) {
        try {
          const parsed = JSON.parse(stored).map((n: any) => ({
            ...n,
            date: new Date(n.date)
          }));
          this._notifications.set(parsed);
        } catch (e) {
          console.error('Failed to parse notifications', e);
        }
      }
    }
  }

  private saveToStorage(notifications: AppNotification[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('turfxpert_notifications', JSON.stringify(notifications));
    }
  }

  addNotification(title: string, body: string) {
    const newNotif: AppNotification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title,
      body,
      date: new Date(),
      read: false
    };
    
    const current = this._notifications();
    const updated = [newNotif, ...current].slice(0, 50); // Keep last 50
    this._notifications.set(updated);
    this.saveToStorage(updated);
  }

  markAsRead(id: string) {
    const current = this._notifications();
    const updated = current.map(n => n.id === id ? { ...n, read: true } : n);
    this._notifications.set(updated);
    this.saveToStorage(updated);
  }

  markAllAsRead() {
    const current = this._notifications();
    const updated = current.map(n => ({ ...n, read: true }));
    this._notifications.set(updated);
    this.saveToStorage(updated);
  }

  getUnreadCount(): number {
    return this._notifications().filter(n => !n.read).length;
  }
}
