import GridData from '../../../grid.js';
import Z3SolverContext from '../z3SolverContext.js';

export default abstract class Z3Module {
  public abstract get id(): string;

  public abstract encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name>
  ): void;
}

export const instance = undefined;
