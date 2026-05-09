# Status — Atomek Cortex Intelligence Sprint

## Current truth

Atomek `0.3.9` is chat-enabled, not fully Cortex-intelligent. It also needs a chat UX repair pass before deeper Cortex work: transcript follow mode, visible streaming, removable context chips, cleaner composer, and reliable edit-preview/apply behavior.

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
- File-change prompts can still end as prose instead of a concrete preview/apply flow.
- Composer has confusing primary controls (`Auto`, `Plan`).
- Attached/active file context cannot be clearly removed per message.
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
