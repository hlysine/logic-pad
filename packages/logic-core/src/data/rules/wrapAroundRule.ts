import { AnyConfig, ConfigType } from '../config.js';
import { array } from '../dataHelper.js';
import { GetTileHandler } from '../events/onGetTile.js';
import GridData from '../grid.js';
import {
  Color,
  MajorRule,
  Orientation,
  Position,
  RuleState,
  State,
  Wrapping,
  orientationToggle,
} from '../primitives.js';
import LetterSymbol from '../symbols/letterSymbol.js';
import MyopiaSymbol from '../symbols/myopiaSymbol.js';
import Symbol from '../symbols/symbol.js';
import Rule, { SearchVariant } from './rule.js';

export default class WrapAroundRule extends Rule implements GetTileHandler {
  private static readonly EXAMPLE_GRID_NONE = Object.freeze(
    GridData.create(['wwwww', 'wwwww', 'wwwww', 'wwwww', 'wwwww'])
  );

  private static readonly EXAMPLE_GRID_HORIZONTAL = Object.freeze({
    [Wrapping.None]: WrapAroundRule.EXAMPLE_GRID_NONE,
    [Wrapping.Wrap]: GridData.create([
      'wwwww',
      'bwwwb',
      'wwwww',
      'bwwwb',
      'wwwww',
    ])
      .addSymbol(new LetterSymbol(0, 1, 'A'))
      .addSymbol(new LetterSymbol(4, 1, 'A'))
      .addSymbol(new LetterSymbol(0, 3, 'B'))
      .addSymbol(new LetterSymbol(4, 3, 'B')),
    [Wrapping.WrapReverse]: GridData.create([
      'wwwww',
      'bwwwb',
      'wwwww',
      'bwwwb',
      'wwwww',
    ])
      .addSymbol(new LetterSymbol(0, 1, 'A'))
      .addSymbol(new LetterSymbol(4, 1, 'B'))
      .addSymbol(new LetterSymbol(0, 3, 'B'))
      .addSymbol(new LetterSymbol(4, 3, 'A')),
    [Wrapping.Reflect]: GridData.create([
      'wwwww',
      'bwwwb',
      'wwwww',
      'bwwwb',
      'wwwww',
    ])
      .addSymbol(
        new MyopiaSymbol(0, 1, false, orientationToggle(Orientation.Left))
      )
      .addSymbol(
        new MyopiaSymbol(0, 3, false, orientationToggle(Orientation.Left))
      )
      .addSymbol(
        new MyopiaSymbol(4, 1, false, orientationToggle(Orientation.Right))
      )
      .addSymbol(
        new MyopiaSymbol(4, 3, false, orientationToggle(Orientation.Right))
      ),
    [Wrapping.ReflectReverse]: GridData.create([
      'wwwww',
      'bwwww',
      'wwwww',
      'wwwwb',
      'wwwww',
    ])
      .addSymbol(
        new MyopiaSymbol(0, 3, false, orientationToggle(Orientation.Left))
      )
      .addSymbol(
        new MyopiaSymbol(4, 1, false, orientationToggle(Orientation.Right))
      ),
  });

  private static readonly EXAMPLE_GRID_VERTICAL = Object.freeze({
    [Wrapping.None]: WrapAroundRule.EXAMPLE_GRID_NONE,
    [Wrapping.Wrap]: GridData.create([
      'wbwbw',
      'wwwww',
      'wwwww',
      'wwwww',
      'wbwbw',
    ])
      .addSymbol(new LetterSymbol(1, 0, 'C'))
      .addSymbol(new LetterSymbol(3, 0, 'D'))
      .addSymbol(new LetterSymbol(1, 4, 'C'))
      .addSymbol(new LetterSymbol(3, 4, 'D')),
    [Wrapping.WrapReverse]: GridData.create([
      'wbwbw',
      'wwwww',
      'wwwww',
      'wwwww',
      'wbwbw',
    ])
      .addSymbol(new LetterSymbol(1, 0, 'C'))
      .addSymbol(new LetterSymbol(3, 0, 'D'))
      .addSymbol(new LetterSymbol(1, 4, 'D'))
      .addSymbol(new LetterSymbol(3, 4, 'C')),
    [Wrapping.Reflect]: GridData.create([
      'wbwbw',
      'wwwww',
      'wwwww',
      'wwwww',
      'wbwbw',
    ])
      .addSymbol(
        new MyopiaSymbol(1, 0, false, orientationToggle(Orientation.Up))
      )
      .addSymbol(
        new MyopiaSymbol(3, 0, false, orientationToggle(Orientation.Up))
      )
      .addSymbol(
        new MyopiaSymbol(1, 4, false, orientationToggle(Orientation.Down))
      )
      .addSymbol(
        new MyopiaSymbol(3, 4, false, orientationToggle(Orientation.Down))
      ),
    [Wrapping.ReflectReverse]: GridData.create([
      'wbwww',
      'wwwww',
      'wwwww',
      'wwwww',
      'wwwbw',
    ])
      .addSymbol(
        new MyopiaSymbol(3, 0, false, orientationToggle(Orientation.Up))
      )
      .addSymbol(
        new MyopiaSymbol(1, 4, false, orientationToggle(Orientation.Down))
      ),
  });

