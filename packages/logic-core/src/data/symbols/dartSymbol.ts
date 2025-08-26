import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { Color, Orientation } from '../primitives.js';
import NumberSymbol from './numberSymbol.js';

export default class DartSymbol extends NumberSymbol {
  public readonly name = 'Dart';

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
    {
      type: ConfigType.Orientation,
      default: Orientation.Right,
      field: 'orientation',
      description: 'Orientation',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwbbw', 'wwwww', 'wbwbb', 'wwwww'])
      .addSymbol(new DartSymbol(1, 0, 1, Orientation.Down))
      .addSymbol(new DartSymbol(4, 0, 2, Orientation.Left))
      .addSymbol(new DartSymbol(3, 1, 1, Orientation.Down))
      .addSymbol(new DartSymbol(0, 2, 3, Orientation.Right))
  );

  /**
   * **Darts count opposite color cells in that direction**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param number - The number of cells seen by the symbol.
   * @param orientation - The orientation of the symbol.
   */
  public constructor(
    x: number,
    y: number,
    number: number,
    public readonly orientation: Orientation
  ) {
    super(x, y, number);
    this.orientation = orientation;
  }

  public get id(): string {
    return `dart`;
  }

  public get placementStep(): number {
    return 1;
  }

  public get explanation(): string {
    return `*Darts* count opposite color cells in that direction`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return DartSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return DartSymbol.EXAMPLE_GRID;
  }

  public countTiles(grid: GridData): { completed: number; possible: number } {
    if (Math.floor(this.x) !== this.x || Math.floor(this.y) !== this.y)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    let gray = 0;
    let opposite = 0;
    grid.iterateDirectionAll(
      { x: this.x, y: this.y },
      this.orientation,
      () => true,
      tile => {
        if (!tile.exists) return;
        if (tile.color === Color.Gray) gray++;
        else if (tile.color !== color) opposite++;
      }
    );
    return { completed: opposite, possible: opposite + gray };
  }

  public copyWith({
    x,
    y,
    number,
    orientation,
  }: {
    x?: number;
    y?: number;
    number?: number;
    orientation?: Orientation;
  }): this {
    return new DartSymbol(
      x ?? this.x,
      y ?? this.y,
      number ?? this.number,
      orientation ?? this.orientation
    ) as this;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}

export const instance = new DartSymbol(0, 0, 1, Orientation.Right);
