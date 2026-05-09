# Final Review — Before Implementation

**Review date:** 2026-05-09  
**Verdict:** `GO_FOR_IMPLEMENTATION`  
**Sprint folder:** `/Users/sebastian/Projects/tytus-apps/tytus-app-atomek/sprints/2026-05-09-atomek-cortex-intelligence`

## Scope containment

All sprint information is in the unique sprint folder:

- `README.md`
- `STATUS.md`
- `SCOPE.md`
- `PLAN.md`
- `CODEBASE-REVIEW.md`
- `IDE-CONTEXT-CONTRACT.md`
- `CHAT-UX.md`
- `TECHNICAL-DESIGN.md`
- `UAT.md`
- `HANDOFF.md`
- `SPRINT-MANIFEST.json`
- `FINAL-REVIEW.md`

No Juli3ta changes are part of this sprint.

## Final architecture check

Pass.

The sprint now correctly treats chat as part of the workbench, not as a detached side panel:

```text
Monaco/File state
  -> DocumentRegistry
  -> ChatContextStore
  -> ContextBuilder
  -> useConversation
  -> Chat renderer
  -> WorkbenchEditService
  -> Monaco/File state
```

Implementation must start with the IDE context spine. RAG/embeddings come later.

## Final sequencing check

Pass.

Correct order:

1. Baseline audit
2. IDE context spine
3. Chat UX repair
4. Workspace edit pipeline
5. Project index without embeddings
6. Embedding capability discovery
7. Semantic retrieval
8. Agentic edit/check loop
9. Release/live QA

This avoids the earlier mistake of adding “intelligence” on top of a weak chat/file connection.

## Final hard-rule check

Pass.

- No hardcoded model IDs.
- No provider-specific `web_search` / tools injection.
- AIL aliases own chat models and embedding models.
- Atomek stays standalone unless a host API is truly required.
- Juli3ta remains untouched.
- File edits must go through preview/apply or explicit generate-patch CTA.

## Final codebase grounding check

Pass.

The sprint is grounded in real code paths:

- Atomek current chat/file flow: `WorkbenchShell.tsx`, `useConversation.ts`, `contextBuilder.ts`, `types.ts`, `workbench.css`.
- Monaco sample pattern: document/model identity, content-change synchronization, range translation.
- VSCode sample pattern: document/editor delta model, attachment model, chat context providers, bulk edit service, dynamic embedding providers.

## Final executable gate check

Pass.

Latest local checks before implementation:

```bash
npm run typecheck
# passed

grep -R -E "minimax|m2\.1|m2\.7|web_search" src --exclude-dir=node_modules
# clean

grep -R -E '"tools"[[:space:]]*:' src --exclude-dir=node_modules
# clean
```

Previously after the production-ready sprint update, these also passed:

```bash
npm run build
npm run release:check
```

The final review patch is docs-only.

## External validator check

Pass.

A bounded Lope review with OpenCode reviewed this final review artifact with tool use disabled. Result:

> The GO verdict is well-justified. No blocker remains. The only soft concern is that embedding provider work could slow a later phase, but the keyword-only fallback is already planned.

A broader directory-divide Lope review was attempted first, but the validator run stalled while reviewing the full sprint pack. It was killed and replaced with the bounded final-review check above. No sprint decision depends on the stalled run.

## Risks to watch during implementation

1. `WorkbenchShell.tsx` is too large. Do not keep adding major logic there; split into context/chat/edit modules.
2. React state may not map directly to Monaco model versions. Add deterministic document version/hash in Atomek state.
3. Auto-scroll can fight user scroll. Implement scroll lock/follow mode carefully.
4. Edit intent detection must not over-trigger normal Q&A. Keep a conservative detector and allow manual `Generate patch`.
5. Context budget clipping must be deterministic and visible; hidden context is not acceptable.
6. Embedding provider/API may require TytusOS work. If so, keep Atomek fallback keyword-only and touch TytusOS separately.

## Start instruction

Implementation may start.

First task: Phase 0 audit, then Phase 1 `DocumentRegistry` + `ChatContextStore` + request-specific `ContextBuilder` refactor.
