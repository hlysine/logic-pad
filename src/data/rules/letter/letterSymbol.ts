import Symbol from '../symbol';

export default class LetterSymbol extends Symbol {
  public constructor(public readonly letter: string) {
    super();
    this.letter = letter;
  }

  public get id(): string {
    return `letter`;
  }

  public copyWith({ letter }: { letter?: string }): LetterSymbol {
    return new LetterSymbol(letter ?? this.letter);
  }

  public withLetter(letter: string): LetterSymbol {
    return this.copyWith({ letter });
  }
}
