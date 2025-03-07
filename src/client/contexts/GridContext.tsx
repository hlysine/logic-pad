import { createContext, memo, useContext, useEffect, useState } from 'react';
import GridData from '@logic-pad/core/data/grid';
import { useEdit } from './EditContext.tsx';
import { PuzzleMetadata } from '@logic-pad/core/data/puzzle';
import validateGrid from '@logic-pad/core/data/validate';
import { useGridState } from './GridStateContext.tsx';
import { invokeSetGrid } from '@logic-pad/core/data/events/onSetGrid';

export interface GridContext {
  grid: GridData;
  solution: GridData | null;
  metadata: PuzzleMetadata;
  setGrid: (value: GridData, solution?: GridData | null) => void;
  setGridRaw: (value: GridData, solution?: GridData | null) => void;
  setMetadata: (value: PuzzleMetadata) => void;
}

export const defaultGrid = GridData.create(5, 4);
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

export interface GridContextProps {
  children: React.ReactNode;
  initialGrid?: GridData | (() => GridData);
  initialSolution?: GridData | null | (() => GridData | null);
  initialMetadata?: PuzzleMetadata | (() => PuzzleMetadata);
  grid?: GridData;
  setGrid?: (value: GridData) => void;
}

export default memo(function GridContext({
  children,
  initialGrid,
  initialSolution,
  initialMetadata,
  grid: externalGrid,
  setGrid: setExternalGrid,
}: GridContextProps) {
  const { recordEdit, clearHistory } = useEdit();
  const { setState } = useGridState();

  const [internalGrid, setInternalGrid] = useState(initialGrid ?? defaultGrid);
  const [solution, setSolution] = useState<GridData | null>(
    initialSolution === undefined ? null : initialSolution
  );
  const [metadata, setMetadata] = useState<PuzzleMetadata>(
    initialMetadata ?? defaultMetadata
  );

  const grid = externalGrid ?? internalGrid;
  const setGrid = setExternalGrid ?? setInternalGrid;

  useEffect(() => {
    clearHistory(grid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setGridRaw = (newGrid: GridData, sol?: GridData | null) => {
    newGrid = invokeSetGrid(grid, newGrid, sol === undefined ? solution : sol);
    setGrid(newGrid);
    if (sol !== undefined) setSolution(sol);
    setState(validateGrid(newGrid, sol === undefined ? solution : sol));
    return newGrid;
  };

  return (
    <context.Provider
      value={{
        grid,
        solution,
        metadata,
        setGrid: (grid, sol) => {
          recordEdit(setGridRaw(grid, sol));
        },
        setGridRaw,
        setMetadata,
      }}
    >
      {children}
    </context.Provider>
  );
});
