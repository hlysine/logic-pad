import GridData from '../grid.js';
import { MajorRule, RuleState, State } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';

export default class CompletePatternRule extends Rule {
  public readonly name = 'Complete The Pattern';

  public get configExplanation() {
    return 'Complete the grid by pattern recognition. Your provided solution may override auto-validation.';
  }

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wbwbw', 'bwbwb', 'wbwbw', 'bwbwb'])
  );

  private static readonly SEARCH_VARIANTS = [
    new CompletePatternRule().searchVariant(),
  ];

  /**
   * **Complete the pattern**
   *
   * This rule validates answers based on the provided solution.
   */
  public constructor() {
    super();
  }

  public get id(): string {
    return MajorRule.CompletePattern;
  }

  public get explanation(): string {
    return `Complete the pattern`;
  }

  public createExampleGrid(): GridData {
    return CompletePatternRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return CompletePatternRule.SEARCH_VARIANTS;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public copyWith(_: object): this {
    return new CompletePatternRule() as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }

  public get isSingleton(): boolean {
    return true;
  }
}

export const instance = new CompletePatternRule();
