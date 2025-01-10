import GridData from '../grid.js';
import Instruction from '../instruction.js';
import { isEventHandler } from './eventHelper.js';

export interface GridChangeHandler {
  onGridChange(newGrid: GridData): this;
}

export function handlesGridChange<T extends Instruction>(
  val: T
): val is T & GridChangeHandler {
  return isEventHandler(val, 'onGridChange');
}
