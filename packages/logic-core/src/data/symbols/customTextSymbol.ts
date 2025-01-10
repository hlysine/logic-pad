import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import CustomSymbol from './customSymbol.js';

export default class CustomTextSymbol extends CustomSymbol {
  private static readonly EXAMPLE_GRID = Object.freeze(new GridData(5, 4));

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
      placeholder: 'Enter description. Emphasize with *asterisks*.',
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
      placeholder: 'Short text to be displayed on the symbol',
      field: 'text',
      description: 'Text',
      configurable: true,
    },
    {
      type: ConfigType.Number,
      default: 0,
      field: 'rotation',
      description: 'Rotation',
      configurable: true,
    },
  ]);

  /**
   * **A custom text symbol**
   *
   * @param description - The description of the symbol. Leave this empty to hide the description.
   * @param grid - The thumbnail grid of the rule, preferably 5x4 in size.
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param text - The text to display.
   * @param rotation - The rotation of the text in degrees.
   */
  public constructor(
    description: string,
    grid: GridData,
    x: number,
    y: number,
    public readonly text: string,
    public readonly rotation = 0
  ) {
    super(description, grid, x, y);
    this.text = text;
    this.rotation = rotation;
  }

  public get id(): string {
    return `custom_text`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return CustomTextSymbol.CONFIGS;
  }

  public copyWith({
    description,
    grid,
    x,
    y,
    text,
    rotation,
  }: {
    description?: string;
    grid?: GridData;
    x?: number;
    y?: number;
    text?: string;
    rotation?: number;
  }): this {
    return new CustomTextSymbol(
      description ?? this.description,
      grid ?? this.grid,
      x ?? this.x,
      y ?? this.y,
      text ?? this.text,
      rotation ?? this.rotation
    ) as this;
  }

  public withText(text: string): this {
    return this.copyWith({ text });
  }

  public withRotation(rotation: number): this {
    return this.copyWith({ rotation });
  }
}

export const instance = new CustomTextSymbol(
  'A *custom* text symbol',
  new GridData(5, 4),
  0,
  0,
  'X'
);
