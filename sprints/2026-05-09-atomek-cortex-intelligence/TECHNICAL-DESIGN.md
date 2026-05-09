# Technical Design

## Current architecture

Atomek talks to Tytus through `host.ai`:

- `sendMessage()` for chat streaming.
- `listModels()` for model discovery.
- `writeMemory()` / `searchMemory()` for current FTS5 memory.
- `createArtifact()` / `listArtifacts()` for outputs.

Today, Atomek memory search is FTS5/BM25 only. No vectors.

## Proposed architecture

### 0. Chat UX foundation

Before retrieval/indexing work, harden the chat component:

```text
ChatPane
  transcript scroll container
  stickToLatest state
  active streaming message state
  context chip state
  composer action bar
  edit-intent bridge to existing preview/apply parser
```

Rules:

- Stream updates must mutate rendered assistant content incrementally.
- Auto-scroll only while the user is at/near the bottom.
- User scroll-up disables follow mode until `Jump to latest` is clicked.
- File/context chips are explicit and removable.
- Edit-intent prompts should route into patch/replacement preview when possible.
- Routing/model controls read/write aliases; no app-side model constants.

### A. Atomek-side project index

Create a new workbench module:

```text
src/workbench/ai/projectIndex/
  chunker.ts
  indexStore.ts
  retrieval.ts
  useProjectIndex.ts
```

Responsibilities:

- derive chunks from `WorkbenchFile[]`
- persist by `file.path + content hash`
- skip unchanged chunks
- expose indexing status to UI
- search chunks by hybrid retrieval

### B. Embedding provider contract

Do **not** hardcode an embedding model. Add host/API capability only if needed:

```ts
host.ai.embedText?.({ input, model?: userAlias, gatewayPreference })
host.ai.listModels?.({ capability: 'embedding' })
```

Fallback if host lacks embeddings:

- keep FTS5/search-only project retrieval
- UI says “Semantic index unavailable — using keyword retrieval”
- no fake vectors

### C. Storage shape

Preferred if TytusOS host API supports app DB access cleanly:

```text
atomek_project_chunks
  id
  workspace_key
  file_path
  language
  content_hash
  chunk_index
  body
  created_at
  updated_at

atomek_project_vectors
  chunk_id
  model_alias
  dim
  vector_blob
  updated_at
```

If standalone app cannot create durable SQLite tables yet, use IndexedDB/local app storage as temporary implementation, with a migration note.

### D. Retrieval flow

```text
user prompt
  -> recall explicit memories via host.ai.searchMemory
  -> retrieve project chunks via hybrid search
  -> build context parts
  -> host.ai.sendMessage({ context })
```

Ranking:

- exact path/name match boost
- FTS keyword score
- vector cosine score when available
- active/open file boost
- recency/hash freshness boost

### E. Agentic edit/check loop

Initial local loop:

1. Ask AI for unified diff with opened/indexed file paths.
2. Parse patch with existing `extractWorkspacePatch`.
3. Preview/apply via current UI.
4. If project has checks configured, run via future host command API.
5. Until host command API exists, expose “copy check command” and mark checks as manual.

Host command execution is a separate TytusOS dependency; do not fake it.
