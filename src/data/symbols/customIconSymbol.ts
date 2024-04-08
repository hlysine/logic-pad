import { AnyConfig, ConfigType } from '../config';
import GridData from '../grid';
import CustomSymbol from './customSymbol';
import type Md from 'react-icons/md';

export type IconString = keyof typeof Md;

export default class CustomIconSymbol extends CustomSymbol {
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
      default: CustomIconSymbol.EXAMPLE_GRID,
      field: 'grid',
      description: 'Thumbnail Grid',
      configurable: true,
    },
    {
      type: ConfigType.Icon,
      default: 'MdQuestionMark',
      field: 'icon',
      description: 'Icon',
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
   * **A custom icon symbol**
   *
   * @param description - The description of the symbol.
   * @param grid - The thumbnail grid of the rule, preferably 5x4 in size.
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param icon - The icon to display. All available icons can be found at https://react-icons.github.io/react-icons/icons/md/
   * @param rotation - The rotation of the text in degrees.
   */
  public constructor(
    description: string,
    grid: GridData,
    x: number,
    y: number,
    public readonly icon: IconString,
    public readonly rotation = 0
  ) {
    super(description, grid, x, y);
    this.icon = icon;
    this.rotation = rotation;
  }

  public get id(): string {
    return `custom_icon`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return CustomIconSymbol.CONFIGS;
  }

  public copyWith({
    description,
    grid,
    x,
    y,
    icon,
    rotation,
  }: {
    description?: string;
    grid?: GridData;
    x?: number;
    y?: number;
    icon?: IconString;
    rotation?: number;
  }): this {
    return new CustomIconSymbol(
      description ?? this.description,
      grid ?? this.grid,
      x ?? this.x,
      y ?? this.y,
      icon ?? this.icon,
      rotation ?? this.rotation
    ) as this;
  }

  public withIcon(icon: IconString): this {
    return this.copyWith({ icon });
  }

  public withRotation(rotation: number): this {
    return this.copyWith({ rotation });
  }
}
