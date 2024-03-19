import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { array } from '../helper';
import { Color, RuleState, State } from '../primitives';
import Rule from './rule';

interface CachedTile {
  x: number;
  y: number;
  color: Color;
}

interface CachedPattern {
  width: number;
  height: number;
  tiles: CachedTile[];
}

function recenterPattern(pattern: CachedPattern) {
  let minX = Number.POSITIVE_INFINITY;
  let minY = Number.POSITIVE_INFINITY;
  let maxX = Number.NEGATIVE_INFINITY;
  let maxY = Number.NEGATIVE_INFINITY;
  for (const tile of pattern.tiles) {
    minX = Math.min(minX, tile.x);
    minY = Math.min(minY, tile.y);
    maxX = Math.max(maxX, tile.x);
    maxY = Math.max(maxY, tile.y);
  }
  for (const tile of pattern.tiles) {
    tile.x -= minX;
    tile.y -= minY;
  }
  pattern.width = maxX - minX + 1;
  pattern.height = maxY - minY + 1;
}

function generateCache(grid: GridData): CachedPattern[] {
  const width = grid.width;
  const height = grid.height;
  const transform = [
    grid.tiles,
    array(height, width, (x, y) => grid.tiles[x][width - 1 - y]),
    array(width, height, (x, y) => grid.tiles[height - 1 - y][width - 1 - x]),
    array(height, width, (x, y) => grid.tiles[height - 1 - x][y]),
    array(width, height, (x, y) => grid.tiles[y][width - 1 - x]),
    array(width, height, (x, y) => grid.tiles[height - 1 - y][x]),
    array(height, width, (x, y) => grid.tiles[x][y]),
    array(height, width, (x, y) => grid.tiles[height - 1 - x][width - 1 - y]),
  ];
  const cache = transform.map(t => ({
    width: 0,
    height: 0,
    tiles: t
      .flatMap((row, y) =>
        row.map((color, x) => ({ x, y, color: color.color }))
      )
      .filter(tile => tile.color !== Color.Gray),
  }));
  cache.forEach(recenterPattern);
  // remove all duplicates in cache
  const uniqueCache: CachedPattern[] = [];
  for (const cachedPattern of cache) {
    if (
      !uniqueCache.some(
        p =>
          p.width === cachedPattern.width &&
          p.height === cachedPattern.height &&
          p.tiles.every(
            (tile, i) =>
              tile.color === cachedPattern.tiles[i].color &&
              tile.x === cachedPattern.tiles[i].x &&
              tile.y === cachedPattern.tiles[i].y
          )
      )
    ) {
      uniqueCache.push(cachedPattern);
    }
  }
  return uniqueCache;
}

export default class BanPatternRule extends Rule {
  private static CONFIGS: readonly AnyConfig[] = [
    {
      type: ConfigType.Grid,
      default: GridData.create(['nnnnn', 'wwwwn', 'nnnnn', 'nnnnn']),
      field: 'pattern',
      description: 'Pattern',
    },
  ];

  public readonly pattern: GridData;
  private readonly cache: CachedPattern[];

  public constructor(pattern: GridData) {
    super();
    this.pattern = pattern;
    this.cache = generateCache(this.pattern);
  }

  public get id(): string {
    return `ban_pattern`;
  }

  public get explanation(): string {
    return `Don't make this pattern`;
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

  public get configs(): readonly AnyConfig[] | null {
    return BanPatternRule.CONFIGS;
  }

  public validateGrid(grid: GridData): RuleState {
    for (const pattern of this.cache) {
      for (let y = 0; y <= grid.height - pattern.height; y++) {
        for (let x = 0; x <= grid.width - pattern.width; x++) {
          let match = true;
          for (const tile of pattern.tiles) {
            if (grid.getTile(x + tile.x, y + tile.y).color !== tile.color) {
              match = false;
              break;
            }
          }
          if (match) {
            return {
              state: State.Error,
              positions: pattern.tiles.map(tile => ({
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
