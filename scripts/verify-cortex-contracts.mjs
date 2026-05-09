#!/usr/bin/env node
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';
import ts from 'typescript';

const repoRoot = process.cwd();
const tempRoot = mkdtempSync(join(tmpdir(), 'atomek-cortex-contracts-'));
const filesToCompile = [
  'src/workbench/types.ts',
  'src/workbench/context/documentRegistry.ts',
  'src/workbench/context/chatContextStore.ts',
  'src/workbench/context/contextBuilder.ts',
  'src/workbench/edits/patchParser.ts',
  'src/workbench/edits/workbenchEditService.ts',
  'src/workbench/checks/manualChecks.ts',
  'src/workbench/projectIndex/chunker.ts',
  'src/workbench/projectIndex/indexStore.ts',
  'src/workbench/projectIndex/retrieval.ts',
];

function compileSources() {
  for (const file of filesToCompile) {
    const sourcePath = join(repoRoot, file);
    const outputPath = join(tempRoot, file.replace(/\.ts$/, '.js'));
    mkdirSync(dirname(outputPath), { recursive: true });
    const source = readFileSync(sourcePath, 'utf8');
    const output = ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
        jsx: ts.JsxEmit.ReactJSX,
      },
      fileName: sourcePath,
      reportDiagnostics: true,
    });
    const diagnostics = output.diagnostics ?? [];
    const fatal = diagnostics.filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);
    if (fatal.length) {
      throw new Error(ts.formatDiagnosticsWithColorAndContext(fatal, {
        getCurrentDirectory: () => repoRoot,
        getCanonicalFileName: (name) => name,
        getNewLine: () => '\n',
      }));
    }
    writeFileSync(outputPath, output.outputText);
  }
}

function load(modulePath) {
  const require = createRequire(join(tempRoot, 'runner.cjs'));
  return require(join(tempRoot, modulePath.replace(/\.ts$/, '.js')));
}

function file(overrides) {
  return {
    id: 'file-default',
    name: 'default.ts',
    path: 'src/default.ts',
    language: 'typescript',
    content: 'export const defaultValue = 1;\n',
    dirty: false,
    size: overrides?.content?.length,
    source: 'sample',
    ...overrides,
  };
}

function testContextBuilderAndStore() {
  const { buildDocumentRegistry, contentHash } = load('src/workbench/context/documentRegistry.ts');
  const { buildContextAttachments, removeAttachment, resetRemovedAttachments, attachmentIdForDocument } = load('src/workbench/context/chatContextStore.ts');
  const { buildAiContext, selectedText } = load('src/workbench/context/contextBuilder.ts');

  const files = [
    file({ id: 'a', name: 'alpha.ts', path: 'src/alpha.ts', content: 'const one = 1;\nconst two = 2;\nconst three = 3;\n' }),
    file({ id: 'b', name: 'beta.md', path: 'docs/beta.md', language: 'markdown', content: '# Beta\nbody\n', dirty: true }),
  ];
  const selection = { startLineNumber: 2, startColumn: 7, endLineNumber: 2, endColumn: 10 };
  const registry = buildDocumentRegistry({ files, openEditorIds: ['a', 'b', 'missing'], activeFileId: 'a', versions: { a: 3 }, activeSelection: selection });

  assert.equal(registry.activeDocumentId, 'a');
  assert.deepEqual(registry.openDocumentIds, ['a', 'b']);
  assert.equal(registry.byId.get('a').version, 3);
  assert.equal(registry.byId.get('a').contentHash, contentHash(files[0].content));
  assert.equal(registry.byId.get('a').selection.startLineNumber, 2);

  const selectionAttachments = buildContextAttachments(registry, { scope: 'active-selection', removedAttachmentIds: [], selectedFileIds: [] });
  assert.equal(selectionAttachments.length, 1);
  assert.equal(selectionAttachments[0].kind, 'selection');
  assert.equal(selectionAttachments[0].range.startColumn, 7);
  assert.equal(selectedText(files[0].content, selection), 'two');

  const openAttachments = buildContextAttachments(registry, { scope: 'open-editors', removedAttachmentIds: [], selectedFileIds: [] });
  assert.deepEqual(openAttachments.map((attachment) => attachment.path), ['src/alpha.ts', 'docs/beta.md']);

  const removedState = removeAttachment({ scope: 'active-file', removedAttachmentIds: [], selectedFileIds: [] }, attachmentIdForDocument(registry.byId.get('a')));
  assert.equal(buildContextAttachments(registry, removedState).length, 0);
  assert.equal(resetRemovedAttachments(removedState).removedAttachmentIds.length, 0);

  const context = buildAiContext(registry, files, { scope: 'active-selection', removedAttachmentIds: [], selectedFileIds: [] });
  assert.equal(context.attachments[0].kind, 'selection');
  assert.equal(context.parts[0].kind, 'selection');
  assert.match(context.parts[0].text, /Path: src\/alpha\.ts/);
  assert.match(context.parts.at(-1).title, /manifest/);
}

