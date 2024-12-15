# Nostr Websocket Utils

[![npm version](https://img.shields.io/npm/v/nostr-websocket-utils.svg)](https://www.npmjs.com/package/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library providing WebSocket utilities for Nostr applications, focusing on robust connection handling, automatic reconnection, and channel-based messaging. This library has been streamlined to remove any DOM-related code, enhancing performance and maintainability.

## Features

- 🔄 Automatic reconnection with configurable attempts
- 💓 Heartbeat monitoring with configurable intervals
- 📨 Message queueing during disconnections
- 📢 Channel-based broadcasting with filtered subscriptions
- 🔒 Type-safe message handling with required handlers
- 📝 Built-in logging with Winston integration
- 🛡️ Comprehensive error handling and validation
- 🧪 100% test coverage with Jest
- 📦 Zero DOM dependencies
- 🔍 Full TypeScript type safety

## Installation

```bash
npm install nostr-websocket-utils
```

## Breaking Changes in v0.2.4

- 🆕 Added dedicated Nostr WebSocket server implementation
- 📝 Enhanced TypeScript type definitions for Nostr messages
- 🔄 Improved message handling with strict type checking
- 🧪 Added comprehensive test suite for Nostr server
- 🛡️ Strengthened type safety with `unknown` types
- 🔌 Added support for Nostr EVENT and REQ messages

## Usage

### Nostr Server Example

```typescript
import { NostrWSServer, createWSServer } from 'nostr-websocket-utils';
import { NostrWSMessageType, NostrWSEvent } from 'nostr-websocket-utils/types/nostr';

// Create Nostr WebSocket server
const server = createWSServer({
  port: 8080,
  heartbeatInterval: 30000, // Optional: 30 seconds
  handlers: {
    // Required: Handle incoming messages
    message: async (socket, message) => {
      switch (message[0]) {
        case NostrWSMessageType.EVENT:
          const event = message[1] as NostrWSEvent;
          // Handle Nostr event
          break;
        case NostrWSMessageType.REQ:
          const [_type, subscriptionId, filter] = message;
          // Handle subscription request
          break;
      }
    },
    // Optional: Handle errors
    error: (socket, error) => {
      console.error('WebSocket error:', error);
    },
    // Optional: Handle client disconnection
    close: (socket) => {
      console.info('Client disconnected');
    }
  }
});

// Start listening
server.listen();
```

### Types

```typescript
// Nostr Event Type
interface NostrWSEvent {
  id: string;
  pubkey: string;
  created_at: number;
  kind: number;
  tags: string[][];
  content: string;
  sig: string;
}

// Nostr Filter Type
interface NostrWSFilter {
  ids?: string[];
  authors?: string[];
  kinds?: number[];
  '#e'?: string[];
  '#p'?: string[];
  since?: number;
  until?: number;
  limit?: number;
}

// Message Types
enum NostrWSMessageType {
  EVENT = 'EVENT',
  REQ = 'REQ',
  CLOSE = 'CLOSE',
  NOTICE = 'NOTICE',
  AUTH = 'AUTH',
  EOSE = 'EOSE'
}
```

## Advanced Configuration

### Server Options

```typescript
interface NostrWSServerOptions {
  port: number;
  heartbeatInterval?: number;
  maxPayloadSize?: number;
  cors?: {
    origin?: string | string[];
    methods?: string[];
  };
  handlers: {
    message: MessageHandler;
    error?: ErrorHandler;
    close?: CloseHandler;
  };
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
