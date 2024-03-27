import { AnyConfig } from './config';
import GridData from './grid';

export default abstract class Instruction {
  public abstract get id(): string;

  public abstract get explanation(): string;

  public abstract createExampleGrid(): GridData;

  public get configs(): readonly AnyConfig[] | null {
    return null;
  }

  public abstract copyWith(props: Record<string, unknown>): this;

  /**
   * Indicates that validation by logic is not available and the solution must be used for validation
   */
  public get validateWithSolution(): boolean {
    return false;
  }
}
