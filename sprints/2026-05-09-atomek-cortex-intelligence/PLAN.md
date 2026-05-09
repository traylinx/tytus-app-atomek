# Plan — Production-Ready Executable Phases

## Phase 0 — Baseline audit

- [x] Verify current Atomek version/commit.
- [x] Verify no hardcoded model IDs/tools.
- [x] Verify current `host.ai` capabilities available in runtime.
- [x] Verify current chat/file data flow in `WorkbenchShell.tsx`, `useConversation.ts`, and `contextBuilder.ts`.
- [x] Document whether embedding host API exists.

Gate:

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
! grep -R -E "minimax|m2\.1|m2\.7|web_search" src --exclude-dir=node_modules
! grep -R '"tools"[[:space:]]*:' src --exclude-dir=node_modules
```

## Phase 1 — IDE context spine

Build the dynamic connection between files, editor state, and chat before polishing chat UI. Details live in [`IDE-CONTEXT-CONTRACT.md`](./IDE-CONTEXT-CONTRACT.md).

- [x] Add `DocumentRegistry` for file/editor identity, URI/path, version, dirty state, language, active editor, and selection/range snapshots.
- [x] Increment document version/hash when Monaco content changes.
- [x] Track active editor and active selection/cursor changes.
- [x] Add `ChatContextStore` for explicit attachments plus implicit context policy.
- [x] Add context attachment types: active selection, active file, open editors, selected files, memory hit, future index hit.
- [x] Add context chip actions: remove, reveal file/range, inspect chars/tokens/stale version.
- [x] Refactor `buildAiContext()` so it uses per-request attachments/scope, not unconditional active/open files.
- [x] Keep no-context and active-context modes available per message.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 2 — Chat UX repair

Fix the chat surface so it behaves like an IDE-integrated assistant. Details live in [`CHAT-UX.md`](./CHAT-UX.md).

- [x] Add transcript follow mode and `Jump to latest`.
- [x] Make stream deltas visibly update the active assistant message.
- [x] Preserve scroll position when user intentionally reads older messages.
- [x] Render context chips from `ChatContextStore`, with remove/reveal/inspect.
- [ ] Clean composer controls; move `Auto` / `Plan` out of the primary input lane.
- [x] Keep routing/model controls dynamic through global AIL aliases.
- [x] Add keyboard UX: Enter send, Shift+Enter newline, Escape stop/cancel where safe.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 3 — Workspace edit pipeline

Make edit prompts turn into actual interactive file changes.

- [x] Add `editIntent` detection for common edit/update/change/replace prompts.
- [ ] When edit intent is detected, include strict diff/replacement instructions using current context attachments.
- [ ] Extract existing patch/replacement parsing from `WorkbenchShell.tsx` into `workbench/edits/`.
- [ ] Introduce `WorkspaceEditCandidate` with file id/path/base version/base hash/proposed content/skipped paths.
- [x] Preview single-file and multi-file edits automatically when parseable.
- [ ] Apply through `WorkbenchEditService` with version/hash conflict checks.
- [ ] Update Monaco buffers and mark files dirty; save remains explicit.
- [ ] If AI returns prose only, show `Generate patch` CTA; never imply file changed.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 4 — Project index without embeddings

Implement keyword/project index on top of the context spine so workspace context exists without waiting on host embeddings.

- [ ] Add chunker for open files and opened folder files.
- [ ] Add index store abstraction.
- [ ] Add keyword retrieval over indexed chunks.
- [ ] Add “Index open files” / “Refresh index” UI.
- [ ] Add status count: files/chunks/index freshness.
- [ ] Add project context as removable `index-hit` chips before send.
- [ ] Respect binary/vendor/large-file skips.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 5 — Embedding capability discovery

- [ ] Inspect TytusOS `host.ai` for embedding API.
- [ ] If missing, design/add host API in TytusOS: `embedText` and optional model discovery capability.
- [ ] Route embeddings through global AIL config/aliases.
- [ ] No hardcoded embedding model in Atomek.
- [ ] Fallback to keyword retrieval if embedding unavailable.

Gate if TytusOS touched:

```bash
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os
npm run typecheck --workspace app
npm run test --workspace app -- src/runtime/ai/conversation-service.test.ts src/runtime/host-impl.test.ts
```

## Phase 6 — Semantic retrieval

- [ ] Embed chunks through dynamic AIL embedding alias/provider.
- [ ] Persist vectors app-scoped.
- [ ] Add cosine search.
- [ ] Combine keyword + vector rankings.
- [ ] Show retrieved context as removable chips with file paths/snippets/scores.

Gate:

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
npm run build
```

## Phase 7 — Agentic edit/check loop v1

- [ ] Add “Ask project” prompt mode using indexed context.
- [ ] Add “Generate patch” action.
- [ ] Reuse workspace edit preview/apply pipeline.
- [ ] Add “Apply and mark unsaved” with save warning.
- [ ] Add manual check command capture until host command runner exists.
- [ ] If host command runner lands, run checks and feed failures back into follow-up prompt.

Gate:

```bash
npm run typecheck
npm run build
npm run release:check
```

## Phase 8 — Release + live QA

- [ ] Add/enable tests for context builder/store, patch parser, edit service, transcript follow mode.
- [ ] Run all gates.
- [ ] Bump Atomek version.
- [ ] Build and release-check.
- [ ] Commit/tag/push Atomek.
- [ ] Update app catalog.
- [ ] If TytusOS touched, update/vendored local runtime separately.
- [ ] Live QA in Tytus with opened file: ask edit, inspect context, apply edit, save file.

Release gates:

```bash
npm run typecheck
npm run build
npm run release:check
! grep -R -E "minimax|m2\.1|m2\.7|web_search" src --exclude-dir=node_modules
! grep -R '"tools"[[:space:]]*:' src --exclude-dir=node_modules
```
