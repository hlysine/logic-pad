import Symbol from '../symbol';

export default class NumberSymbol extends Symbol {
  public constructor(public readonly number: number) {
    super();
    this.number = number;
  }

  public get id(): string {
    return `number`;
  }

  public copyWith({ number }: { number?: number }): NumberSymbol {
    return new NumberSymbol(number ?? this.number);
  }

  public withNumber(number: number): NumberSymbol {
    return this.copyWith({ number });
  }
}
