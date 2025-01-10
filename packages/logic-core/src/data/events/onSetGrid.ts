import GridData from '../grid.js';
import Instruction from '../instruction.js';
import { isEventHandler } from './eventHelper.js';

export interface SetGridHandler {
  onSetGrid(oldGrid: GridData, newGrid: GridData): GridData;
}

export function handlesSetGrid<T extends Instruction>(
  val: T
): val is T & SetGridHandler {
  return isEventHandler(val, 'onSetGrid');
}
