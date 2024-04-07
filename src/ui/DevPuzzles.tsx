import { memo, useEffect } from 'react';
import { useGrid } from './GridContext';
import GridData from '../data/grid';
import { useEdit } from './EditContext';
import CompletePatternRule from '../data/rules/completePatternRule';
import Puzzle from '../data/puzzle';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import Difficulty from './metadata/Difficulty';
import { FiCheck } from 'react-icons/fi';
import { ColorToChar } from '../data/primitives';

function getGrid(solution: GridData) {
  return GridData.create(
    solution.tiles.map(t => {
      return t
        .map(e => {
          return ColorToChar[e.color] ?? 'n';
        })
        .map((e, i) => (i < t.length / 2 ? e : 'n'))
        .join('');
    })
  ).addRule(new CompletePatternRule());
}

export const DEV_PUZZLES: Puzzle[] = [
  {
    id: 'heart',
    title: 'Heart',
    description:
      'You are the missing half of my heart,{BR}if you are a painter, I am your art.{BR}You bring the peace I could never find,{BR}pure heart, pure soul, pure mind.',
    grid: GridData.create([]),
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
      'Your love can make a pengiun fly.{BR}Try, take off, and reach the sky.{BR}There is nothing this pengiun would not do,{BR}to love you, and be loved too.',
    grid: GridData.create([]),
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
    grid: GridData.create([]),
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
    difficulty: 3,
  },
  {
    id: 'panda',
    title: 'Panda',
    difficulty: 4,
    description:
      "From dusk till dawn, the Monday was ours.{BR}No flowers, we watched movie at weird hour.{BR}Kung Fu Panda was nice, but what's the best,{BR}cinema was empty. We got blessed.",
    grid: GridData.create([]),
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
    id: 'sunflower',
    title: 'Sunflower',
    difficulty: 4,
    description:
      'Each flower has a meaning that it brings.{BR}Sunflower can mean a lot of things.{BR}You are a sunflower of my emotions.{BR}Optimism, Happiness, and devotion.',
    grid: GridData.create([]),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnnnnnnnnnn',
      'nnnnnnnBBBBnnnBBBBnnnnnnn',
      'nnnnnnBWWWWBnBWWWWBnnnnnn',
      'nnnnnBWWWWWWBWWWWWWBnnnnn',
      'nnnnnBWWWWWWBWWWWWWBnnnnn',
      'nnnnnBWWWWWWBWWWWWWBnnnnn',
      'nnnBBBWWWWWWBWWWWWWBBBnnn',
      'nnBWWWBWWWBBBBBWWWBWWWBnn',
      'nBWWWWWBWBWWWWWBWBWWWWWBn',
      'nBWWWWWWBWWWWWWWBWWWWWWBn',
      'nBWWWWWBWWWWWWWWWBWWWWWBn',
      'nnBWWWWBWWWBBBWWWBWWWWBnn',
      'nnnBBBBBWWBBBBBWWBBBBBnnn',
      'nnBWWWWBWWWBBBWWWBWWWWBnn',
      'nBWWWWWBWWWWWWWWWBWWWWWBn',
      'nBWWWWWWBWWWWWWWBWWWWWWBn',
      'nBWWWWWBWBWWWWWBWBWWWWWBn',
      'nnBWWWBWWWBBBBBWWWBWWWBnn',
      'nnnBBBWWWWWWBWWWWWWBBBnnn',
      'nnnnnBWWWWWWBWWWWWWBnnnnn',
      'nnnnnBWWWWWWBWWWWWWBnnnnn',
      'nnnnnnBWWWWBnBWWWWBnnnnnn',
      'nnnnnnnBBBBnnnBBBBnnnnnnn',
      'nnnnnnnnnnnnnnnnnnnnnnnnn',
    ]),
  },
  {
    id: 'ring',
    title: 'Ring',
    difficulty: 4,
    description:
      "What is a true meaning of ring?{BR}The memories it's supposed to bring?{BR}Does it define a queen and her king?{BR}Or is it just a meaningless thing?",
    grid: GridData.create([]),
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
  {
    id: 'cupcake',
    title: 'Cupcake',
    difficulty: 3,
    description:
      "Yummy as cupcake, Sweet as candy.{BR}That tasty ass will come in handy.{BR}Out of eight points, she is a nine,{BR}Still can't believe she became mine.",
    grid: GridData.create([]),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnn',
      'nnnnnnnBBBnnnnnnn',
      'nnnnnBBWWWBBnnnnn',
      'nnnnBWWWWWWWBnnnn',
      'nnnBWWWWWWWWWBnnn',
      'nnBWWBWWWWWBWWBnn',
      'nnBWWWWWWWWWWWBnn',
      'nnBBBWWBWBWWBBBnn',
      'nBWWBBBWBWBBBWWBn',
      'nnBWBWWWBWWWBWBnn',
      'nnBWBWWWBWWWBWBnn',
      'nnnBWBWWBWWBWBnnn',
      'nnnBWBWWBWWBWBnnn',
      'nnnnBBWWBWWBBnnnn',
      'nnnnnBBBBBBBnnnnn',
      'nnnnnnnnnnnnnnnnn',
    ]),
  },
  {
    id: 'boo',
    title: 'Boo',
    difficulty: 3,
    description:
      "You need a nickname, what about kitty?{BR}Sorry! I wanted to say that you are pretty.{BR}Can I call you chick? You hate that too?{BR}Okay fine, I'll call you my baby boo.",
    grid: GridData.create([]),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnn',
      'nnnnnnBBBBBnnnnnn',
      'nnnnBBWWWWWBBnnnn',
      'nnnBWWWWWWWWWBnnn',
      'nnnBWWWWWWWWWBnnn',
      'nnBWWWWWWWWWWWBnn',
      'nnBWWWBWWWBWWWBnn',
      'nnBWWWBWWWBWWWBnn',
      'nnBWWWBWWWBWWWBnn',
      'nBWWWWWWWWWWWWWBn',
      'nBWWWWWWWWWWWWWBn',
      'nBWWWBWBWBWBWWWBn',
      'nBWWWWBWBWBWWWWBn',
      'nBWWWWWWWWWWWWWBn',
      'nBWWWWWWWWWWWWWBn',
      'nBWWBBWWWWWBBWWBn',
      'nBWBnnBWWWBnnBWBn',
      'nBBnnnnBBBnnnnBBn',
      'nnnnnnnnnnnnnnnnn',
    ]),
  },
  {
    id: 'bee',
    title: 'Bee',
    difficulty: 3,
    description:
      'Brand new gentleman, and his lady.{BR}Till death do us apart. Maybe.{BR}She starts my day like AB,{BR}see, that can only be my bby.',
    grid: GridData.create([]),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnnn',
      'nnnnnnnBnnBnnnnnnn',
      'nnnnnnnnBBnnnnnnnn',
      'nnnnnnnBBBBnnnnnnn',
      'nnnnnnBBBBBBnnnnnn',
      'nnnnnnBBBBBBnnnnnn',
      'nnnnBBBBBBBBBBnnnn',
      'nnnBWBWWWWWWBWBnnn',
      'nnBWWBBBBBBBBWWBnn',
      'nBWWWBWWWWWWBWWWBn',
      'nBWWWBBBBBBBBWWWBn',
      'nBWWWBWWWWWWBWWWBn',
      'nnBBBnBBBBBBnBBBnn',
      'nnnnnnBWWWWBnnnnnn',
      'nnnnnnnBBBBnnnnnnn',
      'nnnnnnnnBBnnnnnnnn',
      'nnnnnnnnnnnnnnnnnn',
    ]),
  },
  {
    hidden: true,
    id: 'sun',
    title: 'Sun',
    difficulty: 4,
    description:
      'There is a star giving infinite heat.{BR}You are my sun I was lucky to meet.{BR}A sunshine I never knew I need,{BR}An energy of power to grow a seed.',
    grid: GridData.create([]),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
      'nnnnnnnnnnnnnnBnnnnnnnnnnnnnn',
      'nnnnnnnnnnnnnBWBnnnnnnnnnnnnn',
      'nnnnnnnnnnnnnBWBnnnnnnnnnnnnn',
      'nnnnnnnnnnnnBWWWBnnnnnnnnnnnn',
      'nnnnnBBBnnnnBWWWBnnnnBBBnnnnn',
      'nnnnnBWBBBnBWWWWWBnBBBWBnnnnn',
      'nnnnnBBWWBBBWWWWWBBBWWBBnnnnn',
      'nnnnnnBWWWWBBBBBBBWWWWBnnnnnn',
      'nnnnnnBBWWBWWWWWWWBWWBBnnnnnn',
      'nnnnnnnBWBWWWWWWWWWBWBnnnnnnn',
      'nnnnnnBBBWWWWWWWWWWWBBBnnnnnn',
      'nnnnBBWWBWWWBWWWBWWWBWWBBnnnn',
      'nnBBWWWWBWWWBWWWBWWWBWWWWBBnn',
      'nBWWWWWWBWWWWWWWWWWWBWWWWWWBn',
      'nnBBWWWWBWWWWWWWWWWWBWWWWBBnn',
      'nnnnBBWWBWWBWWWWWBWWBWWBBnnnn',
      'nnnnnnBBBWWWBBBBBWWWBBBnnnnnn',
      'nnnnnnnBWBWWWWWWWWWBWBnnnnnnn',
      'nnnnnnBBWWBWWWWWWWBWWBBnnnnnn',
      'nnnnnnBWWWWBBBBBBBWWWWBnnnnnn',
      'nnnnnBBWWBBBWWWWWBBBWWBBnnnnn',
      'nnnnnBWBBBnBWWWWWBnBBBWBnnnnn',
      'nnnnnBBBnnnnBWWWBnnnnBBBnnnnn',
      'nnnnnnnnnnnnBWWWBnnnnnnnnnnnn',
      'nnnnnnnnnnnnnBWBnnnnnnnnnnnnn',
      'nnnnnnnnnnnnnBWBnnnnnnnnnnnnn',
      'nnnnnnnnnnnnnnBnnnnnnnnnnnnnn',
      'nnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
    ]),
  },
  {
    hidden: true,
    id: 'crown',
    title: 'Crown',
    difficulty: 4,
    description:
      "Tinder bio appear, drama queen.{BR}What the hell does that even mean.{BR}Jelousy and fights, should I fear?{BR}Please don't break my heart, and disappear.",
    grid: GridData.create([]),
    solution: GridData.create([
      'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
      'nnnnnnnnBBnnnnnnnnnnnnBBnnnnnnnn',
      'nnBBnnnBBBBnnnnnnnnnnBBBBnnnBBnn',
      'nBBBBnnBBBBnnnnBBnnnnBBBBnnBBBBn',
      'nBBBBnnnBBnnnnBBBBnnnnBBnnnBBBBn',
      'nnBBnnnBWWBnnnBBBBnnnBWWBnnnBBnn',
      'nBWWBnnBWWBnnnnBBnnnnBWWBnnBWWBn',
      'nBWWBnBWWWWBnnBWWBnnBWWWWBnBWWBn',
      'nBWWWBWWWWWWBnBWWBnBWWWWWWBWWWBn',
      'nBWWWBWWWWWWWBWWWWBWWWWWWWBWWWBn',
      'nBWWWWBWWWWWBWWWWWWBWWWWWBWWWWBn',
      'nBWWWWWBBBBBWWWWWWWWBBBBBWWWWWBn',
      'nBWWWWWWWWWWWWWWWWWWWWWWWWWWWWBn',
      'nBWWWWWWWWWWWWWBBWWWWWWWWWWWWWBn',
      'nBWWWWWWWWWWWWBBBBWWWWWWWWWWWWBn',
      'nBWWWWWBBWWWWBBBBBBWWWWBBWWWWWBn',
      'nBWWWWBBBBWWWBBBBBBWWWBBBBWWWWBn',
      'nBWWWWBBBBWWWBBBBBBWWWBBBBWWWWBn',
      'nBWWWWWBBWWWWWBBBBWWWWWBBWWWWWBn',
      'nnBWWWWWWWWWWWWBBWWWWWWWWWWWWBnn',
      'nnnBBWWWWWWWWWWWWWWWWWWWWWWBBnnn',
      'nnnnnBBBBBBBBBBBBBBBBBBBBBBnnnnn',
      'nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn',
    ]),
  },
  // {
  //   hidden: true,
  //   complex: true,
  //   id: 'mosaic',
  //   title: 'Mosaic',
  //   difficulty: 5,
  //   description: 'TODO',
  //   grid: GridData.create([
  //   ]).addRule(new CompletePatternRule()),
  //   solution: GridData.create([
  //   ]),
  // },
];

