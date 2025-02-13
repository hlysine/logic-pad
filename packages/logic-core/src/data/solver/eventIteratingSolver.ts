import GridData from '../grid.js';
import { Serializer } from '../serializer/allSerializers.js';
import Solver, { CancelRef } from './solver.js';
import { EventIterator } from 'event-iterator';

export default abstract class EventIteratingSolver extends Solver {
  protected abstract createWorker(): Worker;

  public async *solve(
    grid: GridData,
    cancelRef: CancelRef
  ): AsyncGenerator<GridData | null> {
    const worker = this.createWorker();

    cancelRef.cancel = () => worker.terminate();

    try {
      const iterator = new EventIterator<GridData>(({ push, stop, fail }) => {
        worker.postMessage(Serializer.stringifyGrid(grid.resetTiles()));

        worker.addEventListener('message', (e: MessageEvent<string | null>) => {
          if (e.data) {
            push(Serializer.parseGrid(e.data));
          } else {
            stop();
          }
        });

        worker.addEventListener('error', (e: ErrorEvent) => {
          alert(`Error while solving!\n${e.message}`);
          fail(e as unknown as Error);
        });
      });

      for await (const solution of iterator) {
        yield solution;
      }

      yield null;
    } finally {
      worker.terminate();
    }
  }
}
