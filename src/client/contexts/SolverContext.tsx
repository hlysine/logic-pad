import { createContext, memo, useContext, useState } from 'react';
import Solver from '@logic-pad/core/data/solver/solver.js';

interface SolverContext {
  solver: Solver | null;
  setSolver: (value: Solver) => void;
}

const context = createContext<SolverContext>({
  solver: null,
  setSolver: () => {},
});

export const useSolver = () => {
  return useContext(context);
};

export const SolverConsumer = context.Consumer;

export default memo(function SolverContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const [solver, setSolver] = useState<Solver | null>(null);

  return (
    <context.Provider
      value={{
        solver,
        setSolver,
      }}
    >
      {children}
    </context.Provider>
  );
});
