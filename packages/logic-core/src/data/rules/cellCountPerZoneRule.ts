import { AnyConfig, ConfigType } from '../config.js';
import { array } from '../dataHelper.js';
import GridData, { NEIGHBOR_OFFSETS } from '../grid.js';
import GridConnections from '../gridConnections.js';
import { Color, Edge, RuleState, State, Position } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';

interface Zone {
  positions: Position[];
  completed: number;
  possible: number;
}
export default class CellCountPerZoneRule extends Rule {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Color,
      default: Color.Light,
      allowGray: true,
      field: 'color',
      description: 'Color',
      configurable: true,
    },
    {
      type: ConfigType.Edges,
      default: [],
      field: 'edges',
      description: 'Edges',
      configurable: false,
    },
  ]);

  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    GridData.create(['bwbbb', 'wbbwb', 'bbbwb', 'bwbwb']).addRule(
      new CellCountPerZoneRule(Color.Light, [
        { x1: 0, y1: 1, x2: 0, y2: 2 },
        { x1: 1, y1: 1, x2: 1, y2: 2 },
        { x1: 2, y1: 1, x2: 2, y2: 2 },
        { x1: 3, y1: 1, x2: 3, y2: 2 },
        { x1: 4, y1: 1, x2: 4, y2: 2 },
      ])
    )
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    CellCountPerZoneRule.EXAMPLE_GRID_LIGHT.withTiles(tiles =>
      tiles.map(row =>
        row.map(tile =>
          tile.withColor(tile.color === Color.Dark ? Color.Light : Color.Dark)
        )
      )
    )
  );

  private static readonly EXAMPLE_GRID_GRAY = Object.freeze(
    CellCountPerZoneRule.EXAMPLE_GRID_LIGHT.withTiles(tiles =>
      tiles.map(row =>
        row.map(tile =>
          tile.withColor(tile.color === Color.Light ? Color.Gray : tile.color)
        )
      )
    )
  );

  private static readonly SEARCH_VARIANTS = [
    new CellCountPerZoneRule(Color.Light, []).searchVariant(),
    new CellCountPerZoneRule(Color.Dark, []).searchVariant(),
  ];

  /**
   * **Every zone has the same number of &lt;color&gt; cells.**
   *
   * @param color - The color of the cells to count.
   * @param edges - The edges of the zones to count.
   */
  public constructor(
    public readonly color: Color,
    public readonly edges: readonly Edge[]
  ) {
    super();
    this.color = color;
    this.edges = GridConnections.deduplicateEdges(edges);
  }

  public get id(): string {
    return `zone_cell_count`;
  }

  public get explanation(): string {
    return `Every zone has the same number of ${this.color} cells`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return CellCountPerZoneRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    if (this.color === Color.Light) {
      return CellCountPerZoneRule.EXAMPLE_GRID_LIGHT;
    } else if (this.color === Color.Dark) {
      return CellCountPerZoneRule.EXAMPLE_GRID_DARK;
    } else {
      return CellCountPerZoneRule.EXAMPLE_GRID_GRAY;
    }
  }

  public get searchVariants(): SearchVariant[] {
    return CellCountPerZoneRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    let complete = true;
    const visited = array(
      grid.width,
      grid.height,
      (i, j) => !grid.getTile(i, j).exists
    );
    const zones: Zone[] = [];
    while (true) {
      const seed = grid.find((_tile, x, y) => !visited[y][x]);
      if (!seed) break;
      const zone: Zone = {
        positions: [],
        completed: 0,
        possible: 0,
      };
      const stack = [seed];
      while (stack.length > 0) {
        const { x, y } = stack.pop()!;
        if (visited[y][x]) continue;
        visited[y][x] = true;
        zone.positions.push({ x, y });
        if (grid.getTile(x, y).color === this.color) {
          zone.completed++;
        } else if (grid.getTile(x, y).color === Color.Gray) {
          zone.possible++;
          complete = false;
        }
        for (const offset of NEIGHBOR_OFFSETS) {
          const next = { x: x + offset.x, y: y + offset.y };
          if (
            !this.edges.some(
              e =>
                (e.x1 === x &&
                  e.y1 === y &&
                  e.x2 === next.x &&
                  e.y2 === next.y) ||
                (e.x1 === next.x && e.y1 === next.y && e.x2 === x && e.y2 === y)
            )
          ) {
            const nextTile = grid.getTile(next.x, next.y);
            if (nextTile.exists) {
              stack.push(next);
            }
          }
        }
      }
      zones.push(zone);
    }
    if (zones.length <= 1) {
      return { state: complete ? State.Satisfied : State.Incomplete };
    } else {
      const errorZone = zones.find(z =>
        zones.some(
          zz =>
            zz !== z &&
            (zz.completed > z.completed + z.possible ||
              zz.completed + zz.possible < z.completed)
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

  public copyWith({
    color,
    edges,
  }: {
    color?: Color;
    edges?: readonly Edge[];
  }): this {
    return new CellCountPerZoneRule(
      color ?? this.color,
      edges ?? this.edges
    ) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }

  public withEdges(
    edges: readonly Edge[] | ((edges: readonly Edge[]) => readonly Edge[])
  ): this {
    return this.copyWith({
      edges: typeof edges === 'function' ? edges(this.edges) : edges,
    });
  }
}

export const instance = new CellCountPerZoneRule(Color.Light, []);
