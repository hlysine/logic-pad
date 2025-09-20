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
  public readonly title = 'Hidden Symbol Marker';

  public get configExplanation() {
    return 'Other symbols in the same location will be hidden until this tile is colored correctly.';
  }

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
      type: ConfigType.Boolean,
      default: false,
      field: 'revealLocation',
      description: 'Reveal symbol location',
      explanation:
        'Whether to show this symbol when the tile is not yet colored correctly.',
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
   * @param revealLocation - Whether to reveal the location of the symbol.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly revealLocation = false
  ) {
    super(x, y);
    this.revealLocation = revealLocation;
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
    return this.revealLocation;
  }

  public get sortOrder(): number {
    return 0;
  }

  public validateSymbol(grid: GridData, solution: GridData | null): State {
    const thisX = Math.floor(this.x);
    const thisY = Math.floor(this.y);
    const thisColor = grid.getTile(thisX, thisY).color;
    if (solution) {
      return thisColor === solution.getTile(thisX, thisY).color
        ? State.Satisfied
        : State.Incomplete;
    } else {
      return thisColor !== Color.Gray ? State.Satisfied : State.Incomplete;
    }
  }

  public onSymbolDisplay(
    grid: GridData,
    solution: GridData | null,
    symbol: Symbol,
    editing: boolean
  ): boolean {
    if (editing) return true;
    const thisX = Math.floor(this.x);
    const thisY = Math.floor(this.y);
    const symX = Math.floor(symbol.x);
    const symY = Math.floor(symbol.y);
    if (thisX !== symX || thisY !== symY) return true;
    const thisColor = grid.getTile(thisX, thisY).color;
    const colorMatch = solution
      ? thisColor === solution.getTile(thisX, thisY).color
      : thisColor !== Color.Gray;
    if (symbol.id === this.id) {
      return !colorMatch;
    }
    return colorMatch;
  }

  public copyWith({
    x,
    y,
    revealLocation,
  }: {
    x?: number;
    y?: number;
    revealLocation?: boolean;
  }): this {
    return new HiddenSymbol(
      x ?? this.x,
      y ?? this.y,
      revealLocation ?? this.revealLocation
    ) as this;
  }

  public withRevealLocation(revealLocation: boolean): this {
    return this.copyWith({ revealLocation });
  }
}

export const instance = new HiddenSymbol(0, 0);
