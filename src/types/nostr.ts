import { ExtendedWebSocket } from './index';

export interface NostrWSEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

export interface NostrWSFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  '#e'?: string[];
  '#p'?: string[];
  since?: number;
  until?: number;
  limit?: number;
}

export interface NostrWSSocket extends ExtendedWebSocket {
  subscriptions?: Set<string>;
  authenticated?: boolean;
  pubkey?: string;
}

export enum NostrWSMessageType {
  EVENT = 'EVENT',
  REQ = 'REQ',
  CLOSE = 'CLOSE',
  NOTICE = 'NOTICE',
  OK = 'OK',
  AUTH = 'AUTH',
  EOSE = 'EOSE'
}

export type NostrWSServerMessage = [NostrWSMessageType, ...unknown[]];

export interface NostrWSServerOptions {
  port: number;
  heartbeatInterval?: number;
  maxPayloadSize?: number;
  cors?: {
    origin: string;
    methods: string[];
  };
  onConnection?: (socket: NostrWSSocket) => void;
  onDisconnect?: (socket: NostrWSSocket) => void;
  onError?: (error: Error, socket?: NostrWSSocket) => void;
  handlers?: {
    message: (socket: NostrWSSocket, message: NostrWSServerMessage) => void | Promise<void>;
    error?: (socket: NostrWSSocket, error: Error) => void;
    close?: (socket: NostrWSSocket) => void;
  };
}
