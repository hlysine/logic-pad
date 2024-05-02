import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { array, minBy } from '../helper';
import { Color, Position, RuleState, State } from '../primitives';
import {
  Shape,
  normalizeShape,
  positionsToShape,
  shapeEquals,
} from '../shapes';
import Rule, { SearchVariant } from './rule';

export default class SameShapeRule extends Rule {
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
    GridData.create(['wwbww', 'wbwbw', 'wbwbw', 'bwwbb'])
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    GridData.create(['bbwbb', 'bwbwb', 'bwbwb', 'wbbww'])
  );

  private static readonly SEARCH_VARIANTS = [
    new SameShapeRule(Color.Light).searchVariant(),
    new SameShapeRule(Color.Dark).searchVariant(),
  ];

  /**
   * **All &lt;color&gt; areas have the same shape and size**
   *
   * @param color - The color of the regions to compare.
   */
  public constructor(public readonly color: Color) {
    super();
    this.color = color;
  }

  public get id(): string {
    return `same_shape`;
  }

  public get explanation(): string {
    return `All ${this.color} areas have the same shape and size`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return SameShapeRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return this.color === Color.Light
      ? SameShapeRule.EXAMPLE_GRID_LIGHT
      : SameShapeRule.EXAMPLE_GRID_DARK;
  }

  public get searchVariants(): SearchVariant[] {
    return SameShapeRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    let complete = true;
    const visited = array(grid.width, grid.height, (i, j) => {
      const tile = grid.getTile(i, j);
      if (tile.exists && tile.color === Color.Gray) complete = false;
      return !(tile.exists && tile.color === this.color);
    });
    const islands: { positions: Position[]; shape: Shape; count: number }[] =
      [];
    while (true) {
      const seed = grid.find((_tile, x, y) => !visited[y][x]);
      if (!seed) break;
      const positions: Position[] = [];
      grid.iterateArea(
        seed,
        tile => tile.color === this.color,
        (_, x, y) => {
          visited[y][x] = true;
          positions.push({ x, y });
        }
      );
      const incomplete = grid.iterateArea(
        seed,
        tile => tile.color === this.color || tile.color === Color.Gray,
        tile => {
          if (tile.color === Color.Gray) return true;
        }
      );
      if (incomplete) continue;
      const shape = normalizeShape(positionsToShape(positions, this.color));
      const existing = islands.find(island => shapeEquals(island.shape, shape));
      if (existing) {
        existing.count++;
      } else {
        islands.push({ positions, shape, count: 1 });
      }
    }
    if (islands.length > 1) {
      return {
        state: State.Error,
        positions: minBy(islands, island => island.count)!.positions,
      };
    } else if (islands.length <= 1) {
      return { state: complete ? State.Satisfied : State.Incomplete };
    } else {
      return { state: State.Incomplete }; // not reachable but the TS is not happy
    }
  }

  public copyWith({ color }: { color?: Color }): this {
    return new SameShapeRule(color ?? this.color) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}

export const instance = new SameShapeRule(Color.Dark);
