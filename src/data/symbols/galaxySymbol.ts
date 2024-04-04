import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { Direction, State } from '../primitives';
import DirectionLinkerSymbol from './directionLinkerSymbol';

export default class GalaxySymbol extends DirectionLinkerSymbol {
  private static readonly linkedDirections = {
    [Direction.Left]: Direction.Right,
    [Direction.Up]: Direction.Down,
    [Direction.Right]: Direction.Left,
    [Direction.Down]: Direction.Up,
  };

  /**
   * **Galaxies are centers of rotational symmetry**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    super(x, y);
    super.changeDirections(GalaxySymbol.linkedDirections);
  }

  public get id(): string {
    return `galaxy`;
  }

  public get explanation(): string {
    return `*Galaxies* are centers of rotational symmetry`;
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
    ]);
  }

  public createExampleGrid(): GridData {
    return Object.freeze(
      GridData.create(['wbbbb', 'wbwww', 'bbwbb', 'wwwbb']).addSymbol(
        new GalaxySymbol(2, 2)
      )
    );
  }

  public validateSymbol(grid: GridData): State {
    return super.validateSymbol(grid);
  }

  public copyWith({ x, y }: { x?: number; y?: number }): this {
    return new GalaxySymbol(x ?? this.x, y ?? this.y) as this;
  }
}
