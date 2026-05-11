# User Flows for the Tytus Agent Team

## Flow A — Repo repair team

User says: “Fix this repo, but show me the patch before writing.”

1. Atomek asks for mission goal and selected workspace.
2. Atomek recommends:
   - implementer: Claude or OpenCode
   - reviewer: Codex or pi
   - optional remote critique: OpenClaw pod
3. Atomek writes mission pack.
4. Implementer writes findings + patch proposal to `proposals/`.
5. Reviewer writes review to `runs/`.
6. Atomek shows one human-readable decision: apply / revise / reject.
7. Only after approval does Atomek apply edits.

What makes this better than a normal IDE agent: three agents can work from the same folder and every result is visible on disk.

## Flow B — Pod + local collaboration

User says: “Ask pod agent for product critique, then local agent implements safe changes.”

1. Pod agent receives only mission/shared-folder context.
2. Pod writes critique to shared/mission folder.
3. Local agent reads critique and selected files.
4. Local agent proposes patch.
5. Atomek records chain in timeline.

What makes this Tytus-native: remote pod never needs raw local disk; it collaborates through shared mission files.

## Flow C — Long-running watch/research

User says: “Watch this topic and notify me if blocked.”

1. Atomek creates mission.
2. Pod agent runs long-lived research/check task.
3. Channel integration sends approved status/approval request.
4. User can answer from Telegram/Slack/etc. when configured.
5. Mission folder updates with decisions.

What makes this useful: work survives the browser tab and becomes asynchronous.

## Flow D — Creative production team

User says: “Use my assets, generate music/copy/visual plan, package final output.”

1. User drops assets in shared folder.
2. OpenClaw/Hermes drafts concept/script.
3. JULI3TA app skill creates or restyles audio.
4. Blender/Remotion/Hypermotion skills run only if configured.
5. Atomek displays output artifacts and handoff.

What makes this useful: apps are tools in a mission, not isolated windows.

## Flow E — Multi-machine handoff

User says: “Continue this mission on another machine/pod.”

1. Shared folder syncs mission handoff files.
2. New Atomek instance opens mission folder.
3. Resource graph marks missing local tools as setup-needed.
4. Available agents continue from `HANDOFF.md` and latest runs.

What makes this useful: the mission is portable because the truth is files, not hidden app memory.
