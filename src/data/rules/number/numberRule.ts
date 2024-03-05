import SymbolRule from '../symbolRule';

export default class NumberRule extends SymbolRule {
  public override get id(): string {
    return 'number';
  }

  public override validateSymbol(): null {
    return null; // TODO: implement
  }

  public override copyWith(_props: {}): NumberRule {
    return new NumberRule();
  }
}
