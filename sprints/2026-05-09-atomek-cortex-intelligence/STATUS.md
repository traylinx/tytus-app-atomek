# Status — Atomek Cortex Intelligence Sprint

## Current truth

Atomek `0.3.9` is chat-enabled, not fully Cortex-intelligent. It also needs a production chat/file integration pass before deeper Cortex work: a document registry, dynamic/removable context attachments, transcript follow mode, visible streaming, cleaner composer, and reliable edit-preview/apply behavior.

### Already shipped before this sprint

- Real chat through `host.ai.sendMessage()`.
- Remote/local/auto AIL routing selection.
- Free-form model alias field resolved by global AIL config.
- Model discovery through `host.ai.listModels()`.
- Chat threads with rename/delete.
- Backward-compatible local rename fallback if `host.ai.updateThread` is missing.
- Stop, retry, regenerate.
- Save AI answer as artifact.
- AI synthesis artifact creation.
- Preview/apply AI edit suggestions from fenced replacement or unified diff.
- Unsaved warning after AI-applied edits.
- Memory write/search through `host.ai.writeMemory()` / `host.ai.searchMemory()`.

### Missing / not done

- Chat transcript does not reliably follow new messages/stream output.
- Streaming is not visibly trustworthy in the UI.
- Chat/file context is implicit and sampled at send time instead of a live interactive context model.
- Active file/open editors are injected unconditionally by `buildAiContext()`; user cannot inspect/remove exact context.
- File-change prompts can still end as prose instead of a concrete preview/apply flow.
- Composer has confusing primary controls (`Auto`, `Plan`).
- Attached/active file context cannot be clearly removed per message.
- `WorkbenchShell.tsx` is carrying too much chat/context/edit responsibility and needs production component/service split.
- No Atomek embedding pipeline.
- No semantic/vector RAG in Atomek.
- No project/workspace file index.
- No “ask across folder/project”.
- No durable project knowledge base with chunk metadata.
- No hybrid retrieval combining FTS5 + vector search.
- No agentic edit loop that runs checks and iterates.
- No explicit Cortex task planner/executor state machine.

## Progress ledger

- 2026-05-09: Sprint folder created. Status corrected from false “complete” to `READY_TO_EXECUTE`.
- 2026-05-09: Added chat UX repair track from screenshots: auto-follow, visible streaming, edit-preview/apply reliability, composer cleanup, and removable context chips.
- 2026-05-09: Re-reviewed sprint against Atomek, Monaco sample, and VSCode sample codebases. Added production IDE context contract and corrected sequencing so dynamic chat/file integration lands before RAG/embeddings.

- 2026-05-09: Implemented Phase 0/1/2 spine in Atomek source: document registry, per-message chat context scope, removable/revealable context chips, active selection capture, request-specific context assembly, transcript follow/jump-to-latest, safer stop behavior, and edit-intent strict patch prompting, auto-preview for parseable patches, and Generate Patch CTA when a response is prose-only.
  - `host.ai` type audit confirmed no embedding API yet; semantic retrieval must stay keyword-only until Phase 5 host capability lands.
  - Gates passed: `npm run typecheck`, `npm run build`, `npm run release:check`, model/tool hardcode greps.
