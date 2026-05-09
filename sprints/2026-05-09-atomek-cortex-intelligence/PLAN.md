# Plan — Executable Phases

## Phase 0 — Baseline audit

- [ ] Verify current Atomek version/commit.
- [ ] Verify no hardcoded model IDs/tools.
- [ ] Verify current host.ai capabilities available in runtime.
- [ ] Document whether embedding host API exists.

Gate:

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
```

## Phase 1 — Chat UX repair

Fix the core chat surface before building deeper Cortex retrieval. Details live in [`CHAT-UX.md`](./CHAT-UX.md).

- [ ] Add transcript follow mode and `Jump to latest`.
- [ ] Make stream deltas visibly update the active assistant message.
- [ ] Preserve scroll position when user intentionally reads older messages.
- [ ] Add removable context chips and per-message context scope.
- [ ] Clean composer controls; move `Auto` / `Plan` out of the primary input lane.
- [ ] Make edit-intent prompts open preview/apply when possible.
- [ ] Keep model/routing controls dynamic through global AIL aliases.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 2 — Project index without embeddings

Implement keyword/project index first so UX and chunking exist without waiting on host embeddings.

- [ ] Add chunker for open files.
- [ ] Add index store abstraction.
- [ ] Add keyword retrieval over indexed chunks.
- [ ] Add “Index open files” / “Refresh index” UI.
- [ ] Add status count: files/chunks/index freshness.
- [ ] Add project context into chat requests.

Gate:

```bash
npm run typecheck
npm run build
```

## Phase 3 — Embedding capability discovery

- [ ] Inspect TytusOS host.ai for embedding API.
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

## Phase 4 — Semantic retrieval

- [ ] Embed chunks.
- [ ] Persist vectors app-scoped.
- [ ] Add cosine search.
- [ ] Combine keyword + vector rankings.
- [ ] Show retrieved context in chat UI for transparency.

Gate:

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
npm run typecheck
npm run build
```

## Phase 5 — Agentic edit loop v1

- [ ] Add “Ask project” prompt mode.
- [ ] Add “Generate patch” action.
- [ ] Reuse preview/apply patch UI.
- [ ] Add “Apply and mark unsaved” with save warning.
- [ ] Add manual check command capture until host command runner exists.

Gate:

```bash
npm run typecheck
npm run build
npm run release:check
```

## Phase 6 — Release

- [ ] Bump Atomek version.
- [ ] Build and release-check.
- [ ] Commit/tag/push Atomek.
- [ ] Update app catalog.
- [ ] If TytusOS touched, update/vendored local runtime separately.
- [ ] Live QA in Tytus.
