import AreaNumberSymbol from '../../../symbols/areaNumberSymbol';
import { Position } from '../../../primitives';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  Rating,
  createOneTileResult,
} from '../data';

export default class AreaNumberBTModule extends BTModule {
  public instr: AreaNumberSymbol;

  public constructor(instr: AreaNumberSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile === BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    const visited = IntArray2D.create(grid.width, grid.height);

    const sameTileQueue: Position[] = [{ x: this.instr.x, y: this.instr.y }];
    const usableTileQueue: Position[] = [];

    let sameCellCount = 0;
    let usableCellCount = 0;

    visited.set(this.instr.x, this.instr.y, 1);

    // Count same tile
    while (sameTileQueue.length > 0) {
      const curPos = sameTileQueue.pop()!;
      sameCellCount += 1;

      for (const edge of grid.getEdges(curPos)) {
        if (visited.get(edge.x, edge.y)) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty) {
          usableTileQueue.push(edge);
        } else if (edgeTile === tile) {
          sameTileQueue.push(edge);
        }

        visited.set(edge.x, edge.y, 1);
      }
    }

    if (sameCellCount > this.instr.number) return false;

    const ratings: Rating[] = [];

    for (const pos of usableTileQueue) {
      ratings.push({ pos, score: 1 });
    }

    // Count usable tile
    while (usableTileQueue.length > 0) {
      const curPos = usableTileQueue.pop()!;
      usableCellCount += 1;

      if (sameCellCount + usableCellCount >= this.instr.number)
        return { tilesNeedCheck: null, ratings };

      for (const edge of grid.getEdges(curPos)) {
        if (visited.get(edge.x, edge.y)) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);

        if (edgeTile === BTTile.Empty || edgeTile === tile) {
          usableTileQueue.push(edge);
          visited.set(edge.x, edge.y, 1);
        }
      }
    }

    return sameCellCount + usableCellCount >= this.instr.number
      ? { tilesNeedCheck: null, ratings }
      : false;
  }

  public checkLocal(
    grid: BTGridData,
    positions: Position[]
  ): CheckResult | boolean {
    // TODO: Also skip checks if color is the same and within the zone but not directly affecting

    // Skip checks if it is too far to affect the symbol
    if (
      positions.every(
        pos =>
          Math.abs(pos.x - this.instr.x) + Math.abs(pos.y - this.instr.y) >
          this.instr.number
      )
    )
      return true;

    return this.checkGlobal(grid);
  }
}
