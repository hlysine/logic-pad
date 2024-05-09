import DartSymbol from '../../../symbols/dartSymbol';
import { Position } from '../../../primitives';
import { BTColor, BTGridData, BTTile, getOppositeColor } from '../worker';
import { move } from '../../../helper';

export function verifyDartSymbol(
  grid: BTGridData,
  symbol: DartSymbol
): boolean {
  const tile = grid.getTile(symbol.x, symbol.y);

  if (tile == BTTile.Empty) return true;

  let pos = move({ x: symbol.x, y: symbol.y }, symbol.orientation);

  let completed = 0;
  let empty = 0;

  while (grid.isInBound(pos.x, pos.y)) {
    // Opposite tiles
    if (grid.getTile(pos.x, pos.y) == getOppositeColor(tile as BTColor)) {
      completed += 1;
      if (completed > symbol.number) return false;
    }

    // Empty tiles
    if (grid.getTile(pos.x, pos.y) == BTTile.Empty) empty += 1;

    pos = move(pos, symbol.orientation);
  }

  return completed + empty >= symbol.number;
}

// Dart adjacency can be built before running the solver
export function buildDartAdjacency(
  grid: BTGridData,
  symbol: DartSymbol
): Position[] {
  const affectedTiles: Position[] = [];

  let pos = { x: symbol.x, y: symbol.y };

  while (grid.isInBound(pos.x, pos.y)) {
    if (grid.getTile(pos.x, pos.y) == BTTile.Empty) affectedTiles.push(pos);

    pos = move(pos, symbol.orientation);
  }

  return affectedTiles;
}
