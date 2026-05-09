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
- [x] Clean composer controls; move `Auto` / `Plan` out of the primary input lane.
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
- [x] When edit intent is detected, include strict diff/replacement instructions using current context attachments.
- [x] Extract existing patch/replacement parsing from `WorkbenchShell.tsx` into `workbench/edits/`.
- [x] Introduce `WorkspaceEditCandidate` with file id/path/base version/base hash/proposed content/skipped paths.
- [x] Preview single-file and multi-file edits automatically when parseable.
- [x] Apply through extracted edit candidate parsing; preview conflict guard remains in UI apply path.
- [x] Update Monaco buffers and mark files dirty; save remains explicit.
- [x] If AI returns prose only, show `Generate patch` CTA; never imply file changed.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 4 — Project index without embeddings

Implement keyword/project index on top of the context spine so workspace context exists without waiting on host embeddings.

- [x] Add chunker for open files and opened folder files.
- [x] Add index store abstraction.
- [x] Add keyword retrieval over indexed chunks.
- [x] Add “Index open files” / “Refresh index” UI.
- [x] Add status count: files/chunks/index freshness.
- [x] Add project context as removable `index-hit` chips after query retrieval and before request context leaves Atomek.
- [x] Respect binary/vendor/large-file skips.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 5 — Embedding capability discovery

- [x] Inspect runtime `host.ai` for embedding API capability.
- [x] Add host API in TytusOS: `host.ai.embedText` routes to AIL `/v1/embeddings` with dynamic model alias.
- [x] Route embedding model selection through global AIL alias field when host capability exists.
- [x] No hardcoded embedding model in Atomek.
- [x] Fallback to keyword retrieval if embedding unavailable.

Gate if TytusOS touched:

```bash
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os
npm run typecheck --workspace app
npm run test --workspace app -- src/runtime/ai/conversation-service.test.ts src/runtime/host-impl.test.ts
```

## Phase 6 — Semantic retrieval

- [x] Embed chunks through dynamic AIL embedding alias/provider when `host.ai.embedText` exists.
- [x] Persist vectors app-scoped in browser localStorage keyed by app/model alias/chunk/hash.
- [x] Add cosine search.
- [x] Combine keyword + vector rankings.
- [x] Show retrieved context as removable chips with file paths/snippets/scores.

Gate:

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
npm run build
```

## Phase 7 — Agentic edit/check loop v1

- [x] Add indexed-project prompt mode using indexed context.
- [x] Add “Generate patch” action.
- [x] Reuse workspace edit preview/apply pipeline.
- [x] Add “Apply and mark unsaved” with save warning.
- [ ] Add manual check command capture until host command runner exists.
- [ ] If host command runner lands, run checks and feed failures back into follow-up prompt.

Gate:

```bash
npm run typecheck
npm run build
npm run release:check
```

## Phase 8 — Release + live QA

- [x] Add lightweight cortex contract harness for context builder/store, patch parser/edit service, and project index retrieval.
- [x] Run all gates.
- [x] Bump Atomek version.
- [x] Build and release-check.
- [x] Commit/tag/push Atomek (`6ee73c0`, tag `v0.4.0`; semantic release `v0.4.1` pending closeout).
- [x] Update app catalog (`tytus-app-catalog` commit `1fe09da`, catalog version 30).
- [x] TytusOS host API touched: `host.ai.embedText` landed in `f6a1905` on `feature/tytus-forge-mvp`.
- [ ] Live QA in Tytus with opened file: ask edit, inspect context, apply edit, save file.

Release gates:

```bash
npm run typecheck
npm run build
npm run release:check
! grep -R -E "minimax|m2\.1|m2\.7|web_search" src --exclude-dir=node_modules
! grep -R '"tools"[[:space:]]*:' src --exclude-dir=node_modules
```
