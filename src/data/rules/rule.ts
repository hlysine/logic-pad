import GridData from '../grid';
import { GridState, RuleState, State } from '../primitives';
import Instruction from '../instruction';
import Symbol from '../symbols/symbol';

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

  public abstract get searchVariants(): SearchVariant[];

  public searchVariant(): SearchVariant {
    return {
      description: this.explanation,
      rule: this,
    };
  }

  public overrideSymbolValidation(
    grid: GridData,
    _symbol: Symbol,
    validator: (grid: GridData) => State
  ): State {
    return validator(grid);
  }
}
