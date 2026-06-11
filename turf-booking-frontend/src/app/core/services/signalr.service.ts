import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthStore } from './auth.store';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private connection: signalR.HubConnection | null = null;
  private hubUrl = 'https://localhost:7273/hubs/slots';

  constructor(private auth: AuthStore, private notificationService: NotificationService) {
    this.init();
  }

  private startPromise: Promise<void> | null = null;

  private init() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, { accessTokenFactory: () => this.auth.token() || '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    if (this.connection) {
      const conn = this.connection as any;
      conn.onreconnecting((error?: Error) => {
        this.notificationService.warning('Live availability connection lost. Reconnecting...');
      });

      conn.onreconnected((connectionId?: string) => {
        this.notificationService.success('Live availability reconnected.');
      });

      conn.onclose((error?: Error) => {
        if (error) {
          this.notificationService.error('Live availability disconnected. Please refresh the page.');
        }
      });
    }

    this.startPromise = this.connection.start();
    this.startPromise.catch(() => {
      // swallow startup errors; will try connecting on demand
    });
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
        console.warn('SignalR start failed:', err);
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
        console.warn('SignalR connection is not connected, state:', this.connection?.state);
      }
    } catch (err) {
      console.warn('SignalR JoinTurfGroup failed:', err);
    }
  }

  async leaveTurfGroup(turfId: string) {
    try {
      await this.ensureConnected();
      if (this.connection && this.connection.state === signalR.HubConnectionState.Connected) {
        await this.connection.invoke('LeaveTurfGroup', turfId);
      }
    } catch (err) {
      console.warn('SignalR LeaveTurfGroup failed:', err);
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
