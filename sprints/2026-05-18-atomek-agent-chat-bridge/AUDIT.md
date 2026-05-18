# Audit: Atomek Agent Chat Bridge

Date: 2026-05-18

## Scope inspected

### Atomek app

Root: `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`

Current state:

- Git clean and synced: `main...origin/main`, latest `a2888d8 fix: serve Atomek bundle from raw GitHub`.
- App manifest: `tytus-app.json` version `0.4.25`.
- App permissions already include the required primitives:
  - `daemon.read`
  - `daemon.network`
  - `ai.chat`
  - `ai.memory.read`
  - `ai.memory.write`
  - `ai.artifacts`
- Build resolves `@tytus/host-api` through local path alias into ProjectWannolot's TytusOS host API source.

Relevant files:

- `package.json`
- `tytus-app.json`
- `tsconfig.json`
- `vite.config.ts`
- `src/workbench/components/WorkbenchShell.tsx`
- `src/workbench/ai/useConversation.ts`
- `src/workbench/types.ts`

### TytusOS host/runtime

Root: `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os`

Current state:

- Git clean and synced: `main...origin/main`, latest `042a801 Add TytusOS pod agent chat`.
- Host API exposes `daemon.callPodEndpoint(podId, path, init?)`, but not a structured agent-chat method.
- `callPodEndpoint` intentionally routes only through `/api/pods/:podId/proxy...`; it cannot call `/api/pods/:podId/cortex/chat` directly.
- TytusOS Chat app already has working agent chat, Cortex streaming, fallback to direct agent chat, session persistence, and redaction helpers.

Relevant files:

- `packages/host-api/src/client.ts`
- `app/src/runtime/host-impl.ts`
- `app/src/runtime/HostBridgeWiring.tsx`
- `app/src/apps/Chat.tsx`
- `app/src/apps/Chat.agentSanitizer.test.ts`

### Tytus tray / local API

Root: `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-cli`

Current state:

- Git clean and synced: `main...origin/main`, latest `293b184 Update PR truth for v0.6.17`.
- Tray exposes:
  - `/api/pods/:id/cortex/chat`
  - `/api/pods/:id/agent/chat`
- Cortex route forwards SSE from provider and uses chunked streaming.
- Direct agent route falls back through OpenAI-compatible pod chat and sanitizes output.

Relevant file:

- `tray/src/web_server.rs`

## Current Atomek chat architecture

Atomek has one strong chat engine already: `src/workbench/ai/useConversation.ts`.

Observed behavior:

- Uses `HostClient` and `AiConversationApi` from `@tytus/host-api`.
- Sends normal Atomek AI messages through `host.ai.sendMessage(...)`.
- Streams AI events into `ChatMessage` objects.
- Maintains workspace key `atomek:default`.
- Surfaces memory/artifacts/tool events.

Implication:

- Atomek should not get a second unrelated chat system.
- The existing chat hook should learn to route messages to either Atomek AI or a selected pod agent target.

## Current Atomek pod awareness

Atomek already understands pod-backed resources inside `WorkbenchShell.tsx`.

Observed helpers:

- `resourcePodId(resource)` extracts pod ids from metadata and resource ids.
- `resourceAgentFamily(resource)` detects `openclaw`, `hermes`, and `ail` families from metadata/labels.
- `resourceDisplayLabel(resource)` renders labels like `OpenClaw agent pod ${podId}` / `Hermes agent pod ${podId}`.
- `runPodTask(resource)` can execute a mission-like prompt through `host.daemon.callPodEndpoint(podId, '/v1/chat/completions')`.

Problems:

1. User-facing labels include pod IDs. That is not fatal locally, but it violates the current privacy/anti-infrastructure-leak posture.
2. `runPodTask` discovers and logs selected model names. That risks provider/model leakage in UI logs.
3. `runPodTask` talks to the raw OpenAI-compatible endpoint, not the safe Cortex/direct agent chat bridge.
4. The interactive Atomek chat does not currently use pod resources as chat targets.

