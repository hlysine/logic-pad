import GridData from '../grid.js';
import Instruction from '../instruction.js';
import { isEventHandler } from './eventHelper.js';

export interface SetGridHandler {
  onSetGrid(
    oldGrid: GridData,
    newGrid: GridData,
    solution: GridData | null
  ): GridData;
}

export function handlesSetGrid<T extends Instruction>(
  val: T
): val is T & SetGridHandler {
  return isEventHandler(val, 'onSetGrid');
}

export function invokeSetGrid(
  oldGrid: GridData,
  newGrid: GridData,
  solution: GridData | null
) {
  newGrid.symbols.forEach(list => {
    list.forEach(symbol => {
      if (handlesSetGrid(symbol)) {
        newGrid = symbol.onSetGrid(oldGrid, newGrid, solution);
      }
    });
  });
  newGrid.rules.forEach(rule => {
    if (handlesSetGrid(rule)) {
      newGrid = rule.onSetGrid(oldGrid, newGrid, solution);
    }
  });
  return newGrid;
}
