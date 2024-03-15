import GridData from '../grid';
import { Errors } from '../primitives';
import Symbol from './symbol';

export default class LetterSymbol extends Symbol {
  private static EXAMPLE_GRID = GridData.create([
    'bbbww',
    'wwbbw',
    'wwbbb',
    'bwwww',
  ])
    .addSymbol(new LetterSymbol(0, 0, 'B'))
    .addSymbol(new LetterSymbol(3, 0, 'A'))
    .addSymbol(new LetterSymbol(4, 1, 'A'))
    .addSymbol(new LetterSymbol(3, 2, 'B'))
    .addSymbol(new LetterSymbol(1, 1, 'C'))
    .addSymbol(new LetterSymbol(0, 2, 'C'))
    .addSymbol(new LetterSymbol(4, 3, 'C'));

  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly letter: string
  ) {
    super(x, y);
    this.letter = letter;
  }

  public get id(): string {
    return `letter`;
  }

  public get explanation(): string {
    return '*Letters* must be sorted into one type per area';
  }

  public get exampleGrid(): GridData {
    return LetterSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(_grid: GridData): Errors | null | undefined {
    return null; // TODO: implement
  }

  public copyWith({
    x,
    y,
    letter,
  }: {
    x?: number;
    y?: number;
    letter?: string;
  }): this {
    return new LetterSymbol(
      x ?? this.x,
      y ?? this.y,
      letter ?? this.letter
    ) as this;
  }

  public withLetter(letter: string): this {
    return this.copyWith({ letter });
  }
}
