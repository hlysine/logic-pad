import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { Direction, Orientation, State } from '../primitives';
import DirectionLinkerSymbol, {
  DirectionLinkerMap,
} from './directionLinkerSymbol';

export default class LotusSymbol extends DirectionLinkerSymbol {
  private static readonly linkedDirectionsFromOrientation: {
    [key in Orientation]: DirectionLinkerMap;
  } = {
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
   * **Darts count opposite color cells in that direction**
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

  public createExampleGrid(): GridData {
    return Object.freeze(
      GridData.create(['wwbww', 'bwbwb', 'bwwwb', 'bwwwb']).addSymbol(
        new LotusSymbol(2, 2, Orientation.Up)
      )
    );
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
        configurable: false,
      },
    ]);
  }

  public validateSymbol(grid: GridData): State {
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
