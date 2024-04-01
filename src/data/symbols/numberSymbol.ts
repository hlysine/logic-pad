import GridData from '../grid';
import { State } from '../primitives';
import Symbol from './symbol';

/**
 * All symbols which contain a number should extend this class to be compatible with off by X rules.
 */
export default abstract class NumberSymbol extends Symbol {
  public constructor(
    public readonly x: number,
    public readonly y: number,
    public readonly number: number
  ) {
    super(x, y);
    this.number = number;
  }

  public abstract countTiles(grid: GridData): {
    completed: number;
    possible: number;
  };

  public validateSymbol(grid: GridData): State {
    const { completed, possible } = this.countTiles(grid);
    if (completed > this.number || possible < this.number) return State.Error;
    if (completed === this.number && possible === this.number)
      return State.Satisfied;
    return State.Incomplete;
  }

  public withNumber(number: number): this {
    return this.copyWith({ number });
  }
}
