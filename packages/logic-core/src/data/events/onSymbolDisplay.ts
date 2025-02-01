import GridData from '../grid.js';
import Instruction from '../instruction.js';
import Symbol from '../symbols/symbol.js';
import { isEventHandler } from './eventHelper.js';

export interface SymbolDisplayHandler {
  /**
   * Controls whether a symbol should be visible in the grid.
   *
   * @param grid The grid that is being displayed.
   * @param solution The solution grid, if it is available.
   * @param symbol The symbol that is being displayed.
   * @param editing Whether the grid is being edited.
   * @returns True if the symbol should be displayed, false otherwise. The symbol will not be displayed if any handler returns false.
   */
  onSymbolDisplay(
    grid: GridData,
    solution: GridData | null,
    symbol: Symbol,
    editing: boolean
  ): boolean;
}

export function handlesSymbolDisplay<T extends Instruction>(
  val: T
): val is T & SymbolDisplayHandler {
  return isEventHandler(val, 'onSymbolDisplay');
}
