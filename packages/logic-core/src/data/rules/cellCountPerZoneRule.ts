import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import GridConnections from '../gridConnections.js';
import { Color, Edge, RuleState, State } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';

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

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete }; // todo
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
