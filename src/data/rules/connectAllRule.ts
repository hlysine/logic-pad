import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { array, minBy } from '../helper';
import { Color, Position, RuleState, State } from '../primitives';
import Rule, { SearchVariant } from './rule';

export default class ConnectAllRule extends Rule {
  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    GridData.create(['bwwwb', 'bwbww', 'wwwbb', 'wbwww'])
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    GridData.create(['wbbbw', 'wbwbb', 'bbbww', 'bwbbb'])
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Color,
      default: Color.Light,
      allowGray: false,
      field: 'color',
      description: 'Color',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new ConnectAllRule(Color.Light).searchVariant(),
    new ConnectAllRule(Color.Dark).searchVariant(),
  ];

  public constructor(public readonly color: Color) {
    super();
    this.color = color;
  }

  public get id(): string {
    return `connect_all`;
  }

  public get explanation(): string {
    return `Connect all ${this.color} cells`;
  }

  public createExampleGrid(): GridData {
    return this.color === Color.Light
      ? ConnectAllRule.EXAMPLE_GRID_LIGHT
      : ConnectAllRule.EXAMPLE_GRID_DARK;
  }

  public get configs(): readonly AnyConfig[] | null {
    return ConnectAllRule.CONFIGS;
  }

  public get searchVariants(): SearchVariant[] {
    return ConnectAllRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    let complete = true;
    const visited = array(grid.width, grid.height, () => false);
    const islands: Position[][] = [];
    while (true) {
      const seed = grid.find(
        (tile, x, y) => tile.color === this.color && !visited[y][x]
      );
      if (!seed) break;
      const positions: Position[] = [];
      grid.iterateArea(
        seed,
        tile => tile.color === this.color || tile.color === Color.Gray,
        (tile, x, y) => {
          visited[y][x] = true;
          if (tile.color === Color.Gray) complete = false;
          positions.push({ x, y });
        }
      );
      islands.push(positions);
    }
    if (islands.length > 1) {
      return {
        state: State.Error,
        positions: minBy(islands, island => island.length)!,
      };
    } else if (islands.length === 1) {
      return { state: complete ? State.Satisfied : State.Incomplete };
    } else {
      return { state: State.Incomplete };
    }
  }

  public copyWith({ color }: { color?: Color }): this {
    return new ConnectAllRule(color ?? this.color) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}
