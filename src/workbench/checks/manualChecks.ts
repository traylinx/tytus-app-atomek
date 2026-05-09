import type { WorkbenchFile } from '../types';

export type ManualCheckStatus = 'pending' | 'passed' | 'failed';

export type ManualCheckCommand = {
  id: string;
  command: string;
  label: string;
  source: 'package-script' | 'manual';
  path?: string;
};

export type ManualCheckResult = {
  command: string;
  status: ManualCheckStatus;
  output: string;
  capturedAt: number;
};

export type ManualCheckSession = {
  id: string;
  reason: string;
  commands: ManualCheckCommand[];
  results: ManualCheckResult[];
  createdAt: number;
};

type PackageJson = {
  scripts?: Record<string, unknown>;
  packageManager?: unknown;
};

const CHECK_SCRIPT_PRIORITY = ['typecheck', 'test', 'lint', 'build', 'release:check', 'verify', 'verify:cortex'];
const LOCKFILE_PACKAGE_MANAGERS: Array<[string, string]> = [
  ['package-lock.json', 'npm'],
  ['pnpm-lock.yaml', 'pnpm'],
  ['yarn.lock', 'yarn'],
  ['bun.lockb', 'bun'],
  ['bun.lock', 'bun'],
];

export function createManualCheckSession(files: WorkbenchFile[], reason: string): ManualCheckSession {
  return {
    id: `manual-check-${Date.now()}`,
    reason,
    commands: detectManualCheckCommands(files),
    results: [],
    createdAt: Date.now(),
  };
}

export function addManualCheckCommand(session: ManualCheckSession, rawCommand: string): ManualCheckSession {
  const command = normalizeCommand(rawCommand);
  if (!command) return session;
  if (session.commands.some((item) => item.command === command)) return session;
  return {
    ...session,
    commands: [
      ...session.commands,
      {
        id: stableCommandId(command),
        command,
        label: command,
        source: 'manual',
      },
    ],
  };
}

export function addManualCheckResult(
  session: ManualCheckSession,
  command: string,
  status: ManualCheckStatus,
  output: string,
): ManualCheckSession {
  const normalized = normalizeCommand(command);
  if (!normalized) return session;
  return {
    ...session,
    results: [
      ...session.results,
      {
        command: normalized,
        status,
        output: output.trim(),
        capturedAt: Date.now(),
      },
    ],
  };
}

export function buildManualCheckFollowupPrompt(session: ManualCheckSession): string {
  const results = session.results.length > 0
    ? session.results.map((result, index) => [
      `Check ${index + 1}: ${result.command}`,
      `Status: ${result.status}`,
      'Output:',
      fence(result.output || '(no output pasted)', 'text'),
    ].join('\n')).join('\n\n')
    : 'No manual check output was captured yet.';

  const commands = session.commands.length > 0
    ? session.commands.map((command) => `- ${command.command}`).join('\n')
    : '- No check command was suggested; user must provide one manually.';

  return [
    'Continue the agentic edit/check loop from a manual check capture.',
    'Do not assume host command execution exists. The user ran or will run checks outside Atomek.',
    'Use only the currently attached workbench context and the pasted output below.',
    'If a fix is needed, return one applicable git-style unified diff in a fenced diff block with paths matching opened files.',
    'Do not write files, do not invoke tools, and do not assume any provider-specific model/tool.',
    '',
    `Manual check reason: ${session.reason}`,
    '',
    'Available manual check commands:',
    commands,
    '',
    'Captured manual check results:',
    results,
  ].join('\n');
}

export function latestManualCheckStatus(session: ManualCheckSession): ManualCheckStatus {
  const latest = session.results.at(-1);
  if (!latest) return 'pending';
  return latest.status;
}

function detectManualCheckCommands(files: WorkbenchFile[]): ManualCheckCommand[] {
  const packages = files.filter((file) => file.name === 'package.json' || file.path.endsWith('/package.json'));
  const commands: ManualCheckCommand[] = [];
  for (const file of packages) {
    const parsed = parsePackageJson(file.content);
    if (!parsed?.scripts) continue;
    const packageDir = dirname(file.path);
    const packageManager = detectPackageManager(files, packageDir, parsed);
    if (!packageManager) continue;
    const scriptNames = Object.keys(parsed.scripts).filter((name) => typeof parsed.scripts?.[name] === 'string');
    const checks = rankCheckScripts(scriptNames);
    for (const script of checks) {
      const command = `${packageManager} run ${script}`;
      commands.push({
        id: stableCommandId(`${packageDir}:${command}`),
        command,
        label: packageDir ? `${script} (${packageDir})` : script,
        source: 'package-script',
        path: file.path,
      });
    }
  }
  return dedupeCommands(commands).slice(0, 6);
}

function parsePackageJson(content: string): PackageJson | null {
  try {
    const parsed = JSON.parse(content) as PackageJson;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function detectPackageManager(files: WorkbenchFile[], packageDir: string, packageJson: PackageJson): string | null {
  if (typeof packageJson.packageManager === 'string') {
    const declared = packageJson.packageManager.split('@')[0]?.trim();
    if (declared) return declared;
  }
  for (const [lockfile, packageManager] of LOCKFILE_PACKAGE_MANAGERS) {
    if (files.some((file) => basename(file.path) === lockfile && dirname(file.path) === packageDir)) return packageManager;
  }
  return null;
}

function rankCheckScripts(scripts: string[]): string[] {
  const known = CHECK_SCRIPT_PRIORITY.filter((name) => scripts.includes(name));
  const discovered = scripts
    .filter((name) => !known.includes(name))
    .filter((name) => /(^|:)(check|typecheck|test|lint|verify|build)(:|$)/i.test(name))
    .sort((a, b) => a.localeCompare(b));
  return [...known, ...discovered];
}

function dedupeCommands(commands: ManualCheckCommand[]): ManualCheckCommand[] {
  const seen = new Set<string>();
  return commands.filter((command) => {
    const key = command.command;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function normalizeCommand(command: string): string {
  return command.trim().replace(/\s+/g, ' ');
}

function dirname(path: string): string {
  const index = path.lastIndexOf('/');
  return index > 0 ? path.slice(0, index) : '';
}

function basename(path: string): string {
  const index = path.lastIndexOf('/');
  return index >= 0 ? path.slice(index + 1) : path;
}

function stableCommandId(value: string): string {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) | 0;
  return `check-${Math.abs(hash)}`;
}

function fence(body: string, lang: string): string {
  return `\`\`\`${lang}\n${body.replace(/\`\`\`/g, '\`\`\\`')}\n\`\`\``;
}
