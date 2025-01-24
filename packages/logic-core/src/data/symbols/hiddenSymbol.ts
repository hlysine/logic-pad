import { AnyConfig, ConfigType } from '../config.js';
import { SymbolDisplayHandler } from '../events/onSymbolDisplay.js';
import GridData from '../grid.js';
import { Color, State } from '../primitives.js';
import CustomIconSymbol from './customIconSymbol.js';
import Symbol from './symbol.js';

export default class HiddenSymbol
  extends Symbol
  implements SymbolDisplayHandler
{
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
      type: ConfigType.Color,
      default: Color.Light,
      field: 'color',
      allowGray: true,
      description: 'Show on color',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['w']).addSymbol(
      new CustomIconSymbol('', GridData.create(['.']), 0, 0, 'MdHideSource') // Not using HiddenSymbol here because it is meant to be hidden in non-edit mode
    )
  );

  /**
   * **Hidden Symbols: color cells correctly to reveal more clues**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   * @param color - The target color of the cell.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly color: Color
  ) {
    super(x, y);
    this.color = color;
  }

  public get id(): string {
    return `hidden`;
  }

  public get explanation(): string {
    return '*Hidden Symbols*: color cells correctly to reveal more clues';
  }

  public get configs(): readonly AnyConfig[] | null {
    return HiddenSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return HiddenSymbol.EXAMPLE_GRID;
  }

  public get necessaryForCompletion(): boolean {
    return false;
  }

  public get visibleWhenSolving(): boolean {
    return false;
  }

  public get sortOrder(): number {
    return 0;
  }

  public validateSymbol(grid: GridData): State {
    const thisX = Math.floor(this.x);
    const thisY = Math.floor(this.y);
    return grid.getTile(thisX, thisY).color === this.color
      ? State.Satisfied
      : State.Incomplete;
  }

  public onSymbolDisplay(
    grid: GridData,
    symbol: Symbol,
    editing: boolean
  ): boolean {
    if (symbol.id === this.id || editing) return true;
    const thisX = Math.floor(this.x);
    const thisY = Math.floor(this.y);
    const symX = Math.floor(symbol.x);
    const symY = Math.floor(symbol.y);
    if (thisX !== symX || thisY !== symY) return true;
    return grid.getTile(thisX, thisY).color === this.color;
  }

  public copyWith({
    x,
    y,
    color,
  }: {
    x?: number;
    y?: number;
    color?: Color;
  }): this {
    return new HiddenSymbol(
      x ?? this.x,
      y ?? this.y,
      color ?? this.color
    ) as this;
  }

  public withColor(color: Color): this {
    return this.copyWith({ color });
  }
}

export const instance = new HiddenSymbol(0, 0, Color.Light);
