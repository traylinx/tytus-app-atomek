# QA Harness — Atomek Cortex Intelligence

## Purpose

Lightweight verification for the released v0.4.0 cortex spine without changing app runtime logic.

The harness lives at:

```bash
scripts/verify-cortex-contracts.mjs
```

It compiles the pure TypeScript workbench modules into a temporary CommonJS sandbox and runs Node assertions against the public contracts.

## Coverage

- Context builder/store
  - document registry active/open document bookkeeping
  - document version/hash propagation
  - active-selection fallback and selected text extraction
  - open-editor attachment order
  - removed attachment/reset behavior
  - emitted AI context parts and manifest metadata
- Patch parser/edit service
  - fenced unified diff extraction
  - per-file diff path metadata
  - hunk application
  - workspace edit candidate metadata/version/hash base
  - apply path dirty marking
  - conflict guard when content changes after preview
  - replacement block path parsing
  - suffix path matching
- Project index retrieval
  - vendor skip behavior
  - index snapshot maps/chunks/skips
  - keyword retrieval ordering
  - dirty-hit exclusion via retrieval option
  - context-hit text formatting
  - stale-report detection after file content changes

## Run

```bash
cd /Users/sebastian/Projects/tytus-apps/tytus-app-atomek
node scripts/verify-cortex-contracts.mjs
```

Expected output:

```text
Atomek cortex contract harness: PASS
```

## Notes

- The harness intentionally avoids Vitest/Jest because this repo currently has no test runner dependency.
- It does not render React/Monaco UI. Live behavior remains covered by the live QA checklist.
- It does not touch JULI3TA or TytusOS.
