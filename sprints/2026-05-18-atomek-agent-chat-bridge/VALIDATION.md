# Validation Plan

## Static checks

### Atomek

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
npm run build
npm run release:check
```

If `release:check` is unavailable or repo policy changes, use the repo's current release validation script from `package.json` and record the exact replacement.

### TytusOS app

```bash
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os/app
npm run typecheck
npm test -- --runInBand src/apps/Chat.agentSanitizer.test.ts
npm run build
```

Add new test files to this command once created.

### TytusOS host-api package

```bash
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os/packages/host-api
npm run typecheck
```

The package currently exposes `typecheck` and `validate`; use `npm run validate` only if the implementation touches the app manifest validation path.

### tytus-cli tray, only if changed

```bash
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-cli
cargo test
```

If full cargo test is too broad, run the narrow tray/web_server tests and document the command.

## Unit tests to add

### Host/runtime

- `chatAgent` yields token events for SSE chunks.
- `chatAgent` yields session id event.
- `chatAgent` yields done event.
- Cortex 503 falls back to direct agent chat.
- Cortex 401/403 does not fallback.
- Error messages are sanitized.
- Provider/model/private-network strings are redacted.

### Atomek

- Target discovery returns Atomek default plus running OpenClaw/Hermes resources.
- Target labels use custom display name when safe.
- Target labels do not include pod id, route id, provider id, droplet id, IP, or model name.
- Duplicate OpenClaw targets are disambiguated as `OpenClaw 1`, `OpenClaw 2` or safe custom names.
- Selecting Atomek target calls `host.ai.sendMessage`.
- Selecting pod-agent target calls `host.daemon.chatAgent`.
- Assistant message source label matches selected target.

## Manual QA

### Setup

- TytusOS running locally.
- User authenticated.
- At least one OpenClaw pod and one Hermes pod visible.
- Atomek installed or loaded from dev build.

### Cases

1. Default Atomek chat
   - Open Atomek.
   - Send `hello` with default Atomek target.
   - Expected: existing Atomek assistant replies; memory/artifacts behavior unchanged.

2. OpenClaw chat
   - Select OpenClaw target.
   - Send `status`.
   - Expected: streamed response from OpenClaw route via Host API; assistant message label is OpenClaw/custom name.

3. Hermes chat
   - Select Hermes target.
   - Send `give me status`.
   - Expected: streamed response from Hermes route via Host API; assistant message label is Hermes/custom name.

4. Warming/error state
   - Select an agent that reports warming or stop/restart a pod briefly.
   - Expected: friendly retryable error, no raw 503 or provider body.

5. Selector persistence
   - Select Hermes, reload Atomek.
   - Expected: safe target restored if still visible; otherwise fallback to Atomek.

6. Session continuity
   - Ask an agent a contextual follow-up.
   - Expected: session id preserved when Cortex provides it.

7. No-infra leak smoke
   - Inspect visible UI and copied response text.
   - Search for banned strings:
     - `strato`
     - `scalesys`
     - `wannolot` when used as infrastructure label
     - `10.` / `192.168.` / `172.16.` through `172.31.`
     - `MiniMax`, `Kimi`, `Moonshot`, `DeepSeek`, `Qwen`, `Alibaba`, `Xiaomi`, `Nous`, `OpenRouter`
     - raw `route_id`
     - public pod subdomain token
   - Expected: none appear in user-facing chat or selector.

8. Network boundary
   - Open DevTools.
   - Send agent chat.
   - Expected: requests go to same-origin TytusOS/tray API only. No direct browser request to private pod URLs.

## Release gates

- Atomek app build artifact loads in TytusOS.
- TytusOS Chat app still works after helper extraction.
- Host API version compatibility checked against Atomek path alias/external runtime behavior.
- No accidental changes in unrelated app repos.
- Brain journal entry written with exact released versions/commits after release.

## Rollback plan

If production/local release regresses:

1. Disable pod-agent targets in Atomek with a feature flag or target discovery guard.
2. Leave Atomek AI target active.
3. Keep TytusOS Chat app as fallback because it already had working agent chat.
4. Revert Atomek release tag if necessary.
5. Revert Host API runtime only if Chat app also regresses.