  private static readonly SEARCH_VARIANTS = [
    new WrapAroundRule(Wrapping.Wrap, Wrapping.None).searchVariant(),
    new WrapAroundRule(Wrapping.None, Wrapping.Wrap).searchVariant(),
    new WrapAroundRule(Wrapping.Wrap, Wrapping.Wrap).searchVariant(),
  ];

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Wrapping,
      default: Wrapping.Wrap,
      field: 'horizontal',
      description: 'Horizontal wrap',
      configurable: true,
    },
    {
      type: ConfigType.Wrapping,
      default: Wrapping.Wrap,
      field: 'vertical',
      description: 'Vertical wrap',
      configurable: true,
    },
  ]);

  /**
   * **The left and right edges are connected (in reverse)**
   *
   * @param horizontal - The horizontal wrapping.
   * @param vertical - The vertical wrapping.
   */
  public constructor(
    public readonly horizontal: Wrapping,
    public readonly vertical: Wrapping
  ) {
    super();
    this.horizontal = horizontal;
    this.vertical = vertical;
  }

  onGetTile(x: number, y: number, grid: GridData): Position {
    if (grid.width === 0 || grid.height === 0) {
      return { x, y };
    }
    if (this.horizontal !== Wrapping.None) {
      const idx = Math.abs(Math.floor(x / grid.width));
      x = ((x % grid.width) + grid.width) % grid.width;
      if (
        (this.horizontal === Wrapping.WrapReverse ||
          this.horizontal === Wrapping.ReflectReverse) &&
        idx % 2 === 1
      ) {
        y = grid.height - 1 - y;
      }
      if (
        (this.horizontal === Wrapping.Reflect ||
          this.horizontal === Wrapping.ReflectReverse) &&
        idx % 2 === 1
      ) {
        x = grid.width - 1 - x;
      }
    }
    if (this.vertical !== Wrapping.None) {
      const idx = Math.abs(Math.floor(y / grid.height));
      y = ((y % grid.height) + grid.height) % grid.height;
      if (
        (this.vertical === Wrapping.WrapReverse ||
          this.vertical === Wrapping.ReflectReverse) &&
        idx % 2 === 1
      ) {
        x = grid.width - 1 - x;
      }
      if (
        (this.vertical === Wrapping.Reflect ||
          this.vertical === Wrapping.ReflectReverse) &&
        idx % 2 === 1
      ) {
        y = grid.height - 1 - y;
      }
    }
    return { x, y };
  }

  public get id(): string {
    return MajorRule.WrapAround;
  }

  public get explanation(): string {
    if (this.horizontal === Wrapping.None && this.vertical === Wrapping.None) {
      return `No edges are connected.`;
    }
    const horizontal =
      this.horizontal === Wrapping.None
        ? null
        : this.horizontal === Wrapping.Wrap ||
            this.horizontal === Wrapping.WrapReverse
          ? 'connected'
          : 'reflective';
    const vertical =
      this.vertical === Wrapping.None
        ? null
        : this.vertical === Wrapping.Wrap ||
            this.vertical === Wrapping.WrapReverse
          ? 'connected'
          : 'reflective';
    const horizontalReverse =
      this.horizontal === Wrapping.WrapReverse ||
      this.horizontal === Wrapping.ReflectReverse
        ? ' in reverse'
        : '';
    const verticalReverse =
      this.vertical === Wrapping.WrapReverse ||
      this.vertical === Wrapping.ReflectReverse
        ? ' in reverse'
        : '';
    if (this.horizontal === this.vertical) {
      return `All four edges are ${horizontal}${horizontalReverse}.`;
    }
    if (this.horizontal === Wrapping.None) {
      return `The top and bottom edges are ${vertical}${verticalReverse}.`;
    }
    if (this.vertical === Wrapping.None) {
      return `The left and right edges are ${horizontal}${verticalReverse}.`;
    }
    if (horizontal === vertical) {
      if (horizontalReverse !== '') {
        return `All four edges are ${horizontal}, with the left and right edges${horizontalReverse}.`;
      } else {
        return `All four edges are ${horizontal}, with the top and bottom edges${verticalReverse}.`;
      }
    }
    return `The left and right edges are ${horizontal}${horizontalReverse}. The top and bottom edges are ${vertical}${verticalReverse}.`;
  }

  public createExampleGrid(): GridData {
    const horizontal = WrapAroundRule.EXAMPLE_GRID_HORIZONTAL[this.horizontal];
    const vertical = WrapAroundRule.EXAMPLE_GRID_VERTICAL[this.vertical];

    if (horizontal === WrapAroundRule.EXAMPLE_GRID_NONE) {
      return vertical;
    } else if (vertical === WrapAroundRule.EXAMPLE_GRID_NONE) {
      return horizontal;
    } else {
      const tiles = array(5, 5, (x, y) => {
        const hTile = horizontal.getTile(x, y);
        const vTile = vertical.getTile(x, y);
        return hTile.withColor(
          hTile.color === Color.Dark || vTile.color === Color.Dark
            ? Color.Dark
            : Color.Light
        );
      });
      const symbols: Symbol[] = [];
      horizontal.symbols.forEach(list => symbols.push(...list));
      vertical.symbols.forEach(list => symbols.push(...list));
      return horizontal.withTiles(tiles).withSymbols(symbols);
    }
  }

  public get configs(): readonly AnyConfig[] | null {
    return WrapAroundRule.CONFIGS;
  }

  public get searchVariants(): SearchVariant[] {
    return WrapAroundRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    if (grid.getTileCount(true, false, Color.Gray) > 0) {
      return { state: State.Incomplete };
    } else {
      return { state: State.Satisfied };
    }
  }

  public copyWith({
    horizontal,
    vertical,
  }: {
    horizontal?: Wrapping;
    vertical?: Wrapping;
  }): this {
    return new WrapAroundRule(
      horizontal ?? this.horizontal,
      vertical ?? this.vertical
    ) as this;
  }

  public get isSingleton(): boolean {
    return true;
  }
}

export const instance = new WrapAroundRule(Wrapping.Wrap, Wrapping.Wrap);
