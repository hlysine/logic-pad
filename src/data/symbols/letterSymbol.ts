import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { array } from '../helper';
import { Color, State } from '../primitives';
import Symbol from './symbol';

export default class LetterSymbol extends Symbol {
  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 0,
      field: 'x',
      description: 'X',
      configurable: false,
    },
    {
      type: ConfigType.Number,
      default: 0,
      field: 'y',
      description: 'Y',
      configurable: false,
    },
    {
      type: ConfigType.String,
      default: 'A',
      field: 'letter',
      description: 'Letter',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['bbbww', 'wwbbw', 'wwbbb', 'bwwww'])
      .addSymbol(new LetterSymbol(0, 0, 'B'))
      .addSymbol(new LetterSymbol(3, 0, 'A'))
      .addSymbol(new LetterSymbol(4, 1, 'A'))
      .addSymbol(new LetterSymbol(3, 2, 'B'))
      .addSymbol(new LetterSymbol(1, 1, 'C'))
      .addSymbol(new LetterSymbol(0, 2, 'C'))
      .addSymbol(new LetterSymbol(4, 3, 'C'))
  );

  /**
   * **Letters must be sorted into one type per area**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param letter - The letter of the symbol.
   */
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

  public get configs(): readonly AnyConfig[] | null {
    return LetterSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return LetterSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(grid: GridData): State {
    let complete = true;
    const visited = array(grid.width, grid.height, () => false);
    const connected = array(grid.width, grid.height, () => false);
    const color = grid.getTile(this.x, this.y).color;
    if (color !== Color.Gray) {
      grid.iterateArea(
        { x: this.x, y: this.y },
        tile => tile.color === Color.Gray || tile.color === color,
        (tile, x, y) => {
          visited[y][x] = true;
          if (tile.color === Color.Gray) complete = false;
        }
      );
      grid.iterateArea(
        { x: this.x, y: this.y },
        tile => tile.color === color,
        (_, x, y) => {
          connected[y][x] = true;
        }
      );
    } else {
      complete = false;
    }
    for (const symbol of grid.symbols.get(this.id) ?? []) {
      if (symbol !== this && symbol instanceof LetterSymbol) {
        if (symbol.letter === this.letter) {
          const theirColor = grid.getTile(symbol.x, symbol.y).color;
          if (
            (color !== Color.Gray && !visited[symbol.y][symbol.x]) ||
            (color !== Color.Gray &&
              theirColor !== Color.Gray &&
              theirColor !== color)
          ) {
            return State.Error;
          }
        } else if (color !== Color.Gray && connected[symbol.y][symbol.x]) {
          return State.Error;
        }
      }
    }
    return complete ? State.Satisfied : State.Incomplete;
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
