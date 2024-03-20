import GridData from '../grid';
import { Color, State } from '../primitives';
import Symbol from './symbol';

export default class NumberSymbol extends Symbol {
  private static EXAMPLE_GRID = GridData.create([
    'wbbbb',
    'wbbwb',
    'bbwwb',
    'bbbbb',
  ])
    .addSymbol(new NumberSymbol(2, 2, 3))
    .addSymbol(new NumberSymbol(0, 1, 2));

  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly number: number
  ) {
    super(x, y);
    this.number = number;
  }

  public static readonly id = `number`;

  public get id(): string {
    return NumberSymbol.id;
  }

  public get explanation(): string {
    return `*Area Numbers* must equal region sizes`;
  }

  public createExampleGrid(): GridData {
    return NumberSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(grid: GridData): State {
    const color = grid.getTile(this.x, this.y).color;
    if (color === Color.Gray) return State.Incomplete;
    let completeCount = 0;
    let grayCount = 0;
    grid.iterateArea(
      { x: this.x, y: this.y },
      tile => tile.color === Color.Gray || tile.color === color,
      () => {
        grayCount++;
      }
    );
    grid.iterateArea(
      { x: this.x, y: this.y },
      tile => tile.color === color,
      () => {
        completeCount++;
      }
    );
    if (completeCount > this.number || grayCount < this.number)
      return State.Error;
    else if (completeCount === this.number && completeCount === grayCount)
      return State.Satisfied;
    return State.Incomplete;
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
    return new NumberSymbol(
      x ?? this.x,
      y ?? this.y,
      number ?? this.number
    ) as this;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}
