import Configurable from './configurable.js';
import GridData from './grid.js';
import { Mode } from './primitives.js';

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

  public get visibleWhenSolving(): boolean {
    return true;
  }

  /**
   * Return a variant of this instruction that is suitable for the given mode.
   */
  public abstract modeVariant(mode: Mode): Instruction | null;

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
