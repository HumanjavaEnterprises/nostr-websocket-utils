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
- 🔒 Type-safe message handling with required handlers
- 📝 Built-in logging
- 🛡️ Comprehensive error handling
- 🧪 Full test coverage

## Installation

```bash
npm install @humanjavaenterprises/nostr-websocket-utils
```

## Breaking Changes in v0.2.0

- Introduced required handlers pattern for better type safety
- Removed individual event handler properties (onMessage, onError, onClose)
- Message handler is now required in server options
- Client updated to match server interface

## Usage

### Server Example

```typescript
import express from 'express';
import { createServer } from 'http';
import { NostrWSServer } from '@humanjavaenterprises/nostr-websocket-utils';
import winston from 'winston';

const app = express();
const server = createServer(app);

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Initialize WebSocket server with required handlers
const wss = new NostrWSServer(server, {
  heartbeatInterval: 30000,
  logger,
  handlers: {
    // Required message handler
    message: async (ws, message) => {
      logger.info('Received message:', message);
      
      // Example: Handle different message types
      switch (message.type) {
        case 'subscribe':
          // Handle subscription
          break;
        case 'event':
          // Broadcast to specific channel
          wss.broadcastToChannel('my-channel', {
            type: 'event',
            data: { content: 'Hello channel!' }
          });
          break;
      }
    },
    // Optional error handler
    error: (ws, error) => {
      logger.error('WebSocket error:', error);
    },
    // Optional close handler
    close: (ws) => {
      logger.info('Client disconnected');
    }
  }
});

server.listen(3000);
```

### Client Example

```typescript
import { NostrWSClient } from '@humanjavaenterprises/nostr-websocket-utils';
import winston from 'winston';

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const client = new NostrWSClient('wss://your-server.com', {
  heartbeatInterval: 30000,
  reconnectInterval: 5000,
  maxReconnectAttempts: 5,
  logger,
  handlers: {
    message: async (ws, message) => {
      logger.info('Received message:', message);
      // Handle message
    },
    error: (ws, error) => {
      logger.error('Connection error:', error);
    },
    close: (ws) => {
      logger.info('Connection closed');
    }
  }
});

// Listen to events
client.on('connect', () => {
  logger.info('Connected!');
  client.subscribe('my-channel');
});

client.connect();
```

## Interface Reference

### NostrWSOptions

```typescript
interface NostrWSOptions {
  // Interval for sending heartbeat pings (ms)
  heartbeatInterval?: number;
  // Interval between reconnection attempts (ms)
  reconnectInterval?: number;
  // Maximum number of reconnection attempts
  maxReconnectAttempts?: number;
  // Required logger instance
  logger: Logger;
  // Required handlers object
  handlers: {
    // Required message handler
    message: (ws: ExtendedWebSocket, message: NostrWSMessage) => Promise<void> | void;
    // Optional error handler
    error?: (ws: WebSocket, error: Error) => void;
    // Optional close handler
    close?: (ws: WebSocket) => void;
  };
}
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
- Required handlers pattern ensures type safety

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT License - see the [LICENSE](LICENSE) file for details.
