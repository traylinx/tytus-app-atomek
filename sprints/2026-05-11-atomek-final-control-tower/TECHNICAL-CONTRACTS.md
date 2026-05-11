# Technical Contracts

## Existing contracts to keep

Already present in `@tytus/host-api`:

- `host.local.listTools()`
- `host.local.openTerminal()`
- `host.local.runJob()`
- `host.local.streamJob()`
- `host.local.cancelJob()`
- `host.skills.list/get/resolve()`
- `host.resources.list/refresh()`
- `host.missions.list/listRuns/create/write()`
- `host.ai` chat, memory, artifacts, model discovery

## Required additions / hardening

### 1. Mission directory creation contract

Current `host.missions.write()` writes files. Final sprint needs directory creation guarantee for:

```text
runs/
outputs/
proposals/
approvals/
```

Option A: `write()` treats `path` ending `/` as directory.  
Option B: add `host.missions.ensureDirs(rootPath, dirs[])`.

Prefer B for clarity.

### 2. Append-safe audit contract

Need append mode for `AUDIT.jsonl` / `RUNS.jsonl`.

```ts
host.missions.append(input: {
  rootPath: string;
  path: 'AUDIT.jsonl' | 'RUNS.jsonl' | string;
  line: string;
}): Promise<{ ok: true; path: string }>;
```

Without this, Atomek risks rewriting event history.

### 3. Unified run record

```ts
type MissionRunKind = 'local-agent' | 'pod-agent' | 'app-skill' | 'channel' | 'human';

type MissionRunRecord = {
  id: string;
  kind: MissionRunKind;
  resourceId: string;
  taskId: string;
  label: string;
  status: 'queued' | 'running' | 'blocked' | 'complete' | 'failed' | 'canceling';
  startedAt: string;
  finishedAt?: string;
  transcriptPath?: string;
  outputPaths?: string[];
  proposalPaths?: string[];
  approvalIds?: string[];
  error?: string;
};
```

### 4. Pod task dispatch

Needed for Phase 5.

```ts
host.pods.dispatchMissionTask(input: {
  podId: string;
  missionRootPath: string;
  taskId: string;
  prompt: string;
  sharedFolderId?: string;
  contextFiles?: string[];
}): Promise<{
  runId: string;
  streamUrl?: string;
  transcriptPath?: string;
}>;
```

Implementation must route through same-origin tray/proxy, not direct browser fetch to pod URL.

### 5. App skill execution descriptor

```ts
type AppSkillAction = {
  skillId: string;
  driver: 'tytus-app' | 'mcp' | 'host-api' | 'local-job';
  status: 'ready' | 'needs-setup' | 'unavailable';
  inputSchema?: unknown;
  outputKinds: Array<'artifact' | 'file' | 'proposal' | 'report'>;
  setupAction?: { label: string; commandPreview?: string; deepLink?: string };
};
```

### 6. Approval model

```ts
type ApprovalRequest = {
  id: string;
  missionId: string;
  taskId?: string;
  runId?: string;
  kind: 'file-write' | 'shell' | 'pod-cost' | 'external-message' | 'publish';
  title: string;
  risk: 'low' | 'medium' | 'high';
  summary: string;
  payloadPath?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  decidedAt?: string;
};
```

## Safety invariants

- Browser never runs raw model-generated shell.
- Pod dispatch uses same-origin tray/host bridge.
- Pod gets mission/shared-folder context, not entire local disk.
- Local file writes go through Atomek preview/approval.
- External messages are drafts until user approves.
- Model IDs remain dynamic AIL aliases/settings.
