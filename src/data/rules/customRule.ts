import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { RuleState, State } from '../primitives';
import Rule, { SearchVariant } from './rule';

export default class CustomRule extends Rule {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwwww', 'wwwww', 'wwwww', 'wwwww'])
  );

  public static readonly configs: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.String,
      default: 'A *custom* rule',
      field: 'description',
      description: 'Description',
      configurable: true,
    },
    {
      type: ConfigType.Tile,
      default: CustomRule.EXAMPLE_GRID,
      resizable: false,
      field: 'grid',
      description: 'Thumbnail Grid',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new CustomRule('A *custom* rule', CustomRule.EXAMPLE_GRID).searchVariant(),
  ];

  /**
   * A custom rule with a description and thumbnail grid.
   *
   * This rule validates answers based on the provided solution.
   *
   * @param description - The description of the rule.
   * @param grid - The thumbnail grid of the rule, preferably 5x4 in size.
   */
  public constructor(
    public readonly description: string,
    public readonly grid: GridData
  ) {
    super();
    this.description = description;
    this.grid = grid;
  }

  public get id(): string {
    return `custom`;
  }

  public get explanation(): string {
    return this.description;
  }

  public get configs(): readonly AnyConfig[] | null {
    return CustomRule.configs;
  }

  public createExampleGrid(): GridData {
    return this.grid;
  }

  public get searchVariants(): SearchVariant[] {
    return CustomRule.SEARCH_VARIANTS;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public copyWith({
    description,
    grid,
  }: {
    description?: string;
    grid?: GridData;
  }): this {
    return new CustomRule(
      description ?? this.description,
      grid ?? this.grid
    ) as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }
}

export const instance = new CustomRule('', GridData.create([]));
