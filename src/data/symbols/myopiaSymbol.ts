import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import {
  Color,
  ORIENTATIONS,
  Orientation,
  OrientationMap,
  OrientationToggle,
  State,
  orientationToggle,
} from '../primitives';
import Symbol from './symbol';

export default class MyopiaSymbol extends Symbol {
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
      type: ConfigType.OrientationToggle,
      default: orientationToggle(Orientation.Up, Orientation.Right),
      field: 'directions',
      description: 'Directions',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wbwww', 'bwwwb', 'wwwww', 'wbwww']).withSymbols([
      new MyopiaSymbol(
        1,
        1,
        orientationToggle(Orientation.Up, Orientation.Left)
      ),
      new MyopiaSymbol(4, 3, orientationToggle(Orientation.Up)),
    ])
  );

  /**
   * **Viewpoint Numbers count visible cells in the four directions**
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param directions - The directions in which an arrow is pointing.
   */
  public constructor(
    x: number,
    y: number,
    public readonly directions: OrientationToggle
  ) {
    super(x, y);
    this.directions = directions;
  }

  public get id(): string {
    return `myopia`;
  }

  public get placementStep(): number {
    return 1;
  }

  public get explanation(): string {
    return '*Myopia arrows* point to *all* the closest cells of the opposite color';
  }

  public get configs(): readonly AnyConfig[] | null {
    return MyopiaSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return MyopiaSymbol.EXAMPLE_GRID;
  }

  public get containsDiagonal(): boolean {
    return (
      this.directions[Orientation.UpLeft] ||
      this.directions[Orientation.UpRight] ||
      this.directions[Orientation.DownLeft] ||
      this.directions[Orientation.DownRight]
    );
  }

  public validateSymbol(grid: GridData): State {
    const tile = grid.getTile(this.x, this.y);
    if (!tile.exists || tile.color === Color.Gray) return State.Incomplete;

    const allDirections = this.containsDiagonal
      ? ORIENTATIONS
      : [Orientation.Up, Orientation.Down, Orientation.Left, Orientation.Right];

    const map: OrientationMap<{ min: number; max: number; complete: boolean }> =
      {
        up: { min: 0, max: 0, complete: true },
        down: { min: 0, max: 0, complete: true },
        left: { min: 0, max: 0, complete: true },
        right: { min: 0, max: 0, complete: true },
        'up-left': { min: 0, max: 0, complete: true },
        'up-right': { min: 0, max: 0, complete: true },
        'down-left': { min: 0, max: 0, complete: true },
        'down-right': { min: 0, max: 0, complete: true },
      };
    const pos = { x: this.x, y: this.y };
    allDirections.forEach(direction => {
      grid.iterateDirectionAll(
        pos,
        direction,
        t => t.color === tile.color,
        () => {
          map[direction].min++;
        }
      );
      let stopped = false;
      grid.iterateDirectionAll(
        pos,
        direction,
        t => {
          if (t.color === tile.color || t.color === Color.Gray) return true;
          stopped = true;
          return false;
        },
        t => {
          map[direction].max++;
          if (t.color === Color.Gray) map[direction].complete = false;
        }
      );
      if (!stopped) map[direction].max = Number.MAX_SAFE_INTEGER;
    });
    const pointedDirections = allDirections.filter(d => this.directions[d]);
    const otherDirections = allDirections.filter(d => !this.directions[d]);
    for (let i = 0; i < pointedDirections.length; i++) {
      const direction1 = pointedDirections[i];
      for (let j = i + 1; j < pointedDirections.length; j++) {
        const direction2 = pointedDirections[j];
        if (map[direction1].min > map[direction2].max) return State.Error;
        if (map[direction2].min > map[direction1].max) return State.Error;
      }
    }
    if (
      Math.min(...otherDirections.map(d => map[d].max)) <=
      Math.max(...pointedDirections.map(d => map[d].min))
    )
      return State.Error;
    if (
      pointedDirections.length === 0 &&
      otherDirections.some(d => map[d].max !== Number.MAX_SAFE_INTEGER)
    )
      return State.Error;
    if (
      pointedDirections.some(
        d => map[d].complete && map[d].max === Number.MAX_SAFE_INTEGER
      )
    )
      return State.Error;
    if (
      pointedDirections.length > 0 &&
      otherDirections.length > 0 &&
      Math.max(...pointedDirections.map(d => map[d].max)) <
        Math.min(...otherDirections.map(d => map[d].min))
    )
      return State.Satisfied;
    if (allDirections.every(d => map[d].complete)) return State.Satisfied;
    return State.Incomplete;
  }

  public copyWith({
    x,
    y,
    directions,
  }: {
    x?: number;
    y?: number;
    directions?: OrientationToggle;
  }): this {
    return new MyopiaSymbol(
      x ?? this.x,
      y ?? this.y,
      directions ?? this.directions
    ) as this;
  }

  public withDirections(directions: OrientationToggle): this {
    return this.copyWith({ directions });
  }
}

export const instance = new MyopiaSymbol(
  0,
  0,
  orientationToggle(Orientation.Up, Orientation.Right)
);
