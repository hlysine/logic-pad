import GridData from '../../grid';
import { instance as undercluedInstance } from '../../rules/undercluedRule';
import { Serializer } from '../../serializer/allSerializers';
import Solver from '../solver';
import Worker from './undercluedWorker?worker';

export default class UndercluedSolver extends Solver {
  public readonly id = 'underclued';

  public readonly description =
    'Solves every puzzle as if it were underclued. Supports all rules and symbols and is decently fast for small puzzles. Very slow for large puzzles.';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    const worker = new Worker();
    try {
      const solved = await new Promise<GridData | null>(resolve => {
        worker.addEventListener('message', e => {
          const solution = Serializer.parseGrid(e.data as string);
          console.timeEnd('Solve time');
          if (solution.resetTiles().equals(solution)) resolve(null);
          else resolve(solution);
        });
        worker.postMessage(Serializer.stringifyGrid(grid));
        console.time('Solve time');
      });
      yield solved;
    } finally {
      worker.terminate();
    }
  }

  public isInstructionSupported(instructionId: string): boolean {
    if (super.isInstructionSupported(instructionId)) {
      return true;
    }
    return instructionId === undercluedInstance.id;
  }
}
