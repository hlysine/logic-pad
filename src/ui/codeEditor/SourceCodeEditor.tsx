import { useNavigate, useRouterState } from '@tanstack/react-router';
import { memo, useEffect, useRef, useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import { Puzzle, PuzzleSchema } from '../../data/puzzle';
import Compressor from '../../data/serializer/compressor/allCompressors';
import Serializer from '../../data/serializer/allSerializers';
import { ZodError } from 'zod';
import evaluate, { enclosure } from './evaluator';

const defaultCode = `/** @type Puzzle */
({
  title: '',
  grid: GridData.create([]),
  solution: null,
  difficulty: 1,
  author: '',
  link: '',
  description: ''
})
`;

const options: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineNumbers: 'on',
  glyphMargin: false,
  folding: true,
  lineDecorationsWidth: 5,
  lineNumbersMinChars: 3,
  wrappingIndent: 'indent',
  wrappingStrategy: 'advanced',
  wordWrap: 'on',
  formatOnType: true,
};

export interface SourceCodeEditorProps {
  loading?: React.ReactNode;
}

export default memo(function SourceCodeEditor({
  loading,
}: SourceCodeEditorProps) {
  const navigate = useNavigate();
  const state = useRouterState();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    const saved = window.localStorage.getItem('viewState');
    if (saved)
      editor.restoreViewState(JSON.parse(saved) as editor.ICodeEditorViewState);
  };
  const [toast, setToast] = useState<{
    message: string;
    handle: number;
  } | null>(null);
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    // compiler options
    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      allowJs: true,
      checkJs: true,
      strict: true,
    });

    import('../../../types/logic-pad.d.ts?raw')
      .then(({ default: def }) => {
        monaco.languages.typescript.javascriptDefaults.addExtraLib(
          def,
          'file:///logic-pad.d.ts'
        );
      })
      .catch(console.log);
  }, [monaco]);

  const parseJs = () => {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      window.localStorage.setItem('sourceCode', value);
      window.localStorage.setItem(
        'viewState',
        JSON.stringify(editorRef.current.saveViewState())
      );
      try {
        const puzzle: Puzzle = PuzzleSchema.parse(
          evaluate(`"use strict";\n${value}`)
        );
        Compressor.compress(Serializer.stringifyPuzzle(puzzle))
          .then(d =>
            navigate({
              to: state.location.pathname,
              search: {
                d,
              },
            })
          )
          .catch(console.log);
      } catch (error) {
        if (toast !== null) clearTimeout(toast.handle);
        const handle = window.setTimeout(() => setToast(null), 5000);
        if (error instanceof ZodError) {
          setToast({
            message:
              error.errors[0].path.join('.') + ': ' + error.errors[0].message,
            handle,
          });
        } else if (error instanceof Error) {
          setToast({ message: error.message, handle });
        }
      }
    }
  };

  return (
    <>
      <div className="basis-0 grow shrink min-h-[70vh] self-stretch dropdown dropdown-right text-nowrap overflow-visible">
        <div className="inline-block w-full h-full focus-within:w-[max(100%-400px-1rem,min(800px,50vw))] transition-[width] duration-75">
          <Editor
            loading={loading}
            theme="vs-dark"
            width="100%"
            height="100%"
            className="focus-within:z-30"
            defaultLanguage="javascript"
            defaultValue={(() => {
              let saved = window.localStorage.getItem('sourceCode');
              if (!saved || saved.length === 0) saved = defaultCode;
              else if (/^return\s+/.test(saved.trim())) {
                saved =
                  '/** @type Puzzle */\n(' +
                  saved
                    .trim()
                    .replace(/^return\s+/, '')
                    .replace(/;\s*$/, '') +
                  ')';
              }
              return saved;
            })()}
            options={options}
            onMount={handleEditorDidMount}
          />
        </div>
        <div className="dropdown-content inline-block !relative !inset-0 shadow-xl bg-base-300 rounded-box z-10 ml-4 p-4 w-[400px] h-full overflow-y-auto">
          <div className="flex flex-col flex-nowrap gap-2">
            <h3 className="text-lg text-base-content">Quick reference</h3>
            {enclosure.map(
              ({ example }) =>
                example && (
                  <pre key={example} className="text-xs text-base-content">
                    {example}
                  </pre>
                )
            )}
          </div>
        </div>
      </div>
      <div
        className="tooltip w-full tooltip-right"
        data-tip="Source code is NOT saved in the puzzle link! Remember to back up your code."
      >
        <button className="btn btn-primary w-full" onClick={parseJs}>
          Load puzzle
        </button>
      </div>
      <div className="toast toast-start mb-40 z-50">
        {toast && (
          <div className="alert alert-error w-[290px] whitespace-normal">
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
});
