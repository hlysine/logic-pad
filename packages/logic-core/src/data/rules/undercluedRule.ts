import GridData from '../grid.js';
import { RuleState, State } from '../primitives.js';
import AreaNumberSymbol from '../symbols/areaNumberSymbol.js';
import CustomTextSymbol from '../symbols/customTextSymbol.js';
import Rule, { SearchVariant } from './rule.js';

export default class UndercluedRule extends Rule {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['nbnnn', 'bwbnn', 'nbnnn', 'wwwnn'])
      .addSymbol(new AreaNumberSymbol(1, 1, 1))
      .addSymbol(new AreaNumberSymbol(0, 3, 4))
      .addSymbol(new CustomTextSymbol('', GridData.create([]), 0, 2, '?'))
      .addSymbol(new CustomTextSymbol('', GridData.create([]), 2, 2, '?'))
      .addSymbol(new CustomTextSymbol('', GridData.create([]), 3, 3, '?'))
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

  public get isSingleton(): boolean {
    return true;
  }
}

export const instance = new UndercluedRule();
