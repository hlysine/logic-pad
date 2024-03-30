import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { move } from '../helper';
import { Color, DIRECTIONS, State } from '../primitives';
import Symbol from './symbol';

export default class ViewpointSymbol extends Symbol {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['bbbbb', 'wwwwb', 'bwwbb', 'bbwww']).addSymbol(
      new ViewpointSymbol(1, 1, 5)
    )
  );

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

  /**
   * **Viewpoint Numbers count visible cells in the four directions**
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param number - The viewpoint number.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly number: number
  ) {
    super(x, y);
    this.number = number;
  }

  public get id(): string {
    return `viewpoint`;
  }

  public get explanation(): string {
    return '*Viewpoint Numbers* count visible cells in the four directions';
  }

  public createExampleGrid(): GridData {
    return ViewpointSymbol.EXAMPLE_GRID;
  }

  public get configs(): readonly AnyConfig[] | null {
    return ViewpointSymbol.CONFIGS;
  }

  public validateSymbol(grid: GridData): State {
    const pos = { x: this.x, y: this.y };
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray) return State.Incomplete;
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
    if (minSize > this.number || maxSize < this.number) {
      return State.Error;
    } else if (minSize === this.number && maxSize === this.number) {
      return State.Satisfied;
    } else {
      return State.Incomplete;
    }
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