function testPatchParserAndEditService() {
  const parser = load('src/workbench/edits/patchParser.ts');
  const edits = load('src/workbench/edits/workbenchEditService.ts');
  const files = [
    file({ id: 'a', name: 'alpha.ts', path: 'src/alpha.ts', content: 'export const answer = 41;\nexport const label = "old";\n' }),
    file({ id: 'b', name: 'beta.ts', path: 'packages/app/src/beta.ts', content: 'console.log("beta");\n' }),
  ];
  const diffBody = '```diff\n@@ -1,2 +1,2 @@\n-export const answer = 41;\n+export const answer = 42;\n export const label = "old";\n```';
  const diffSources = parser.extractDiffSources(diffBody);
  assert.ok(diffSources.length >= 1);
  const hunkDiff = diffSources.find((source) => source.startsWith('@@ '));
  assert.ok(hunkDiff, 'fenced hunk source should be extracted separately from surrounding prose');
  assert.equal(parser.splitUnifiedDiffByFile(hunkDiff)[0].path, null);
  assert.match(parser.applyUnifiedDiff(files[0].content, hunkDiff), /answer = 42/);

  const candidate = edits.buildWorkspaceEditCandidate({ body: diffBody, files, sourceTitle: 'contract', activeFile: files[0], versions: { a: 7 } });
  assert.equal(candidate.kind, 'single-file');
  assert.equal(candidate.edits[0].fileId, 'a');
  assert.equal(candidate.edits[0].base.version, 7);
  assert.equal(candidate.edits[0].stats.changed, 1);

  const applied = edits.applyWorkspaceEdit(files, candidate, { versions: { a: 7 } });
  assert.equal(applied.conflicts.length, 0);
  assert.equal(applied.applied.length, 1);
  assert.match(applied.files.find((candidateFile) => candidateFile.id === 'a').content, /answer = 42/);
  assert.equal(applied.files.find((candidateFile) => candidateFile.id === 'a').dirty, true);

  const conflictedFiles = [
    { ...files[0], content: files[0].content.replace('old', 'newer') },
    files[1],
  ];
  const conflictResult = edits.applyWorkspaceEdit(conflictedFiles, candidate, { versions: { a: 8 } });
  assert.equal(conflictResult.applied.length, 0);
  assert.equal(conflictResult.conflicts.length, 1);
  assert.equal(conflictResult.conflicts[0].conflict.changedAfterPreview, true);
  assert.equal(conflictResult.conflicts[0].conflict.currentVersion, 8);

  const replacementBody = '```typescript atomek-replace path=src/alpha.ts\nexport const answer = 100;\n```';
  const replacement = parser.extractReplacementBlocks(replacementBody)[0];
  assert.equal(replacement.path, 'src/alpha.ts');
  assert.match(replacement.content, /answer = 100/);
  assert.equal(edits.findFileForPatchPath(files, 'app/src/beta.ts').confidence, 'suffix');
}

