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
          const { solution } = Serializer.parsePuzzle(e.data as string);
          resolve(solution);
        });
        worker.postMessage(
          Serializer.stringifyPuzzle({
            grid,
            solution: null,
            title: '',
            author: '',
            description: '',
            link: '',
            difficulty: 1,
          })
        );
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
