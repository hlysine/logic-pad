import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import EventIteratingSolver from '../eventIteratingSolver.js';

export default class UndercluedSolver extends EventIteratingSolver {
  public readonly id = 'underclued';

  public readonly description =
    'Solves every puzzle as if it were underclued. Supports all rules and symbols and is decently fast for small puzzles. Very slow for large puzzles.';

  protected createWorker(): Worker {
    return new Worker(new URL('./undercluedWorker.js', import.meta.url), {
      type: 'module',
    });
  }

  public isInstructionSupported(instructionId: string): boolean {
    if (super.isInstructionSupported(instructionId)) {
      return true;
    }
    return instructionId === undercluedInstance.id;
  }
}
