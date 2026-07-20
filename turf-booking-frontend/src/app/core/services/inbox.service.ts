import { Injectable, signal, computed } from '@angular/core';

export interface InboxNotification {
 id: number;
 title: string;
 message: string;
 time: string;
 isRead: boolean;
 type: string;
}

@Injectable({
 providedIn: 'root'
})
export class InboxService {
  private _notifications = signal<InboxNotification[]>([]);
  notifications = this._notifications.asReadonly();
  unreadCount = computed(() => this._notifications().filter(n => !n.isRead).length);

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('turfxpert_inbox');
      if (stored) {
        try {
          this._notifications.set(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse inbox notifications', e);
        }
      }
    }
  }

  private saveToStorage(notifications: InboxNotification[]) {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('turfxpert_inbox', JSON.stringify(notifications));
    }
  }

  addNotification(notification: Omit<InboxNotification, 'id' | 'time' | 'isRead'> & { time?: string }) {
    const newNotification: InboxNotification = {
      id: Math.floor(Math.random() * 1000000),
      time: notification.time || new Date().toISOString(),
      isRead: false,
      ...notification
    };
    
    this._notifications.update(n => {
      const updated = [newNotification, ...n].slice(0, 50);
      this.saveToStorage(updated);
      return updated;
    });
  }

  markAsRead(id: number) {
    this._notifications.update(nots => {
      const updated = nots.map(n => n.id === id ? { ...n, isRead: true } : n);
      this.saveToStorage(updated);
      return updated;
    });
  }

  markAllAsRead() {
    this._notifications.update(nots => {
      const updated = nots.map(n => ({ ...n, isRead: true }));
      this.saveToStorage(updated);
      return updated;
    });
  }
}
