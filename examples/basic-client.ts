/**
 * Basic Client Example — nostr-websocket-utils
 *
 * Demonstrates connecting to a relay and subscribing to events.
 */
import { NostrWSClient } from 'nostr-websocket-utils';

async function main() {
  // Create a WebSocket client connected to a relay
  const client = new NostrWSClient('wss://relay.damus.io', {
    heartbeatInterval: 30000,
    handlers: {
      message: async (msg) => {
        console.log('Received message:', JSON.stringify(msg, null, 2));
      },
      error: (err) => {
        console.error('Connection error:', err);
      },
      close: () => {
        console.log('Connection closed');
      },
    },
  });

  // Connect to the relay
  await client.connect();
  console.log('Connected to relay');

  // Subscribe to text note events (kind 1) from specific authors
  client.subscribe('my-subscription', {
    filter: {
      kinds: [1],
      limit: 10,
    },
  });

  console.log('Subscribed to text notes. Listening for events...');
}

main().catch(console.error);
