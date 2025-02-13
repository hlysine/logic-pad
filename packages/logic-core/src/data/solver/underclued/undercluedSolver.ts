import GridData from '../../grid.js';
import { Color } from '../../primitives.js';
import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import { Serializer } from '../../serializer/allSerializers.js';
import Solver, { CancelRef } from '../solver.js';

export default class UndercluedSolver extends Solver {
  public readonly id = 'underclued';

  public readonly description =
    'Solves every puzzle as if it were underclued. Supports all rules and symbols and is decently fast for small puzzles. Very slow for large puzzles.';

  public async *solve(
    grid: GridData,
    cancelRef: CancelRef
  ): AsyncGenerator<GridData | null> {
    const worker = new Worker(
      new URL('./undercluedWorker.js', import.meta.url),
      {
        type: 'module',
      }
    );

    cancelRef.cancel = () => worker.terminate();

    try {
      const solved = await new Promise<GridData | null>(resolve => {
        worker.addEventListener('message', e => {
          const solution = Serializer.parseGrid(e.data as string);
          // console.timeEnd('Solve time');
          if (solution.resetTiles().equals(solution)) resolve(null);
          else resolve(solution);
        });
        worker.postMessage(Serializer.stringifyGrid(grid));
        // console.time('Solve time');
      });
      yield solved;
      if (solved) {
        if (solved.getTileCount(true, undefined, Color.Gray) === 0) {
          yield null; // the grid is completely filled, which means the solution is unique
        }
      }
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
