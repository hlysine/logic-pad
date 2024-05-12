import GridData from '../grid';
import Instruction from '../instruction';
import { isEventHandler } from './helper';

export interface SetGridHandler {
  onSetGrid(oldGrid: GridData, newGrid: GridData): GridData;
}

export function handlesSetGrid<T extends Instruction>(
  val: T
): val is T & SetGridHandler {
  return isEventHandler(val, 'onSetGrid');
}
