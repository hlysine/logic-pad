import { Position } from '../../../primitives.js';
import DirectionLinkerSymbol from '../../../symbols/directionLinkerSymbol.js';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  Rating,
  createOneTileResult,
} from '../data.js';

export default abstract class DirectionLinkerBTModule extends BTModule {
  public instr: DirectionLinkerSymbol;

  public constructor(instr: DirectionLinkerSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const thisX = Math.floor(this.instr.x);
    const thisY = Math.floor(this.instr.y);

    const tile = grid.getTile(thisX, thisY);

    if (tile === BTTile.Empty)
      return createOneTileResult(grid, { x: thisX, y: thisY });

    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings: Rating[] = [];

    const queue: Position[] = [{ x: thisX, y: thisY }];
    const visited = IntArray2D.create(grid.width, grid.height);

    // Visit all connected tiles
    while (queue.length > 0) {
      const curPos = queue.pop()!;

      if (visited.get(curPos.x, curPos.y)) continue;
      visited.set(curPos.x, curPos.y, 1);

      const oppoPos = this.movePos(grid, curPos.x, curPos.y);
      if (oppoPos === null) return false;

      const oppoTile = grid.getTile(oppoPos.x, oppoPos.y);
      if (!(oppoTile === BTTile.Empty || oppoTile === tile)) return false;

      for (const edge of grid.getEdges(curPos)) {
        if (visited.get(edge.x, edge.y)) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);
        if (edgeTile === BTTile.Empty) {
          tilesNeedCheck.set(edge.x, edge.y, 1);
          ratings.push({ pos: edge, score: 1 });
        } else if (edgeTile === tile) {
          queue.push(edge);
        }
      }
    }

    return { tilesNeedCheck, ratings };
  }

  protected abstract movePos(
    grid: BTGridData,
    x: number,
    y: number
  ): Position | null;
}
