import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { Color } from '../primitives.js';
import NumberSymbol from './numberSymbol.js';

export default class MinesweeperSymbol extends NumberSymbol {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 0,
      field: 'x',
      description: 'X',
      configurable: false,
    },
    {
      type: ConfigType.Number,
      default: 0,
      field: 'y',
      description: 'Y',
      configurable: false,
    },
    {
      type: ConfigType.Number,
      default: 1,
      field: 'number',
      description: 'Number',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwbww', 'wwbwb', 'wwbwb', 'bwwww'])
      .addSymbol(new MinesweeperSymbol(1, 1, 3))
      .addSymbol(new MinesweeperSymbol(3, 1, 5))
      .addSymbol(new MinesweeperSymbol(4, 1, 4))
      .addSymbol(new MinesweeperSymbol(2, 3, 1))
  );

  /**
   * **Minesweeper Numbers count opposite cells in 8 adjacent spaces**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param number - The number of cells seen by the symbol.
   */
  public constructor(x: number, y: number, number: number) {
    super(x, y, number);
  }

  public get id(): string {
    return `minesweeper`;
  }

  public get placementStep(): number {
    return 1;
  }

  public get explanation(): string {
    return `*Minesweeper Numbers* count opposite cells in 8 adjacent spaces`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return MinesweeperSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return MinesweeperSymbol.EXAMPLE_GRID;
  }

  public countTiles(grid: GridData): { completed: number; possible: number } {
    if (Math.floor(this.x) !== this.x || Math.floor(this.y) !== this.y)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    let gray = 0;
    let opposite = 0;
    for (let y = this.y - 1; y <= this.y + 1; y++) {
      for (let x = this.x - 1; x <= this.x + 1; x++) {
        if (x === this.x && y === this.y) continue;
        const tile = grid.getTile(x, y);
        if (!tile.exists) continue;
        if (tile.color === Color.Gray) gray++;
        else if (tile.color !== color) opposite++;
      }
    }
    return { completed: opposite, possible: opposite + gray };
  }

  public copyWith({
    x,
    y,
    number,
  }: {
    x?: number;
    y?: number;
    number?: number;
  }): this {
    return new MinesweeperSymbol(
      x ?? this.x,
      y ?? this.y,
      number ?? this.number
    ) as this;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}

export const instance = new MinesweeperSymbol(0, 0, 1);
