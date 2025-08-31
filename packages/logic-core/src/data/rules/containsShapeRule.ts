import { AnyConfig, ConfigType } from '../config.js';
import { array } from '../dataHelper.js';
import GridData from '../grid.js';
import { Color, RuleState, State } from '../primitives.js';
import {
  Shape,
  getShapeVariants,
  sanitizePatternGrid,
  tilesToShape,
} from '../shapes.js';
import RegionShapeRule from './regionShapeRule.js';
import { SearchVariant } from './rule.js';

export default class ContainsShapeRule extends RegionShapeRule {
  public readonly title = 'Areas Contain Pattern';

  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    GridData.create(['nnnnn', 'nnnnn', 'wwwwn', 'nnnnn', 'nnnnn'])
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    GridData.create(['nnnnn', 'nnnnn', 'bbbbn', 'nnnnn', 'nnnnn'])
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
    {
      type: ConfigType.Shape,
      default: ContainsShapeRule.EXAMPLE_GRID_LIGHT,
      resizable: true,
      field: 'pattern',
      description: 'Pattern',
      explanation:
        'The pattern to be contained. Must only include tiles of the selected color.',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new ContainsShapeRule(
      Color.Light,
      ContainsShapeRule.EXAMPLE_GRID_LIGHT
    ).searchVariant(),
    new ContainsShapeRule(
      Color.Dark,
      ContainsShapeRule.EXAMPLE_GRID_DARK
    ).searchVariant(),
  ];

  public readonly pattern: GridData;
  public readonly cache: Shape[];

  /**
   * **All &lt;color&gt; areas must contain this pattern**
   *
   * @param color - The color of the regions to compare.
   * @param pattern - GridData representing the required pattern. Only non-gray tiles are considered.
   */
  public constructor(color: Color, pattern: GridData) {
    super(color);
    this.pattern = sanitizePatternGrid(pattern, t =>
      t.color === color ? t : t.withColor(Color.Gray)
    );
    this.cache = getShapeVariants(tilesToShape(this.pattern.tiles));
  }

  public get id(): string {
    return `contains_shape`;
  }

  public get explanation(): string {
    return `All ${this.color} areas must contain this pattern`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return ContainsShapeRule.CONFIGS;
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
    return ContainsShapeRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    const { regions, complete } = this.getShapeRegions(grid);
    const errorRegion = regions.find(r => {
      for (const pattern of this.cache) {
        if (r.shape.elements.length < pattern.elements.length) continue;
        for (let y = 0; y <= r.shape.height - pattern.height; y++) {
          for (let x = 0; x <= r.shape.width - pattern.width; x++) {
            let match = true;
            for (const element of pattern.elements) {
              const tile = r.shape.elements.find(
                e => e.x === x + element.x && e.y === y + element.y
              );
              if (!tile || tile.color !== element.color) {
                match = false;
                break;
              }
            }
            if (match) return false;
          }
        }
      }
      return true;
    });
    if (errorRegion) {
      return {
        state: State.Error,
        positions: errorRegion.positions,
      };
    } else {
      return { state: complete ? State.Satisfied : State.Incomplete };
    }
  }

  public copyWith({
    color,
    pattern,
  }: {
    color?: Color;
    pattern?: GridData;
  }): this {
    return new ContainsShapeRule(
      color ?? this.color,
      pattern ?? this.pattern
    ) as this;
  }

  public withPattern(pattern: GridData): this {
    return this.copyWith({ pattern });
  }
}

export const instance = new ContainsShapeRule(Color.Dark, GridData.create([]));
