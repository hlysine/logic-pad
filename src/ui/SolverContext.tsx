import { createContext, memo, useContext, useState } from 'react';
import Solver from '../data/solver/solver';
import { allSolvers } from '../data/solver/allSolvers';

interface SolverContext {
  solver: Solver;
  setSolver: (value: Solver) => void;
}

const defaultSolver = [...allSolvers.values()][0];

const context = createContext<SolverContext>({
  solver: defaultSolver,
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
  const [solver, setSolver] = useState(() => defaultSolver);

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
