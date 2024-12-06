import type { WebSocket } from 'ws';

export type MessageType = 
  | 'subscribe'
  | 'unsubscribe'
  | 'event'
  | 'request'
  | 'response'
  | 'error'
  | 'status';

export interface NostrWSOptions {
  heartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  logger?: Logger;
}

export interface NostrWSMessage {
  type: string;
  id?: string;
  data: Record<string, unknown>;
}

export interface NostrWSSubscription {
  channel: string;
  filter?: any;
}

export interface NostrWSClientEvents {
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  message: (message: NostrWSMessage) => void;
  error: (error: Error) => void;
}

export interface NostrWSServerEvents {
  connection: (client: ExtendedWebSocket) => void;
  message: (message: NostrWSMessage, client: ExtendedWebSocket) => void;
  error: (error: Error) => void;
}

export interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  subscriptions?: Set<string>;
  messageQueue?: NostrWSMessage[];
  lastPing?: number;
  reconnectAttempts?: number;
}

export interface NostrWSValidationResult {
  isValid: boolean;
  error?: string;
}

export interface NostrWSConnectionState {
  isConnected: boolean;
  reconnectAttempts: number;
  lastError?: string;
}

export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}
