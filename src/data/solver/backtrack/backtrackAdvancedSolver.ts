import GridData from '../../grid';
import Solver from '../solver';
import { solve } from './worker';
import { instance as undercluedInstance } from '../../rules/undercluedRule';

export default class BacktrackAdvancedSolver extends Solver {
  public readonly id = 'backtrack advanced';

  public readonly description =
    'Solves puzzles using backtracking with optimizations (much faster than naive backtrack). Support all rules and symbols except for underclued.';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    console.log('Solving');

    console.time('Solve time');

    const res = solve(grid);

    console.timeEnd('Solve time');

    console.log(res);

    yield res;
  }

  public isInstructionSupported(instructionId: string): boolean {
    if (instructionId == undercluedInstance.id) return true;

    return super.isInstructionSupported(instructionId);
  }
}
