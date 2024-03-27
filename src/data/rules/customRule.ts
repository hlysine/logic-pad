import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { RuleState, State } from '../primitives';
import Rule from './rule';

export default class CustomRule extends Rule {
  private static readonly EXAMPLE_GRID = GridData.create([
    'wwwww',
    'wwwww',
    'wwwww',
    'wwwww',
  ]);

  private static readonly CONFIGS: readonly AnyConfig[] = [
    {
      type: ConfigType.String,
      default: 'A *custom* rule.',
      field: 'description',
      description: 'Description',
    },
    {
      type: ConfigType.Grid,
      default: CustomRule.EXAMPLE_GRID,
      field: 'grid',
      description: 'Example Grid',
    },
  ];

  public constructor(
    public readonly description: string,
    public readonly grid: GridData
  ) {
    super();
    this.description = description;
    this.grid = grid;
  }

  public static readonly id = `underclued`;

  public static readonly searchVariants = [
    new CustomRule('A *custom* rule.', CustomRule.EXAMPLE_GRID).searchVariant(),
  ];

  public get id(): string {
    return CustomRule.id;
  }

  public get explanation(): string {
    return this.description;
  }

  public createExampleGrid(): GridData {
    return this.grid;
  }

  public get configs(): readonly AnyConfig[] | null {
    return CustomRule.CONFIGS;
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
