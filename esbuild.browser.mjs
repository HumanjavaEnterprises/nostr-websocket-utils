import { build } from 'esbuild';

const result = await build({
  entryPoints: ['src/browser.ts'],
  bundle: true,
  minify: true,
  sourcemap: true,
  format: 'iife',
  globalName: 'NostrWebSocketUtils',
  outfile: 'dist/browser/nostr-websocket-utils.min.js',
  target: ['es2020'],
  platform: 'browser',
  metafile: true,
});

// Print bundle size info
const output = Object.entries(result.metafile.outputs)
  .filter(([k]) => k.endsWith('.js'))
  .map(([k, v]) => `${k}: ${(v.bytes / 1024).toFixed(1)}KB`);
console.log('Browser bundle built:', output.join(', '));
