import GridData from '../data/grid';
import { Color, State } from '../data/primitives';
import { Puzzle } from '../data/puzzle';
import CompletePatternRule from '../data/rules/completePatternRule';
import Serializer from '../data/serializer/allSerializers';
import Compressor from '../data/serializer/compressor/allCompressors';
import { useGrid } from './GridContext';

export default function StupidGrid() {
  const { grid, metadata, state } = useGrid();

  const showMemoryGrid = () => {
    const puzzle: Puzzle = {
      title: metadata.title + ' but memory',
      author: metadata.author.endsWith(' et al.')
        ? metadata.author
        : metadata.author + ' et al.',
      link: metadata.link,
      description: metadata.description,
      difficulty: 10,
      grid: new GridData(
        grid.width,
        grid.height,
        grid.tiles.map(row =>
          row.map(tile => tile.copyWith({ color: Color.Gray, fixed: false }))
        ),
        grid.connections,
        undefined,
        [new CompletePatternRule()]
      ),
      solution: grid,
    };
    Compressor.compress(Serializer.stringifyPuzzle(puzzle))
      .then(d => {
        // open a new tab to the same url but with search param d replaced with the new puzzle
        const url = new URL(window.location.href);
        url.searchParams.set('d', d);
        window.open(url.toString(), '_blank')?.focus();
      })
      .catch(console.log);
  };

  if (state.final !== State.Satisfied) return null;
  return (
    <div
      className="tooltip tooltip-accent tooltip-bottom before:text-xl before:mt-1 after:mt-[0.125rem] after:scale-150 tooltip-open w-full"
      data-tip="Wait, the puzzle isn't done yet!"
    >
      <button
        className="btn btn-primary w-full btn-lg"
        onClick={showMemoryGrid}
      >
        Show memory grid
      </button>
    </div>
  );
}
