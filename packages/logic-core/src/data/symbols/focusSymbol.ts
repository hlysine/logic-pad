import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { Color, Position } from '../primitives.js';
import NumberSymbol from './numberSymbol.js';

const OFFSETS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

export default class FocusSymbol extends NumberSymbol {
  public readonly title = 'Focus Number';

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
    GridData.create(['wwwww', 'bbbbw', 'wwbbw', 'wwwww']).withSymbols([
      new FocusSymbol(0, 0, 1),
      new FocusSymbol(4, 1, 2),
      new FocusSymbol(1, 3, 3),
    ])
  );

  /**
   * **Focus Numbers count directly adjacent cells of the same color**
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param number - The focus number.
   */
  public constructor(x: number, y: number, number: number) {
    super(x, y, number);
  }

  public get id(): string {
    return `focus`;
  }

  public get placementStep(): number {
    return 1;
  }

  public get explanation(): string {
    return '*Focus Numbers* count directly adjacent cells of the same color';
  }

  public get configs(): readonly AnyConfig[] | null {
    return FocusSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return FocusSymbol.EXAMPLE_GRID;
  }

  public countTiles(grid: GridData): { completed: number; possible: number } {
    if (Math.floor(this.x) !== this.x || Math.floor(this.y) !== this.y)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    let gray = 0;
    let same = 0;
    const visited: Position[] = [];
    for (const [dx, dy] of OFFSETS) {
      const x = this.x + dx;
      const y = this.y + dy;
      if (grid.wrapAround.value) {
        const pos = grid.toArrayCoordinates(x, y);
        if (visited.some(v => v.x === pos.x && v.y === pos.y)) continue;
        visited.push(pos);
      }
      const tile = grid.getTile(x, y);
      if (!tile.exists) continue;
      if (tile.color === Color.Gray) gray++;
      else if (tile.color === color) same++;
    }
    return { completed: same, possible: same + gray };
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
    return new FocusSymbol(
      x ?? this.x,
      y ?? this.y,
      number ?? this.number
    ) as this;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}

export const instance = new FocusSymbol(0, 0, 1);
