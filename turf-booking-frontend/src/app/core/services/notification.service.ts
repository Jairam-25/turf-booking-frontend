import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = signal<Notification[]>([]);
  notifications = this._notifications.asReadonly();
  private nextId = 0;

  show(message: string, type: NotificationType = 'info', duration: number = 5000) {
    const id = this.nextId++;
    const notification: Notification = { id, message, type };
    
    this._notifications.update(prev => [...prev, notification]);

    if (duration > 0) {
      setTimeout(() => this.remove(id), duration);
    }
  }

  success(message: string) { this.show(message, 'success'); }
  error(message: string) { this.show(message, 'error'); }
  info(message: string) { this.show(message, 'info'); }
  warning(message: string) { this.show(message, 'warning'); }

  remove(id: number) {
    this._notifications.update(prev => prev.filter(n => n.id !== id));
  }
}
