import { createContext, useContext, useEffect, useState } from 'react';
import GridData from '../data/grid';
import { Color, GridState, State } from '../data/primitives';
import ConnectAllRule from '../data/rules/connectAllRule';
import ViewpointSymbol from '../data/symbols/viewpointSymbol';
import BanPatternRule from '../data/rules/banPatternRule';
import GridConnections from '../data/gridConnections';
import { useEdit } from './EditContext';

interface GridContext {
  grid: GridData;
  state: GridState;
  setGrid: (value: GridData) => void;
  setGridRaw: (value: GridData) => void;
  setState: (value: GridState) => void;
}

const defaultGrid = GridData.create([
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
    new BanPatternRule(GridData.create(['.bbb.', 'bb.bb', '.bbb.', '..b..']))
  )
  .addRule(
    new BanPatternRule(GridData.create(['.bbb.', 'wb.bw', '.bbb.', '..w..']))
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
  .addSymbol(new ViewpointSymbol(23, 23, 7));
const defaultState: GridState = { rules: [], symbols: new Map() };

const context = createContext<GridContext>({
  grid: defaultGrid,
  state: defaultState,
  setGrid: () => {},
  setGridRaw: () => {},
  setState: () => {},
});

export const useGrid = () => {
  return useContext(context);
};

export const GridConsumer = context.Consumer;

export default function GridContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { recordEdit } = useEdit();

  const [grid, setGrid] = useState(defaultGrid);
  const [state, setState] = useState(defaultState);

  const validateGrid = (grid: GridData) => {
    const rules = grid.rules.map(rule => rule.validateGrid(grid));
    const symbols = new Map<string, State[]>();
    grid.symbols.forEach((symbolList, id) =>
      symbols.set(
        id,
        symbolList.map(s => s.validateSymbol(grid))
      )
    );
    setState({ rules, symbols });
  };

  useEffect(() => {
    validateGrid(grid);
    recordEdit(grid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setGridRaw: GridContext['setGridRaw'] = grid => {
    setGrid(grid);
    validateGrid(grid);
  };

  return (
    <context.Provider
      value={{
        grid,
        state,
        setGrid: grid => {
          recordEdit(grid);
          setGridRaw(grid);
        },
        setGridRaw,
        setState,
      }}
    >
      {children}
    </context.Provider>
  );
}
