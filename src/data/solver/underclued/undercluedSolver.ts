import GridData from '../../grid';
import { instance as undercluedInstance } from '../../rules/undercluedRule';
import { Serializer } from '../../serializer/allSerializers';
import Solver from '../solver';
import Worker from './worker?worker';

export default class UndercluedSolver extends Solver {
  public readonly id = 'underclued';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    const worker = new Worker();
    try {
      const solved = await new Promise<GridData | null>(resolve => {
        worker.addEventListener('message', e => {
          const solution = Serializer.parseGrid(e.data as string);
          if (solution.resetTiles().equals(solution)) resolve(null);
          else resolve(solution);
        });
        worker.postMessage(Serializer.stringifyGrid(grid));
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
