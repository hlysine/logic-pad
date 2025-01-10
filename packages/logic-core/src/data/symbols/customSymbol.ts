import GridData from '../grid.js';
import { State } from '../primitives.js';
import MultiEntrySymbol from './multiEntrySymbol.js';

export default abstract class CustomSymbol extends MultiEntrySymbol {
  /**
   * **A custom symbol**
   *
   * @param description - The description of the symbol. Leave this empty to hide the description.
   * @param grid - The thumbnail grid of the rule, preferably 5x4 in size.
   * @param x - The x-coordinate of the symbol.
   * @param y - The y-coordinate of the symbol.
   */
  public constructor(
    public readonly description: string,
    public readonly grid: GridData,
    x: number,
    y: number
  ) {
    super(x, y);
    this.description = description;
    this.grid = grid;
  }

  public get explanation(): string {
    return this.description;
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

  public withDescription(description: string): this {
    return this.copyWith({ description });
  }

  public withGrid(grid: GridData): this {
    return this.copyWith({ grid });
  }
}

export const instance = undefined;
