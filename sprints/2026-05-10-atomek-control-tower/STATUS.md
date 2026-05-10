# Status — Atomek Control Tower

Created: 2026-05-10

## Decision

Pivot Atomek from editor/chat app to Tytus Control Tower.

## Why

Current Atomek primitives work but product shape is wrong. It is only useful if it coordinates Tytus resources: pods, local agents, shared folders, app skills, mission memory, approvals, and outputs.

## External review

Lope ask attempted with Claude/Kimi/pi on 2026-05-10.

Result:

- Kimi exited nonzero.
- Pi stalled upstream on minimax.
- Claude timed out after 180s.
- Pi synthesis still flagged the key risk: scope too broad unless MVP is narrowed to one mission/resource/run loop.

Action taken:

- Sprint narrowed to Mission Control MVP.
- Full workboard/app-skill/pod orchestration sequenced after mission/resource/run loop proves useful.

## Current repo state at creation

- `tytus-app-atomek` clean on `main...origin/main` before sprint docs.
- Current published Atomek: `v0.4.14`.
- Current published Tytus CLI beta: `v0.6.14-beta.30`.

## Next implementation target

Phase 0 + Phase 1:

1. Rename Computer / Agents surface to Control Tower / Mission Control.
2. Make mission control the useful default home.
3. Add mission list/open/resume.
4. Show resource graph as actionable cards.
5. Remove or hide dead/fake extension cards.
6. Keep editor and chat as mission views, not product center.

## Blockers

None structural. Existing APIs are enough for MVP:

- `/api/resources`
- `/api/local/tools`
- `/api/local/jobs`
- `/api/jobs/:id/stream`
- `/api/missions`
- `/api/missions/write`
- `/api/shared-folders`
- `/api/skills`
