import Instruction from '../instruction.js';
import { isEventHandler } from './eventHelper.js';
import { Position } from '../primitives.js';
import GridData from '../grid.js';

export interface GetTileHandler {
  onGetTile(x: number, y: number, grid: GridData): Position;
}

export function handlesGetTile<T extends Instruction>(
  val: T
): val is T & GetTileHandler {
  return isEventHandler(val, 'onGetTile');
}
