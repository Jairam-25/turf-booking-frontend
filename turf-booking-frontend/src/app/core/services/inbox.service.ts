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
  private _notifications = signal<InboxNotification[]>([
    { id: 1, title: 'Booking Confirmed', message: 'Your booking at Green Valley Turf for tomorrow at 6 PM is confirmed.', time: new Date(Date.now() - 3600000).toISOString(), isRead: false, type: 'success' },
    { id: 2, title: 'System Update', message: 'We have updated our terms of service. Please review them.', time: new Date(Date.now() - 86400000).toISOString(), isRead: true, type: 'info' },
    { id: 3, title: 'Promo Offer', message: 'Get 20% off on your next booking using code TURF20!', time: new Date(Date.now() - 172800000).toISOString(), isRead: false, type: 'warning' },
  ]);

  notifications = this._notifications.asReadonly();
  unreadCount = computed(() => this._notifications().filter(n => !n.isRead).length);

  markAsRead(id: number) {
    this._notifications.update(nots => nots.map(n => n.id === id ? { ...n, isRead: true } : n));
  }

  markAllAsRead() {
    this._notifications.update(nots => nots.map(n => ({ ...n, isRead: true })));
  }
}
