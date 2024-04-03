import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { Color, RuleState, State } from '../primitives';
import AreaNumberSymbol from '../symbols/areaNumberSymbol';
import Rule, { SearchVariant } from './rule';

export default class CellCountRule extends Rule {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Color,
      default: Color.Light,
      allowGray: false,
      field: 'color',
      description: 'Color',
      configurable: true,
    },
    {
      type: ConfigType.Number,
      default: 10,
      min: 0,
      field: 'count',
      description: 'Count',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new CellCountRule(Color.Light, 10).searchVariant(),
    new CellCountRule(Color.Dark, 10).searchVariant(),
  ];

  /**
   * **There are &lt;count&gt; &lt;color&gt; cells in total**
   *
   * @param color - The color of the cells to count.
   * @param count - The total number of cells of the given color.
   */
  public constructor(
    public readonly color: Color,
    public readonly count: number
  ) {
    super();
    this.color = color;
    this.count = count;
  }

  public get id(): string {
    return `cell_count`;
  }

  public get explanation(): string {
    return `There are ${this.count} ${this.color} cell${this.count === 1 ? '' : 's'} *in total*`;
  }

  public createExampleGrid(): GridData {
    const grid = GridData.create(['wbbbb', 'wwbbb', 'wwwbb', 'wwwwb']);
    if (this.color === Color.Light) {
      return grid.addSymbol(new AreaNumberSymbol(0, 3, this.count));
    } else {
      return grid.addSymbol(new AreaNumberSymbol(4, 0, this.count));
    }
  }

  public get configs(): readonly AnyConfig[] | null {
    return CellCountRule.CONFIGS;
  }

  public get searchVariants(): SearchVariant[] {
    return CellCountRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    let colored = 0;
    let possible = 0;
    grid.forEach(tile => {
      if (!tile.exists) return;
      if (tile.color === this.color) colored++;
      if (tile.color === Color.Gray) possible++;
    });
    if (colored > this.count || colored + possible < this.count) {
      return { state: State.Error, positions: [] };
    } else if (colored === this.count && possible === 0) {
      return { state: State.Satisfied };
    } else {
      return { state: State.Incomplete };
    }
  }

  public copyWith({ color, count }: { color?: Color; count?: number }): this {
    return new CellCountRule(color ?? this.color, count ?? this.count) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }

  public withCount(count: number): this {
    return this.copyWith({ count });
  }
}
