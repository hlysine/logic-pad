import ViewpointSymbol from '../../../symbols/viewpointSymbol';
import { Position } from '../../../primitives';
import { BTColor, BTGridData, BTTile, getOppositeColor } from '../worker';

export function verifyViewpointSymbol(
  grid: BTGridData,
  symbol: ViewpointSymbol
): Position[] | false {
  const tile = grid.getTile(symbol.x, symbol.y);

  if (tile == BTTile.Empty) return [{ x: symbol.x, y: symbol.y }];

  let completed = 1;
  let possible = 1;

  let affected_cells: Position[] = [];

  function traverse(dirX: number, dirY: number): boolean {
    let connected = true;
    let x = symbol.x + dirX;
    let y = symbol.y + dirY;

    while (grid.isInBound(x, y)) {
      const curTile = grid.getTile(x, y);

      if (connected) {
        if (tile == curTile) {
          completed += 1;
          if (completed > symbol.number) return true;
        } else {
          if (curTile == BTTile.Empty) affected_cells.push({ x, y });
          connected = false;
        }
      }

      if (
        getOppositeColor(tile as BTColor) == curTile ||
        curTile == BTTile.Border
      )
        break;

      possible += 1;

      x += dirX;
      y += dirY;
    }

    return false;
  }

  if (traverse(-1, 0) || traverse(1, 0) || traverse(0, -1) || traverse(0, 1))
    return false;

  if (possible < symbol.number) return false;

  return affected_cells;
}
