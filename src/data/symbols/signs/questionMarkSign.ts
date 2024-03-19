import GridData from '../../grid';
import Sign from './sign';

export default class QuestionMarkSign extends Sign {
  private static EXAMPLE_GRID = GridData.create([
    'nnnnn',
    'nnnnn',
    'nnnnn',
    'nnnnn',
  ])
    .addSymbol(new QuestionMarkSign(1, 0))
    .addSymbol(new QuestionMarkSign(0, 1));

  public get id(): string {
    return `question_mark`;
  }

  public get explanation(): string {
    return `*Question Marks* indicate that a cell is uncertain`;
  }

  public createExampleGrid(): GridData {
    return QuestionMarkSign.EXAMPLE_GRID;
  }

  // eslint-disable-next-line no-empty-pattern
  public copyWith({ x, y }: { x?: number; y?: number }): this {
    return new QuestionMarkSign(x ?? this.x, y ?? this.y) as this;
  }
}
