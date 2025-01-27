import { createContext, memo, useContext, useState } from 'react';
import { Position } from '@logic-pad/core/data/primitives';

interface SolvePathContext {
  solvePath: Position[];
  setSolvePath: (solvePath: Position[]) => void;
  visualizeSolvePath: boolean;
  setVisualizeSolvePath: (visualizeSolvePath: boolean) => void;
}

const context = createContext<SolvePathContext>({
  solvePath: [],
  setSolvePath: () => {},
  visualizeSolvePath: false,
  setVisualizeSolvePath: () => {},
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
  const [visualizeSolvePath, setVisualizeSolvePath] = useState<boolean>(false);

  return (
    <context.Provider
      value={{
        solvePath,
        setSolvePath,
        visualizeSolvePath,
        setVisualizeSolvePath,
      }}
    >
      {children}
    </context.Provider>
  );
});
