import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import EditorWorkerUrl from 'monaco-editor/esm/vs/editor/editor.worker?url';
import JsonWorkerUrl from 'monaco-editor/esm/vs/language/json/json.worker?url';
import CssWorkerUrl from 'monaco-editor/esm/vs/language/css/css.worker?url';
import HtmlWorkerUrl from 'monaco-editor/esm/vs/language/html/html.worker?url';
import TsWorkerUrl from 'monaco-editor/esm/vs/language/typescript/ts.worker?url';
import { registerTytusMonacoTheme } from './monacoTheme';
import type { CursorPosition, WorkbenchFile, WorkbenchRange } from '../types';

type Props = {
  file: WorkbenchFile;
  revealLine?: number | null;
  onChange: (content: string) => void;
  onCursorChange: (position: CursorPosition) => void;
  onSelectionChange: (range: WorkbenchRange | null) => void;
  onSave: () => void;
};

function createMonacoWorker(workerUrl: string): Worker {
  const resolvedUrl = new URL(workerUrl, import.meta.url).toString();
  const canUseDirectWorker = typeof window === 'undefined' || new URL(resolvedUrl).origin === window.location.origin;
  if (canUseDirectWorker) return new Worker(resolvedUrl, { type: 'module' });

  // TytusOS loads app bundles from immutable jsDelivr URLs while the shell runs on
  // localhost. Browsers reject cross-origin Worker script URLs, so create a
  // same-origin blob worker that imports the immutable CDN module instead.
  const blobUrl = URL.createObjectURL(new Blob([`import ${JSON.stringify(resolvedUrl)};`], { type: 'text/javascript' }));
  const worker = new Worker(blobUrl, { type: 'module' });
  setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
  return worker;
}

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === 'json') return createMonacoWorker(JsonWorkerUrl);
    if (label === 'css' || label === 'scss' || label === 'less') return createMonacoWorker(CssWorkerUrl);
    if (label === 'html' || label === 'handlebars' || label === 'razor') return createMonacoWorker(HtmlWorkerUrl);
    if (label === 'typescript' || label === 'javascript') return createMonacoWorker(TsWorkerUrl);
    return createMonacoWorker(EditorWorkerUrl);
  },
};

let __monacoErrorHandlerInstalled = false;
function isWorkerEvent(value: unknown): boolean {
  if (!(value instanceof Event)) return false;
  const t = (value as Event).target as unknown;
  if (t instanceof Worker) return true;
  return Boolean(t && typeof t === 'object' && 'postMessage' in (t as object) && 'terminate' in (t as object));
}
function installMonacoErrorHandler() {
  if (__monacoErrorHandlerInstalled || typeof window === 'undefined') return;
  __monacoErrorHandlerInstalled = true;
  window.addEventListener('error', (event) => {
    if (isWorkerEvent(event.error) || isWorkerEvent((event as unknown as { target?: unknown }).target)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
    return undefined;
  }, true);
  window.addEventListener('unhandledrejection', (event) => {
    if (isWorkerEvent(event.reason)) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return false;
    }
    return undefined;
  }, true);
}
installMonacoErrorHandler();

export function WorkbenchMonacoEditor({ file, revealLine, onChange, onCursorChange, onSelectionChange, onSave }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const modelRef = useRef<monaco.editor.ITextModel | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    registerTytusMonacoTheme(monaco);
    const uri = monaco.Uri.parse(`tytus-workbench:///${encodeURI(file.path)}`);
    const existing = monaco.editor.getModel(uri);
    const model = existing ?? monaco.editor.createModel(file.content, file.language, uri);
    modelRef.current = model;
    const editor = monaco.editor.create(containerRef.current, {
      model,
      theme: 'tytus-vscode-dark',
      automaticLayout: true,
      minimap: { enabled: true },
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: 13,
      lineHeight: 20,
      scrollBeyondLastLine: false,
      renderLineHighlight: 'all',
      tabSize: 2,
      wordWrap: 'off',
    });
    editorRef.current = editor;
    requestAnimationFrame(() => editor.layout());
    const changeSub = editor.onDidChangeModelContent(() => onChange(editor.getValue()));
    const cursorSub = editor.onDidChangeCursorPosition((event) => onCursorChange(event.position));
    const selectionSub = editor.onDidChangeCursorSelection((event) => {
      const selection = event.selection;
      onSelectionChange(selection.isEmpty() ? null : {
        startLineNumber: selection.startLineNumber,
        startColumn: selection.startColumn,
        endLineNumber: selection.endLineNumber,
        endColumn: selection.endColumn,
      });
    });
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, onSave);
    return () => {
      changeSub.dispose();
      cursorSub.dispose();
      selectionSub.dispose();
      editor.dispose();
    };
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const uri = monaco.Uri.parse(`tytus-workbench:///${encodeURI(file.path)}`);
    let model = monaco.editor.getModel(uri);
    if (!model) model = monaco.editor.createModel(file.content, file.language, uri);
    if (model.getValue() !== file.content) model.setValue(file.content);
    monaco.editor.setModelLanguage(model, file.language);
    editor.setModel(model);
    modelRef.current = model;
    requestAnimationFrame(() => editor.layout());
    editor.focus();
  }, [file.id, file.language, file.path]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor || !revealLine) return;
    const lineNumber = Math.max(1, Math.min(revealLine, editor.getModel()?.getLineCount() ?? revealLine));
    editor.setPosition({ lineNumber, column: 1 });
    editor.revealLineInCenterIfOutsideViewport(lineNumber);
    editor.focus();
  }, [file.id, revealLine]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
}
