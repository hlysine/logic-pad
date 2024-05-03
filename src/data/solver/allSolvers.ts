import GridData from '../grid';
import SolverBase from './solverBase';
import Z3Solver from './z3/z3Solver';

const allSolvers = new Map<string, SolverBase>();

function register(prototype: SolverBase) {
  allSolvers.set(prototype.id, prototype);
}

const activeSolver = new Z3Solver();
register(activeSolver);

class MasterSolver extends SolverBase {
  public readonly id = 'solver';

  public isEnvironmentSupported(): Promise<boolean> {
    return activeSolver.isEnvironmentSupported();
  }

  public solve(grid: GridData): AsyncGenerator<GridData | null> {
    // todo: run multiple solvers in parallel when we have more than one
    return activeSolver.solve(grid);
  }

  public isInstructionSupported(instructionId: string): boolean {
    return activeSolver.isInstructionSupported(instructionId);
  }

  public isGridSupported(grid: GridData): boolean {
    return activeSolver.isGridSupported(grid);
  }
}

const Solver = new MasterSolver();
export { Solver };
