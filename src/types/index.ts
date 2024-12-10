import { WebSocket } from 'ws';

export type NostrEventKind = number;

export interface NostrEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export type NostrWSMessage = [string, ...any[]];

export interface Logger {
  info: (message: string, ...args: any[]) => void;
  warn: (message: string, ...args: any[]) => void;
  error: (message: string, ...args: any[]) => void;
  debug: (message: string, ...args: any[]) => void;
}

export interface EnhancedWebSocket extends WebSocket {
  id: string;
  isAlive: boolean;
  subscriptions?: Set<string>;
}

export type NostrWSValidationResult = {
  valid: boolean;
  error?: string;
}

export enum NostrWSConnectionState {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

export type NostrWSHandlers = {
  message: (ws: EnhancedWebSocket, message: NostrWSMessage | any) => Promise<void> | void;
  error: (ws: EnhancedWebSocket, error: Error) => void;
  close: (ws: EnhancedWebSocket) => void;
}

export type NostrWSOptions = {
  logger: Logger;
  handlers: NostrWSHandlers;
  heartbeatInterval?: number;
  maxReconnectAttempts?: number;
}

export type NostrWSStats = {
  totalConnections: number;
  authenticatedConnections: number;
  totalSubscriptions: number;
  uptime: number;
}

export type NostrWSSubscription = string;

export interface NostrWSClientEvents {
  message: (message: NostrWSMessage) => void;
  error: (error: Error) => void;
  close: () => void;
}

export interface NostrWSServerEvents {
  message: (ws: EnhancedWebSocket, message: NostrWSMessage) => void;
  error: (ws: EnhancedWebSocket, error: Error) => void;
  close: (ws: EnhancedWebSocket) => void;
}

export interface NostrWSServerOptions {
  logger?: Logger;
  handlers?: Partial<NostrWSServerEvents>;
}

export interface NostrWSClientOptions {
  logger?: Logger;
  handlers?: Partial<NostrWSClientEvents>;
  autoReconnect?: boolean;
  maxReconnectAttempts?: number;
  reconnectDelay?: number;
}

export interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  authenticated?: boolean;
  subscriptions?: Set<string>;
}
