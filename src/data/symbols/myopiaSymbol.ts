import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import {
  Color,
  DIRECTIONS,
  DirectionMap,
  DirectionToggle,
  State,
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
      type: ConfigType.DirectionToggle,
      default: { up: false, down: false, left: false, right: false },
      field: 'directions',
      description: 'Directions',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wbwww', 'bwwwb', 'wwwww', 'wbwww']).withSymbols([
      new MyopiaSymbol(1, 1, {
        up: true,
        left: true,
        right: false,
        down: false,
      }),
      new MyopiaSymbol(4, 3, {
        up: true,
        left: false,
        right: false,
        down: false,
      }),
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
    public readonly directions: DirectionToggle
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
    return '*Myopia arrows* points to *all* the closest cells of the opposite color';
  }

  public get configs(): readonly AnyConfig[] | null {
    return MyopiaSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return MyopiaSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(grid: GridData): State {
    const tile = grid.getTile(this.x, this.y);
    if (!tile.exists || tile.color === Color.Gray) return State.Incomplete;

    const map: DirectionMap<{ min: number; max: number; complete: boolean }> = {
      up: { min: 0, max: 0, complete: true },
      down: { min: 0, max: 0, complete: true },
      left: { min: 0, max: 0, complete: true },
      right: { min: 0, max: 0, complete: true },
    };
    const pos = { x: this.x, y: this.y };
    DIRECTIONS.forEach(direction => {
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
    const pointedDirections = DIRECTIONS.filter(d => this.directions[d]);
    const otherDirections = DIRECTIONS.filter(d => !this.directions[d]);
    const complete = DIRECTIONS.every(d => map[d].complete);
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
    return complete ? State.Satisfied : State.Incomplete;
  }

  public copyWith({
    x,
    y,
    directions,
  }: {
    x?: number;
    y?: number;
    directions?: DirectionToggle;
  }): this {
    return new MyopiaSymbol(
      x ?? this.x,
      y ?? this.y,
      directions ?? this.directions
    ) as this;
  }

  public withDirections(directions: DirectionToggle): this {
    return this.copyWith({ directions });
  }
}

export const instance = new MyopiaSymbol(0, 0, {
  up: true,
  right: true,
  left: false,
  down: false,
});
