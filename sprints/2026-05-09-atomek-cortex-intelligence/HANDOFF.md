# Handoff Prompt

Copy this into a fresh context window:

```text
You are Harvey. Continue the Atomek Cortex Intelligence Sprint.

Repo:
/Users/sebastian/Projects/tytus-apps/tytus-app-atomek

Sprint folder:
/Users/sebastian/Projects/tytus-apps/tytus-app-atomek/sprints/2026-05-09-atomek-cortex-intelligence

Read first:
- README.md
- STATUS.md
- SCOPE.md
- TECHNICAL-DESIGN.md
- PLAN.md
- CODEBASE-REVIEW.md
- IDE-CONTEXT-CONTRACT.md
- CHAT-UX.md
- UAT.md

Current truth:
Atomek v0.3.9 has real host.ai chat, AIL routing, model alias settings, artifacts, threads, retry/regenerate/stop, edit preview/apply, and FTS5 memory. It does NOT yet have dynamic IDE-grade chat/file integration, embeddings, semantic RAG, workspace indexing, or agentic edit/check loop. Screenshots from 2026-05-09 also show chat UX defects: no reliable transcript follow mode, streaming not visibly alive, file-edit prompts not reliably producing changes, confusing `Auto` / `Plan` composer controls, and context files not clearly removable. Code review against Monaco/VSCode samples shows the production fix must add a document registry, chat context store, context attachments, and workspace edit service before RAG.

Hard rules:
- Do not hardcode model IDs.
- Do not hardcode provider tools like web_search.
- Use global AIL config/aliases for chat and embeddings.
- Do not change Juli3ta.
- Keep Atomek standalone; touch TytusOS only if host API is truly required.

Start with Phase 0 in PLAN.md, then implement Phase 1 IDE context spine before chat polish/indexing/RAG.
Run gates before claiming completion.
```
