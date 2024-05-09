import { Position } from '../../../primitives';
import ConnectAllRule from '../../../rules/connectAllRule';
import BTModule, {
  BTColor,
  BTGridData,
  CheckResult,
  IntArray2D,
  colorToBTTile,
  getOppositeColor,
} from '../data';

export default class ConnectAllBTModule extends BTModule {
  public instr: ConnectAllRule;

  public constructor(instr: ConnectAllRule) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const color = colorToBTTile(this.instr.color) as BTColor;

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
    if (sameCells.length === 0) return { tilesNeedCheck: null, ratings: null };

    const queue: Position[] = [sameCells[0]];
    const visited = IntArray2D.create(grid.width, grid.height);

    // Perform flood fill
    visited.set(sameCells[0].x, sameCells[0].y, 1);

    while (queue.length > 0) {
      const curPos = queue.pop()!;

      for (const edge of grid.getEdges(curPos)) {
        if (
          visited.get(edge.x, edge.y) ||
          grid.getTile(edge.x, edge.y) == getOppositeColor(color)
        ) {
          continue;
        }

        visited.set(edge.x, edge.y, 1);
        queue.push(edge);
      }
    }

    // Check if any same cell is not reachable
    for (const cell of sameCells) {
      if (!visited.get(cell.x, cell.y)) return false;
    }

    return { tilesNeedCheck: null, ratings: null };
  }

  public checkLocal(grid: BTGridData, _: Position[]): CheckResult | false {
    return this.checkGlobal(grid);
  }
}
