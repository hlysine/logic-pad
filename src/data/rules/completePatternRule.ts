import GridData from '../grid';
import { RuleState, State } from '../primitives';
import Rule from './rule';

export default class CompletePatternRule extends Rule {
  private static EXAMPLE_GRID = GridData.create([
    'wbwbw',
    'bwbwb',
    'wbwbw',
    'bwbwb',
  ]);

  public get id(): string {
    return `complete_pattern`;
  }

  public get explanation(): string {
    return `Complete the pattern`;
  }

  public createExampleGrid(): GridData {
    return CompletePatternRule.EXAMPLE_GRID;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  // eslint-disable-next-line no-empty-pattern
  public copyWith({}: {}): this {
    return new CompletePatternRule() as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }
}
