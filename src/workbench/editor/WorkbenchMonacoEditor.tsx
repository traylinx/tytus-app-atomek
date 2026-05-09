import { useEffect, useRef } from 'react';
import * as monaco from 'monaco-editor';
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import JsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import CssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import HtmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import TsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
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

self.MonacoEnvironment = {
  getWorker(_workerId: string, label: string) {
    if (label === 'json') return new JsonWorker();
    if (label === 'css' || label === 'scss' || label === 'less') return new CssWorker();
    if (label === 'html' || label === 'handlebars' || label === 'razor') return new HtmlWorker();
    if (label === 'typescript' || label === 'javascript') return new TsWorker();
    return new EditorWorker();
  },
};

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
