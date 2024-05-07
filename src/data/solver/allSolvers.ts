import Solver from './solver';
import UndercluedSolver from './underclued/undercluedSolver';
import Z3Solver from './z3/z3Solver';

const allSolvers = new Map<string, Solver>();

function register(prototype: Solver) {
  allSolvers.set(prototype.id, prototype);
}

register(new Z3Solver());
register(new UndercluedSolver());

export { allSolvers };
