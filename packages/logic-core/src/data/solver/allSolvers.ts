import Solver from './solver.js';
import UndercluedSolver from './underclued/undercluedSolver.js';
import BacktrackSolver from './backtrack/backtrackSolver.js';
import Z3Solver from './z3/z3Solver.js';

const allSolvers = new Map<string, Solver>();

function register(prototype: Solver) {
  allSolvers.set(prototype.id, prototype);
}

register(new BacktrackSolver());
register(new UndercluedSolver());
register(new Z3Solver());

export { allSolvers };
