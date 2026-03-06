**nostr-websocket-utils v0.4.0**

***

# nostr-websocket-utils

[![npm version](https://img.shields.io/npm/v/nostr-websocket-utils.svg)](https://www.npmjs.com/package/nostr-websocket-utils)
[![License](https://img.shields.io/npm/l/nostr-websocket-utils.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/blob/main/LICENSE)
[![Build Status](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/CI/badge.svg)](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/actions)
[![Documentation](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/workflows/Documentation/badge.svg)](https://humanjavaenterprises.github.io/nostr-websocket-utils/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

A TypeScript library for building Nostr protocol WebSocket clients and servers.

## Features

- 🚀 Full Nostr protocol support with nostr-crypto-utils integration
- 🔒 Secure WebSocket connections
- ♥️ Heartbeat mechanism for connection health
- 🔄 Automatic reconnection handling
- 📝 Comprehensive logging with Pino v8
- 🎯 Type-safe message handling
- 📦 Easy to use API
- 🧪 Vitest-powered test suite

## NIPs Support Status

🟢 Fully implemented 🟡 Partially implemented 🔴 Not implemented

| NIP | Status | Description |
|-----|--------|-------------|
| 01 | 🟢 | Basic protocol flow & WebSocket connections |
| 02 | 🟢 | Contact List and Petnames |
| 11 | 🟢 | Relay Information Document |
| 15 | 🟢 | End of Stored Events Notice |
| 16 | 🟢 | Event Treatment |
| 20 | 🟢 | Command Results |
| 42 | 🟢 | Authentication of clients to relays |

### WebSocket Protocol Implementation Details

This package implements the Nostr WebSocket protocol with full support for the core NIPs that define WebSocket behavior. Here's how it works:

#### Key Features & Compliance

1. **Protocol Implementation**:
   - Full implementation of Nostr WebSocket protocol
   - Support for all standard message types (EVENT, REQ, CLOSE, etc.)
   - Robust error handling and status reporting

2. **Connection Management**:
   - Automatic reconnection with configurable backoff
   - Heartbeat mechanism for connection health
   - Connection pooling and load balancing

3. **Message Handling**:
   - Type-safe message processing
   - Support for subscription management
   - Efficient event filtering

4. **Security & Best Practices**:
   - Secure WebSocket connections (WSS)
   - Implementation of authentication protocols
   - Rate limiting and protection mechanisms

#### Interoperability

This implementation ensures compatibility with:
- All major Nostr relays
- Other Nostr clients and libraries
- Standard WebSocket tooling and infrastructure

#### Validation & Testing

The package includes:
- Comprehensive test suites for protocol compliance
- Connection reliability testing
- Performance benchmarks for message handling

## Installation

```bash
npm install nostr-websocket-utils
```

## Quick Start

### Creating a Nostr WebSocket Client

```typescript
import { NostrWSClient } from 'nostr-websocket-utils';

const client = new NostrWSClient('wss://relay.example.com', {
  logger: console,
  heartbeatInterval: 30000,
  handlers: {
    message: async (msg) => console.log('Received:', msg),
    error: (err) => console.error('Error:', err),
    close: () => console.log('Connection closed')
  }
});

await client.connect();
```

### Creating a Nostr WebSocket Server

```typescript
import { createNostrServer } from 'nostr-websocket-utils';

const server = await createNostrServer(8080, {
  logger: console,
  heartbeatInterval: 30000,
  handlers: {
    message: async (ws, msg) => {
      console.log('Received message:', msg);
      // Handle the message
    }
  }
});
```

## Browser Usage

This library now supports direct browser usage! You can use it in your client-side applications in two ways:

### Via NPM (Recommended)

```javascript
import { NostrWSClient } from 'nostr-websocket-utils';

const client = new NostrWSClient({
  url: 'wss://relay.damus.io',
  options: {
    autoReconnect: true,
    maxRetries: 3
  }
});

client.onMessage((message) => {
  console.log('Received:', message);
});

client.connect();
```

### Via CDN

```html
<script src="https://unpkg.com/nostr-websocket-utils/dist/browser/nostr-websocket-utils.min.js"></script>
<script>
  const client = new NostrWebSocketUtils.NostrWSClient({
    url: 'wss://relay.damus.io',
    options: {
      autoReconnect: true,
      maxRetries: 3
    }
  });

  client.onMessage((message) => {
    console.log('Received:', message);
  });

  client.connect();
</script>
```

### Features in Browser Environment

- Direct WebSocket connections to Nostr relays
- Automatic reconnection handling
- Message queueing
- Type-safe handlers
- Full compatibility with browser environments
- Source maps for better debugging

See the `examples/browser.html` file for a complete example of browser usage.

## Dependencies

This package uses:
- nostr-crypto-utils (^0.4.2) for cryptographic operations
- pino (^8.17.2) for logging
- ws (^8.16.0) for WebSocket functionality
- uuid (^9.0.0) for unique identifiers

## Documentation

Comprehensive API documentation is available in our [documentation site](https://humanjavaenterprises.github.io/nostr-websocket-utils/). Here's what you'll find:

### Core Components
- [NostrWSClient](_media/NostrWSClient.md) - WebSocket client implementation
- [NostrWSServer](_media/NostrWSServer.md) - WebSocket server implementation
- [NostrServer](_media/NostrServer.md) - High-level Nostr server

### Types and Interfaces
- [NostrWSMessage](_media/NostrWSMessage.md) - Message structure
- [NostrWSOptions](_media/NostrWSOptions.md) - Configuration options
- [NostrWSSubscription](_media/NostrWSSubscription.md) - Subscription interface
- [ExtendedWebSocket](_media/ExtendedWebSocket.md) - Enhanced WebSocket interface

### Utility Functions
- [createServer](_media/createServer.md) - Server creation helper
- [getLogger](_media/getLogger.md) - Logging utility

### Type Definitions
- [ConnectionState](_media/ConnectionState.md) - Connection state enumeration
- [Global Types](_media/globals.md) - Global type definitions

## Examples

### Subscribe to a Channel

```typescript
client.subscribe('my-channel', {
  filter: {
    authors: ['pubkey1', 'pubkey2'],
    kinds: [1]
  }
});
```

### Broadcast a Message

```typescript
server.broadcast({
  type: 'event',
  data: {
    content: 'Hello everyone!',
    kind: 1
  }
});
```

## Security

### Dependency Vulnerability Status

We actively monitor and address security vulnerabilities in this codebase. **`npm audit --omit=dev` reports zero vulnerabilities** for this package — there are no known security issues in production dependencies.

Any remaining `npm audit` findings are in development-only tooling (eslint, typescript-eslint, vitest, typedoc, etc.) and stem from transitive dependencies with no upstream fix available. These are devDependencies that are never included in the published package and pose no risk to consumers of this library. We monitor upstream fixes and update promptly when they become available.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](_media/CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](_media/LICENSE) file for details.

## Related Projects

- [nostr-protocol](https://github.com/nostr-protocol/nostr)

## Support

If you have any questions or need help, please:

1. Check the [documentation](https://humanjavaenterprises.github.io/nostr-websocket-utils/)
2. Open an [issue](https://github.com/HumanjavaEnterprises/nostr-websocket-utils/issues)