## Current TytusOS Chat agent path

`app/src/apps/Chat.tsx` already does the right product-level thing:

- Presents agent targets.
- Uses Cortex first via `/api/pods/:podId/cortex/chat`.
- Falls back to direct agent chat via `/api/pods/:podId/agent/chat` for transient 404/502/503/504 states.
- Parses SSE.
- Extracts token, session, error, and done events.
- Sanitizes visible agent text to remove private network URLs, provider names, model names, and infra hints.
- Tests the sanitizer in `Chat.agentSanitizer.test.ts`.

Problem:

- This logic is buried inside the Chat app component. Atomek cannot reuse it cleanly.
- Copying it into Atomek would create three code paths to maintain: Traylinx web, TytusOS Chat, Atomek.

## Best reuse seam

The correct seam is TytusOS Host API runtime:

```
Atomek UI
  -> host.daemon.chatAgent(...)
    -> TytusOS runtime implementation
      -> local tray /api/pods/:id/cortex/chat
      -> fallback /api/pods/:id/agent/chat
        -> provider / pod
```

Why this seam:

- Atomek already consumes `@tytus/host-api`.
- Host runtime already owns pod routing and same-origin tray calls.
- Apps should not know tray endpoint details.
- Security/redaction can be centralized.
- Future TytusOS apps can use the same capability.

## Key risks

### Risk 1: duplicating stream parsing

Bad implementation: add `readSse()` inside Atomek.

Consequence: Atomek drifts from Chat app, fallback behavior diverges, redaction fixes are missed.

Mitigation: add `daemon.chatAgent()` to Host API and keep parser/sanitizer under TytusOS runtime/shared library.

### Risk 2: provider/infrastructure leakage

Bad implementation: show model/provider/pod route/network details in Atomek messages or labels.

Consequence: user-visible attack surface and violates existing product rule.

Mitigation:

- Sanitize all agent output in the runtime bridge.
- Use friendly target labels.
- Do not render raw `route_id`, droplet/provider id, private IP, public pod subdomain, or model/provider names.
- Add tests for labels and message redaction.

### Risk 3: wrong target model

Bad implementation: Atomek selector exposes `Tytus Brain` plus agent entries, or raw AIL entries, causing user confusion.

Consequence: users don't know whether they are chatting with agent, memory brain, or base model.

Mitigation:

- Atomek sprint only exposes real agent targets: OpenClaw, Hermes.
- Atomek AI remains the default assistant.
- No `Tytus Brain` target in Atomek unless a future product decision adds it.

### Risk 4: UI state breaks Atomek AI chat

Bad implementation: replace existing `useConversation` with a pod-only hook.

Consequence: memory/artifacts/workbench assistant regress.

Mitigation:

- Extend existing chat with a selected target abstraction.
- Preserve default Atomek AI behavior when selected target is `atomek`.
- Store pod-agent sessions separately.

### Risk 5: async semantics overpromised

Current endpoint is streaming request/response. It is not a durable Telegram/Slack-style queue.

Mitigation:

- MVP supports long streaming responses and UI timeout hardening.
- Do not claim true offline async delivery until durable message queue/session polling is added.
- Keep future async queue as a phase-2 roadmap, not part of this sprint unless explicitly expanded.

## Audit conclusion

Implementation is feasible and low-to-medium risk if done at the Host API boundary. The critical rule is no duplicated agent-chat implementation inside Atomek.

Go path:

1. Extract or centralize TytusOS Chat agent stream helpers.
2. Add `host.daemon.chatAgent()` contract + runtime implementation.
3. Extend Atomek chat target model and UI selector.
4. Route selected pod-agent messages through Host API.
5. Add redaction, state, and regression tests.
6. Release TytusOS/CLI if Host API or tray assumptions changed; release Atomek app after build gates.
