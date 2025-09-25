import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { array } from '../dataHelper.js';
import { Color, RuleState, State, Position } from '../primitives.js';
import {
  Shape,
  getShapeVariants,
  sanitizePatternGrid,
  tilesToShape,
} from '../shapes.js';
import Rule, { SearchVariant } from './rule.js';

export default class BanPatternRule extends Rule {
  public readonly title = 'Ban Pattern';

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['nnnnn', 'nnnnn', 'wwwwn', 'nnnnn', 'nnnnn'])
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Shape,
      default: BanPatternRule.EXAMPLE_GRID,
      resizable: true,
      field: 'pattern',
      description: 'Pattern',
      explanation:
        'The pattern to be banned. Can be a mix of dark and light tiles.',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new BanPatternRule(BanPatternRule.EXAMPLE_GRID).searchVariant(),
  ];

  public readonly pattern: GridData;
  public readonly cache: Shape[];

  /**
   * **Don't make this pattern**
   *
   * @param pattern - GridData representing the banned pattern. Only non-gray tiles are considered.
   */
  public constructor(pattern: GridData) {
    super();
    this.pattern = sanitizePatternGrid(pattern);
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
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      return GridData.create(0, 0);
    }
    const tiles = array(width, height, (x, y) => {
      const tile = this.pattern.getTile(x + minX, y + minY);
      if (!tile.exists || tile.color !== Color.Gray) return tile;
      return tile.withExists(false);
    });
    return GridData.create(width, height, tiles);
  }

  public get searchVariants(): SearchVariant[] {
    return BanPatternRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    for (const pattern of this.cache) {
      let startX, startY, endX, endY;
      if (grid.wrapAround.value) {
        startX = -pattern.width;
        startY = -pattern.height;
        endX = grid.width - 1;
        endY = grid.height - 1;
      } else {
        startX = 0;
        startY = 0;
        endX = grid.width - pattern.width;
        endY = grid.height - pattern.height;
      }
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          let match = true;
          const visited: Position[] = [];
          for (const tile of pattern.elements) {
            const pos = grid.toArrayCoordinates(x + tile.x, y + tile.y);
            if (
              grid.wrapAround.value && // optimization: no need to check visited if wrapAround is disabled
              visited.some(p => p.x === pos.x && p.y === pos.y)
            ) {
              match = false;
              break;
            }
            visited.push(pos);
            const t = grid.getTile(x + tile.x, y + tile.y);
            if (!t.exists || t.color !== tile.color) {
              match = false;
              break;
            }
          }
          if (match) {
            return {
              state: State.Error,
              positions: pattern.elements.map(tile =>
                grid.toArrayCoordinates(x + tile.x, y + tile.y)
              ),
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
