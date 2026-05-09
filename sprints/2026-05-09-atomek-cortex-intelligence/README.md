# Atomek Cortex Intelligence Sprint

**Created:** 2026-05-09  
**Repo:** `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek`  
**Current app version at sprint start:** `0.3.9`  
**Sprint status:** `READY_TO_EXECUTE`  
**Owner:** Harvey  

## Why this sprint exists

Previous closeout overstated completion. Atomek now has real `host.ai` chat, AIL routing, model alias settings, artifacts, thread controls, and edit preview/apply. That is **not** the same as full Cortex intelligence.

This sprint turns Atomek from chat-enabled editor into a project-aware AI workbench.

## Non-negotiables

- Do **not** hardcode model IDs in Atomek.
- Do **not** hardcode provider-specific tools such as `web_search`.
- Use global AIL routing/config/aliases for chat and embeddings.
- Do **not** modify Juli3ta.
- Keep Atomek backward-compatible with older TytusOS where reasonable.
- Keep app repo standalone; only touch TytusOS if a host API is truly required.

## Sprint documents

- [`STATUS.md`](./STATUS.md) — current truth and live progress ledger.
- [`SCOPE.md`](./SCOPE.md) — implemented vs missing, corrected after the bad closeout.
- [`PLAN.md`](./PLAN.md) — executable phases and gates.
- [`CODEBASE-REVIEW.md`](./CODEBASE-REVIEW.md) — repo-backed review against Atomek, Monaco samples, and VSCode.
- [`IDE-CONTEXT-CONTRACT.md`](./IDE-CONTEXT-CONTRACT.md) — production contract for dynamic chat/file/editor integration.
- [`CHAT-UX.md`](./CHAT-UX.md) — required chat repair track from the May 9 screenshots.
- [`TECHNICAL-DESIGN.md`](./TECHNICAL-DESIGN.md) — architecture for embeddings, project index, retrieval, and agent loop.
- [`UAT.md`](./UAT.md) — acceptance checks.
- [`HANDOFF.md`](./HANDOFF.md) — copy-paste continuation prompt for a fresh context window.
