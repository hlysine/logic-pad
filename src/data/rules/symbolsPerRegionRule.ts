import Rule, { SearchVariant } from './rule';
import GridData from '../grid';
import { AnyConfig, ConfigType } from '../config';
import { Color, Position, RuleState, State } from '../primitives';
import { array } from '../helper';
import LetterSymbol from '../symbols/letterSymbol';
import Symbol from '../symbols/symbol';
import GridConnections from '../gridConnections';

export default class SymbolsPerRegionRule extends Rule {
  private static readonly SYMBOL_POSITIONS = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 2 },
  ];

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 1,
      field: 'count',
      description: 'Count',
      configurable: true,
    },
    {
      type: ConfigType.Color,
      default: Color.Light,
      field: 'color',
      description: 'Color',
      configurable: true,
      allowGray: true,
    },
  ]);

  private static readonly EXAMPLE_GRIDS = {
    [Color.Dark]: GridData.create(['wwwww', 'wbbbw', 'wbbww', 'wwwww']),
    [Color.Light]: GridData.create(['bbbbb', 'bwwwb', 'bwwbb', 'bbbbb']),
    [Color.Gray]: GridData.create(['bwbwb', 'wnnnw', 'bnnwb', 'wbwbw']),
  };

  private static readonly SEARCH_VARIANTS = [
    new SymbolsPerRegionRule(Color.Light, 1).searchVariant(),
  ];

  /**
   * **Exactly &lt;count&gt; symbols per &lt;color&gt; area**
   *
   * @param color - Color of the region affected by the rule
   * @param count - Number of symbols to have in each region
   */
  public constructor(
    public readonly color: Color,
    public readonly count: number
  ) {
    super();
    this.color = color;
    this.count = count;
  }

  public get id(): string {
    return `symbols_per_region`;
  }

  public get explanation(): string {
    return `Exactly ${this.count} symbol${this.count === 1 ? '' : 's'} per ${this.color} area`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return SymbolsPerRegionRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    if (this.count > SymbolsPerRegionRule.SYMBOL_POSITIONS.length) {
      const symbol = new LetterSymbol(1.5, 1.5, `${this.count}X`);
      return SymbolsPerRegionRule.EXAMPLE_GRIDS[this.color]
        .copyWith({ symbols: new Map([['letter', [symbol]]]) })
        .withConnections(
          GridConnections.create(['.....', '.aa..', '.aa..', '.....'])
        );
    }
    const symbols: Symbol[] = [];
    for (let i = 0; i < this.count; i++) {
      const { x, y } = SymbolsPerRegionRule.SYMBOL_POSITIONS[i];
      symbols.push(new LetterSymbol(x, y, 'X'));
    }
    return SymbolsPerRegionRule.EXAMPLE_GRIDS[this.color].copyWith({
      symbols: new Map([['letter', symbols]]),
    });
  }

  public get searchVariants(): SearchVariant[] {
    return SymbolsPerRegionRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    const visited = array(grid.width, grid.height, (i, j) => !(grid.getTile(i, j).exists && grid.getTile(i, j).color === this.color));
    let complete = true;
    while (true) {
      const seed = grid.find((_tile, x, y) => !visited[y][x]);
      if (!seed) break;
      const completed: Position[] = [];
      const gray: Position[] = [];
      let nbSymbolsIn = 0;
      grid.iterateArea(
        { x: seed.x, y: seed.y },
        tile => tile.color === this.color,
        (_, x, y) => {
          completed.push({ x, y });
          visited[y][x] = true;
          nbSymbolsIn += SymbolsPerRegionRule.countAllSymbolsOfPosition(
            grid,
            x,
            y
          );
        }
      );
      if (nbSymbolsIn > this.count) {
        return { state: State.Error, positions: completed };
      }
      let nbSymbolsOut = 0;
      if (this.color === Color.Gray) {
        gray.push(...completed);
        nbSymbolsOut = nbSymbolsIn;
      } else {
        grid.iterateArea(
          { x: seed.x, y: seed.y },
          tile => tile.color === Color.Gray || tile.color === this.color,
          (_, x, y) => {
            gray.push({ x, y });
            nbSymbolsOut += SymbolsPerRegionRule.countAllSymbolsOfPosition(
              grid,
              x,
              y
            );
          }
        );
      }
      if (nbSymbolsOut < this.count) {
        return { state: State.Error, positions: gray };
      }
      if (gray.length !== completed.length) {
        complete = false;
      }
    }
    return complete ? { state: State.Satisfied } : { state: State.Incomplete };
  }

  public copyWith({ count, color }: { count?: number; color?: Color }): this {
    return new SymbolsPerRegionRule(
      color ?? this.color,
      count ?? this.count
    ) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }

  public withCount(count: number): this {
    return this.copyWith({ count });
  }

  private static countAllSymbolsOfPosition(
    grid: GridData,
    x: number,
    y: number
  ) {
    let count = 0;
    for (const symbolKind of grid.symbols.values()) {
      if (
        symbolKind.some(
          symbol => Math.floor(symbol.x) === x && Math.floor(symbol.y) === y
        )
      ) {
        count++;
      }
    }
    return count;
  }
}
