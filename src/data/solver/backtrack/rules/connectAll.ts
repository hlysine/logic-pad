import { Position } from '../../../primitives';
import {
  BTColor,
  BTGridData,
  colorToBTTile,
  getOppositeColor,
} from '../worker';
import ConnectAllRule from '../../../rules/connectAllRule';

export function verifyConnectAllRule(
  grid: BTGridData,
  rule: ConnectAllRule
): boolean {
  const color = colorToBTTile(rule.color) as BTColor;

  // Find all same cells
  const sameCells: Position[] = [];
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.getTile(x, y) == color) {
        sameCells.push({ x, y });
      }
    }
  }

  // If there are no same cells, return true
  if (sameCells.length === 0) return true;

  const queue: Position[] = [sameCells[0]];
  const visited: boolean[][] = [];

  // Initialize the visited array
  for (let y = 0; y < grid.height; y++) {
    visited[y] = [];
    for (let x = 0; x < grid.width; x++) {
      visited[y][x] = false;
    }
  }

  // Perform flood fill
  visited[sameCells[0].y][sameCells[0].x] = true;

  while (queue.length > 0) {
    const curPos = queue.pop()!;

    for (const edge of grid.getEdges(curPos)) {
      if (
        visited[edge.y][edge.x] ||
        grid.getTile(edge.x, edge.y) == getOppositeColor(color)
      ) {
        continue;
      }

      visited[edge.y][edge.x] = true;
      queue.push(edge);
    }
  }

  // Check if any same cell is not reachable
  for (const cell of sameCells) {
    if (!visited[cell.y][cell.x]) return false;
  }

  return true;
}
