import { AnyConfig, configEquals } from './config';
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

  /**
   * Check if this instruction is equal to another instruction by comparing their IDs and configs.
   *
   * @param other The other instruction to compare to.
   * @returns Whether the two instructions are equal.
   */
  public equals(other: Instruction): boolean {
    if (this.id !== other.id) return false;
    const configs = this.configs;
    if (configs === null) return true;

    // this is only possible when an instruction is instantiated before the class itself is completely defined
    // in this case, we can only compare the instances themselves
    if (configs === undefined) return this === other;

    for (const config of this.configs!) {
      if (
        !configEquals(
          config.type,
          this[config.field as keyof Instruction] as AnyConfig['default'],
          other[config.field as keyof Instruction] as AnyConfig['default']
        )
      )
        return false;
    }
    return true;
  }
}
