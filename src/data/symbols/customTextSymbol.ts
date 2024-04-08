import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import { State } from '../primitives';
import MultiEntrySymbol from './multiEntrySymbol';

export default class CustomTextSymbol extends MultiEntrySymbol {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['wwwww', 'wwwww', 'wwwww', 'wwwww'])
  );

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
      default: 'A *custom* text symbol',
      field: 'description',
      description: 'Description',
      configurable: true,
    },
    {
      type: ConfigType.Grid,
      default: CustomTextSymbol.EXAMPLE_GRID,
      field: 'grid',
      description: 'Thumbnail Grid',
      configurable: true,
    },
    {
      type: ConfigType.String,
      default: 'X',
      field: 'text',
      description: 'Text',
      configurable: true,
    },
  ]);

  /**
   * **A custom text symbol**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param description - The description of the symbol.
   * @param grid - The thumbnail grid of the rule, preferably 5x4 in size.
   * @param text - The text to display.
   */
  public constructor(
    x: number,
    y: number,
    public readonly description: string,
    public readonly grid: GridData,
    public readonly text: string
  ) {
    super(x, y);
    this.description = description;
    this.grid = grid;
    this.text = text;
  }

  public get id(): string {
    return `custom_text`;
  }

  public get explanation(): string {
    return this.description;
  }

  public get configs(): readonly AnyConfig[] | null {
    return CustomTextSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return this.grid;
  }

  public validateSymbol(_grid: GridData): State {
    return State.Incomplete;
  }

  public get validateWithSolution(): boolean {
    return true;
  }

  public copyWith({
    x,
    y,
    description,
    grid,
    text,
  }: {
    x?: number;
    y?: number;
    description?: string;
    grid?: GridData;
    text?: string;
  }): this {
    return new CustomTextSymbol(
      x ?? this.x,
      y ?? this.y,
      description ?? this.description,
      grid ?? this.grid,
      text ?? this.text
    ) as this;
  }

  public withText(text: string): this {
    return this.copyWith({ text });
  }
}
