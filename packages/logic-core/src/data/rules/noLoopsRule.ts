import { AnyConfig, ConfigType } from '../config.js';
import GridData, { NEIGHBOR_OFFSETS } from '../grid.js';
import { array } from '../dataHelper.js';
import { Color, Position, RuleState, State } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';
import CustomIconSymbol from '../symbols/customIconSymbol.js';

export default class NoLoopsRule extends Rule {
  public readonly title = 'No Loops';

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

  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    GridData.create(['bwwwb', 'bwbww', 'wwwwb', 'wbbww']).withSymbols([
      new CustomIconSymbol('', GridData.create([]), 1, 0, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 2, 0, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 3, 0, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 3, 1, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 3, 2, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 2, 2, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 1, 2, 'MdClear'),
      new CustomIconSymbol('', GridData.create([]), 1, 1, 'MdClear'),
    ])
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    NoLoopsRule.EXAMPLE_GRID_LIGHT.withTiles(tiles =>
      tiles.map(row =>
        row.map(tile =>
          tile.withColor(tile.color === Color.Dark ? Color.Light : Color.Dark)
        )
      )
    )
  );

  private static readonly SEARCH_VARIANTS = [
    new NoLoopsRule(Color.Light).searchVariant(),
    new NoLoopsRule(Color.Dark).searchVariant(),
  ];

  /**
   * **No loops in &lt;color&gt; cells**
   *
   * @param color - The color of the cells to check.
   */
  public constructor(public readonly color: Color) {
    super();
    this.color = color;
  }

  public get id(): string {
    return `no_loops`;
  }

  public get explanation(): string {
    return `*No loops* in ${this.color} cells`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return NoLoopsRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return this.color === Color.Light
      ? NoLoopsRule.EXAMPLE_GRID_LIGHT
      : NoLoopsRule.EXAMPLE_GRID_DARK;
  }

  public get searchVariants(): SearchVariant[] {
    return NoLoopsRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    const visited = array(
      grid.width,
      grid.height,
      (i, j) => !grid.getTile(i, j).exists
    );
    while (true) {
      const seed = grid.find(
        (tile, x, y) => !visited[y][x] && tile.color === this.color
      );
      if (!seed) break;
      let invalid = false;
      const positions: Position[] = [];
      const stack: [Position, Position | null][] = [[seed, null]];
      while (stack.length > 0) {
        const [{ x, y }, from] = stack.pop()!;
        const { x: arrX, y: arrY } = grid.toArrayCoordinates(x, y);
        positions.push({ x, y });
        if (visited[arrY][arrX]) {
          invalid = true;
          continue;
        }
        visited[arrY][arrX] = true;
        for (const offset of NEIGHBOR_OFFSETS) {
          if (-offset.x === from?.x && -offset.y === from?.y) continue;
          const next = { x: x + offset.x, y: y + offset.y };
          if (grid.isPositionValid(next.x, next.y)) {
            const nextTile = grid.getTile(next.x, next.y);
            if (nextTile.exists && nextTile.color === this.color)
              stack.push([next, offset]);
          }
        }
      }
      if (invalid) {
        return {
          state: State.Error,
          positions,
        };
      }
    }
    return {
      state: visited.some(row => row.some(v => !v))
        ? State.Incomplete
        : State.Satisfied,
    };
  }

  public copyWith({ color }: { color?: Color }): this {
    return new NoLoopsRule(color ?? this.color) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}

export const instance = new NoLoopsRule(Color.Dark);
