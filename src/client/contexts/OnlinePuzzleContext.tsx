import { createContext, memo, useContext, useMemo, useState } from 'react';
import GridData from '@logic-pad/core/data/grid';
import { defaultGrid } from './GridContext';

export interface OnlinePuzzleContext {
  id: string;
  setId: (id: string) => void;
  lastSaved: GridData;
  setLastSaved: (grid: GridData) => void;
}

const context = createContext<OnlinePuzzleContext>({
  id: '',
  setId: () => {},
  lastSaved: defaultGrid,
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
  const [id, setId] = useState<string>('');
  const [lastSaved, setLastSaved] = useState<GridData>(defaultGrid);

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
