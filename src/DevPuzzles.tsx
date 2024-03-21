import { memo, useEffect } from 'react';
import { useGrid } from './ui/GridContext';
import ViewpointSymbol from './data/symbols/viewpointSymbol';
import ConnectAllRule from './data/rules/connectAllRule';
import { Color } from './data/primitives';
import BanPatternRule from './data/rules/banPatternRule';
import GridData from './data/grid';
import GridConnections from './data/gridConnections';
import { useEdit } from './ui/EditContext';
import LetterSymbol from './data/symbols/letterSymbol';
import NumberSymbol from './data/symbols/numberSymbol';
import UndercluedRule from './data/rules/undercluedRule';
import CompletePatternRule from './data/rules/completePatternRule';
import Puzzle from './data/puzzle';

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
      .addRule(
        new BanPatternRule(
          GridData.create(['nnnnn', 'nbbbn', 'bbnbb', 'nbbbn', 'nnbnn'])
        )
      )
      .addRule(
        new BanPatternRule(
          GridData.create(['nnnnn', 'nbbbn', 'wbnbw', 'nbbbn', 'nnwnn'])
        )
      )
      .addRule(new ConnectAllRule(Color.Dark))
      .addSymbol(new ViewpointSymbol(17, 5, 8))
      .addSymbol(new ViewpointSymbol(23, 5, 6))
      .addSymbol(new ViewpointSymbol(5, 11, 8))
      .addSymbol(new ViewpointSymbol(11, 17, 6))
      .addSymbol(new ViewpointSymbol(17, 17, 8))
      .addSymbol(new ViewpointSymbol(23, 17, 7))
      .addSymbol(new ViewpointSymbol(5, 23, 7))
      .addSymbol(new ViewpointSymbol(11, 23, 6))
      .addSymbol(new ViewpointSymbol(17, 23, 7))
      .addSymbol(new ViewpointSymbol(23, 23, 7)),
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
    ])
      .addSymbol(new LetterSymbol(2, 2, 'A'))
      .addSymbol(new LetterSymbol(14, 2, 'F'))
      .addSymbol(new LetterSymbol(6, 4, 'D'))
      .addSymbol(new LetterSymbol(14, 4, 'E'))
      .addSymbol(new LetterSymbol(12, 6, 'D'))
      .addSymbol(new LetterSymbol(8, 8, 'C'))
      .addSymbol(new LetterSymbol(4, 12, 'B'))
      .addSymbol(new LetterSymbol(8, 16, 'B'))
      .addSymbol(new LetterSymbol(10, 16, 'A'))
      .addSymbol(new LetterSymbol(12, 16, 'F'))
      .addSymbol(new LetterSymbol(14, 16, 'C'))
      .addSymbol(new LetterSymbol(16, 16, 'E')),
    solution: null,
    difficulty: 5,
    author: 'Lysine',
    link: '',
    description: '',
  },
  {
    title: 'Underclued',
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
      .addSymbol(new LetterSymbol(2, 2, 'A'))
      .addSymbol(new LetterSymbol(7, 7, 'A'))
      .addSymbol(new NumberSymbol(1, 2, 20))
      .addSymbol(new NumberSymbol(7, 2, 8))
      .addSymbol(new NumberSymbol(6, 4, 2))
      .addSymbol(new NumberSymbol(3, 5, 2))
      .addSymbol(new NumberSymbol(1, 8, 2))
      .addSymbol(new NumberSymbol(4, 8, 2)),
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
    title: 'Pattern',
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
    title: 'Pattern 2',
    grid: GridData.create([
      'WWBWBBW.B',
      'BWWWBBW.B',
      'BWBBWBW.W',
      'WWWnWWW.W',
      'BWBnnBB.W',
      'WWWBnnB.B',
      'BBWBWnn.W',
      '.........',
      'WnBnBWB..',
    ]).addRule(new CompletePatternRule()),
    solution: GridData.create([
      'WWBWBBW.B',
      'BWWWBBW.B',
      'BWBBWBW.W',
      'WWWWWWW.W',
      'BWBWWBB.W',
      'WWWBBWB.B',
      'BBWBWWB.W',
      '.........',
      'WBBBBWB..',
    ]),
    difficulty: 8,
    author: 'Lysine',
    link: '',
    description: '',
  },
];

// million-ignore
export default memo(function DevPuzzles() {
  const { grid, setGrid, setMetadata } = useGrid();
  const { clearHistory } = useEdit();

  useEffect(() => {
    if (grid.width === 0) {
      setGrid(DEV_PUZZLES[0].grid, DEV_PUZZLES[0].solution);
      setMetadata(DEV_PUZZLES[0]);
      clearHistory(DEV_PUZZLES[0].grid);
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
            setGrid(puzzle.grid, puzzle.solution);
            setMetadata(puzzle);
            clearHistory(puzzle.grid);
          }}
        >
          <a>{puzzle.title}</a>
        </li>
      ))}
    </ul>
  );
});
