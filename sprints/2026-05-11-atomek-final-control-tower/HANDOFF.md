# Handoff Prompt — Continue Atomek Resource Fabric Sprint

Work in:

```text
/Users/sebastian/Projects/tytus-apps/tytus-app-atomek
```

Read first:

```text
sprints/2026-05-11-atomek-final-control-tower/README.md
sprints/2026-05-11-atomek-final-control-tower/FEATURE-AUDIT.md
sprints/2026-05-11-atomek-final-control-tower/PRODUCT-SPEC.md
sprints/2026-05-11-atomek-final-control-tower/IMPLEMENTATION-PLAN.md
sprints/2026-05-11-atomek-final-control-tower/TECHNICAL-CONTRACTS.md
sprints/2026-05-11-atomek-final-control-tower/UAT.md
```

Current repo head when sprint was created:

```text
6333429 docs: define Tytus agent team manifest
```

Goal:

Rebuild Atomek into the Tytus Resource Fabric cockpit for autonomous agent teams. Do not continue the current noisy IDE/options shape.

Immediate implementation:

1. Phase 0: three-mode IA — Team Mission / Mission Board / Resource Setup.
2. Phase 1: harden mission folder protocol (`runs/`, `outputs/`, `proposals/`, `approvals/`, append-safe audit/run files).
3. Make task/resource actions mission-first, not tool-first.

Run gates:

```bash
npm run typecheck
npm run build
npm run release:check
```

If touching host/tray:

```bash
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-os && npm run typecheck && npm run build
cd /Users/sebastian/Projects/makakoo/api/ProjectWannolot/services/tytus-cli && cargo check -p tytus-tray && cargo test -p tytus-tray web_server -- --nocapture
```

Safety:

- no hardcoded AI model IDs
- no raw browser CORS fetches to pods
- no model-generated arbitrary shell execution
- no external message auto-send
- no direct file writes without preview/approval
