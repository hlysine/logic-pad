import {AnyConfig, ConfigType} from '../config';
import GridData from '../grid';
import {move} from '../helper';
import {Color, Direction, State} from '../primitives';
import Symbol from './symbol';

export default class DartSymbol extends Symbol {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwbbw', 'wwwww', 'wbwbb', 'wwwww'])
      .addSymbol(new DartSymbol(1, 0, 1, Direction.Down))
      .addSymbol(new DartSymbol(4, 0, 2, Direction.Left))
      .addSymbol(new DartSymbol(3, 1, 1, Direction.Down))
      .addSymbol(new DartSymbol(0, 2, 3, Direction.Right))
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
    {
      type: ConfigType.Direction,
      default: Direction.Down,
      field: 'orientation',
      description: 'Orientation',
      configurable: true,
    },
  ]);

  /**
   * **Area Numbers must equal region sizes**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param number - The number seen by the symbol.
   * @param orientation - The orientation of the symbol.
   */
  public constructor(
	  public readonly x: number,
	  public readonly y: number,
	  public readonly number: number,
	  public readonly orientation: Direction = Direction.Down
  ) {
    super(x, y);
    this.number = number;
    this.orientation = orientation;
  }

  public get id(): string {
    return `dart`;
  }

  public get explanation(): string {
    return `*Darts* count opposite color cells in that direction`;
  }

  public createExampleGrid(): GridData {
    return DartSymbol.EXAMPLE_GRID;
  }

  public get configs(): readonly AnyConfig[] | null {
    return DartSymbol.CONFIGS;
  }

  public validateSymbol(grid: GridData): State {
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray) return State.Incomplete;
    let maxPossible = 0;
    let stillGray = false;
    let isVertical = this.orientation === Direction.Up || this.orientation === Direction.Down;
    let isForward = this.orientation === Direction.Down || this.orientation === Direction.Right;
    let stopCondition = !isForward ? (i: number) => i >= 0
        : this.orientation === Direction.Down ? (i: number) => i < grid.height : (i: number) => i < grid.width;
    let pos = { x: this.x, y: this.y };
    while (stopCondition(isVertical ? pos.y : pos.x)) {
      let tile = grid.getTile(pos.x, pos.y);
      if (tile.exists && tile.color !== color) {
        maxPossible++;
        if (tile.color === Color.Gray) stillGray = true;
      }
      pos = move(pos, this.orientation);
    }
    return stillGray ? State.Incomplete : maxPossible === this.number ? State.Satisfied : State.Error;
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
    orientation?: Direction;
  }): this {
    return new DartSymbol(x ?? this.x, y ?? this.y, number ?? this.number, orientation ?? this.orientation) as this;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}
