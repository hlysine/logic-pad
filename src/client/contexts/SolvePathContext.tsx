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

export interface SolvePathContextProps {
  children: React.ReactNode;
  solvePath?: Position[];
  setSolvePath?: (solvePath: Position[]) => void;
}

export default memo(function SolvePathContext({
  children,
  solvePath: externalSolvePath,
  setSolvePath: setExternalSolvePath,
}: SolvePathContextProps) {
  const [internalSolvePath, setInternalSolvePath] = useState<Position[]>([]);
  const [visualizeSolvePath, setVisualizeSolvePath] = useState<boolean>(false);

  return (
    <context.Provider
      value={{
        solvePath: externalSolvePath ?? internalSolvePath,
        setSolvePath: setExternalSolvePath ?? setInternalSolvePath,
        visualizeSolvePath,
        setVisualizeSolvePath,
      }}
    >
      {children}
    </context.Provider>
  );
});
