import GridData from '../grid';
import { State } from '../primitives';
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

  public get id(): string {
    return `number`;
  }

  public get explanation(): string {
    return `*Area Numbers* must equal region sizes`;
  }

  public get exampleGrid(): GridData {
    return NumberSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(_grid: GridData): State {
    return State.Incomplete; // TODO: implement
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
