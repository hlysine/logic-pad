import { instance as undercluedInstance } from '../../../rules/undercluedRule.js';
import EventIteratingSolver from '../../eventIteratingSolver.js';

// eslint-disable-next-line @typescript-eslint/no-unused-expressions
('vite-apply-code-mod');

export default class UniversalDevSolver extends EventIteratingSolver {
  public readonly id = 'universal_dev';

  public readonly author = 'romain22222, Lysine';

  public readonly description =
    'A backtracking solver that supports all rules and symbols (including underclued) but is less optimized.';

  protected createWorker(): Worker {
    return new Worker(new URL('./universalDevWorker.js', import.meta.url), {
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
