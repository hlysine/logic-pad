import GridData from '../grid.js';
import Instruction from '../instruction.js';
import { isEventHandler } from './eventHelper.js';

export interface GridResizeHandler {
  /**
   * Update itself when the grid is resized.
   */
  onGridResize(
    grid: GridData,
    mode: 'insert' | 'remove',
    direction: 'row' | 'column',
    index: number
  ): this | null;
}

export function handlesGridResize<T extends Instruction>(
  val: T
): val is T & GridResizeHandler {
  return isEventHandler(val, 'onGridResize');
}
