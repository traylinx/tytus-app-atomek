import type { TytusResourceGraph } from '@tytus/host-api';
import { languageForPath } from '../language';
import type { WorkbenchFile } from '../types';
import type { MissionFolderState, TeamPresetId } from './missionTypes';
import { buildHandoffMarkdown, buildMissionJson, buildMissionMarkdown, buildMissionTasks, buildResourcesMarkdown, buildTasksMarkdown } from './missionDocuments';
import { stableId } from '../fileAccess';

export type MissionGeneratedFile = {
  path: string;
  content: string;
  primary?: boolean;
  editable?: boolean;
};

export const PRIMARY_MISSION_FILE_PATHS = ['MISSION.md', 'TASKS.md', 'RESOURCES.md', 'HANDOFF.md'];

export function buildMissionPackFiles(
  mission: MissionFolderState,
  graph: TytusResourceGraph | null,
  activeFile: WorkbenchFile | null,
  openEditors: WorkbenchFile[],
  prompt: string,
  presetId?: TeamPresetId,
  auditLines: string[] = [],
): MissionGeneratedFile[] {
  const tasks = buildMissionTasks(prompt || mission.goal, graph, presetId);
  return [
    { path: 'MISSION.md', content: buildMissionMarkdown(mission, graph, activeFile, openEditors, prompt, presetId), primary: true, editable: true },
    { path: 'MISSION.json', content: buildMissionJson(mission, graph, prompt, presetId), editable: true },
    { path: 'RESOURCES.md', content: buildResourcesMarkdown(graph), primary: true, editable: true },
    { path: 'TASKS.md', content: buildTasksMarkdown(tasks), primary: true, editable: true },
    { path: 'HANDOFF.md', content: buildHandoffMarkdown(mission), primary: true, editable: true },
    { path: 'INBOX.md', content: '# Mission inbox\n\nDrop incoming agent notes, pod outputs, and shared-folder discoveries here.\n', editable: true },
    { path: 'OUTBOX.md', content: '# Mission outbox\n\nApproved handoffs, final artifacts, and user-ready summaries go here.\n', editable: true },
    { path: 'AUDIT.jsonl', content: auditLines.join(''), editable: false },
    { path: 'RUNS.jsonl', content: '', editable: false },
    { path: 'runs/README.md', content: '# Mission runs\n\nLocal, pod, and app run transcripts land here.\n', editable: true },
    { path: 'outputs/README.md', content: '# Mission outputs\n\nFinal artifacts and generated files land here before handoff.\n', editable: true },
    { path: 'proposals/README.md', content: '# Mission proposals\n\nPatch/write/publish proposals land here before approval.\n', editable: true },
    { path: 'approvals/README.md', content: '# Mission approvals\n\nApproval and rejection decisions reference proposal files from here.\n', editable: true },
    { path: 'NEXT.md', content: ['# Next actions', '', '- Pick a task card.', '- Click Run task.', '- Watch Runs for transcript and status.', '- Review approvals before applying outputs.', ''].join('\n'), editable: true },
  ];
}

export function missionFileId(mission: MissionFolderState, relPath: string): string {
  return `mission:${mission.missionId}:${stableId(relPath)}`;
}

export function missionWorkbenchFile(mission: MissionFolderState, file: MissionGeneratedFile): WorkbenchFile {
  const name = file.path.split('/').pop() || file.path;
  return {
    id: missionFileId(mission, file.path),
    name,
    path: `${mission.title}/${file.path}`,
    language: languageForPath(file.path),
    content: file.content,
    dirty: false,
    source: 'mission',
    mission: {
      missionId: mission.missionId,
      rootPath: mission.rootPath,
      handle: mission.handle,
      relPath: file.path,
      title: mission.title,
    },
  };
}

export function missionWorkbenchFiles(mission: MissionFolderState, files: MissionGeneratedFile[]): WorkbenchFile[] {
  return files.map((file) => missionWorkbenchFile(mission, file));
}

export function primaryMissionFiles(files: MissionGeneratedFile[]): MissionGeneratedFile[] {
  const byPath = new Map(files.map((file) => [file.path, file]));
  return PRIMARY_MISSION_FILE_PATHS.flatMap((path) => {
    const file = byPath.get(path);
    return file ? [file] : [];
  });
}
