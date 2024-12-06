Nostr Websocket Utils

[![npm version](https://img.shields.io/npm/v/@humanjavaenterprises/nostr-websocket-utils.svg)](https://www.npmjs.com/package/@humanjavaenterprises/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/@humanjavaenterprises/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library providing WebSocket utilities for Nostr applications, with robust connection handling, automatic reconnection, and channel-based messaging.

## Features

- 🔄 Automatic reconnection with configurable attempts
- 💓 Heartbeat monitoring
- 📨 Message queueing during disconnections
- 📢 Channel-based broadcasting
- 🔒 Type-safe message handling
- 📝 Built-in logging

## Installation

```bash
npm install @humanjavaenterprises/nostr-websocket-utils
```

## Usage

### Client Example

```typescript
import { NostrWSClient } from '@humanjavaenterprises/nostr-websocket-utils';

const client = new NostrWSClient('wss://your-server.com', {
  heartbeatInterval: 30000,
  reconnectInterval: 5000,
  maxReconnectAttempts: 5
});

client.on('connect', () => {
  console.log('Connected!');
  client.subscribe('my-channel');
});

client.on('message', (message) => {
  console.log('Received:', message);
});

client.connect();
```

### Server Example

```typescript
import express from 'express';
import { createServer } from 'http';
import { NostrWSServer } from '@humanjavaenterprises/nostr-websocket-utils';

const app = express();
const server = createServer(app);
const wss = new NostrWSServer(server, {
  heartbeatInterval: 30000
});

wss.on('message', (message, client) => {
  console.log('Received message:', message);
  
  // Broadcast to specific channel
  wss.broadcastToChannel('my-channel', {
    type: 'event',
    data: { content: 'Hello channel!' }
  });
});

server.listen(3000);
```

## Why This Library is Perfect for Nostr Development

This library is specifically designed to accelerate Nostr application development by providing a robust foundation for WebSocket communication. Here's what makes it particularly valuable:

### 1. Nostr-Specific Message Types
- Built-in support for core Nostr protocol message types (`subscribe`, `unsubscribe`, `event`, `request/response`)
- Perfectly aligned with Nostr's pub/sub model
- Type-safe message handling for all Nostr events

### 2. Advanced WebSocket Management
- Zero-config connection maintenance with automatic reconnection
- Built-in heartbeat mechanism prevents stale connections
- Smart message queuing ensures no events are lost during disconnections
- Comprehensive connection state tracking

### 3. Efficient Event Distribution
- Channel-based broadcasting for targeted event distribution
- Support for filtered subscriptions (crucial for Nostr event filtering)
- Memory-efficient subscription tracking
- Optimized message routing to relevant subscribers

### 4. Developer Experience
- Full TypeScript support with comprehensive type definitions
- Event-driven architecture matching Nostr's event-centric nature
- Clear, consistent error handling and validation
- Minimal boilerplate needed to get started

### 5. Production-Ready Features
- Built-in logging system
- Memory leak prevention through proper client cleanup
- Scalable client management
- Support for multiple simultaneous subscriptions

By using this library, you can skip weeks of WebSocket infrastructure development and focus on building your Nostr application's unique features.

## API Reference

### NostrWSClient

- `constructor(url: string, options?: NostrWSOptions)`
- `connect(): void`
- `send(message: NostrWSMessage): void`
- `subscribe(channel: string): void`
- `unsubscribe(channel: string): void`
- `close(): void`

Events:
- `connect`
- `disconnect`
- `reconnect`
- `message`
- `error`

### NostrWSServer

- `constructor(server: any, options?: NostrWSOptions)`
- `broadcast(message: NostrWSMessage): void`
- `broadcastToChannel(channel: string, message: NostrWSMessage): void`
- `sendTo(client: ExtendedWebSocket, message: NostrWSMessage): void`
- `getClients(): Set<ExtendedWebSocket>`
- `close(): void`

Events:
- `message`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT
