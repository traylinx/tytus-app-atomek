import type { BrowserDirectoryHandleLike } from '../types';

export type AtomekLocalTool = {
  id: string;
  label: string;
  command?: string;
  kind: string;
  status: string;
  version?: string | null;
  description?: string;
};

export type AtomekSkillSummary = {
  id: string;
  title: string;
  description: string;
  driver: string;
  source: string;
  status: string;
  appId?: string;
  skillUrl?: string;
  triggers?: string[];
};

export type AtomekSkillPack = AtomekSkillSummary & {
  body: string;
  setup?: string[];
};

export type LocalAgentRunState = {
  id: string;
  jobId?: string;
  toolId: string;
  label: string;
  status: 'running' | 'failed' | 'complete' | 'canceling';
  startedAt: number;
  finishedAt?: number;
  exitCode?: number;
  taskId?: string;
  taskTitle?: string;
  transcriptPath?: string;
  lines: string[];
};

export type MissionAuditEvent = {
  ts: string;
  kind: string;
  message: string;
  data?: Record<string, unknown>;
};

export type MissionFolderState = {
  handle?: BrowserDirectoryHandleLike;
  name: string;
  missionId: string;
  title: string;
  goal: string;
  rootPath?: string;
  source: 'tray' | 'browser';
  teamPresetId?: string;
};

export type MissionTaskPreview = {
  id: string;
  title: string;
  prompt: string;
  resourceHint: string;
  role: string;
  assignedResourceLabel: string;
  status: 'ready' | 'waiting' | 'running' | 'needs-approval' | 'done';
  expectedOutputs: string[];
};

export type TeamPresetId = 'repo-repair' | 'pod-local' | 'creative-production' | 'research-watch';

export type TeamRoleAssignment = {
  role: 'planner' | 'implementer' | 'reviewer' | 'team-desk' | 'app-tool' | 'status';
  label: string;
  purpose: string;
  resourceId: string;
  resourceLabel: string;
  status: string;
  trustTier: string;
  sandbox: string;
};

export type TeamPresetPreview = {
  id: TeamPresetId;
  label: string;
  summary: string;
  bestFor: string;
  readiness: 'ready' | 'partial' | 'needs-setup';
  assignments: TeamRoleAssignment[];
};
