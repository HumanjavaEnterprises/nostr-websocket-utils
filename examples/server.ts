/**
 * Server Example — nostr-websocket-utils
 *
 * Demonstrates creating a basic Nostr WebSocket server.
 */
import { createNostrServer } from 'nostr-websocket-utils';

async function main() {
  const port = 8080;

  const server = await createNostrServer(port, {
    heartbeatInterval: 30000,
    handlers: {
      message: async (ws, msg) => {
        console.log('Received message from client:', JSON.stringify(msg, null, 2));

        // Echo the message type back
        if (msg.type === 'EVENT') {
          console.log('Event received:', msg.data);
        } else if (msg.type === 'REQ') {
          console.log('Subscription request:', msg.data);
        } else if (msg.type === 'CLOSE') {
          console.log('Subscription closed:', msg.data);
        }
      },
    },
  });

  console.log(`Nostr WebSocket server listening on port ${port}`);

  // Broadcast a message to all connected clients
  server.broadcast({
    type: 'NOTICE',
    data: 'Welcome to the Nostr relay!',
  });
}

main().catch(console.error);
