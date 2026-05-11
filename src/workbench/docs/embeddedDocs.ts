import resourceFabric from './tytus-resource-fabric.md?raw';
import openClawHermes from './openclaw-hermes.md?raw';
import sharedFolders from './shared-folders.md?raw';
import missionUseCases from './mission-use-cases.md?raw';
import appSkills from './agentic-app-skills.md?raw';

export type AtomekEmbeddedDoc = {
  id: string;
  title: string;
  summary: string;
  fileName: string;
  body: string;
  tags: string[];
};

export const ATOMEK_EMBEDDED_DOCS: AtomekEmbeddedDoc[] = [
  {
    id: 'resource-fabric',
    title: 'Tytus Resource Fabric',
    summary: 'How local computer, pods, shared folders, local agents, apps, channels, and AIL routes work together.',
    fileName: 'Tytus-Resource-Fabric.md',
    body: resourceFabric,
    tags: ['Tytus', 'mission', 'resources'],
  },
  {
    id: 'openclaw-hermes',
    title: 'OpenClaw + Hermes',
    summary: 'When to use OpenClaw, Hermes, and local agents in one team.',
    fileName: 'OpenClaw-Hermes-Agents.md',
    body: openClawHermes,
    tags: ['OpenClaw', 'Hermes', 'agents'],
  },
  {
    id: 'shared-folders',
    title: 'Shared folders',
    summary: 'Mission folders, INBOX/OUTBOX, pod workspaces, and agent handoff conventions.',
    fileName: 'Shared-Folders.md',
    body: sharedFolders,
    tags: ['shared', 'files', 'handoff'],
  },
  {
    id: 'mission-use-cases',
    title: 'Mission use cases',
    summary: 'Repo repair, documents, creative production, research watch, and app automation.',
    fileName: 'Mission-Use-Cases.md',
    body: missionUseCases,
    tags: ['use cases', 'workflow'],
  },
  {
    id: 'agentic-app-skills',
    title: 'Agentic app skills',
    summary: 'How Tytus apps expose skills and how Atomek uses them safely.',
    fileName: 'Agentic-App-Skills.md',
    body: appSkills,
    tags: ['skills', 'apps'],
  },
];

export function findEmbeddedDoc(id: string): AtomekEmbeddedDoc | undefined {
  return ATOMEK_EMBEDDED_DOCS.find((doc) => doc.id === id);
}
