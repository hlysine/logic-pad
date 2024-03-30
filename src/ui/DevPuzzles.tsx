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
    id: 'heart',
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
    difficulty: 1,
  },
  {
    id: 'penguin',
    title: 'Penguin',
    description:
      'Your love can make a pengiun fly.{BR}Try, take off, and reach the sky.{BR}There is nothing this pengiun would not do,{BR}to see your smile.. and hear.. "I love you".',
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
    ]).addRule(new CompletePatternRule()),
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
    difficulty: 2,
  },
  {
    id: 'cactus',
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
      'nnnnnnnnnnnnnn',
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
      'nnnnnnnnnnnnnn',
    ]),
    difficulty: 2,
  },
  {
    id: 'panda',
    title: 'Panda',
    difficulty: 4,
    description:
      "From dusk till dawn, the Monday was ours.{BR}No flowers, we watched movie at weird hour.{BR}Kung Fu Panda was nice, but what's the best,{BR}cinema was empty. We got blessed.",
    grid: GridData.create([
      'nnnnnnnnnnnnnnnnnnnnnn',
      'nnBBBBnnBBBnnnnnnnnnnn',
      'nBBBBBBBWWWnnnnnnnnnnn',
      'nBBBBWWWWWWnnnnnnnnnnn',
      'nBBBWWWWWWWnnnnnnnnnnn',
      'nBBWWWWWWWWnnnnnnnnnnn',
      'nnBWWWWWWWWnnnnnnnnnnn',
      'nnnBWWWWWWWnnnnnnnnnnn',
      'nnnBWWBBBWWnnnnnnnnnnn',
      'nnnBWBBBWBWnnnnnnnnnnn',
      'nnnBWBBWBBWnnnnnnnnnnn',
      'nnnBWWBBBWWnnnnnnnnnnn',
      'nnnBWWWWWWBnnnnnnnnnnn',
      'nnnnBWWWWWBnnnnnnnnnnn',
      'nnnBBBWWWWWnnnnnnnnnnn',
      'nnBBBBBBBBBnnnnnnnnnnn',
      'nBBBBBBBBBBnnnnnnnnnnn',
      'nBBBBWWWWWWnnnnnnnnnnn',
      'nnBBWWBBWWBnnnnnnnnnnn',
      'nnnnBWWWBBWnnnnnnnnnnn',
      'nnnnBWBBWWBnnnnnnnnnnn',
      'nnnnnBWWWWWnnnnnnnnnnn',
      'nnnnnBBBBBBnnnnnnnnnnn',
      'nnnnnBBBBBnnnnnnnnnnnn',
      'nnnnnBBBBBnnnnnnnnnnnn',
      'nnnnnnnnnnnnnnnnnnnnnn',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnnnnnnn',
      'nnBBBBnnBBBBBBnnBBBBnn',
      'nBBBBBBBWWWWWWBBBBBBBn',
      'nBBBBWWWWWWWWWWWWBBBBn',
      'nBBBWWWWWWWWWWWWWWBBBn',
      'nBBWWWWWWWWWWWWWWWWBBn',
      'nnBWWWWWWWWWWWWWWWWBnn',
      'nnnBWWWWWWWWWWWWWWBnnn',
      'nnnBWWBBBWWWWBBBWWBnnn',
      'nnnBWBBBWBWWBWBBBWBnnn',
      'nnnBWBBWBBWWBBWBBWBnnn',
      'nnnBWWBBBWWWWBBBWWBnnn',
      'nnnBWWWWWWBBWWWWWWBnnn',
      'nnnnBWWWWWBBWWWWWBnnnn',
      'nnnBBBWWWWWWWWWWBBBnnn',
      'nnBBBBBBBBBBBBBBBBBBnn',
      'nBBBBBBBBBBBBBBBBBBBBn',
      'nBBBBWWWWWWWWWWWWBBBBn',
      'nnBBWWBBWWBBWWBBWWBBnn',
      'nnnnBWWWBBWWBBWWWBnnnn',
      'nnnnBWBBWWBBWWBBWBnnnn',
      'nnnnnBWWWWWWWWWWBnnnnn',
      'nnnnnBBBBBBBBBBBBnnnnn',
      'nnnnnBBBBBnnBBBBBnnnnn',
      'nnnnnBBBBBnnBBBBBnnnnn',
      'nnnnnnnnnnnnnnnnnnnnnn',
    ]),
  },
  {
    id: 'ring',
    title: 'Ring',
    difficulty: 4,
    description: 'What is a true meaning of ring?{BR}The memories it\'s supposed to bring?{BR}Does it define a queen and her king?{BR}Or is it just a meaningless thing?',
    grid: GridData.create([
      'nnnnnnnnnnnnnnnnnnn',
      'nnnnnnnBBBnnnnnnnnn',
      'nnnnnBBWWWnnnnnnnnn',
      'nnnnBWWWWWnnnnnnnnn',
      'nnnBWWWWWWnnnnnnnnn',
      'nnnBWWWWWWnnnnnnnnn',
      'nnnnBWWWWWnnnnnnnnn',
      'nnnnnBWWWWnnnnnnnnn',
      'nnnnnnBWWWnnnnnnnnn',
      'nnnnnnnBWWnnnnnnnnn',
      'nnnnnnBBBBnnnnnnnnn',
      'nnnnBBWWWWnnnnnnnnn',
      'nnnBWWWWWWnnnnnnnnn',
      'nnBWWWWBBBnnnnnnnnn',
      'nnBWWWBnnnnnnnnnnnn',
      'nBWWWBnnnnnnnnnnnnn',
      'nBWWBnnnnnnnnnnnnnn',
      'nBWWBnnnnnnnnnnnnnn',
      'nBWWBnnnnnnnnnnnnnn',
      'nBWWBnnnnnnnnnnnnnn',
      'nBWWBnnnnnnnnnnnnnn',
      'nBWWWBnnnnnnnnnnnnn',
      'nnBWWWBnnnnnnnnnnnn',
      'nnBWWWWBBBnnnnnnnnn',
      'nnnBWWWWWWnnnnnnnnn',
      'nnnnBBWWWWnnnnnnnnn',
      'nnnnnnBBBBnnnnnnnnn',
      'nnnnnnnnnnnnnnnnnnn',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnnnn',
      'nnnnnnnBBBBBnnnnnnn',
      'nnnnnBBWWWWWBBnnnnn',
      'nnnnBWWWWWWWWWBnnnn',
      'nnnBWWWWWWWWWWWBnnn',
      'nnnBWWWWWWWWWWWBnnn',
      'nnnnBWWWWWWWWWBnnnn',
      'nnnnnBWWWWWWWBnnnnn',
      'nnnnnnBWWWWWBnnnnnn',
      'nnnnnnnBWWWBnnnnnnn',
      'nnnnnnBBBBBBBnnnnnn',
      'nnnnBBWWWWWWWBBnnnn',
      'nnnBWWWWWWWWWWWBnnn',
      'nnBWWWWBBBBBWWWWBnn',
      'nnBWWWBnnnnnBWWWBnn',
      'nBWWWBnnnnnnnBWWWBn',
      'nBWWBnnnnnnnnnBWWBn',
      'nBWWBnnnnnnnnnBWWBn',
      'nBWWBnnnnnnnnnBWWBn',
      'nBWWBnnnnnnnnnBWWBn',
      'nBWWBnnnnnnnnnBWWBn',
      'nBWWWBnnnnnnnBWWWBn',
      'nnBWWWBnnnnnBWWWBnn',
      'nnBWWWWBBBBBWWWWBnn',
      'nnnBWWWWWWWWWWWBnnn',
      'nnnnBBWWWWWWWBBnnnn',
      'nnnnnnBBBBBBBnnnnnn',
      'nnnnnnnnnnnnnnnnnnn',
    ]),
  },
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
