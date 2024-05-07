import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';

export default abstract class Z3Module {
  public abstract get id(): string;

  public abstract encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name>
  ): void;
}

export const instance = undefined;
