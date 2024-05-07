import GridData from '../grid';
import { State } from '../primitives';
import Symbol from '../symbols/symbol';
import { isEventHandler } from './helper';

export interface SymbolValidationHandler {
  /**
   * Overrides the validation of symbols.
   *
   * You can return a different validation result, or call the original validation logic with a modified grid.
   *
   * @param grid - The grid to validate.
   * @param _symbol - The symbol to validate.
   * @param validator - The original validation logic for the symbol.
   * @returns The state of the symbol after validation.
   */
  overrideSymbolValidation(
    grid: GridData,
    symbol: Symbol,
    validator: (grid: GridData) => State
  ): State | undefined;
}

export function handlesSymbolValidation<T>(
  val: T
): val is T & SymbolValidationHandler {
  return isEventHandler(val, 'overrideSymbolValidation');
}
