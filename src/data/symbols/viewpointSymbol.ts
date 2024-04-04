import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { move } from '../helper';
import { Color, DIRECTIONS } from '../primitives';
import NumberSymbol from './numberSymbol';

export default class ViewpointSymbol extends NumberSymbol {
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
    GridData.create(['bbbbb', 'wwwwb', 'bwwbb', 'bbwww']).addSymbol(
      new ViewpointSymbol(1, 1, 5)
    )
  );

  /**
   * **Viewpoint Numbers count visible cells in the four directions**
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param number - The viewpoint number.
   */
  public constructor(x: number, y: number, number: number) {
    super(x, y, number);
  }

  public get id(): string {
    return `viewpoint`;
  }

  public get explanation(): string {
    return '*Viewpoint Numbers* count visible cells in the four directions';
  }

  public get configs(): readonly AnyConfig[] | null {
    return ViewpointSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return ViewpointSymbol.EXAMPLE_GRID;
  }

  public countTiles(grid: GridData): { completed: number; possible: number } {
    const pos = { x: this.x, y: this.y };
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray)
      return { completed: 0, possible: Number.MAX_SAFE_INTEGER };
    let minSize = 1;
    let maxSize = 1;
    for (const direction of DIRECTIONS) {
      let continuous = true;
      grid.iterateDirection(
        move(pos, direction),
        direction,
        tile => tile.color === color || tile.color === Color.Gray,
        tile => {
          maxSize++;
          if (tile.color === Color.Gray) {
            continuous = false;
          } else {
            if (continuous) minSize++;
          }
        }
      );
    }
    return { completed: minSize, possible: maxSize };
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
    return new ViewpointSymbol(
      x ?? this.x,
      y ?? this.y,
      number ?? this.number
    ) as this;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}
