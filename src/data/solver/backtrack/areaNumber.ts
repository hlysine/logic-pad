import AreaNumberSymbol from '../../symbols/areaNumberSymbol';
import { Position } from '../../primitives';
import { BTGridData, BTTile } from './worker';

export function verifyAreaNumberSymbol(
  grid: BTGridData,
  symbol: AreaNumberSymbol
): Position[] | false {
  const tile = grid.getTile(symbol.x, symbol.y);

  if (tile == BTTile.Empty) return [{ x: symbol.x, y: symbol.y }];

  const visited: boolean[][] = [];

  const sameTileQueue: Position[] = [{ x: symbol.x, y: symbol.y }];
  const usableTileQueue: Position[] = [];

  let sameCellCount = 0;
  let usableCellCount = 0;

  // Initialize the visited array
  for (let y = 0; y < grid.height; y++) {
    visited[y] = [];
    for (let x = 0; x < grid.width; x++) {
      visited[y][x] = false;
    }
  }

  visited[symbol.y][symbol.x] = true;

  // Count same tile
  while (sameTileQueue.length > 0) {
    const curPos = sameTileQueue.pop()!;
    sameCellCount += 1;

    for (const edge of grid.getEdges(curPos)) {
      if (visited[edge.y][edge.x]) continue;

      const edgeTile = grid.getTile(edge.x, edge.y);

      if (edgeTile == BTTile.Empty) {
        usableTileQueue.push(edge);
      } else if (edgeTile == tile) {
        sameTileQueue.push(edge);
      }

      visited[edge.y][edge.x] = true;
    }
  }

  if (sameCellCount > symbol.number) return false;

  const emptyEdges = [...usableTileQueue];

  // Count usable tile
  while (usableTileQueue.length > 0) {
    const curPos = usableTileQueue.pop()!;
    usableCellCount += 1;

    if (sameCellCount + usableCellCount >= symbol.number) return emptyEdges;

    for (const edge of grid.getEdges(curPos)) {
      if (visited[edge.y][edge.x]) continue;

      const edgeTile = grid.getTile(edge.x, edge.y);

      if (edgeTile == BTTile.Empty || edgeTile == tile) {
        usableTileQueue.push(edge);
        visited[edge.y][edge.x] = true;
      }
    }
  }

  return sameCellCount + usableCellCount >= symbol.number ? emptyEdges : false;
}
