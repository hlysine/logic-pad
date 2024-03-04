import Markup from './markup';

export default class NumberMarkup extends Markup {
  public constructor(public readonly number: number) {
    super();
    this.number = number;
  }

  public get id(): string {
    return `number`;
  }

  public copyWith({ number }: { number?: number }): NumberMarkup {
    return new NumberMarkup(number ?? this.number);
  }

  public withNumber(number: number): NumberMarkup {
    return this.copyWith({ number });
  }
}