for (const puzzle of DEV_PUZZLES) {
  if (puzzle.grid.tiles.length <= 0) {
    puzzle.grid = getGrid(puzzle.solution ?? GridData.create([]));
  }
}

let defaultSelection = 0;

const urlParams = new URLSearchParams(window.location.search);
const customId = urlParams.get('id');

if (customId) {
  defaultSelection = DEV_PUZZLES.findIndex(p => p.id === customId);
}

defaultSelection = defaultSelection === -1 ? 0 : defaultSelection;

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

      console.log(DEV_PUZZLES[defaultSelection].solution);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function isComplete(id: string) {
    const finishes = JSON.parse(localStorage.getItem('finishes') ?? '[]');
    return finishes.includes(id);
  }

  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu menu-vertical min-w-[300px] bg-base-200 rounded-box text-base-content z-50"
    >
      {DEV_PUZZLES.filter(p => {
        const urlParams = new URLSearchParams(window.location.search);
        const showHidden = urlParams.get('hidden');

        if (showHidden) {
          return true;
        }

        return p.hidden !== true;
      }).map(puzzle => (
        <li
          key={puzzle.title}
          onClick={() => {
            navigate({
              to: state.location.pathname,
              search: {
                id: puzzle.id,
              },
            });
          }}
        >
          <a className="text-md w-full flex items-center justify-between">
            <div className="flex items-center gap-2">
              {puzzle.title}
              {isComplete(puzzle.id) && <FiCheck className="text-green-500" />}
            </div>
            <Difficulty value={puzzle.difficulty} />
          </a>
        </li>
      ))}
    </ul>
  );
});
