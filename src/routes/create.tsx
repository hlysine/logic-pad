import InstructionList from '../ui/instructions/InstructionList';
import EditControls from '../ui/EditControls';
import MainGrid from '../ui/grid/MainGrid';
import EditableInstruction from '../ui/instructions/EditableInstruction';
import RulerOverlay from '../ui/grid/RulerOverlay';
import { useGrid } from '../ui/GridContext';
import InstructionSearch from '../ui/instructions/InstructionSearch';
import {
  createFileRoute,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { memo, useRef } from 'react';
import LinkLoader, { validateSearch } from '../ui/router/LinkLoader';
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
import { array, compress } from '../data/helper';
import Serializer from '../data/serializer';

const enclosure = [
  ['GridData', GridData],
  ['GridConnections', GridConnections],
  ['BanPatternRule', BanPatternRule],
  ['CompletePatternRule', CompletePatternRule],
  ['ConnectAllRule', ConnectAllRule],
  ['CustomRule', CustomRule],
  ['UndercluedRule', UndercluedRule],
  ['LetterSymbol', LetterSymbol],
  ['NumberSymbol', NumberSymbol],
  ['ViewpointSymbol', ViewpointSymbol],
  ['Color', Color],
  ['Direction', Direction],
] as const;

const options: editor.IStandaloneEditorConstructionOptions = {
  minimap: { enabled: false },
  lineNumbers: 'off',
  glyphMargin: false,
  folding: false,
  lineDecorationsWidth: 5,
  lineNumbersMinChars: 0,
};

export const Route = createFileRoute('/create')({
  validateSearch,
  component: memo(function CreateMode() {
    const { grid } = useGrid();
    const params = Route.useSearch();
    const navigate = useNavigate();
    const state = useRouterState();
    const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
    const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
      editorRef.current = editor;
    };

    const parseJs = () => {
      if (editorRef.current) {
        const value = editorRef.current.getValue();
        // eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
        const func = new Function(...enclosure.map(([name]) => name), value);
        const puzzle = func(...enclosure.map(([, value]) => value)) as Puzzle;
        let grid = puzzle.grid;
        if (puzzle.solution !== null) {
          const tiles = array(puzzle.grid.width, puzzle.grid.height, (x, y) => {
            const tile = puzzle.grid.tiles[y][x];
            return tile.exists && tile.color === Color.Gray
              ? tile.copyWith({
                  color: puzzle.solution!.tiles[y][x].color,
                })
              : tile;
          });
          grid = puzzle.grid.copyWith({ tiles });
        }
        compress(
          JSON.stringify({
            ...puzzle,
            grid: Serializer.stringifyGrid(grid),
          })
        )
          .then(d =>
            navigate({
              to: state.location.pathname,
              search: {
                d,
              },
            })
          )
          .catch(console.log);
      }
    };

    return (
      <div className="flex flex-1 justify-center items-center flex-wrap">
        <LinkLoader params={params} />
        <div className="w-[320px] flex flex-col p-4 gap-4 text-neutral-content self-stretch justify-between">
          <div className="justify-self-stretch">
            <Editor
              height="70vh"
              defaultLanguage="javascript"
              defaultValue={
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
          <EditControls />
        </div>
        <div className="grow shrink flex justify-start items-center p-0">
          <div className="flex shrink-0 grow justify-center items-center m-0 p-0 border-0">
            <MainGrid editable={true}>
              <RulerOverlay width={grid.width} height={grid.height} />
            </MainGrid>
          </div>
        </div>
        <div className="flex flex-col items-stretch self-stretch justify-center gap-4">
          <InstructionSearch />
          <InstructionList>{EditableInstruction}</InstructionList>
        </div>
      </div>
    );
  }),
});
