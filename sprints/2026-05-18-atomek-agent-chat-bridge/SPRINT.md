# Sprint: Atomek Agent Chat Bridge

## Goal

Ship reusable Tytus pod-agent chat into Atomek's existing chat UI. Users can select OpenClaw or Hermes and chat with the agent directly through Cortex/direct fallback, without duplicating TytusOS Chat logic and without leaking infrastructure.

## Repos involved

1. `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os`
2. `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`
3. `/Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-cli` only if tray endpoint behavior or tests need adjustment.

## Phase 0 - Preflight and branch setup

Tasks:

- Confirm all repos are clean.
- Create feature branches:
  - `tytus-os`: `feature/atomek-agent-chat-bridge`
  - `tytus-app-atomek`: `feature/agent-chat-bridge`
  - `tytus-cli`: only if needed, `feature/agent-chat-bridge-support`
- Capture current app versions and release targets.

Acceptance:

- No untracked accidental changes before coding.
- Branch names and baselines recorded in implementation notes.

## Phase 1 - Centralize TytusOS agent chat runtime

Objective:

Move the working agent chat mechanics out of `Chat.tsx` into reusable TytusOS runtime/helpers.

Tasks:

- Create shared helper module for:
  - SSE block parsing
  - token extraction
  - session id extraction
  - error extraction
  - visible output sanitization
  - Cortex first/direct fallback fetch path
- Keep Chat app behavior unchanged by replacing its local helper copies with imports from the shared helper.
- Preserve sanitizer tests and add parser tests.

Files:

- `services/tytus-os/app/src/apps/Chat.tsx`
- `services/tytus-os/app/src/apps/Chat.agentSanitizer.test.ts`
- new `services/tytus-os/app/src/runtime/agent-chat.ts` or `app/src/lib/agent-chat.ts`

Acceptance:

- TytusOS Chat still lists agents, sends to OpenClaw/Hermes, streams output, and falls back as before.
- Existing sanitizer tests pass.
- No behavior regression in Chat app.

## Phase 2 - Add Host API `daemon.chatAgent()`

Objective:

Expose agent chat to hosted apps through a typed Host API method.

Tasks:

- Add `AgentChatRequest` and `AgentChatEvent` types.
- Extend `DaemonApi` with `chatAgent(request)`.
- Implement `chatAgent` in TytusOS runtime using shared agent chat helper.
- Ensure runtime fills `app_id` from the app id when possible.
- Ensure apps cannot pass headers or arbitrary URLs.
- Add host/runtime tests with mocked fetch.

Files:

- `services/tytus-os/packages/host-api/src/client.ts`
- `services/tytus-os/app/src/runtime/host-impl.ts`
- new/updated runtime tests

Acceptance:

- `host.daemon.chatAgent({ podId, message })` yields token/session/done/error events.
- 503 Cortex warmup can fallback to direct chat where appropriate.
- 401/403 do not fallback.
- Output is sanitized before delivery to app.

## Phase 3 - Add Atomek chat targets

Objective:

Atomek can discover and display safe agent chat targets.

Tasks:

- Add target discovery helper from host resources/daemon state.
- Add target model types.
- Add friendly display-name resolver:
  - custom pod name if present and safe
  - `OpenClaw` / `Hermes`
  - numeric suffix for duplicates
- Add selector state persistence.
- Keep Atomek AI target as default.

Files:

- `src/workbench/types.ts`
- new `src/workbench/ai/chatTargets.ts`
- `src/workbench/components/WorkbenchShell.tsx` or extracted chat selector component

Acceptance:

- Selector shows Atomek plus running OpenClaw/Hermes targets.
- No raw pod id, route id, provider, droplet, model, or IP appears in selector labels.
- If agents are absent, Atomek AI remains usable.

## Phase 4 - Route Atomek messages to selected target

Objective:

Atomek's chat hook routes messages to Atomek AI or pod agent based on selected target.

Tasks:

- Extend existing `useConversation` rather than building a parallel chat system.
- For Atomek target: keep current `host.ai.sendMessage` path unchanged.
- For pod-agent target: call `host.daemon.chatAgent`.
- Stream token events into `ChatMessage`.
- Store per-agent session id.
- Add cancel/retry behavior using `AbortController`.
- Add source label to assistant messages.
- Add local transcript persistence if needed.

Files:

- `src/workbench/ai/useConversation.ts`
- `src/workbench/types.ts`
- `src/workbench/components/WorkbenchShell.tsx`

Acceptance:

- User can select OpenClaw/Hermes and send a message.
- Response streams into the existing chat panel.
- Assistant message clearly says which agent answered.
- Atomek AI still works exactly as before.
- No duplicate Tytus Brain/chat panel appears in Atomek.

## Phase 5 - Hardening, mission-run safety, and copy polish

Objective:

Make the product safe and polished enough for release.

Tasks:

- Sanitize or remove model/provider logs from Atomek mission pod runs.
- Convert raw errors to user-safe messages:
  - `Agent is warming up. Try again in a moment.`
  - `Agent is offline. Restart the pod or pick another agent.`
  - `Connection timed out. The agent may still be working. Try again.`
- Add empty-state and no-agent copy.
- Ensure custom pod names appear where safe.
- Ensure disabled/warming states are visually consistent with project page style, not neon/noisy styling.

Acceptance:

- UI looks consistent with Atomek/Traylinx standard dark cards.
- No raw `503`, provider payload, or internal route in user-visible text.
- Agent chat errors are actionable.

## Phase 6 - Tests and validation

Objective:

Prove no regressions across Atomek, TytusOS Chat, and tray endpoints.

Tasks:

- Add unit tests for target discovery and label sanitization.
- Add unit tests for Host API agent chat event parsing/fallback.
- Add regression tests for TytusOS Chat sanitizer.
- Run Atomek typecheck/build.
- Run TytusOS typecheck/tests/build.
- Smoke locally with running TytusOS and existing pods if available.

Acceptance:

- All listed gates in `VALIDATION.md` pass or are explicitly documented with exact blocker.

## Phase 7 - Release

Objective:

Publish versions in the correct order.

Order:

1. TytusOS host/runtime release if Host API/runtime changed.
2. tytus-cli release only if tray changed.
3. Atomek app release after it points to the released Host API behavior.

Acceptance:

- Commits pushed to `main` and production/release branches where applicable.
- Version tags/releases created where repo policy requires.
- Deployed/installed app loads the new selector and can chat with agents.

## Done definition

The sprint is done only when:

- Atomek default chat works.
- Atomek agent chat works for OpenClaw and Hermes.
- TytusOS Chat still works.
- No duplicate implementation of SSE/fallback exists in Atomek.
- No user-facing infrastructure leak exists in labels, messages, logs, or errors.
- Tests/builds pass.
- Releases are published and verified live/local.
