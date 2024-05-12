import Configurable from './configurable';
import GridData from './grid';

export default abstract class Instruction extends Configurable {
  public abstract get id(): string;

  public abstract get explanation(): string;

  public abstract createExampleGrid(): GridData;

  /**
   * Indicates that validation by logic is not available and the solution must be used for validation
   */
  public get validateWithSolution(): boolean {
    return false;
  }

  public get necessaryForCompletion(): boolean {
    return true;
  }

  /**
   * Check if this instruction is equal to another instruction by comparing their IDs and configs.
   *
   * @param other The other instruction to compare to.
   * @returns Whether the two instructions are equal.
   */
  public equals(other: Instruction): boolean {
    if (this.id !== other.id) return false;
    return super.equals(other);
  }
}
