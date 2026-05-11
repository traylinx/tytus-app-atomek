# Status

- Created: 2026-05-11
- Phase: planning complete, Lope-reviewed, implementation not started
- Repo state when created: clean on `main` at `6333429`
- Previous pack: `2026-05-11-tytus-agent-team-manifest`

## Current conclusion

Atomek has enough backend primitives to become useful, but needs product/UX consolidation around missions and teams.

## No blocking questions

Use conservative defaults:

- mission-first UX
- resource graph truth only
- pod dispatch through same-origin tray/host bridge
- local agents are role/task actions, not raw tool cards
- app skills only actionable when configured
- approval-first writes/messages/costs

## Next executable action

Implement Phase 0 and Phase 1:

1. Three-mode IA: Team Mission / Mission Board / Resource Setup.
2. Complete mission folder protocol and append-safe audit/run files.
3. Remove duplicate noisy Computer/Agents/Extensions surfaces.

## Must not do

- Do not keep adding small buttons to current clutter.
- Do not hardcode model IDs.
- Do not fake Hermes/Blender/Hypermotion availability.
- Do not make Atomek a clone of VS Code, Claude, OpenCode, or Antigravity.


## Lope review outcome

Accepted corrections:

- Core vertical first; expansion second.
- Mission Board and approval skeleton earlier.
- Pod dispatch moved into core proof.
- Shared folder folded into Team Mission / mission protocol.
- Chat cleanup folded into IA and Mission Copilot work.
- Channels explicitly deferred to expansion, not forgotten.

## Revised next executable action

Implement Phase 0a, 0b, and Phase 1 in one coherent branch. Stop before pod/app dispatch unless these gates pass.
