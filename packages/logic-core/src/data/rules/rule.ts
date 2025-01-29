import GridData from '../grid.js';
import { Mode, RuleState } from '../primitives.js';
import Instruction from '../instruction.js';

export interface SearchVariant {
  description: string;
  rule: Rule;
}

export default abstract class Rule extends Instruction {
  public abstract validateGrid(grid: GridData): RuleState;

  public abstract get searchVariants(): SearchVariant[];

  public searchVariant(): SearchVariant {
    return {
      description: this.explanation,
      rule: this,
    };
  }

  public modeVariant(_mode: Mode): Rule | null {
    return this as Rule;
  }

  /**
   * Whether only one instance of this rule is allowed in a grid.
   */
  public get isSingleton(): boolean {
    return false;
  }
}

export const instance = undefined;
