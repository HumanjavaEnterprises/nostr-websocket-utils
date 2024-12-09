import type { WebSocket } from 'ws';

export type NostrEventKind = 
  | 0    // Metadata
  | 1    // Text Note
  | 2    // Recommend Server
  | 3    // Contacts
  | 4    // Encrypted Direct Message
  | 40   // Channel Creation
  | 41   // Channel Metadata
  | 42   // Channel Message
  | 43   // Channel Hide Message
  | 44   // Channel Mute User;

export type NostrEvent = {
  id?: string;
  pubkey?: string;
  created_at?: number;
  kind: NostrEventKind;
  tags: string[][];
  content: string;
  sig?: string;
};

export type NostrWSMessage = [string, NostrEvent] | [string, string];

export interface NostrWSOptions {
  heartbeatInterval?: number;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
  logger: Logger;
  handlers: {
    message: (ws: EnhancedWebSocket, message: NostrWSMessage) => Promise<void> | void;
    error?: (ws: WebSocket, error: Error) => void;
    close?: (ws: WebSocket) => void;
  };
}

export interface NostrWSSubscription {
  channel: string;
  filter?: Record<string, unknown>;
}

export interface NostrWSClientEvents {
  connect: () => void;
  disconnect: () => void;
  reconnect: () => void;
  message: (message: NostrWSMessage) => void;
  error: (error: Error) => void;
}

export interface NostrWSServerEvents {
  connection: (client: EnhancedWebSocket) => void;
  message: (message: NostrWSMessage, client: EnhancedWebSocket) => void;
  error: (error: Error) => void;
}

export interface EnhancedWebSocket extends WebSocket {
  id?: string;
  pubkey?: string;
  isAlive?: boolean;
  authenticated?: boolean;
  subscriptions?: Set<string>;
  connectedAt?: Date;
}

export interface Logger {
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
}
