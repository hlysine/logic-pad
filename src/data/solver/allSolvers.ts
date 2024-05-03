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

  public solve(grid: GridData): AsyncGenerator<GridData | null> {
    return activeSolver.solve(grid);
  }

  public isInstructionSupported(instructionId: string): boolean {
    return activeSolver.isInstructionSupported(instructionId);
  }
}

const Solver = new MasterSolver();
export { Solver };
