import Solver from './solver.js';
import UniversalSolver from './universal/universalSolver.js';
import BacktrackSolver from './backtrack/backtrackSolver.js';
import Z3Solver from './z3/z3Solver.js';
import CspuzSolver from './cspuz/cspuzSolver.js';

const allSolvers = new Map<string, Solver>();

function register(prototype: Solver) {
  allSolvers.set(prototype.id, prototype);
}

register(new CspuzSolver());
register(new BacktrackSolver());
register(new UniversalSolver());
register(new Z3Solver());

export { allSolvers };
