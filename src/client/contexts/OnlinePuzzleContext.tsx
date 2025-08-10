import { createContext, memo, useContext, useMemo, useState } from 'react';
import { defaultGrid } from './GridContext';
import { Puzzle } from '@logic-pad/core/data/puzzle';

const defaultPuzzle = {
  title: '',
  description: '',
  author: '',
  difficulty: 1,
  grid: defaultGrid,
  solution: null,
};

export interface OnlinePuzzleContext {
  id: string | null;
  lastSaved: Puzzle;
  setLastSaved: (puzzle: Puzzle) => void;
}

const context = createContext<OnlinePuzzleContext>({
  id: null,
  lastSaved: defaultPuzzle,
  setLastSaved: () => {},
});

export const useOnlinePuzzle = () => {
  return useContext(context);
};

export const OnlinePuzzleConsumer = context.Consumer;

export default memo(function OnlinePuzzleContext({
  children,
  id,
  initialPuzzle = defaultPuzzle,
}: {
  children: React.ReactNode;
  id: string | null;
  initialPuzzle?: Puzzle;
}) {
  const [lastSaved, setLastSaved] = useState<Puzzle>(initialPuzzle);

  const value = useMemo(
    () => ({
      id,
      lastSaved,
      setLastSaved,
    }),
    [id, lastSaved]
  );

  return <context.Provider value={value}>{children}</context.Provider>;
});
