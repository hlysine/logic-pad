import { memo, useEffect } from 'react';
import { useGrid } from './GridContext';
import GridData from '../data/grid';
import { useEdit } from './EditContext';
import CompletePatternRule from '../data/rules/completePatternRule';
import Puzzle from '../data/puzzle';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import Serializer from '../data/serializer/allSerializers';
import Compressor from '../data/serializer/compressor/allCompressors';
import Difficulty from './metadata/Difficulty';

export const DEV_PUZZLES: Puzzle[] = [
  {
    id: "heart",
    title: 'Heart',
    description:
      'You are the missing half of my heart,{BR}if you are a painter, I am your art.{BR}You bring the peace I could never find,{BR}pure heart, pure soul, pure mind.',
    grid: GridData.create([
      'nnnnnnnnnn',
      'nnBBnnnnnn',
      'nBWWBnnnnn',
      'nBWWWnnnnn',
      'nBWWWnnnnn',
      'nnBWWnnnnn',
      'nnnBWnnnnn',
      'nnnnBnnnnn',
      'nnnnnnnnnn',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'nnnnnnnnnn',
      'nnBBnnBBnn',
      'nBWWBBWWBn',
      'nBWWWWWWBn',
      'nBWWWWWWBn',
      'nnBWWWWBnn',
      'nnnBWWBnnn',
      'nnnnBBnnnn',
      'nnnnnnnnnn',
    ]),
    difficulty: 2
  },
  {
    id: "cactus",
    title: 'Cactus',
    description:
      "There ain't love garden without a cactus.{BR}We cannot succeed without a practice.{BR}We cannot be happy without some pain.{BR}Pull the thorn out, and try again.",
    grid: GridData.create([
      'nnnnnnnnnnnnnn',
      'nnnnnnBnnnnnnn',
      'nnnnnBWnnnnnnn',
      'nnnnnBWnnnnnnn',
      'nnnnnBWnnnnnnn',
      'nnBnnBWnnnnnnn',
      'nBWBnBWnnnnnnn',
      'nBWBnBWnnnnnnn',
      'nBWWBWWnnnnnnn',
      'nBWWWWWnnnnnnn',
      'nnBBBWWnnnnnnn',
      'nnnnnBWnnnnnnn',
      'nnnnnBWnnnnnnn',
      'nnnBBBBnnnnnnn',
      'nnnnBWWnnnnnnn',
      'nnnnBWBnnnnnnn',
      'nnnnBWWnnnnnnn',
      'nnnnnBBnnnnnnn',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'nnnnnnnnnnnnnn',
      'nnnnnnBBnnnnnn',
      'nnnnnBWWBnnnnn',
      'nnnnnBWWBnnnnn',
      'nnnnnBWWBnnnnn',
      'nnBnnBWWBnnBnn',
      'nBWBnBWWBnBWBn',
      'nBWBnBWWBnBWBn',
      'nBWWBWWWWBWWBn',
      'nBWWWWWWWWWWBn',
      'nnBBBWWWWBBBnn',
      'nnnnnBWWBnnnnn',
      'nnnnnBWWBnnnnn',
      'nnnBBBBBBBBnnn',
      'nnnnBWWWWBnnnn',
      'nnnnBWBBWBnnnn',
      'nnnnBWWWWBnnnn',
      'nnnnnBBBBnnnnn',
    ]),
    difficulty: 3,
  },
  {
    id: "penguin",
    title: 'Penguin',
    description: 'Your love can make a pengiun fly.{BR}Try, take off, and reach the sky.{BR}There is nothing this pengiun would not do,{BR}to see your smile.. and hear.. "I love you".',
    grid: GridData.create([
      'nnnnnnnnnnnnnn',
      'nnnnnBBnnnnnnn',
      'nnnnBWWnnnnnnn',
      'nnnBWWWnnnnnnn',
      'nnnBWBWnnnnnnn',
      'nnnBWWWnnnnnnn',
      'nBBBWBBnnnnnnn',
      'nnBBWWBnnnnnnn',
      'nnnBWWWnnnnnnn',
      'nnnnBWWnnnnnnn',
      'nnnnWBBnnnnnnn',
      'nnnWWWnnnnnnnn',
      'nnnnnnnnnnnnnn',
    ])
    .addRule(new CompletePatternRule()),
   solution: GridData.create([
      'nnnnnnnnnnnnnn',
      'nnnnnBBBBnnnnn',
      'nnnnBWWWWBnnnn',
      'nnnBWWWWWWBnnn',
      'nnnBWBWWBWBnnn',
      'nnnBWWWWWWBnnn',
      'nBBBWBBBBWBBBn',
      'nnBBWWBBWWBBnn',
      'nnnBWWWWWWBnnn',
      'nnnnBWWWWBnnnn',
      'nnnnWBBBBWnnnn',
      'nnnWWWnnWWWnnn',
      'nnnnnnnnnnnnnn',
    ]),
    difficulty: 3,
  }
];

const defaultSelection = 0;

// million-ignore
export default memo(function DevPuzzles() {
  const { grid, setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();
  const navigate = useNavigate();
  const state = useRouterState();

  useEffect(() => {
    if (grid.width === 0) {
      setGrid(
        DEV_PUZZLES[defaultSelection].grid,
        DEV_PUZZLES[defaultSelection].solution
      );
      setMetadata(DEV_PUZZLES[defaultSelection]);
      clearHistory(DEV_PUZZLES[defaultSelection].grid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu menu-vertical min-w-[300px] bg-base-200 rounded-box text-base-content z-50"
    >
      {DEV_PUZZLES.map(puzzle => (
        <li
          key={puzzle.title}
          onClick={() => {
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
          }}
        >
          <a className="text-md w-full flex items-center justify-between">
            {puzzle.title}
            <Difficulty value={puzzle.difficulty} />
          </a>
        </li>
      ))}
    </ul>
  );
});
