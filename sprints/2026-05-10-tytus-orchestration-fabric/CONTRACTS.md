# Contracts v1 — Tytus Orchestration Fabric

Status: DRAFT, required before implementation.

## Resource graph

```ts
export type TytusResourceKind =
  | 'workspace'
  | 'shared-folder'
  | 'local-cli'
  | 'pod-agent'
  | 'app-skill'
  | 'ail-route';

export type TytusCapability =
  | 'text-gen'
  | 'code-edit'
  | 'code-review'
  | 'test-run'
  | 'web-fetch'
  | 'file-read'
  | 'file-write-preview'
  | 'file-write-direct'
  | 'image-edit'
  | 'image-gen'
  | 'video-render'
  | 'audio-gen'
  | 'shell-exec-allowlist';

export type TytusResourceStatus = 'ready' | 'degraded' | 'needs-setup' | 'unreachable';
export type TytusTrustTier = 'local-private' | 'tytus-pod' | 'remote-ail' | 'third-party-app';
export type TytusSandbox = 'mission-folder' | 'pod' | 'process' | 'browser-app' | 'none';

export interface TytusResource {
  id: string;
  kind: TytusResourceKind;
  label: string;
  status: TytusResourceStatus;
  reason?: string;
  capabilities: TytusCapability[];
  trustTier: TytusTrustTier;
  sandbox: TytusSandbox;
  allowedRoots: string[];
  cost: {
    unit: 'free' | 'tytus-units' | 'tokens' | 'dollars';
    tier: 'low' | 'mid' | 'high';
    perCall?: number;
  };
  setupAction?: {
    label: string;
    deepLink?: string;
    commandPreview?: string;
  };
  metadata?: Record<string, unknown>;
}

export interface TytusResourceGraph {
  generatedAt: string;
  resources: TytusResource[];
  warnings: Array<{ code: string; message: string; resourceId?: string }>;
}
```

## Mission context pack

```ts
export interface TytusContextPackV1 {
  schemaVersion: 1;
  missionId: string;
  title: string;
  goal: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'active' | 'paused' | 'complete' | 'archived';
  rootPath: string;
  resources: Array<{
    resourceId: string;
    pinnedLabel: string;
    pinnedKind: TytusResourceKind;
    pinnedCapabilities: TytusCapability[];
  }>;
  permissions: {
    fileWrite: 'preview-only' | 'mission-folder-only' | 'direct-with-approval';
    shellExec: 'never' | 'allowlist-with-approval';
    netEgress: 'none' | 'allowlist' | 'resource-default';
    secretRead: 'never';
  };
  secretsPolicy: {
    deniedGlobs: string[];
    deniedPatterns: string[];
  };
  budget: {
    maxTytusUnits?: number;
    maxDollars?: number;
    maxRuntimeMinutes?: number;
    maxArtifactMb?: number;
  };
  tasks: TytusMissionTask[];
}

export interface TytusMissionTask {
  id: string;
  title: string;
  prompt: string;
  status: 'todo' | 'ready' | 'running' | 'blocked' | 'needs-approval' | 'failed' | 'complete';
  assignedResourceId?: string;
  dependsOn: string[];
  expectedOutputs: string[];
  approvalGateIds: string[];
}
```

Default deny globs:

```text
**/.env
**/.env.*
**/.ssh/**
**/*_key*
**/*secret*
**/*token*
**/id_rsa
**/id_ed25519
```

Default denied content patterns:

```text
OPENAI_API_KEY\s*=
sk-[A-Za-z0-9_-]{20,}
sk-tytus-[A-Za-z0-9_-]{10,}
ANTHROPIC_API_KEY\s*=
```

## Orchestration run

```ts
export interface OrchestrationRun {
  id: string;
  missionId: string;
  taskId: string;
  driver: 'local-cli' | 'pod-agent' | 'app-skill' | 'terminal' | 'ail-chat';
  resourceId: string;
  status: 'queued' | 'running' | 'needs-input' | 'needs-approval' | 'failed' | 'cancelled' | 'complete';
  startedAt?: string;
  endedAt?: string;
  durationMs?: number;
  inputContextPackId: string;
  parentRunId?: string;
  streamChannel?: string;
  transcriptPath: string;
  resultPath?: string;
  outputFiles: string[];
  proposalIds: string[];
  approvalsPending: ApprovalGate[];
  cost: {
    tytusUnits?: number;
    tokens?: number;
    dollars?: number;
  };
  error?: {
    code: string;
    message: string;
    retryable: boolean;
  };
}
```

## Approval gates

```ts
export interface ApprovalGate {
  id: string;
  missionId: string;
  runId?: string;
  kind:
    | 'file-write'
    | 'shell-exec'
    | 'pod-cost'
    | 'network-egress'
    | 'secret-read'
    | 'app-native-write';
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  summary: string;
  details: Record<string, unknown>;
  createdAt: string;
  resolvedAt?: string;
}
```

## Tray/API additions

### `GET /api/resources`

Returns:

```json
{
  "generatedAt": "2026-05-10T00:00:00Z",
  "resources": [],
  "warnings": []
}
```

Sources:

- existing `/api/state` for pods
- existing `/api/local/tools` for local CLIs
- existing `/api/skills` for app skills
- shared-folder bindings from existing tray shared-folder code
- Tytus Home/Inbox/Outbox roots from existing file API

### `GET /api/shared-folders`

Returns normalized bindings:

```ts
export interface SharedFolderResource {
  id: string;
  label: string;
  localPath: string;
  bucket?: string;
  autoSync: boolean;
  status: 'ready' | 'needs-setup' | 'degraded' | 'missing';
  podsProvisioned: string[];
}
```

## Host API additions

```ts
export interface ResourcesApi {
  list(): Promise<TytusResourceGraph>;
  refresh(): Promise<TytusResourceGraph>;
}
```

Add optional `resources?: ResourcesApi` to `HostClient`.
