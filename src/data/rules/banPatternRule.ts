import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { array } from '../helper';
import { Color, RuleState, State } from '../primitives';
import { Shape, getShapeVariants, tilesToShape } from '../shapes';
import Rule, { SearchVariant } from './rule';

export default class BanPatternRule extends Rule {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['nnnnn', 'nnnnn', 'wwwwn', 'nnnnn', 'nnnnn'])
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Tile,
      default: BanPatternRule.EXAMPLE_GRID,
      resizable: true,
      field: 'pattern',
      description: 'Pattern',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new BanPatternRule(BanPatternRule.EXAMPLE_GRID).searchVariant(),
  ];

  public readonly pattern: GridData;
  private readonly cache: Shape[];

  /**
   * **Don't make this pattern**
   *
   * @param pattern - GridData representing the banned pattern. Only non-gray tiles are considered.
   */
  public constructor(pattern: GridData) {
    super();
    this.pattern = pattern.withTiles(tiles =>
      tiles.map(row => row.map(t => t.withFixed(false)))
    );
    this.cache = getShapeVariants(tilesToShape(this.pattern.tiles));
  }

  public get id(): string {
    return `ban_pattern`;
  }

  public get explanation(): string {
    return `Don't make this pattern`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return BanPatternRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    let minX = Number.POSITIVE_INFINITY;
    let minY = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let maxY = Number.NEGATIVE_INFINITY;
    this.pattern.forEach((tile, x, y) => {
      if (tile.color !== Color.Gray && tile.exists) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    });
    const width = maxX - minX + 1;
    const height = maxY - minY + 1;
    const tiles = array(width, height, (x, y) => {
      const tile = this.pattern.getTile(x + minX, y + minY);
      if (!tile.exists || tile.color !== Color.Gray) return tile;
      return tile.withExists(false);
    });
    return new GridData(width, height, tiles);
  }

  public get searchVariants(): SearchVariant[] {
    return BanPatternRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    for (const pattern of this.cache) {
      for (let y = 0; y <= grid.height - pattern.height; y++) {
        for (let x = 0; x <= grid.width - pattern.width; x++) {
          let match = true;
          for (const tile of pattern.elements) {
            const t = grid.getTile(x + tile.x, y + tile.y);
            if (!t.exists || t.color !== tile.color) {
              match = false;
              break;
            }
          }
          if (match) {
            return {
              state: State.Error,
              positions: pattern.elements.map(tile => ({
                x: x + tile.x,
                y: y + tile.y,
              })),
            };
          }
        }
      }
    }
    return { state: grid.isComplete() ? State.Satisfied : State.Incomplete };
  }

  public copyWith({ pattern }: { pattern?: GridData }): this {
    return new BanPatternRule(pattern ?? this.pattern) as this;
  }

  public withPattern(pattern: GridData): this {
    return this.copyWith({ pattern });
  }
}

export const instance = new BanPatternRule(GridData.create([]));
