import GridData from '../../grid';
import Solver from '../solver';
import Worker from './backtrackWorker?worker';
import { Serializer } from '../../serializer/allSerializers';

export default class BacktrackNaiveSolver extends Solver {
  public readonly id = 'backtrack naive';

  public readonly description =
    'Solves puzzles using backtracking. Support all rules and symbols except for underclued.';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    const worker = new Worker();

    try {
      const solutions = await new Promise<GridData[]>(resolve => {
        worker.addEventListener('message', (e: MessageEvent<string[]>) => {
          resolve(e.data.map((grid: string) => Serializer.parseGrid(grid)));
        });

        worker.postMessage(Serializer.stringifyGrid(grid));
      });

      if (solutions.length >= 1) yield solutions[0];
      if (solutions.length >= 2) yield solutions[1];
      yield null;
    } finally {
      worker.terminate();
    }
  }
}
