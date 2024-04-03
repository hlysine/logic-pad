import Rule, { SearchVariant } from './rule';
import GridData from '../grid';
import { AnyConfig, ConfigType } from '../config';
import { Color, Position, RuleState, State } from '../primitives';
import { array } from '../helper';
import LetterSymbol from '../symbols/letterSymbol';
import Symbol from '../symbols/symbol';
import GridConnections from '../gridConnections';

export default class XSymbolsByColorRegion extends Rule {

  private static readonly EXAMPLE_GRIDS = {
    [Color.Dark]: GridData.create(['wwwww', 'wbbbw', 'wbbww', 'wwwww']),
    [Color.Light]: GridData.create(['bbbbb', 'bwwwb', 'bwwbb', 'bbbbb']),
    [Color.Gray]: GridData.create(['bwbwb', 'wnnnw', 'bnnwb', 'wbwbw']),
  };

  private static readonly SYMBOL_POSITIONS = [
    { x: 1, y: 1 },
    { x: 2, y: 2 },
    { x: 2, y: 1 },
    { x: 3, y: 1 },
    { x: 1, y: 2 },
  ]

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 1,
      field: 'number',
      description: 'Number',
      configurable: true,
    },
    {
      type: ConfigType.Color,
      default: Color.Light,
      field: 'color',
      description: 'Color',
      configurable: true,
      allowGray: true,
    }
  ]);

  private static readonly SEARCH_VARIANTS = [
    new XSymbolsByColorRegion(1, Color.Light).searchVariant(),
  ];

  /**
   * **Don't make this pattern**
   *
   * @param number - Number of symbols to have in each region
   * @param color - Color of the region affected by the rule
   */
  public constructor(public readonly number: number, public readonly color: Color) {
    super();
    this.number = number;
    this.color = color;
  }

  public get id(): string {
    return `x_symbols_by_color_region`;
  }

  public get explanation(): string {
    return `Exactly ${this.number} symbols in each ${this.color} region`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return XSymbolsByColorRegion.CONFIGS;
  }

  public get searchVariants(): SearchVariant[] {
    return XSymbolsByColorRegion.SEARCH_VARIANTS;
  }

  public createExampleGrid(): GridData {
    if (this.number > XSymbolsByColorRegion.SYMBOL_POSITIONS.length) {
      const symbol = new LetterSymbol(1.5, 1.5, `${this.number}S`);
      return XSymbolsByColorRegion.EXAMPLE_GRIDS[this.color]
        .copyWith({symbols: new Map([["letter",[symbol]]])})
        .withConnections(GridConnections.create(['.....','.aa..','.aa..','.....']));
    }
    const symbols: Symbol[] = [];
    for (let i = 0; i < this.number; i++) {
      const { x, y } = XSymbolsByColorRegion.SYMBOL_POSITIONS[i];
      symbols.push(new LetterSymbol(x, y, 'X'));
    }
    return XSymbolsByColorRegion.EXAMPLE_GRIDS[this.color].copyWith({symbols: new Map([["letter",symbols]])});
  }

  public validateGrid(grid: GridData): RuleState {
    const visited = array(grid.width, grid.height, () => false);
    let complete = true;
    while (true) {
      const seed = grid.find(
        (tile, x, y) => tile.color === this.color && !visited[y][x]
      );
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
          nbSymbolsIn += XSymbolsByColorRegion.countAllSymbolsOfPosition(grid, x, y);
        }
      );
      if (nbSymbolsIn > this.number) {
        return { state: State.Error, positions: completed };
      }
      let nbSymbolsOut = 0;
      if (this.color === Color.Gray) {
        gray.push(...completed);
      } else {
        grid.iterateArea(
          { x: seed.x, y: seed.y },
          tile => tile.color === Color.Gray || tile.color === this.color,
          (_, x, y) => {
            gray.push({ x, y });
            nbSymbolsOut += XSymbolsByColorRegion.countAllSymbolsOfPosition(grid, x, y);
          }
        );
      }
      if (nbSymbolsOut < this.number) {
        return { state: State.Error, positions: gray };
      }
      if (
        gray.length !== completed.length
      ) {
        complete = false;
      }
    }
    return complete ? { state: State.Satisfied } : { state: State.Incomplete };
  }

  public copyWith({ number, color }: { number?: number; color?: Color }): this {
    return new XSymbolsByColorRegion(number ?? this.number, color ?? this.color) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }

  private static countAllSymbolsOfPosition(grid: GridData, x: number, y: number) {
    let count = 0;
    for (const symbolKind of grid.symbols.values()) {
      if (symbolKind.some(symbol => symbol.x === x && symbol.y === y)) {
        count++;
      }
    }
    return count;
  }
}
