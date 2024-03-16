import { createContext, useContext, useEffect, useState } from 'react';
import GridData from '../data/grid';
import { GridState, State } from '../data/primitives';
import { useEdit } from './EditContext';

interface GridContext {
  grid: GridData;
  state: GridState;
  setGrid: (value: GridData) => void;
  setGridRaw: (value: GridData) => void;
  setState: (value: GridState) => void;
}

const defaultGrid = GridData.create([]);
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
