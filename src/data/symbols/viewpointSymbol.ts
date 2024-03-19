import GridData from '../grid';
import { move } from '../helper';
import { Color, DIRECTIONS, State } from '../primitives';
import Symbol from './symbol';

export default class ViewpointSymbol extends Symbol {
  private static EXAMPLE_GRID = GridData.create([
    'bbbbb',
    'wwwwb',
    'bwwbb',
    'bbwww',
  ]).addSymbol(new ViewpointSymbol(1, 1, 5));

  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly number: number
  ) {
    super(x, y);
    this.number = number;
  }

  public static readonly id = `viewpoint`;

  public get id(): string {
    return ViewpointSymbol.id;
  }

  public get explanation(): string {
    return '*Viewpoint Numbers* count visible cells in the four directions';
  }

  public createExampleGrid(): GridData {
    return ViewpointSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(grid: GridData): State {
    const pos = { x: this.x, y: this.y };
    const color = grid.getTile(this.x, this.y).color;
    let minSize = color === Color.Gray ? 0 : 1;
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
