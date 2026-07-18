# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.5.0] - 2026-07-17

This is a **breaking** release that fixes the wire/crypto layer. Prior versions
did not correctly speak the NIP-01 wire protocol and shipped a broken NIP-04
implementation; message builders, validators, and several crypto primitives
changed shape. Any consumer relying on the old (non-functional) output must
update. See the migration notes below.

### Fixed — wire protocol (CRITICAL)
- **NIP-01 message builders now emit spec positional arrays.** `createReqMessage`
  → `["REQ", subId, ...filters]`, `createCloseMessage` → `["CLOSE", subId]`,
  `createNoticeMessage` → `["NOTICE", msg]`, `createOkMessage` →
  `["OK", eventId, bool, msg]`. Previously they emitted `["REQ", {subscription_id,
  filters}]` etc., which every compliant relay rejects. Downstream emitters fixed
  too: NIP-46 transport `subscribe`, NIP-28 channel subscribe/unsubscribe, NIP-33
  parameterized subscribe, and NIP-02 `createContactListSubscription` (which
  previously omitted the subscription id entirely).
- **`validateMessage` / `validateEvent` rewritten for positional args.** Control
  messages with string/boolean payloads (`NOTICE`/`EOSE`/`OK`/`CLOSED`) are now
  accepted; `CLOSED` added to `MESSAGE_TYPES`.
- **MessageQueue no longer corrupts tuples.** It now stores and sends the original
  wire tuple verbatim instead of destructuring `[type, ...data]` and rebuilding
  `[type, data]` (which turned `["REQ","sub1",{...}]` into `["REQ",["sub1",{...}]]`).

### Fixed — crypto (CRITICAL / HIGH)
- **NIP-04 key arguments were swapped.** `encryptMessage`/`decryptMessage` are now
  called as `(message, senderPriv, recipientPub)` and `(ciphertext, recipientPriv,
  senderPub)` per the nostr-crypto-utils signature. Every kind-4 DM was previously
  broken and non-interoperable. `createEncryptedDM` now also includes `pubkey` and
  `created_at` so the event is publishable.
- **`validateSignature` performed no verification** (returned `true` for any event
  with a string `sig`, and `true` for non-EVENT messages). It now performs real
  BIP-340 verification (`validateEvent` + `verifySignature`), is `async`
  (returns `Promise<boolean>`), and returns `false` for non-EVENT messages.
- **NIP-26 delegation rewritten per spec.** A token is now
  `schnorr(sha256("nostr:delegation:<delegatee>:<conditions>"))`, not an event
  signature; verification no longer re-serializes with a fresh `created_at`.
  Conditions use the NIP-26 grammar (`kind=`, `created_at>`, `created_at<`).
- **NIP-13 proof of work rewritten per spec.** The nonce is committed in a
  `["nonce", n, target]` tag inside the standard 6-element NIP-01 id preimage;
  `calculatePowEventId` now returns `{ id, nonce, tags }`; `validateEventPoW`
  recomputes the id before counting leading zero bits (a forged `id` of `"0000…"`
  is rejected).

### Fixed — validation / encoding (HIGH / MEDIUM)
- `validateEvent` uses strict type checks (accepts kind:0, empty content,
  `created_at:0`) and enforces hex format on `id`/`pubkey`/`sig`.
- `bech32Decode` normalizes all-uppercase input (BIP-173 / QR) and lifts the
  90-char cap for NIP-19 TLV entities; `encodeToBech32` throws on odd-length /
  non-hex input instead of minting a checksum-valid string for the wrong key.
- NIP-19 `encode*/decode*` enforce 32-byte (64 hex char) lengths.
- NIP-16 `getEventTreatment` no longer classifies kind 41/42 (channel
  metadata/message) as replaceable — prevents channel-history data loss.
- NIP-05 percent-encodes the local-part before building the well-known query.
- `NostrWSFilter` tag queries use NIP-01 `#e`/`#p` keys instead of
  `tags: Record<string,string[]>`.

### Added
- Real unit tests for the wire/crypto surface (previously zero): NIP-01 wire
  round-trips, NIP-04 encrypt→decrypt round-trip + argument-order guards,
  forged-signature rejection, NIP-26 create→verify round-trip, NIP-13 mined-id
  vs recomputed-id, bech32/NIP-19 known-answer vectors, and MessageQueue
  tuple-preservation. Uses the shared `nostr-vectors.json` known-answer vectors.
- `@noble/curves` and `@noble/hashes` as direct dependencies (NIP-26 schnorr).

## [0.4.0] - 2026-03-06

### Changed
- **Pino 10:** Upgraded logger from pino ^8.x to ^10.3.1
- **UUID 13:** Upgraded from uuid ^9.x to ^13.0.0
- **Vitest 4:** Upgraded test framework
- **esbuild:** Replaced webpack with esbuild for browser bundling
- **nostr-crypto-utils** dependency upgraded to ^0.6.0
- Dropped Node.js 16 support, CI runs on Node 20.x + 22.x

### Added
- NIP-44 encryption and NIP-46 transport via nostr-crypto-utils v0.5.1
- CommonJS `package.json` in dist/cjs for Node-RED compatibility

### Fixed
- WSS enforcement, payload size limits, backoff jitter, rate limiter cleanup
- Resolved npm audit vulnerabilities
- Fixed broken typedoc links in README

## [0.3.14] - 2025-02-19

### Changed
- Updated dependencies and fixed broken validateResponse import
- Fixed import from nostr-crypto-utils

## [0.3.13] - 2025-01-13

### Added
- Browser support via webpack bundle
- New browser entry point for direct browser usage
- Example HTML file demonstrating browser usage
- Source maps for better debugging
- UMD bundle for CDN usage

### Changed
- Updated package.json to include browser field
- Enhanced build process to support browser environments

## [0.3.11] - 2025-01-05

### Added
- CommonJS support and included dist/ in package

## [0.3.10] - 2025-01-02

### Changed
- Updated nostr-crypto-utils dependency to ^0.4.10 for better ESM compatibility
- Updated to use npm-published nostr-crypto-utils package

## [0.3.9] - 2025-01-02

### Fixed
- Enhanced Node.js compatibility with proper CJS/ESM module support
- Improved module resolution for both CommonJS and ES Module environments
- Fixed package exports to ensure consistent behavior across different Node.js versions

## [0.3.1] - 2024-12-30

### Changed
- Switched testing framework from Jest to Vitest
- Removed nostr-tools dependency
- Updated pino logger to version 8.17.2
- Fixed TypeScript type issues and linting errors
- Improved type safety across the codebase

### Removed
- Removed nostr-tools peer dependency
- Removed Jest-related dependencies

## [0.3.0] - 2024-12-30

### Added
- Comprehensive TypeScript type definitions
- Enhanced WebSocket connection management
- Improved message queue implementation
- Better error handling and logging

### Changed
- Updated to nostr-crypto-utils 0.4.2
- Refactored core functionality for better type safety
- Enhanced documentation
