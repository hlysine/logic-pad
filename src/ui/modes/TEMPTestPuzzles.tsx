import { memo, useEffect } from 'react';
import { useGrid } from '../GridContext';
import ViewpointSymbol from '../../data/symbols/viewpointSymbol';
import ConnectAllRule from '../../data/rules/connectAllRule';
import { Color } from '../../data/primitives';
import BanPatternRule from '../../data/rules/banPatternRule';
import GridData from '../../data/grid';
import GridConnections from '../../data/gridConnections';
import { useEdit } from '../EditContext';
import LetterSymbol from '../../data/symbols/letterSymbol';

const PUZZLES = [
  {
    name: 'Triangles',
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
          GridData.create(['.bbb.', 'bb.bb', '.bbb.', '..b..'])
        )
      )
      .addRule(
        new BanPatternRule(
          GridData.create(['.bbb.', 'wb.bw', '.bbb.', '..w..'])
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
  },
  {
    name: 'Flow',
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
  },
];

export default memo(function TEMPTestPuzzles() {
  const { grid, setGrid } = useGrid();
  const { clearHistory } = useEdit();

  useEffect(() => {
    if (grid.width === 0) {
      setGrid(PUZZLES[0].grid);
      clearHistory(PUZZLES[0].grid);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ul className="menu menu-vertical lg:menu-horizontal bg-base-200 rounded-box text-base-content">
      {PUZZLES.map(puzzle => (
        <li
          key={puzzle.name}
          onClick={() => {
            setGrid(puzzle.grid);
            clearHistory(puzzle.grid);
          }}
        >
          <a>{puzzle.name}</a>
        </li>
      ))}
    </ul>
  );
});
