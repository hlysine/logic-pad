import { createContext, memo, useContext, useState } from 'react';
import { Position } from '@logic-pad/core/data/primitives';

interface SolvePathContext {
  solvePath: Position[];
  setSolvePath: (solvePath: Position[]) => void;
}

const context = createContext<SolvePathContext>({
  solvePath: [],
  setSolvePath: () => {},
});

export const useSolvePath = () => {
  return useContext(context);
};

export const SolvePathConsumer = context.Consumer;

export default memo(function SolvePathContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [solvePath, setSolvePath] = useState<Position[]>([]);

  return (
    <context.Provider
      value={{
        solvePath,
        setSolvePath,
      }}
    >
      {children}
    </context.Provider>
  );
});
