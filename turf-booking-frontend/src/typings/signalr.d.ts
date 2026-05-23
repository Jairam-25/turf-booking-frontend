declare namespace signalR {
  export class HubConnection {
    start(): Promise<void>;
    stop(): Promise<void>;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
    invoke(methodName: string, ...args: any[]): Promise<any>;
  }

  export class HubConnectionBuilder {
    withUrl(url: string, options?: any): HubConnectionBuilder;
    withAutomaticReconnect(): HubConnectionBuilder;
    configureLogging(level: LogLevel): HubConnectionBuilder;
    build(): HubConnection;
  }

  export enum LogLevel {
    Trace,
    Debug,
    Information,
    Warning,
    Error,
    Critical,
    None
  }
}

declare module '@microsoft/signalr' {
  export = signalR;
}
