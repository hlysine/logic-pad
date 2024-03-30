import { memo, useEffect } from 'react';
import { useGrid } from './GridContext';
import ViewpointSymbol from '../data/symbols/viewpointSymbol';
import ConnectAllRule from '../data/rules/connectAllRule';
import { Color } from '../data/primitives';
import BanPatternRule from '../data/rules/banPatternRule';
import GridData from '../data/grid';
import GridConnections from '../data/gridConnections';
import { useEdit } from './EditContext';
import LetterSymbol from '../data/symbols/letterSymbol';
import NumberSymbol from '../data/symbols/numberSymbol';
import UndercluedRule from '../data/rules/undercluedRule';
import CompletePatternRule from '../data/rules/completePatternRule';
import { Puzzle } from '../data/puzzle';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import Serializer from '../data/serializer/allSerializers';
import Compressor from '../data/serializer/compressor/allCompressors';

export const DEV_PUZZLES: Puzzle[] = [
  {
    title: 'Triangles',
    grid: GridData.create([
      'WWWWWWWWWWWWWWWWWWWWWWWWWBBBW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'Wnnnn.nnnnn.nnnnn.nnnnn.nnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'Wn.nWWWn.nWWWn.nWWWn.nWWWn.nW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'Wnnnn.nnnnn.nnnnn.nnnnn.nnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'Wn.nWWWn.nWWWn.nWWWn.nWWWn.nW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'Wnnnn.nnnnn.nnnnn.nnnnn.nnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'Wn.nWWWn.nWWWn.nWWWn.nWWWn.nW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'Wnnnn.nnnnn.nnnnn.nnnnn.nnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'Wn.nWWWn.nWWWn.nWWWn.nWWWn.nW',
      'WnnnWWWnnnWWWnnnWWWnnnWWWnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'Wnnnn.nnnnn.nnnnn.nnnnn.nnnnW',
      'WnnnnnnnnnnnnnnnnnnnnnnnnnnnW',
      'WBBBWWWWWWWWWWWWWWWWWWWWWWWWW',
    ])
      .withConnections(
        GridConnections.create([
          '.............................',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.aaab.bcccd.deeef.fgggh.hiii.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.j.j...l.l...n.n...p.p...r.r.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.aaab.bcccd.deeef.fgggh.hiii.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.j.j...l.l...n.n...p.p...r.r.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.aaab.bcccd.deeef.fgggh.hiii.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.j.j...l.l...n.n...p.p...r.r.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.aaab.bcccd.deeef.fgggh.hiii.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.j.j...l.l...n.n...p.p...r.r.',
          '.jjj...lll...nnn...ppp...rrr.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.aaab.bcccd.deeef.fgggh.hiii.',
          '.aaabbbcccdddeeefffggghhhiii.',
          '.............................',
        ])
      )
      .withRules([
        new BanPatternRule(
          GridData.create(['nnnnn', 'nbbbn', 'bbnbb', 'nbbbn', 'nnbnn'])
        ),
        new BanPatternRule(
          GridData.create(['nnnnn', 'nbbbn', 'wbnbw', 'nbbbn', 'nnwnn'])
        ),
        new ConnectAllRule(Color.Dark),
      ])
      .withSymbols([
        new ViewpointSymbol(17, 5, 8),
        new ViewpointSymbol(23, 5, 6),
        new ViewpointSymbol(5, 11, 8),
        new ViewpointSymbol(11, 17, 6),
        new ViewpointSymbol(17, 17, 8),
        new ViewpointSymbol(23, 17, 7),
        new ViewpointSymbol(5, 23, 7),
        new ViewpointSymbol(11, 23, 6),
        new ViewpointSymbol(17, 23, 7),
        new ViewpointSymbol(23, 23, 7),
      ]),
    solution: null,
    difficulty: 7,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Flow',
    grid: GridData.create([
      'nnnnnnnnnnnnnnnnn',
      'nBnBnBnBnBnBnBnBn',
      'nnWnnnnnnnnnnnWnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnnnWnnnnnnnWnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnnnnnnnnnWnnnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnnnnnWnnnnnnnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnnnnnnnnnnnnnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnWnnnnnnnnnnnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnnnnnnnnnnnnnn',
      'nBnBnBnBnBnBnBnBn',
      'nnnnnnnnWnWnWnWnW',
    ]).withSymbols([
      new LetterSymbol(2, 2, 'A'),
      new LetterSymbol(14, 2, 'F'),
      new LetterSymbol(6, 4, 'D'),
      new LetterSymbol(14, 4, 'E'),
      new LetterSymbol(12, 6, 'D'),
      new LetterSymbol(8, 8, 'C'),
      new LetterSymbol(4, 12, 'B'),
      new LetterSymbol(8, 16, 'B'),
      new LetterSymbol(10, 16, 'A'),
      new LetterSymbol(12, 16, 'F'),
      new LetterSymbol(14, 16, 'C'),
      new LetterSymbol(16, 16, 'E'),
    ]),
    solution: null,
    difficulty: 5,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Surrounded',
    grid: GridData.create([
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nWWnnnnWnn',
      'nnnnnnnnnn',
      'nnnnnnWnnn',
      'nnnWnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnWnn',
      'nWnnWnnnnn',
      'nnnnnnnnnn',
    ])
      .addRule(new UndercluedRule())
      .withSymbols([
        new LetterSymbol(2, 2, 'A'),
        new LetterSymbol(7, 7, 'A'),
        new NumberSymbol(1, 2, 20),
        new NumberSymbol(7, 2, 8),
        new NumberSymbol(6, 4, 2),
        new NumberSymbol(3, 5, 2),
        new NumberSymbol(1, 8, 2),
        new NumberSymbol(4, 8, 2),
      ]),
    solution: GridData.create([
      'nnnnwwwwwn',
      'nbwnnbbbnw',
      'bWWbnwwWbw',
      'nbbnwnbnnw',
      'nnnbnbWnnn',
      'nnnWnnnbnn',
      'nnnnnnnnnn',
      'nnnnnnbWnn',
      'nWnnWnnbnn',
      'nnnnnnnnnn',
    ]),
    difficulty: 6,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Movement',
    grid: GridData.create([
      'BWB.WWB.BWW.nnn',
      'WBB.BWB.WBB.nnn',
      'WBW.WBB.BBW.nnn',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'BWB.WWB.BWW.WBW',
      'WBB.BWB.WBB.WWB',
      'WBW.WBB.BBW.BBB',
    ]),
    difficulty: 9,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Matrix',
    grid: GridData.create([
      'WBBWBBB.B',
      'BWWWBBW.B',
      'BWBBWBW.W',
      'WWWnWWW.W',
      'BWBnnBB.W',
      'WWWBnnB.B',
      'BBWBWnn.W',
      '.........',
      'WnBnBWW..',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'WBBWBBB.B',
      'BWWWBBW.B',
      'BWBBWBW.W',
      'WWWWWWW.W',
      'BWBWWBB.W',
      'WWWBBWB.B',
      'BBWBWWB.W',
      '.........',
      'WWBBBWW..',
    ]),
    difficulty: 6,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Barricaded',
    grid: GridData.create([
      'WnnnnnnnnnnB',
      'nnnnnnnnnnnn',
      'nnnnnnnnnnnW',
      'nnnnnnnnnnnn',
      'nnnnnnnnnWnW',
      'nnnnnnnnnnnn',
      'nnnnnnnnnnnn',
      'nnWnnnnnnnnn',
      'nnnnnnnnnnnn',
      'nnnnnnnnnnnn',
      'nnnnnnnnnnnn',
      'BnWnnnnnnnnn',
    ])
      .withRules([new UndercluedRule(), new ConnectAllRule(Color.Dark)])
      .withSymbols([
        new LetterSymbol(0, 0, 'A'),
        new LetterSymbol(9, 4, 'A'),
        new LetterSymbol(11, 2, 'B'),
        new LetterSymbol(2, 7, 'B'),
        new LetterSymbol(11, 4, 'C'),
        new LetterSymbol(2, 11, 'C'),
      ]),
    solution: GridData.create([
      'WnnnnnnnnnnB',
      'wnnnnnnnnnnn',
      'wnnnnnnnnnnW',
      'wnnnnnnnnnbb',
      'wnnnnnnnnWbW',
      'wnnnnnnnnnbw',
      'wbnnnnnnnnnw',
      'wbWnnnnnnnnw',
      'wbbbnnnnnnnw',
      'wwwwwnnnnnnw',
      'nbbbbbnnnnnw',
      'BnWwwwwwwwww',
    ]),
    difficulty: 5,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Around The Pot',
    grid: GridData.create([
      'BWBBWWB',
      'BBnWnWB',
      'BnWWBnB',
      'nWBBBBn',
      'BWBBBBn',
      'WnBBBnW',
      'WWnnnBB',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'BWBBWWB',
      'BBWWWWB',
      'BWWWBWB',
      'BWBBBBW',
      'BWBBBBW',
      'WWBBBBW',
      'WWWBBBB',
    ]),
    difficulty: 10,
    author: 'romain22222',
    link: '',
    description: '',
  },
  {
    title: 'Around The Pot v2',
    grid: GridData.create([
      'BnnnnnB',
      'nBnnnBn',
      'nWBBBnn',
      'nWWBWnn',
      'nWBBWnn',
      'nBBBBWn',
      'BnnnnnW',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'BBBBBBB',
      'WBBBBBW',
      'WWBBBWW',
      'WWWBWWW',
      'WWBBWWW',
      'WBBBBWW',
      'BBBBBBW',
    ]),
    difficulty: 7,
    author: 'romain22222',
    link: '',
    description: '',
  },
  {
    title: 'Offsetted rotation',
    grid: GridData.create([
      'BWWBBWBWWBW.W',
      'WWWWBBBBBWW.B',
      'BBBBBBWBWWW.B',
      'BWBWBWWBBWB.W',
      'WWWWWWBWBWW.B',
      'WWWBBWWBWWW.W',
      'BBBWBBWBWWB.W',
      'BWBBWBWBBWW.B',
      'WBBWWWBWWWW.n',
      'BWWWBWBWBBB.n',
      'WWBBWBBWWBW.n',
      'BWBBBWBBBWW.n',
      'BBWWBWWWWWW.n',
      'BBBBBBBBBnn.B',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'BWWBBWBWWBW.W',
      'WWWWBBBBBWW.B',
      'BBBBBBWBWWW.B',
      'BWBWBWWBBWB.W',
      'WWWWWWBWBWW.B',
      'WWWBBWWBWWW.W',
      'BBBWBBWBWWB.W',
      'BWBBWBWBBWW.B',
      'WBBWWWBWWWW.B',
      'BWWWBWBWBBB.W',
      'WWBBWBBWWBW.W',
      'BWBBBWBBBWW.W',
      'BBWWBWWWWWW.B',
      'BBBBBBBBBWW.B',
    ]),
    difficulty: 8,
    author: 'AZURE',
    link: '',
    description: '',
  },
  {
    title: 'Chain reaction',
    grid: GridData.create([
      '.nnnnnnnn.',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      'nnnnnnnnnn',
      '.nnnnnnnn.',
    ])
      .addRule(
        new BanPatternRule(
          GridData.create(['nnnnn', 'nnnnn', 'nnnnn', 'nnnnn', 'nWWnn'])
        )
      )
      .withSymbols([
        new NumberSymbol(7, 9, 3),
        new NumberSymbol(4, 9, 8),
        new NumberSymbol(0, 7, 6),
        new NumberSymbol(0, 2, 4),
        new NumberSymbol(1, 0, 8),
        new NumberSymbol(4, 3, 8),
        new NumberSymbol(7, 2, 5),
        new NumberSymbol(9, 3, 4),
        new NumberSymbol(7, 6, 8),
      ]),
    solution: null,
    difficulty: 5,
    author: 'AZURE',
    link: '',
    description: '',
  },
  {
    title: 'Scratch Pad',
    grid: new GridData(12, 12),
    solution: null,
    difficulty: 1,
    author: 'Lysine',
    link: '',
    description: 'An empty grid for you to design your next puzzle.',
  },
];

const defaultSelection = 8;

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
          <a className="text-md">
            {puzzle.title}
            <span className="badge badge-secondary badge-sm rounded-lg">
              {puzzle.author}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
});
