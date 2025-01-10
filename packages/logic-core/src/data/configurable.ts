import { AnyConfig, configEquals } from './config.js';

export default abstract class Configurable {
  public get configs(): readonly AnyConfig[] | null {
    return null;
  }

  public abstract copyWith(props: Record<string, unknown>): this;

  /**
   * Check if this instruction is equal to another instruction by comparing their IDs and configs.
   *
   * @param other The other instruction to compare to.
   * @returns Whether the two instructions are equal.
   */
  public equals(other: Configurable): boolean {
    const configs = this.configs;
    if (configs === null) return true;

    // this is only possible when an instruction is instantiated before the class itself is completely defined
    // in this case, we can only compare the instances themselves
    if (configs === undefined) return this === other;

    for (const config of this.configs!) {
      if (
        !configEquals(
          config.type,
          this[
            config.field as keyof Configurable
          ] as unknown as AnyConfig['default'],
          other[
            config.field as keyof Configurable
          ] as unknown as AnyConfig['default']
        )
      )
        return false;
    }
    return true;
  }
}
