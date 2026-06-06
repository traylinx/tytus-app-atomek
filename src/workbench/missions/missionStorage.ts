import type { TytusMission, TytusMissionRun, TytusMissionSummary } from '@tytus/host-api';
import type { MissionFolderState, TeamPresetId } from './missionTypes';
import { TEAM_PRESET_DEFINITIONS } from './missionResources';

export const CURRENT_MISSION_KEY = 'tytus.atomek.currentMission';
export const CURRENT_MISSION_EVENT = 'tytus.atomek.currentMissionChanged';

export function missionSlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) || 'mission';
}

export function isoNow(): string {
  return new Date().toISOString();
}

export function missionRunSortValue(run: TytusMissionRun): string {
  return run.finishedAt ?? run.startedAt ?? '';
}

export function saveCurrentMission(mission: MissionFolderState | TytusMission): void {
  const state: MissionFolderState = 'source' in mission
    ? mission
    : {
      missionId: mission.missionId,
      title: mission.title,
      goal: mission.goal,
      rootPath: mission.rootPath,
      name: mission.rootPath.split('/').pop() || mission.missionId,
      source: 'tray',
      teamPresetId: undefined,
    };
  try {
    localStorage.setItem(CURRENT_MISSION_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent(CURRENT_MISSION_EVENT, { detail: state }));
  } catch {
    // localStorage can be unavailable in strict privacy contexts. Mission still exists on disk.
  }
}

export function readCurrentMission(): MissionFolderState | null {
  try {
    const raw = localStorage.getItem(CURRENT_MISSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<MissionFolderState>;
    if (!parsed.missionId || !parsed.title) return null;
    return {
      missionId: parsed.missionId,
      title: parsed.title,
      goal: parsed.goal ?? '',
      rootPath: parsed.rootPath,
      name: parsed.name ?? parsed.rootPath?.split('/').pop() ?? parsed.missionId,
      source: parsed.source === 'browser' ? 'browser' : 'tray',
      teamPresetId: TEAM_PRESET_DEFINITIONS.some((item) => item.id === parsed.teamPresetId) ? parsed.teamPresetId as TeamPresetId : undefined,
    };
  } catch {
    return null;
  }
}

export function missionStateFromSummary(summary: TytusMissionSummary): MissionFolderState {
  return {
    missionId: summary.missionId,
    title: summary.title,
    goal: summary.goal,
    rootPath: summary.rootPath,
    name: summary.rootPath.split('/').pop() || summary.missionId,
    source: 'tray',
    teamPresetId: undefined,
  };
}
