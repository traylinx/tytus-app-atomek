# Task Breakdown

## A. TytusOS shared agent chat

- [ ] Extract stream parser from `app/src/apps/Chat.tsx`.
- [ ] Extract sanitizer from `app/src/apps/Chat.tsx`.
- [ ] Extract Cortex/direct fallback request flow.
- [ ] Replace Chat app local helpers with shared imports.
- [ ] Add parser/sanitizer unit tests.

## B. Host API contract

- [ ] Add `AgentChatRequest` type.
- [ ] Add `AgentChatEvent` type.
- [ ] Add `DaemonApi.chatAgent()`.
- [ ] Update host API docs/comments if present.
- [ ] Ensure TypeScript consumers compile through local path alias.

## C. TytusOS runtime bridge

- [ ] Implement `makeDaemonApi(appId).chatAgent(...)`.
- [ ] Update `makeHostForApp` to pass the app id into daemon API, or document safe generic `app_id` fallback.
- [ ] Validate pod id is sent only to same-origin tray endpoints.
- [ ] Preserve Authorization stripping behavior.
- [ ] Add mocked fetch tests for success, stream chunks, session event, Cortex fallback, and forbidden no-fallback.

## D. Atomek target discovery

- [ ] Add `ChatTarget` types.
- [ ] Add `buildChatTargets(host)` helper.
- [ ] Normalize OpenClaw/Hermes family detection.
- [ ] Resolve friendly target labels.
- [ ] Add duplicate target suffixes without exposing pod ids.
- [ ] Add tests for target discovery and label safety.

## E. Atomek chat routing

- [ ] Extend `useConversation` with selected target input.
- [ ] Keep current Atomek AI path unchanged.
- [ ] Add pod-agent send path via `host.daemon.chatAgent()`.
- [ ] Stream tokens into `ChatMessage`.
- [ ] Track per-agent `sessionId`.
- [ ] Add abort/cancel handling.
- [ ] Add retryable error messages.
- [ ] Add source label on assistant replies.

## F. Atomek UI

- [ ] Add target selector in existing chat composer/header.
- [ ] Keep Atomek as default.
- [ ] Show OpenClaw/Hermes targets with safe names.
- [ ] Show warming/offline states.
- [ ] Avoid extra chat panel.
- [ ] Match existing project/workbench card style.

## G. Mission runner cleanup

- [ ] Remove or sanitize selected model/provider log line in `runPodTask`.
- [ ] Consider routing agent-family mission runs through `host.daemon.chatAgent()` after interactive chat is stable.
- [ ] Ensure mission output still attaches artifact logs correctly.

## H. Validation

- [ ] Atomek typecheck.
- [ ] Atomek build.
- [ ] TytusOS app tests.
- [ ] TytusOS app build/typecheck.
- [ ] Tray tests if touched.
- [ ] Local smoke: Atomek AI target.
- [ ] Local smoke: OpenClaw target.
- [ ] Local smoke: Hermes target.
- [ ] Leak smoke: search rendered UI/output for provider/droplet/IP/model patterns.

## I. Release

- [ ] Commit TytusOS changes.
- [ ] Commit Atomek changes.
- [ ] Commit tytus-cli changes if any.
- [ ] Push branches.
- [ ] Merge/push `main` per repo policy.
- [ ] Publish releases in dependency order.
- [ ] Verify installed/live Atomek loads the new target selector.
