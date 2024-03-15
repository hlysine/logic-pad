import GridData from '../grid';
import { Errors } from '../primitives';
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

  public get id(): string {
    return `viewpoint`;
  }

  public get explanation(): string {
    return '*Viewpoint Numbers* count visible cells in the four directions';
  }

  public get exampleGrid(): GridData {
    return ViewpointSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(_grid: GridData): Errors | null | undefined {
    return null; // TODO: implement
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
