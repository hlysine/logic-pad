import GridData from '../grid';
import { GridState, RuleState } from '../primitives';
import Instruction from '../instruction';

export interface SearchVariant {
  description: string;
  rule: Rule;
}

export default abstract class Rule extends Instruction {
  public abstract validateGrid(grid: GridData): RuleState;

  public statusText(
    _grid: GridData,
    _solution: GridData | null,
    _state: GridState
  ): string | null {
    return null;
  }

  public searchVariant(): SearchVariant {
    return {
      description: this.explanation,
      rule: this,
    };
  }
}
