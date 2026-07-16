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

 addNotification(notification: Omit<InboxNotification, 'id' | 'time' | 'isRead'> & { time?: string }) {
    const newNotification: InboxNotification = {
      id: Math.floor(Math.random() * 1000000),
      time: new Date().toISOString(),
      isRead: false,
      ...notification
    };
    this._notifications.update(n => [newNotification, ...n]);
  }

  markAsRead(id: number) {
 this._notifications.update(nots => nots.map(n => n.id === id ? { ...n, isRead: true } : n));
 }

 markAllAsRead() {
 this._notifications.update(nots => nots.map(n => ({ ...n, isRead: true })));
 }
}
