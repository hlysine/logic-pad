import Instruction from '../instruction.js';
import Symbol from './symbol.js';

export default abstract class MultiEntrySymbol extends Symbol {
  /**
   * Determines if the description of two MultiEntrySymbols can be merged when displayed in the UI.
   * @param other - The other MultiEntrySymbol to compare to.
   * @returns Whether the two MultiEntrySymbols have the same description.
   */
  public descriptionEquals(other: Instruction): boolean {
    return (
      this.id === other.id &&
      this.explanation === other.explanation &&
      this.createExampleGrid().equals(other.createExampleGrid())
    );
  }
}

export const instance = undefined;
