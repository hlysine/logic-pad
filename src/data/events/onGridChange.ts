import GridData from '../grid';
import Instruction from '../instruction';
import { isEventHandler } from './eventHelper';

export interface GridChangeHandler {
  onGridChange(newGrid: GridData): this;
}

export function handlesGridChange<T extends Instruction>(
  val: T
): val is T & GridChangeHandler {
  return isEventHandler(val, 'onGridChange');
}
