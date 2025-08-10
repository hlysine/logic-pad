import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { Direction, Orientation, State } from '../primitives.js';
import DirectionLinkerSymbol, {
  DirectionLinkerMap,
} from './directionLinkerSymbol.js';

export default class LotusSymbol extends DirectionLinkerSymbol {
  private static readonly linkedDirectionsFromOrientation: Record<
    Orientation,
    DirectionLinkerMap
  > = {
    [Orientation.Up]: {
      [Direction.Left]: Direction.Right,
      [Direction.Up]: Direction.Up,
      [Direction.Right]: Direction.Left,
      [Direction.Down]: Direction.Down,
    },
    [Orientation.UpRight]: {
      [Direction.Left]: Direction.Down,
      [Direction.Up]: Direction.Right,
      [Direction.Right]: Direction.Up,
      [Direction.Down]: Direction.Left,
    },
    [Orientation.Right]: {
      [Direction.Left]: Direction.Left,
      [Direction.Up]: Direction.Down,
      [Direction.Right]: Direction.Right,
      [Direction.Down]: Direction.Up,
    },
    [Orientation.DownRight]: {
      [Direction.Left]: Direction.Up,
      [Direction.Up]: Direction.Left,
      [Direction.Right]: Direction.Down,
      [Direction.Down]: Direction.Right,
    },
    [Orientation.Down]: {
      [Direction.Left]: Direction.Right,
      [Direction.Up]: Direction.Up,
      [Direction.Right]: Direction.Left,
      [Direction.Down]: Direction.Down,
    },
    [Orientation.DownLeft]: {
      [Direction.Left]: Direction.Down,
      [Direction.Up]: Direction.Right,
      [Direction.Right]: Direction.Up,
      [Direction.Down]: Direction.Left,
    },
    [Orientation.Left]: {
      [Direction.Left]: Direction.Left,
      [Direction.Up]: Direction.Down,
      [Direction.Right]: Direction.Right,
      [Direction.Down]: Direction.Up,
    },
    [Orientation.UpLeft]: {
      [Direction.Left]: Direction.Up,
      [Direction.Up]: Direction.Left,
      [Direction.Right]: Direction.Down,
      [Direction.Down]: Direction.Right,
    },
  };

  /**
   * **Areas containing this symbol must be symmetrical**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param orientation - The orientation of the symbol.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly orientation: Orientation
  ) {
    super(x, y);
    super.changeDirections(
      LotusSymbol.linkedDirectionsFromOrientation[orientation]
    );
  }

  public get id(): string {
    return `lotus`;
  }

  public get explanation(): string {
    return `Areas containing this symbol must be *symmetrical*`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return Object.freeze([
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
        type: ConfigType.Orientation,
        default: Orientation.Up,
        field: 'orientation',
        description: 'Orientation',
        configurable: true,
      },
    ]);
  }

  public createExampleGrid(): GridData {
    return Object.freeze(
      GridData.create(['wwbww', 'bwbwb', 'bwwwb', 'bwwwb']).addSymbol(
        new LotusSymbol(2, 2, Orientation.Up)
      )
    );
  }

  public validateSymbol(grid: GridData): State {
    if (
      this.orientation === Orientation.DownLeft ||
      this.orientation === Orientation.DownRight ||
      this.orientation === Orientation.UpLeft ||
      this.orientation === Orientation.UpRight
    ) {
      if (this.x % 1 === 0 || this.y % 1 === 0)
        if (this.x % 1 !== 0 || this.y % 1 !== 0) {
          if (
            !grid.getTile(Math.floor(this.x), Math.floor(this.y)).exists &&
            !grid.getTile(Math.ceil(this.x), Math.ceil(this.y)).exists &&
            !grid.getTile(Math.floor(this.x), Math.ceil(this.y)).exists &&
            !grid.getTile(Math.ceil(this.x), Math.floor(this.y)).exists
          ) {
            return State.Satisfied;
          } else {
            return State.Error;
          }
        }
    }
    return super.validateSymbol(grid);
  }

  public copyWith({
    x,
    y,
    orientation,
  }: {
    x?: number;
    y?: number;
    orientation?: Orientation;
  }): this {
    return new LotusSymbol(
      x ?? this.x,
      y ?? this.y,
      orientation ?? this.orientation
    ) as this;
  }
}

export const instance = new LotusSymbol(0, 0, Orientation.Up);
