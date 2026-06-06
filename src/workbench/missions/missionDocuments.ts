import type { TytusResourceGraph } from '@tytus/host-api';
import type { WorkbenchFile } from '../types';
import type { MissionFolderState, MissionTaskPreview, TeamPresetId, TeamRoleAssignment } from './missionTypes';
import { buildTeamPresetPreview, formatAssignment, pickTeamPresetId, resourceDisplayLabel, resourceSummary } from './missionResources';

export function buildMissionTasks(goal: string, graph: TytusResourceGraph | null, presetId?: TeamPresetId): MissionTaskPreview[] {
  const trimmedGoal = goal.trim() || 'Coordinate a Tytus mission.';
  const selectedPreset = buildTeamPresetPreview(graph, pickTeamPresetId(trimmedGoal, graph, presetId));
  const assignmentFor = (role: TeamRoleAssignment['role']) => selectedPreset.assignments.find((assignment) => assignment.role === role);
  const planner = assignmentFor('planner');
  const implementer = assignmentFor('implementer');
  const reviewer = assignmentFor('reviewer');
  const desk = assignmentFor('team-desk');
  const appTool = assignmentFor('app-tool');
  return [
    {
      id: 'task-scope',
      title: 'Scope mission and context',
      prompt: `Planner role: turn this goal into an executable mission plan, list required files/assets, and define approval gates. Goal: ${trimmedGoal}`,
      resourceHint: planner ? formatAssignment(planner) : 'Planner agent',
      role: 'planner',
      assignedResourceLabel: planner?.resourceLabel ?? 'Planner agent',
      status: 'ready',
      expectedOutputs: ['PLAN.md', 'risk list', 'resource choices'],
    },
    {
      id: 'task-execute',
      title: 'Execute or produce artifact',
      prompt: `Implementer role: use the mission folder, selected files, and shared/team desk context to execute the smallest safe step. Return transcript, artifact, or patch proposal only. Goal: ${trimmedGoal}`,
      resourceHint: implementer ? formatAssignment(implementer) : 'Local/app implementer',
      role: 'implementer',
      assignedResourceLabel: implementer?.resourceLabel ?? 'Local/app implementer',
      status: 'waiting',
      expectedOutputs: ['transcript', 'artifact', 'patch proposal'],
    },
    appTool ? {
      id: 'task-app-tool',
      title: 'Drive app skill',
      prompt: `App-tool role: use the relevant app skill only through configured Tytus/app instructions. Save source assets and outputs into the mission/team desk. Goal: ${trimmedGoal}`,
      resourceHint: formatAssignment(appTool),
      role: 'app-tool',
      assignedResourceLabel: appTool.resourceLabel,
      status: appTool.status === 'ready' || appTool.status === 'available' ? 'waiting' : 'needs-approval',
      expectedOutputs: ['app output', 'asset path', 'usage notes'],
    } : null,
    {
      id: 'task-handoff',
      title: 'Review and hand off',
      prompt: `Reviewer role: independently review the outputs, list approval decisions, and prepare a handoff that another agent can continue from. Goal: ${trimmedGoal}`,
      resourceHint: reviewer ? `${formatAssignment(reviewer)} · ${desk?.resourceLabel ?? 'mission folder'}` : 'Reviewer + mission folder',
      role: 'reviewer',
      assignedResourceLabel: reviewer?.resourceLabel ?? 'Reviewer agent',
      status: 'waiting',
      expectedOutputs: ['REVIEW.md', 'HANDOFF.md', 'approval list'],
    },
  ].filter(Boolean) as MissionTaskPreview[];
}

