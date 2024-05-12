import GridData from '../grid';
import { RuleState } from '../primitives';
import Instruction from '../instruction';

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

  public get visibleWhenSolving(): boolean {
    return true;
  }

  /**
   * Whether only one instance of this rule is allowed in a grid.
   */
  public get isSingleton(): boolean {
    return false;
  }
}

export const instance = undefined;
