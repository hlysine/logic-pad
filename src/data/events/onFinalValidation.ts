import GridData from '../grid';
import Instruction from '../instruction';
import { GridState } from '../primitives';
import { isEventHandler } from './helper';

export interface FinalValidationHandler {
  /**
   * Edits the final grid state after all rules and symbols have been validated.
   *
   * @param grid The grid that is being validated.
   * @param solution The solution grid, or null if the solution is not available.
   * @param state The current state of the grid.
   */
  onFinalValidation(
    grid: GridData,
    solution: GridData | null,
    state: GridState
  ): GridState;
}

export function handlesFinalValidation<T extends Instruction>(
  val: T
): val is T & FinalValidationHandler {
  return isEventHandler(val, 'onFinalValidation');
}
