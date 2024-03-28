import { useNavigate, useRouterState } from '@tanstack/react-router';
import { memo, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { editor } from 'monaco-editor';
import GridData from '../data/grid';
import GridConnections from '../data/gridConnections';
import BanPatternRule from '../data/rules/banPatternRule';
import CompletePatternRule from '../data/rules/completePatternRule';
import ConnectAllRule from '../data/rules/connectAllRule';
import CustomRule from '../data/rules/customRule';
import { Color, Direction } from '../data/primitives';
import UndercluedRule from '../data/rules/undercluedRule';
import LetterSymbol from '../data/symbols/letterSymbol';
import NumberSymbol from '../data/symbols/numberSymbol';
import ViewpointSymbol from '../data/symbols/viewpointSymbol';
import Puzzle from '../data/puzzle';
import Compressor from '../data/serializer/compressor/allCompressors';
import Serializer from '../data/serializer/allSerializers';

const enclosure = [
  ['GridData', GridData],
  ['GridConnections', GridConnections],
  ['Color', Color],
  ['Direction', Direction],
  ['BanPatternRule', BanPatternRule],
  ['CompletePatternRule', CompletePatternRule],
  ['ConnectAllRule', ConnectAllRule],
  ['CustomRule', CustomRule],
  ['UndercluedRule', UndercluedRule],
  ['LetterSymbol', LetterSymbol],
  ['NumberSymbol', NumberSymbol],
  ['ViewpointSymbol', ViewpointSymbol],
] as const;

const options: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 5,
  lineNumbersMinChars: 0,
};

export default memo(function SourceCodeEditor() {
  const navigate = useNavigate();
  const state = useRouterState();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };
  const [toast, setToast] = useState<{
    message: string;
    handle: number;
  } | null>(null);

  const parseJs = () => {
    if (editorRef.current) {
      const value = editorRef.current.getValue();
      window.localStorage.setItem('sourceCode', value);
      try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        const func = new Function(...enclosure.map(([name]) => name), value);
        const puzzle = func(...enclosure.map(([, value]) => value)) as Puzzle;
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
        const handle = setTimeout(() => setToast(null), 5000);
        setToast({ message: (error as Error).message, handle });
      }
    }
  };

  return (
    <>
      <div className="justify-self-stretch">
        <Editor
          height="70vh"
          defaultLanguage="javascript"
          defaultValue={
            window.localStorage.getItem('sourceCode') ??
            "return {\n  title: '',\n  grid: GridData.create([]),\n  solution: null,\n  difficulty: 1,\n  author: '',\n  link: '',\n  description: ''\n};"
          }
          options={options}
          onMount={handleEditorDidMount}
        />
      </div>
      <div
        className="tooltip w-full"
        data-tip="Source code is NOT saved in the puzzle link! Remember to back up your code."
      >
        <button className="btn btn-primary w-full" onClick={parseJs}>
          Load puzzle
        </button>
      </div>
      <div className="toast toast-start mb-40 z-50">
        {toast && (
          <div className="alert alert-error w-[290px]">
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    </>
  );
});
