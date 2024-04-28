import GridData from '../grid';
import { Color, GridState, RuleState, State } from '../primitives';
import AreaNumberSymbol from '../symbols/areaNumberSymbol';
import QuestionMarkSign from '../symbols/signs/questionMarkSign';
import Rule, { SearchVariant } from './rule';

export default class UndercluedRule extends Rule {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['nbnnn', 'bwbnn', 'nbnnn', 'wwwnn'])
      .addSymbol(new AreaNumberSymbol(1, 1, 1))
      .addSymbol(new AreaNumberSymbol(0, 3, 4))
      .addSymbol(new QuestionMarkSign(0, 2))
      .addSymbol(new QuestionMarkSign(2, 2))
      .addSymbol(new QuestionMarkSign(3, 3))
  );

  private static readonly SEARCH_VARIANTS = [
    new UndercluedRule().searchVariant(),
  ];

  /**
   * **Underclued Grid: Mark only what is definitely true**
   *
   * This rule validates answers based on the provided solution.
   */
  public constructor() {
    super();
  }

  public get id(): string {
    return `underclued`;
  }

  public get explanation(): string {
    return `*Underclued Grid:* Mark only what is definitely true`;
  }

  public createExampleGrid(): GridData {
    return UndercluedRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return UndercluedRule.SEARCH_VARIANTS;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public copyWith(_: object): this {
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

export const instance = new UndercluedRule();