function testProjectIndexRetrieval() {
  const chunker = load('src/workbench/projectIndex/chunker.ts');
  const { createProjectIndexStore, detectProjectIndexStaleness } = load('src/workbench/projectIndex/indexStore.ts');
  const retrieval = load('src/workbench/projectIndex/retrieval.ts');
  const files = [
    file({ id: 'ctx', name: 'contextBuilder.ts', path: 'src/workbench/context/contextBuilder.ts', content: 'export function buildAiContext() { return "context attachment manifest"; }\n' }),
    file({ id: 'idx', name: 'retrieval.ts', path: 'src/workbench/projectIndex/retrieval.ts', content: 'export function retrieveProjectContext() { return "keyword retrieval score"; }\n' }),
    file({ id: 'vendor', name: 'bundle.js', path: 'dist/bundle.js', language: 'javascript', content: 'keyword retrieval score in dist\n' }),
    file({ id: 'dirty', name: 'draft.ts', path: 'src/draft.ts', content: 'draft keyword\n', dirty: true }),
  ];

  assert.equal(chunker.shouldSkipFile(files[2]), 'vendor');
  assert.equal(chunker.shouldSkipFile(files[3]), null, 'dirty files remain indexable by default for current workbench state');

  const snapshot = chunker.buildProjectIndex(files, { maxChunkChars: 500 });
  assert.equal(snapshot.byFileId.has('vendor'), false);
  assert.equal(snapshot.byFileId.has('ctx'), true);
  assert.ok(snapshot.chunks.length >= 2);
  assert.equal(snapshot.skipped.find((entry) => entry.fileId === 'vendor').reason, 'vendor');

  const hits = retrieval.retrieveProjectContext(snapshot, 'retrieveProjectContext retrieval', { limit: 2, includeDirty: false });
  assert.equal(hits[0].fileId, 'idx');
  assert.equal(hits[0].kind, 'index-hit');
  assert.match(retrieval.contextHitToText(hits[0]), /Path: src\/workbench\/projectIndex\/retrieval\.ts/);
  assert.ok(hits.every((hit) => hit.fileId !== 'dirty'));

  const store = createProjectIndexStore(files, { maxChunkChars: 500 });
  assert.equal(store.isStale(files), false);
  const changedFiles = files.map((candidateFile) => candidateFile.id === 'idx'
    ? { ...candidateFile, content: `${candidateFile.content}\nexport const changed = true;\n` }
    : candidateFile);
  const stale = detectProjectIndexStaleness(store.getSnapshot(), changedFiles, store.getOptions());
  assert.equal(stale.stale, true);
  assert.equal(stale.files.find((entry) => entry.fileId === 'idx').status, 'changed');
}

function testManualEditCheckLoop() {
  const manualChecks = load('src/workbench/checks/manualChecks.ts');
  const files = [
    file({
      id: 'pkg',
      name: 'package.json',
      path: 'package.json',
      language: 'json',
      content: JSON.stringify({
        scripts: {
          build: 'vite build',
          typecheck: 'tsc --noEmit',
          'verify:cortex': 'node scripts/verify-cortex-contracts.mjs',
          dev: 'vite --host 0.0.0.0',
        },
      }, null, 2),
    }),
    file({ id: 'lock', name: 'package-lock.json', path: 'package-lock.json', language: 'json', content: '{}' }),
  ];

  let session = manualChecks.createManualCheckSession(files, 'AI workspace patch applied to 2 files');
  assert.equal(session.results.length, 0);
  assert.deepEqual(session.commands.map((command) => command.command), [
    'npm run typecheck',
    'npm run build',
    'npm run verify:cortex',
  ]);
  assert.ok(session.commands.every((command) => command.source === 'package-script'));
  assert.ok(session.commands.every((command) => command.path === 'package.json'));

  session = manualChecks.addManualCheckResult(
    session,
    ' npm   run   verify:cortex ',
    'failed',
    'Atomek cortex contract harness: FAIL\n```nested fence from tool output```',
  );
  assert.equal(manualChecks.latestManualCheckStatus(session), 'failed');
  assert.equal(session.results[0].command, 'npm run verify:cortex');

  const prompt = manualChecks.buildManualCheckFollowupPrompt(session);
  assert.match(prompt, /Continue the agentic edit\/check loop from a manual check capture\./);
  assert.match(prompt, /Manual check reason: AI workspace patch applied to 2 files/);
  assert.match(prompt, /- npm run verify:cortex/);
  assert.match(prompt, /Check 1: npm run verify:cortex/);
  assert.match(prompt, /Status: failed/);
  assert.match(prompt, /Atomek cortex contract harness: FAIL/);
  assert.match(prompt, /Do not assume host command execution exists\. The user ran or will run checks outside Atomek\./);
  assert.match(prompt, /Use only the currently attached workbench context and the pasted output below\./);
  assert.match(prompt, /Do not write files, do not invoke tools, and do not assume any provider-specific model\/tool\./);

  const noPackageManagerSession = manualChecks.createManualCheckSession([
    file({ id: 'pkg-no-lock', name: 'package.json', path: 'package.json', language: 'json', content: '{"scripts":{"test":"vitest"}}' }),
  ], 'No host package manager inference');
  assert.deepEqual(noPackageManagerSession.commands, []);
  assert.match(manualChecks.buildManualCheckFollowupPrompt(noPackageManagerSession), /No manual check output was captured yet\./);
}

try {
  compileSources();
  testContextBuilderAndStore();
  testPatchParserAndEditService();
  testProjectIndexRetrieval();
  testManualEditCheckLoop();
  console.log('Atomek cortex contract harness: PASS');
  console.log(`Compiled modules under ${relative(repoRoot, tempRoot) || tempRoot}`);
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
