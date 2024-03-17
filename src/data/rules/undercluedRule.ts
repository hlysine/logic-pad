import GridData from '../grid';
import { Color, GridState, RuleState, State } from '../primitives';
import NumberSymbol from '../symbols/numberSymbol';
import QuestionMarkSign from '../symbols/signs/questionMarkSign';
import Rule from './rule';

export default class UndercluedRule extends Rule {
  private static EXAMPLE_GRID = GridData.create([
    'nbnnn',
    'bwbnn',
    'nbnnn',
    'wwwnn',
  ])
    .addSymbol(new NumberSymbol(1, 1, 1))
    .addSymbol(new NumberSymbol(0, 3, 4))
    .addSymbol(new QuestionMarkSign(0, 2))
    .addSymbol(new QuestionMarkSign(2, 2))
    .addSymbol(new QuestionMarkSign(3, 3));

  public get id(): string {
    return `underclued`;
  }

  public get explanation(): string {
    return `*Underclued Grid:* Mark only what is definitely true`;
  }

  public get exampleGrid(): GridData {
    return UndercluedRule.EXAMPLE_GRID;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  // eslint-disable-next-line no-empty-pattern
  public copyWith({}: {}): this {
    return new UndercluedRule() as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }

  public statusText(
    grid: GridData,
    solution: GridData | null,
    _state: GridState
  ): string | null {
    if (solution === null) return null;
    let solutionCount = 0;
    let gridCount = 0;
    grid.forEach(tile => {
      if (!tile.fixed && tile.color !== Color.Gray) gridCount++;
    });
    solution.forEach(tile => {
      if (!tile.fixed && tile.color !== Color.Gray) solutionCount++;
    });
    return `Tiles Remaining: ${solutionCount - gridCount}`;
  }
}
