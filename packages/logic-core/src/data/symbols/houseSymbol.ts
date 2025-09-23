import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { array } from '../dataHelper.js';
import { Color, State } from '../primitives.js';
import Symbol from './symbol.js';

export default class HouseSymbol extends Symbol {
  public readonly title = 'House';

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
  ]);

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['bbbww', 'wwwbw', 'wbbbw', 'wwwww'])
      .addSymbol(new HouseSymbol(0, 0))
      .addSymbol(new HouseSymbol(2, 0))
      .addSymbol(new HouseSymbol(3, 0))
      .addSymbol(new HouseSymbol(2, 1))
      .addSymbol(new HouseSymbol(3, 1))
      .addSymbol(new HouseSymbol(1, 2))
  );

  /**
   * **Houses must connect to exactly one other house**
   *
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   */
  public constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    super(x, y);
  }

  public get id(): string {
    return `house`;
  }

  public get explanation(): string {
    return '*Houses* must connect to *exactly one* other house';
  }

  public get configs(): readonly AnyConfig[] | null {
    return HouseSymbol.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return HouseSymbol.EXAMPLE_GRID;
  }

  public validateSymbol(grid: GridData): State {
    const thisX = Math.floor(this.x);
    const thisY = Math.floor(this.y);
    let complete = true;
    const visited = array(grid.width, grid.height, () => false);
    const connected = array(grid.width, grid.height, () => false);
    const color = grid.getTile(thisX, thisY).color;
    if (color === Color.Gray) return State.Incomplete;
    grid.iterateArea(
      { x: thisX, y: thisY },
      tile => tile.color === Color.Gray || tile.color === color,
      (tile, x, y) => {
        visited[y][x] = true;
        if (tile.color === Color.Gray) complete = false;
      }
    );
    grid.iterateArea(
      { x: thisX, y: thisY },
      tile => tile.color === color,
      (_, x, y) => {
        connected[y][x] = true;
      }
    );
    let connectedHouses = 0;
    let possibleHouses = 0;
    for (const symbol of grid.symbols.get(this.id) ?? []) {
      if (symbol !== this && symbol instanceof HouseSymbol) {
        const symbolX = Math.floor(symbol.x);
        const symbolY = Math.floor(symbol.y);
        if (connected[symbolY][symbolX]) connectedHouses++;
        else if (visited[symbolY][symbolX]) possibleHouses++;
      }
    }
    if (connectedHouses > 1 || connectedHouses + possibleHouses < 1) {
      return State.Error;
    }
    return complete || (connectedHouses === 1 && possibleHouses === 0)
      ? State.Satisfied
      : State.Incomplete;
  }

  public copyWith({ x, y }: { x?: number; y?: number }): this {
    return new HouseSymbol(x ?? this.x, y ?? this.y) as this;
  }
}

export const instance = new HouseSymbol(0, 0);