export function buildTasksMarkdown(tasks: MissionTaskPreview[]): string {
  return [
    '# Mission tasks',
    '',
    ...tasks.map((task, index) => [
      `## ${index + 1}. ${task.title}`,
      '',
      `- ID: \`${task.id}\``,
      `- Status: ${task.status}`,
      `- Role: ${task.role}`,
      `- Assigned resource: ${task.assignedResourceLabel}`,
      `- Resource hint: ${task.resourceHint}`,
      `- Expected outputs: ${task.expectedOutputs.join(', ')}`,
      '',
      task.prompt,
      '',
    ].join('\n')),
  ].join('\n');
}

export function buildHandoffMarkdown(mission: MissionFolderState): string {
  return [
    `# Handoff — ${mission.title}`,
    '',
    `- Mission ID: \`${mission.missionId}\``,
    `- Root: \`${mission.rootPath ?? mission.name}\``,
    `- Updated: ${new Date().toISOString()}`,
    '',
    '## What changed',
    '',
    '- TBD',
    '',
    '## Decisions',
    '',
    '- TBD',
    '',
    '## Open approvals',
    '',
    '- No direct writes without Atomek preview/approval.',
    '',
    '## Next owner',
    '',
    '- Pick the next OpenClaw, Hermes, local-agent, shared-folder, or app-skill resource from Atomek.',
    '',
  ].join('\n');
}

export function buildMissionMarkdown(mission: MissionFolderState, graph: TytusResourceGraph | null, activeFile: WorkbenchFile | null, openEditors: WorkbenchFile[], prompt: string, presetId?: TeamPresetId): string {
  const preset = buildTeamPresetPreview(graph, pickTeamPresetId(prompt || mission.goal, graph, presetId ?? mission.teamPresetId));
  return [
    `# ${mission.title}`,
    '',
    `- Mission ID: \`${mission.missionId}\``,
    `- Updated: ${new Date().toISOString()}`,
    `- Folder: ${mission.rootPath ?? mission.name}`,
    '',
    '## Goal',
    '',
    mission.goal || '(no goal set)',
    '',
    '## Team preset',
    '',
    `- Preset: ${preset.label} (${preset.readiness})`,
    `- Best for: ${preset.bestFor}`,
    `- Summary: ${preset.summary}`,
    '',
    ...preset.assignments.map((assignment) => `- ${assignment.label}: ${assignment.resourceLabel} — ${assignment.purpose} [${assignment.status}, ${assignment.trustTier}, ${assignment.sandbox}]`),
    '',
    '## Current Atomek context',
    '',
    activeFile
      ? `- Active file: \`${activeFile.path}\` (${activeFile.language}, ${activeFile.content.length} chars${activeFile.dirty ? ', dirty' : ''})`
      : '- Active file: none',
    `- Open editors: ${openEditors.length}`,
    '',
    '## Current task',
    '',
    prompt || '(no task prompt set)',
    '',
    '## Resource graph',
    '',
    graph ? `- ${resourceSummary(graph.resources)}` : '- not loaded',
    ...(graph?.warnings?.length ? graph.warnings.map((warning) => `- Warning: ${warning.code} — ${warning.message}`) : []),
    '',
    '## Rules',
    '',
    '- Mission folder is the shared source of truth.',
    '- Shared folder / Team Desk is the exchange layer between local computer and Tytus pods when available.',
    '- Agents must not write project files directly.',
    '- Proposed edits must be returned as unified diffs or fenced replacement blocks.',
    '- Atomek previews and approves edits before applying.',
    '- Secrets are never requested or copied into mission context.',
  ].join('\n');
}

