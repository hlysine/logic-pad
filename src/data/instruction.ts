import { AnyConfig } from './config';
import GridData from './grid';

export default abstract class Instruction {
  public abstract get id(): string;

  public get acryonym(): string {
    return this.id
      .split('_')
      .map(word => word[0])
      .join('');
  }

  public abstract get explanation(): string;

  public abstract createExampleGrid(): GridData;

  public get configs(): readonly AnyConfig[] | null {
    return null;
  }

  public abstract copyWith(props: { [key: string]: any }): this;

  /**
   * Indicates that validation by logic is not available and the solution must be used for validation
   */
  public get validateWithSolution(): boolean {
    return false;
  }
}
