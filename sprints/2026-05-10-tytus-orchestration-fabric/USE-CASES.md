# Use Cases — Tytus Orchestration Fabric

## UC1 — Code change with independent review

Goal: update an app feature safely.

Resources:

- Workspace files
- Local Claude or OpenCode
- Local Codex/pi as reviewer
- Mission folder

Flow:

1. User selects repo/folder in Atomek.
2. Atomek creates mission context pack.
3. Claude/OpenCode proposes diff into `proposals/`.
4. Reviewer agent reads same mission pack and reviews proposal.
5. Atomek shows approval gate and preview diff.
6. User applies or rejects.

Why Tytus-native:

- Agents share durable files/transcripts.
- Atomek coordinates, not edits blindly.

## UC2 — Pod + local agent collaboration

Goal: use remote Tytus pod for reasoning/copy and local agent for repo patch.

Resources:

- Hermes/OpenClaw pod
- Local Claude/OpenCode
- Shared folder via garagetytus

Flow:

1. Hermes writes plan/copy in mission folder.
2. Local agent reads Hermes output and creates patch.
3. Atomek captures both transcripts.
4. User sees timeline and approves patch.

Risk controls:

- Pod only sees mission folder.
- Secrets excluded from pack.
- Cost gate before pod task starts.

## UC3 — Product video pipeline

Goal: create product/demo video assets.

Resources:

- Hermes for script
- Remotion/Hypermotion skill for render
- Blender MCP optional for scene/asset generation
- Shared folder for media assets

Flow:

1. Hermes writes script.
2. User approves script.
3. Remotion task depends on approved script.
4. Render outputs to `outputs/video/`.
5. Atomek previews artifact and saves final handoff.

Why not clone:

- Atomek does not become video editor. It coordinates installed tools.

## UC4 — API smoke + implementation loop

Goal: test endpoint, update client code, retest.

Resources:

- API Tester skill
- Local code agent
- Workspace files

Flow:

1. API Tester probes endpoint and writes response artifact.
2. Local agent reads response and patches client.
3. API Tester reruns.
4. Mission timeline records before/after.

## UC5 — Music/creative asset workflow

Goal: generate soundtrack/voice/music and attach to project.

Resources:

- JULI3TA skill
- Shared media folder
- Local agent for metadata/readme

Flow:

1. JULI3TA generates audio artifact.
2. Atomek stores metadata in mission outputs.
3. Local agent updates project docs/credits.

## UC6 — Multi-agent disagreement arbitration

Goal: decide between two implementation approaches.

Resources:

- Claude
- OpenCode
- Kimi/pi
- Atomek chat

Flow:

1. Atomek creates two/three analysis tasks.
2. Each agent writes recommendation.
3. Atomek synthesizes agreements/disagreements.
4. User picks one; mission records decision.

## UC7 — Resume mission next day

Goal: continue a long task after restart.

Resources:

- Mission registry
- Existing context pack
- Existing transcripts/artifacts

Flow:

1. Atomek starts and discovers active missions.
2. User opens mission.
3. Atomek reconstructs timeline from `AUDIT.jsonl`.
4. Agents receive prompt prelude to read current mission state.

## UC8 — Cross-machine handoff

Goal: continue work from another computer or pod.

Resources:

- garagetytus shared folder
- Mission export/zip
- Tytus pods

Flow:

1. Mission folder syncs via shared binding.
2. Another machine opens same mission.
3. Resource graph updates local availability.
4. Missing local tools show setup-needed; pod tasks can continue.
