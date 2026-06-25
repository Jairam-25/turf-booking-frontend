import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
 selector: 'app-toast',
 standalone: true,
 imports: [CommonModule],
 template: `
 <div class="toast-container">
 <div 
 *ngFor="let n of notificationService.notifications()" 
 class="toast toast-themed" 
 [ngClass]="n.type"
 (click)="notificationService.remove(n.id)"
 >
 <div class="toast-icon">
 <i *ngIf="n.type === 'success'" class="icon-check">✓</i>
 <i *ngIf="n.type === 'error'" class="icon-error">✕</i>
 <i *ngIf="n.type === 'info'" class="icon-info">ℹ</i>
 <i *ngIf="n.type === 'warning'" class="icon-warning">⚠</i>
 </div>
 <div class="toast-content">
 <p>{{ n.message }}</p>
 </div>
 <button class="toast-close">&times;</button>
 </div>
 </div>
 `,
 styles: [`
 .toast-container {
 position: fixed;
 top: 2rem;
 right: 2rem;
 z-index: 9999;
 display: flex;
 flex-direction: column;
 gap: 1rem;
 pointer-events: none;
 }

 .toast {
 pointer-events: auto;
 min-width: 300px;
 max-width: 450px;
 padding: 1rem 1.25rem;
 border-radius: 12px;
 display: flex;
 align-items: center;
 gap: 1rem;
 backdrop-filter: blur(10px);
 border-left: 5px solid var(--primary);
 animation: slideIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
 cursor: pointer;
 transition: all 0.2s ease;
 }

 .toast:hover {
 transform: translateY(-2px);
 box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
 }

 .toast.success { border-left-color: #22c55e; }
 .toast.error { border-left-color: #ef4444; }
 .toast.info { border-left-color: #3b82f6; }
 .toast.warning { border-left-color: #f59e0b; }

 .toast-icon {
 flex-shrink: 0;
 width: 28px;
 height: 28px;
 border-radius: 50%;
 display: flex;
 align-items: center;
 justify-content: center;
 font-size: 0.875rem;
 font-weight: bold;
 }

 .success .toast-icon { background: #dcfce7; color: #22c55e; }
 .error .toast-icon { background: #fee2e2; color: #ef4444; }
 .info .toast-icon { background: #dbeafe; color: #3b82f6; }
 .warning .toast-icon { background: #fef3c7; color: #f59e0b; }

 .toast-content {
 flex-grow: 1;
 }

 .toast-content p {
 margin: 0;
 font-size: 0.9375rem;
 font-weight: 500;
 }

 .toast-close {
 background: none;
 border: none;
 font-size: 1.25rem;
 cursor: pointer;
 padding: 0;
 line-height: 1;
 }

 @keyframes slideIn {
 from {
 opacity: 0;
 transform: translateX(100%) scale(0.9);
 }
 to {
 opacity: 1;
 transform: translateX(0) scale(1);
 }
 }
 `]
})
export class ToastComponent {
 constructor(public notificationService: NotificationService) {}
}
