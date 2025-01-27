import { createContext, memo, useContext, useEffect, useState } from 'react';
import GridData from '@logic-pad/core/data/grid';
import { useEdit } from './EditContext.tsx';
import { PuzzleMetadata } from '@logic-pad/core/data/puzzle';
import validateGrid from '@logic-pad/core/data/validate';
import { useGridState } from './GridStateContext.tsx';
import { handlesSetGrid } from '@logic-pad/core/data/events/onSetGrid';

export interface GridContext {
  grid: GridData;
  solution: GridData | null;
  metadata: PuzzleMetadata;
  setGrid: (value: GridData, solution?: GridData | null) => void;
  setGridRaw: (value: GridData, solution?: GridData | null) => void;
  setMetadata: (value: PuzzleMetadata) => void;
}

export const defaultGrid = new GridData(5, 4);
const defaultMetadata: PuzzleMetadata = {
  title: '',
  author: '',
  description: '',
  link: '',
  difficulty: 1,
};

const context = createContext<GridContext>({
  grid: defaultGrid,
  solution: null,
  metadata: defaultMetadata,
  setGrid: () => {},
  setGridRaw: () => {},
  setMetadata: () => {},
});

export const useGrid = () => {
  return useContext(context);
};

export const GridConsumer = context.Consumer;

export default memo(function GridContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { recordEdit, clearHistory } = useEdit();
  const { setState } = useGridState();

  const [grid, setGrid] = useState(defaultGrid);
  const [solution, setSolution] = useState<GridData | null>(null);
  const [metadata, setMetadata] = useState<PuzzleMetadata>(defaultMetadata);

  useEffect(() => {
    clearHistory(grid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setGridRaw: GridContext['setGridRaw'] = (newGrid, sol) => {
    newGrid.symbols.forEach(list => {
      list.forEach(symbol => {
        if (handlesSetGrid(symbol)) {
          newGrid = symbol.onSetGrid(
            grid,
            newGrid,
            sol === undefined ? solution : sol
          );
        }
      });
    });
    newGrid.rules.forEach(rule => {
      if (handlesSetGrid(rule)) {
        newGrid = rule.onSetGrid(
          grid,
          newGrid,
          sol === undefined ? solution : sol
        );
      }
    });
    setGrid(newGrid);
    if (sol !== undefined) setSolution(sol);
    setState(validateGrid(newGrid, sol === undefined ? solution : sol));
  };

  return (
    <context.Provider
      value={{
        grid,
        solution,
        metadata,
        setGrid: (grid, sol) => {
          recordEdit(grid);
          setGridRaw(grid, sol);
        },
        setGridRaw,
        setMetadata,
      }}
    >
      {children}
    </context.Provider>
  );
});
