import { Position } from '../../../primitives.js';
import RegionAreaRule from '../../../rules/regionAreaRule.js';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  colorToBTTile,
} from '../data.js';

export default class RegionAreaBTModule extends BTModule {
  public instr: RegionAreaRule;

  public constructor(instr: RegionAreaRule) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const color = colorToBTTile(this.instr.color);

    const visited: IntArray2D = IntArray2D.create(grid.width, grid.height);

    let id = 0;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        if (visited.get(x, y) & 0b01111111) continue;
        if (grid.getTile(x, y) !== color) continue;

        id += 1;
        if (id > 127) throw new Error('Too many regions!');

        if (!this.visitArea(grid, color, visited, { x, y }, id)) return false;
      }
    }

    return { tilesNeedCheck: null, ratings: null };
  }

  private visitArea(
    grid: BTGridData,
    tile: BTTile,
    visited: IntArray2D,
    pos: Position,
    id: number
  ) {
    const sameTileQueue: Position[] = [pos];
    const usableTileQueue: Position[] = [];

    let sameCellCount = 0;
    let usableCellCount = 0;

    visited.set(pos.x, pos.y, id);

    // Count same tile
    while (sameTileQueue.length > 0) {
      const curPos = sameTileQueue.pop()!;
      sameCellCount += 1;

      for (const edge of grid.getEdges(curPos)) {
        if ((visited.get(edge.x, edge.y) & 0b01111111) === id) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty) {
          usableTileQueue.push(edge);
          visited.set(edge.x, edge.y, id | 0b10000000);
        } else if (edgeTile === tile) {
          sameTileQueue.push(edge);
          visited.set(edge.x, edge.y, id);
        }
      }
    }

    if (sameCellCount > this.instr.size) return false;

    // Count usable tile
    while (usableTileQueue.length > 0) {
      const curPos = usableTileQueue.pop()!;
      usableCellCount += 1;

      if (sameCellCount + usableCellCount >= this.instr.size) return true;

      for (const edge of grid.getEdges(curPos)) {
        if ((visited.get(edge.x, edge.y) & 0b01111111) === id) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty || edgeTile === tile) {
          usableTileQueue.push(edge);
          visited.set(edge.x, edge.y, id | 0b10000000);
        }
      }
    }

    return sameCellCount + usableCellCount >= this.instr.size;
  }
}
