# Nostr Websocket Utils

[![npm version](https://img.shields.io/npm/v/nostr-websocket-utils.svg)](https://www.npmjs.com/package/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library providing WebSocket utilities for Nostr applications, focusing on robust connection handling, automatic reconnection, and channel-based messaging. This library has been streamlined to remove any DOM-related code, enhancing performance and maintainability.

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
npm install nostr-websocket-utils
```

## Breaking Changes in v0.2.2

- Removed all DOM-related code to focus solely on WebSocket functionality.
- Added UUID support for message tracking and correlation.
- Introduced a new `WebSocketImpl` option for custom WebSocket implementations.
- Improved TypeScript type safety across the codebase.
- Enhanced error handling for WebSocket connections.

## Usage

### Server Example

```typescript
import express from 'express';
import { createServer } from 'http';
import { NostrWSServer } from 'nostr-websocket-utils';
import winston from 'winston';

const app = express();
const server = createServer(app);

// Create a logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

// Initialize the WebSocket server with custom WebSocket implementation
const wsServer = new NostrWSServer(server, {
  logger,
  handlers: {
    message: async (ws, message) => {
      logger.info('Received message:', message);
      // Handle message
    },
    error: (ws, error) => {
      logger.error('WebSocket error:', error);
    },
    close: (ws) => {
      logger.info('Connection closed');
    }
  }
});

server.listen(3000);
```

### Client Example

```typescript
import { NostrWSClient } from 'nostr-websocket-utils';
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [new winston.transports.Console()]
});

const client = new NostrWSClient('ws://localhost:3000', {
  logger,
  WebSocketImpl: CustomWebSocketImplementation // Optional custom WebSocket implementation
});

client.on('message', (message) => {
  console.log('Received message:', message);
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
  // Optional custom WebSocket implementation
  WebSocketImpl?: WebSocketImpl;
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
