import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { AuthStore } from './auth.store';

@Injectable({ providedIn: 'root' })
export class SignalrService {
  private connection: signalR.HubConnection | null = null;
  private hubUrl = 'https://localhost:7273/hubs/slots';

  constructor(private auth: AuthStore) {
    this.init();
  }

  private init() {
    const token = this.auth.token();

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl, { accessTokenFactory: () => token || '' })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    this.connection.start().catch(() => {
      // swallow startup errors; reconnection will be attempted automatically
    });
  }

  async joinTurfGroup(turfId: string) {
    if (!this.connection) return;
    try {
      await this.connection.invoke('JoinTurfGroup', turfId);
    } catch {
      // ignore
    }
  }

  async leaveTurfGroup(turfId: string) {
    if (!this.connection) return;
    try {
      await this.connection.invoke('LeaveTurfGroup', turfId);
    } catch {
      // ignore
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
