import { createContext, memo, useContext, useMemo, useState } from 'react';
import GridData from '../data/grid';
import { useEdit } from './EditContext';
import { PuzzleMetadata } from '../data/puzzle';
import validateGrid from '../data/validate';
import { useGridState } from './GridStateContext';
import debounce from 'lodash/debounce';
import { GridState } from '../data/primitives';

interface GridContext {
  grid: GridData;
  solution: GridData | null;
  metadata: PuzzleMetadata;
  setGrid: (value: GridData, solution?: GridData | null) => void;
  setGridRaw: (value: GridData, solution?: GridData | null) => void;
  setMetadata: (value: PuzzleMetadata) => void;
}

const defaultGrid = GridData.create([]);
const defaultMetadata: PuzzleMetadata = {
  title: '',
  author: '',
  description: '',
  link: '',
  difficulty: 0,
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
  const { recordEdit } = useEdit();
  const { setState } = useGridState();

  const [grid, setGrid] = useState(defaultGrid);
  const [solution, setSolution] = useState<GridData | null>(null);
  const [metadata, setMetadata] = useState<PuzzleMetadata>(defaultMetadata);

  const setStateDebounced = useMemo(
    () =>
      debounce((state: GridState) => setState(state), 100, {
        maxWait: 100,
        trailing: true,
        leading: false,
      }),
    [setState]
  );

  const setGridRaw: GridContext['setGridRaw'] = (grid, sol) => {
    setGrid(grid);
    if (sol !== undefined) setSolution(sol);
    setStateDebounced(validateGrid(grid, sol === undefined ? solution : sol));
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
