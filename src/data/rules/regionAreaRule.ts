import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { array } from '../helper';
import { Color, Position, RuleState, State } from '../primitives';
import TileData from '../tile';
import Rule, { SearchVariant } from './rule';

export default class RegionAreaRule extends Rule {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Color,
      default: Color.Dark,
      allowGray: false,
      field: 'color',
      description: 'Color',
      configurable: true,
    },
    {
      type: ConfigType.Number,
      default: 2,
      min: 0,
      field: 'size',
      description: 'Region Size',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID_DARK = Object.freeze([
    GridData.create(['wwwww', 'wwwww', 'wwwww', 'wwwww']),
    GridData.create(['bwwbw', 'wbwwb', 'bwbww', 'wbwwb']),
    GridData.create(['bbwbb', 'wwbww', 'wwbww', 'wwwbb']),
    GridData.create(['bbwww', 'bwbwb', 'wbbwb', 'wwwwb']),
    GridData.create(['bwbbb', 'bbwwb', 'bwbbw', 'wwbbw']),
    GridData.create(['bbbww', 'bbwbw', 'wwbbb', 'wwwbw']),
    GridData.create(['bbbww', 'bbbwb', 'wwwbb', 'wwbbb']),
    GridData.create(['bbbbb', 'bbwww', 'wwwbb', 'bbbbb']),
    GridData.create(['bbbbw', 'bbbww', 'bwwww', 'wwwww']),
    GridData.create(['wwwww', 'bbbbb', 'bbwbb', 'wwwww']),
    GridData.create(['bbbbb', 'bbbww', 'bbwww', 'wwwww']),
  ]);

  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    RegionAreaRule.EXAMPLE_GRID_DARK.map(
      grid =>
        new GridData(
          grid.width,
          grid.height,
          grid.tiles.map(row =>
            row.map(tile =>
              tile.withColor(
                tile.color === Color.Dark ? Color.Light : Color.Dark
              )
            )
          )
        )
    )
  );

  private static readonly EXAMPLE_GRID_GRAY = Object.freeze(
    RegionAreaRule.EXAMPLE_GRID_DARK.map(
      grid =>
        new GridData(
          grid.width,
          grid.height,
          grid.tiles.map((row, y) =>
            row.map((tile, x) =>
              tile.withColor(
                tile.color === Color.Dark
                  ? Color.Gray
                  : x % 2 !== y % 2
                    ? Color.Dark
                    : Color.Light
              )
            )
          )
        )
    )
  );

  private static readonly SEARCH_VARIANTS = [
    new RegionAreaRule(Color.Dark, 2).searchVariant(),
    new RegionAreaRule(Color.Light, 2).searchVariant(),
  ];

  /**
   * **All &lt;color&gt; regions have area &lt;size&gt;**
   *
   * @param color - The color of the regions.
   * @param size - The area of the regions.
   */
  public constructor(
    public readonly color: Color,
    public readonly size: number
  ) {
    super();
    this.color = color;
    this.size = size;
  }

  public get id(): string {
    return `region_area`;
  }

  public get explanation(): string {
    return `All ${this.color} regions have area ${this.size}`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return RegionAreaRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    if (this.size < RegionAreaRule.EXAMPLE_GRID_DARK.length) {
      switch (this.color) {
        case Color.Dark:
          return RegionAreaRule.EXAMPLE_GRID_DARK[this.size];
        case Color.Light:
          return RegionAreaRule.EXAMPLE_GRID_LIGHT[this.size];
        case Color.Gray:
          return RegionAreaRule.EXAMPLE_GRID_GRAY[this.size];
      }
    } else {
      let count = this.size;
      const tiles = array(5, 4, (x, y) => {
        count--;
        return new TileData(
          true,
          false,
          count >= 0
            ? this.color
            : this.color === Color.Gray
              ? x % 2 !== y % 2
                ? Color.Dark
                : Color.Light
              : this.color === Color.Light
                ? Color.Dark
                : Color.Light
        );
      });
      return new GridData(5, 4, tiles);
    }
  }

  public get searchVariants(): SearchVariant[] {
    return RegionAreaRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    const visited = array(
      grid.width,
      grid.height,
      (i, j) =>
        !(grid.getTile(i, j).exists && grid.getTile(i, j).color === this.color)
    );
    let complete = true;
    while (true) {
      const seed = grid.find((_tile, x, y) => !visited[y][x]);
      if (!seed) break;
      const completed: Position[] = [];
      const gray: Position[] = [];
      grid.iterateArea(
        { x: seed.x, y: seed.y },
        tile => tile.color === this.color,
        (_, x, y) => {
          completed.push({ x, y });
          visited[y][x] = true;
        }
      );
      if (this.color === Color.Gray) {
        gray.push(...completed);
      } else {
        grid.iterateArea(
          { x: seed.x, y: seed.y },
          tile => tile.color === Color.Gray || tile.color === this.color,
          (_, x, y) => {
            gray.push({ x, y });
          }
        );
      }
      if (completed.length > this.size) {
        return { state: State.Error, positions: completed };
      } else if (gray.length < this.size) {
        return { state: State.Error, positions: gray };
      } else if (
        completed.length !== this.size ||
        completed.length !== gray.length
      ) {
        complete = false;
      }
    }
    return complete ? { state: State.Satisfied } : { state: State.Incomplete };
  }

  public copyWith({ color, size }: { color?: Color; size?: number }): this {
    return new RegionAreaRule(color ?? this.color, size ?? this.size) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }

  public withSize(size: number): this {
    return this.copyWith({ size });
  }
}

export const instance = new RegionAreaRule(Color.Dark, 2);
