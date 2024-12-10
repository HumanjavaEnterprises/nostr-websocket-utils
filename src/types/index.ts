import { WebSocket } from 'ws';

export type NostrEventKind = number;

export interface NostrEvent {
  id?: string;
  pubkey?: string;
  created_at?: number;
  kind: NostrEventKind;
  tags: string[][];
  content: string;
  sig?: string;
}

export type NostrWSMessage = 
  | ['EVENT', NostrEvent]
  | ['REQ', string]
  | ['CLOSE', string]
  | ['AUTH', { pubkey: string }]
  | ['SUB', string]
  | ['UNSUB', string];

export interface EnhancedWebSocket extends WebSocket {
  id: string;
  pubkey?: string;
  authenticated: boolean;
  isAlive: boolean;
  subscriptions: Set<string>;
  connectedAt: Date;
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

export interface Logger {
  debug(message: string, ...meta: unknown[]): void;
  info(message: string, ...meta: unknown[]): void;
  warn(message: string, ...meta: unknown[]): void;
  error(message: string, ...meta: unknown[]): void;
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
  open: () => void;
  close: () => void;
  error: (error: Error) => void;
  message: (message: NostrWSMessage) => void;
}

export interface NostrWSServerEvents {
  connection: (ws: EnhancedWebSocket) => void;
  close: (ws: EnhancedWebSocket) => void;
  error: (ws: EnhancedWebSocket, error: Error) => void;
}

export interface ExtendedWebSocket extends WebSocket {
  isAlive?: boolean;
  authenticated?: boolean;
  subscriptions?: Set<string>;
}
