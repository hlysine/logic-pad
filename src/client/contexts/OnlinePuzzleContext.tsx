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
  setId: (id: string | null) => void;
  lastSaved: Puzzle;
  setLastSaved: (puzzle: Puzzle) => void;
}

const context = createContext<OnlinePuzzleContext>({
  id: null,
  setId: () => {},
  lastSaved: defaultPuzzle,
  setLastSaved: () => {},
});

export const useOnlinePuzzle = () => {
  return useContext(context);
};

export const OnlinePuzzleConsumer = context.Consumer;

export default memo(function OnlinePuzzleContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [id, setId] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Puzzle>(defaultPuzzle);

  const value = useMemo(
    () => ({
      id,
      setId,
      lastSaved,
      setLastSaved,
    }),
    [id, lastSaved]
  );

  return <context.Provider value={value}>{children}</context.Provider>;
});
