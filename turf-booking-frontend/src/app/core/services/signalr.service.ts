import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthStore } from './auth.store';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class SignalrService {
 private connection: signalR.HubConnection | null = null;
 private hubUrl = 'https://turf-booking-backend-fixl.onrender.com/hubs/slots';
 public reconnected$ = new Subject<void>();

 constructor(private auth: AuthStore, private notificationService: NotificationService) {
 this.init();
 }

 private startPromise: Promise<void> | null = null;

 private init() {
 this.connection = (new signalR.HubConnectionBuilder()
 .withUrl(this.hubUrl, { accessTokenFactory: () => this.auth.token() || '' }) as any)
 .withAutomaticReconnect([0, 2000, 5000, 10000, null])
 .configureLogging(signalR.LogLevel.Warning)
 .build();

 if (this.connection) {
 const conn = this.connection as any;
 conn.onreconnecting((error?: Error) => {
 this.notificationService.warning('Live availability connection lost. Reconnecting...');
 });

 conn.onreconnected((connectionId?: string) => {
 this.notificationService.success('Live availability reconnected.');
 this.reconnected$.next();
 });

 conn.onclose((error?: Error) => {
 if (error) {
 this.notificationService.error('Live availability disconnected. Please refresh the page.');
 }
 });
 this.startPromise = this.connection.start();
 this.startPromise.catch(() => {
 // swallow startup errors; will try connecting on demand
 });
 }
 }

 private async ensureConnected() {
 if (!this.connection) {
 this.init();
 }
 if (!this.connection) return;

 if (this.connection.state === signalR.HubConnectionState.Disconnected) {
 this.startPromise = this.connection.start();
 try {
 await this.startPromise;
 } catch (err) {
 // SignalR start failed
 this.startPromise = null;
 }
 } else if (this.connection.state === signalR.HubConnectionState.Connecting) {
 if (this.startPromise) {
 try {
 await this.startPromise;
 } catch {}
 } else {
 // Fallback waiting for connection status
 let retries = 20;
 while (this.connection.state === signalR.HubConnectionState.Connecting && retries > 0) {
 await new Promise(resolve => setTimeout(resolve, 100));
 retries--;
 }
 }
 }
 }

 async joinTurfGroup(turfId: string) {
 try {
 await this.ensureConnected();
 if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
 await this.connection.invoke('JoinTurfGroup', turfId);
 } else {
 // SignalR connection is not connected
 }
 } catch (err) {
 // SignalR JoinTurfGroup failed
 }
 }

 async leaveTurfGroup(turfId: string) {
 try {
 await this.ensureConnected();
 if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
 await this.connection.invoke('LeaveTurfGroup', turfId);
 }
 } catch (err) {
 // SignalR LeaveTurfGroup failed
 }
 }

 on(event: string, cb: (...args: any[]) => void) {
 this.connection?.on(event, cb);
 }

 off(event: string, cb?: (...args: any[]) => void) {
 if (!this.connection) return;
 if (cb) this.connection.off(event, cb);
 else this.connection.off(event);
 }
}
