import { instance as undercluedInstance } from '../../rules/undercluedRule.js';
import EventIteratingSolver from '../eventIteratingSolver.js';

export default class UniversalSolver extends EventIteratingSolver {
  public readonly id = 'universal';

  public readonly author = 'romain22222, Lysine';

  public readonly description =
    'A backtracking solver that supports all rules and symbols (including underclued) but is less optimized.';

  protected createWorker(): Worker {
    return new Worker(new URL('./universalWorker.js', import.meta.url), {
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
