import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import GridZones from '../gridZones.js';
import { Color, RuleState, State } from '../primitives.js';
import CellCountPerZoneRule from './cellCountPerZoneRule.js';
import { SearchVariant } from './rule.js';

export default class DifferentCountPerZoneRule extends CellCountPerZoneRule {
  public readonly title = 'Different Count Per Zone';

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Color,
      default: Color.Light,
      allowGray: true,
      field: 'color',
      description: 'Color',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    GridData.create(['wwbbw', 'wbbwb', 'bbbwb', 'bwbwb'])
      .withZones(
        new GridZones([
          { x1: 0, y1: 1, x2: 0, y2: 2 },
          { x1: 1, y1: 1, x2: 1, y2: 2 },
          { x1: 2, y1: 1, x2: 2, y2: 2 },
          { x1: 3, y1: 1, x2: 3, y2: 2 },
          { x1: 4, y1: 1, x2: 4, y2: 2 },
          { x1: 1, y1: 0, x2: 2, y2: 0 },
          { x1: 1, y1: 1, x2: 2, y2: 1 },
          { x1: 2, y1: 2, x2: 3, y2: 2 },
          { x1: 2, y1: 3, x2: 3, y2: 3 },
        ])
      )
      .addRule(new DifferentCountPerZoneRule(Color.Light))
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    DifferentCountPerZoneRule.EXAMPLE_GRID_LIGHT.withTiles(tiles =>
      tiles.map(row =>
        row.map(tile =>
          tile.withColor(tile.color === Color.Dark ? Color.Light : Color.Dark)
        )
      )
    )
  );

  private static readonly EXAMPLE_GRID_GRAY = Object.freeze(
    DifferentCountPerZoneRule.EXAMPLE_GRID_LIGHT.withTiles(tiles =>
      tiles.map(row =>
        row.map(tile =>
          tile.withColor(tile.color === Color.Light ? Color.Gray : tile.color)
        )
      )
    )
  );

  private static readonly SEARCH_VARIANTS = [
    new DifferentCountPerZoneRule(Color.Light).searchVariant(),
    new DifferentCountPerZoneRule(Color.Dark).searchVariant(),
  ];

  /**
   * **Zones of the same size have different numbers of &lt;color&gt; cells.**
   *
   * @param color - The color of the cells to count.
   */
  public constructor(public readonly color: Color) {
    super(color);
  }

  public get id(): string {
    return `zone_diff_count`;
  }

  public get explanation(): string {
    return `Zones of the same size have different numbers of ${this.color} cells`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return DifferentCountPerZoneRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    if (this.color === Color.Light) {
      return DifferentCountPerZoneRule.EXAMPLE_GRID_LIGHT;
    } else if (this.color === Color.Dark) {
      return DifferentCountPerZoneRule.EXAMPLE_GRID_DARK;
    } else {
      return DifferentCountPerZoneRule.EXAMPLE_GRID_GRAY;
    }
  }

  public get searchVariants(): SearchVariant[] {
    return DifferentCountPerZoneRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    const { zones, complete } = this.getZoneCounts(grid);
    if (zones.length <= 1) {
      return { state: complete ? State.Satisfied : State.Incomplete };
    } else {
      const errorZone = zones.find(z =>
        zones.some(
          zz =>
            zz !== z &&
            zz.positions.length === z.positions.length &&
            zz.possible === 0 &&
            z.possible === 0 &&
            zz.completed === z.completed
        )
      );
      if (errorZone) {
        return {
          state: State.Error,
          positions: errorZone.positions,
        };
      } else {
        return { state: complete ? State.Satisfied : State.Incomplete };
      }
    }
  }

  public copyWith({ color }: { color?: Color }): this {
    return new DifferentCountPerZoneRule(color ?? this.color) as this;
  }
}

export const instance = new DifferentCountPerZoneRule(Color.Light);
