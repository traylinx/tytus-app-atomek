# Sprint — Atomek Production Missions

Date: 2026-06-06
Repo: `tytus-app-atomek`
Status: Planning only — no app implementation in this sprint folder commit.

## Objective

Turn the current Atomek Agent Team / Mission surface from a resource dashboard into a production-grade mission workbench:

```text
create/resume mission -> show mission files -> edit context -> dispatch task -> watch run -> review outputs/proposals -> approve/apply -> handoff/resume
```

## Hard scope

- Work only in the Atomek app repo.
- Do not touch TytusOS, Tytus CLI, catalog, JULI3TA, OpenHouse, or provider repos in this sprint.
- Use existing host APIs only.
- Do not break existing chat, file editor, project index, patch preview, pod chat, app install, or published release flow.

## Deliverables in this planning pack

- `CURRENT-STATE-AUDIT.md` — what exists now and why it feels inert.
- `PRODUCT-SPEC.md` — production mental model and user flows.
- `UX-ARCHITECTURE.md` — final UI structure and interaction rules.
- `TECHNICAL-PLAN.md` — Atomek-only architecture and code plan.
- `MISSION-CONTRACT.md` — mission folder/file/schema contract.
- `PHASES.md` — incremental implementation phases with acceptance gates.
- `QA-PLAN.md` — verification checklist and regression risks.
- `SPRINT-MANIFEST.json` — machine-readable sprint metadata.

## Production bar

A non-technical user should be able to answer these without asking Harvey:

1. How do I create a new mission?
2. Where are the mission files?
3. What can each agent see?
4. How do I run this selected task?
5. Where did the output go?
6. What needs approval?
7. How do I resume tomorrow?

Current Atomek fails several of those. This sprint fixes the flow.

## Final review status

Green light for implementation: **YES**.

This is not a release green light. It means the sprint is now tight enough to start coding in Atomek only. See:

- `PLAN-REVIEW.md`
- `MISSION-NAMING.md`
- `IMPLEMENTATION-BRIEF.md`
- `ACCEPTANCE-GATES.md`
- `GREEN-LIGHT.md`