export function buildResourcesMarkdown(graph: TytusResourceGraph | null): string {
  if (!graph) return '# Resources\n\nResource graph not loaded yet.\n';
  return [
    '# Resources',
    '',
    `Generated: ${graph.generatedAt}`,
    '',
    ...graph.resources.map((resource) => [
      `## ${resourceDisplayLabel(resource)}`,
      '',
      `- ID: \`${resource.id}\``,
      `- Kind: ${resource.kind}`,
      `- Status: ${resource.status}${resource.reason ? ` — ${resource.reason}` : ''}`,
      `- Trust: ${resource.trustTier}`,
      `- Sandbox: ${resource.sandbox}`,
      `- Capabilities: ${resource.capabilities.join(', ') || 'none'}`,
      resource.allowedRoots.length ? `- Allowed roots: ${resource.allowedRoots.map((root) => `\`${root}\``).join(', ')}` : '- Allowed roots: none',
      '',
    ].join('\n')),
    graph.warnings.length ? '## Warnings\n' : '',
    ...graph.warnings.map((warning) => `- ${warning.code}: ${warning.message}${warning.resourceId ? ` (${warning.resourceId})` : ''}`),
    '',
  ].join('\n');
}

export function buildMissionJson(mission: MissionFolderState, graph: TytusResourceGraph | null, prompt: string, presetId?: TeamPresetId): string {
  const selectedPresetId = pickTeamPresetId(prompt || mission.goal, graph, presetId ?? mission.teamPresetId);
  const preset = buildTeamPresetPreview(graph, selectedPresetId);
  const tasks = buildMissionTasks(prompt || mission.goal, graph, selectedPresetId);
  return JSON.stringify({
    schemaVersion: 1,
    missionId: mission.missionId,
    title: mission.title,
    goal: mission.goal,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'active',
    rootPath: mission.rootPath ?? mission.name,
    teamPreset: {
      id: preset.id,
      label: preset.label,
      readiness: preset.readiness,
      summary: preset.summary,
      bestFor: preset.bestFor,
    },
    team: preset.assignments.map((assignment) => ({
      role: assignment.role,
      label: assignment.label,
      purpose: assignment.purpose,
      resourceId: assignment.resourceId,
      resourceLabel: assignment.resourceLabel,
      status: assignment.status,
      trustTier: assignment.trustTier,
      sandbox: assignment.sandbox,
    })),
    storage: {
      missionFolder: mission.rootPath ?? mission.name,
      teamDesk: preset.assignments.find((assignment) => assignment.role === 'team-desk')?.resourceLabel ?? 'mission folder',
      paths: {
        runs: 'runs/',
        outputs: 'outputs/',
        proposals: 'proposals/',
        approvals: 'approvals/',
        inbox: 'INBOX.md',
        outbox: 'OUTBOX.md',
      },
    },
    resources: (graph?.resources ?? []).filter((resource) => resource.status === 'ready').map((resource) => ({
      resourceId: resource.id,
      pinnedLabel: resourceDisplayLabel(resource),
      pinnedKind: resource.kind,
      pinnedCapabilities: resource.capabilities,
      visibility: {
        allowedRoots: resource.allowedRoots,
        sandbox: resource.sandbox,
        trustTier: resource.trustTier,
      },
    })),
    permissions: {
      fileWrite: 'preview-only',
      shellExec: 'allowlist-with-approval',
      netEgress: 'resource-default',
      secretRead: 'never',
    },
    secretsPolicy: {
      deniedGlobs: ['**/.env', '**/.env.*', '**/.ssh/**', '**/*_key*', '**/*secret*', '**/*token*', '**/id_rsa', '**/id_ed25519'],
      deniedPatterns: ['OPENAI_API_KEY\\\\s*=', 'sk-[A-Za-z0-9_-]{20,}', 'ANTHROPIC_API_KEY\\\\s*='],
    },
    budget: { maxRuntimeMinutes: 30, maxArtifactMb: 25 },
    tasks: tasks.map((task, index) => ({
      id: task.id,
      title: task.title,
      prompt: task.prompt,
      role: task.role,
      assignedResourceLabel: task.assignedResourceLabel,
      status: index === 0 ? 'ready' : 'waiting',
      selectedResourceHint: task.resourceHint,
      dependsOn: index === 0 ? [] : [tasks[index - 1].id],
      expectedOutputs: task.expectedOutputs,
      approvalGateIds: ['file-write-preview'],
    })),
  }, null, 2);
}
