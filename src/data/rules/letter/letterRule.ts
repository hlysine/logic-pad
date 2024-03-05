import SymbolRule from '../symbolRule';

export default class LetterRule extends SymbolRule {
  public override get id(): string {
    return 'letter';
  }

  public override validateSymbol(): null {
    return null; // TODO: implement
  }

  public override copyWith(_props: {}): LetterRule {
    return new LetterRule();
  }
}
