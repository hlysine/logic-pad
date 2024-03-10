import GridData from '../grid';
import Symbol from './symbol';

export default class NumberSymbol extends Symbol {
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

  public validateSymbol(_grid: GridData): null {
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
