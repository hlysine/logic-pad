import GalaxySymbol from '../../../symbols/galaxySymbol';
import LotusSymbol from '../../../symbols/lotusSymbol';
import { Orientation, Position } from '../../../primitives';
import { BTGridData, BTTile } from '../worker';
import DirectionLinkerSymbol from '../../../symbols/directionLinkerSymbol';

// Translate a position in relative to a galaxy symbol
function movePosGalaxy(
  grid: BTGridData,
  symbol: GalaxySymbol,
  x: number,
  y: number
): Position | null {
  const pos = { x: 2 * symbol.x - x, y: 2 * symbol.y - y };
  return grid.isInBound(pos.x, pos.y) ? pos : null;
}

// Translate a position in relative to a lotus symbol
function movePosLotus(
  grid: BTGridData,
  symbol: LotusSymbol,
  x: number,
  y: number
): Position | null {
  let pos!: Position;
  if (
    symbol.orientation == Orientation.Up ||
    symbol.orientation == Orientation.Down
  ) {
    pos = { x: 2 * symbol.x - x, y };
  } else if (
    symbol.orientation == Orientation.UpRight ||
    symbol.orientation == Orientation.DownLeft
  ) {
    pos = { x: symbol.y + symbol.x - y, y: symbol.y + symbol.x - x };
  } else if (
    symbol.orientation == Orientation.Right ||
    symbol.orientation == Orientation.Left
  ) {
    pos = { x, y: 2 * symbol.y - y };
  } else if (
    symbol.orientation == Orientation.DownRight ||
    symbol.orientation == Orientation.UpLeft
  ) {
    pos = { x: symbol.x - symbol.y + y, y: symbol.y - symbol.x + x };
  }

  return grid.isInBound(pos.x, pos.y) ? pos : null;
}

function verifyDirectionLinkerSymbol(
  grid: BTGridData,
  symbol: DirectionLinkerSymbol,
  translator: (x: number, y: number) => Position | null
): Position[] | false {
  const tile = grid.getTile(symbol.x, symbol.y);

  if (tile == BTTile.Empty) return [{ x: symbol.x, y: symbol.y }];

  const queue: Position[] = [{ x: symbol.x, y: symbol.y }];
  const visited: boolean[][] = [];

  const affectedTiles: Position[] = [];

  // Initialize the visited array
  for (let y = 0; y < grid.height; y++) {
    visited[y] = [];
    for (let x = 0; x < grid.width; x++) {
      visited[y][x] = false;
    }
  }

  // Visit all connected tiles
  while (queue.length > 0) {
    const curPos = queue.pop()!;

    if (visited[curPos.y][curPos.x]) continue;
    visited[curPos.y][curPos.x] = true;

    const oppoPos = translator(curPos.x, curPos.y);
    if (oppoPos == null) return false;

    const oppoTile = grid.getTile(oppoPos.x, oppoPos.y);
    if (!(oppoTile == BTTile.Empty || oppoTile == tile)) return false;

    for (const edge of grid.getEdges(curPos)) {
      if (visited[edge.y][edge.x]) continue;

      const edgeTile = grid.getTile(edge.x, edge.y);
      if (edgeTile == BTTile.Empty) {
        affectedTiles.push(edge);
      } else if (edgeTile == tile) {
        queue.push(edge);
      }
    }
  }

  return affectedTiles;
}

export function verifyGalaxySymbol(
  grid: BTGridData,
  symbol: GalaxySymbol
): Position[] | false {
  return verifyDirectionLinkerSymbol(grid, symbol, (x, y) =>
    movePosGalaxy(grid, symbol, x, y)
  );
}

export function verifyLotusSymbol(
  grid: BTGridData,
  symbol: LotusSymbol
): Position[] | false {
  return verifyDirectionLinkerSymbol(grid, symbol, (x, y) =>
    movePosLotus(grid, symbol, x, y)
  );
}
