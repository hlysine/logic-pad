import { Position } from '../../../primitives.js';
import DirectionLinkerSymbol from '../../../symbols/directionLinkerSymbol.js';
import BTModule, {
  BTColor,
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  Rating,
} from '../data.js';

export default abstract class DirectionLinkerBTModule extends BTModule {
  public instr: DirectionLinkerSymbol;

  public constructor(instr: DirectionLinkerSymbol) {
    super();
    this.instr = instr;
  }

  private initialPositions: Position[] | null = null;

  private getInitialPositions(): Position[] {
    if (this.instr.x % 1 !== 0 && this.instr.y % 1 !== 0)
      return [
        { x: Math.floor(this.instr.x), y: Math.floor(this.instr.y) },
        { x: Math.ceil(this.instr.x), y: Math.ceil(this.instr.y) },
        { x: Math.floor(this.instr.x), y: Math.ceil(this.instr.y) },
        { x: Math.ceil(this.instr.x), y: Math.floor(this.instr.y) },
      ];
    else if (this.instr.x % 1 !== 0)
      return [
        { x: Math.floor(this.instr.x), y: this.instr.y },
        { x: Math.ceil(this.instr.x), y: this.instr.y },
      ];
    else if (this.instr.y % 1 !== 0)
      return [
        { x: this.instr.x, y: Math.floor(this.instr.y) },
        { x: this.instr.x, y: Math.ceil(this.instr.y) },
      ];
    else return [{ x: this.instr.x, y: this.instr.y }];
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    this.initialPositions ??= this.getInitialPositions();

    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings: Rating[] = [];

    for (const pos of this.initialPositions) {
      const tile = grid.isInBound(pos.x, pos.y)
        ? grid.getTile(pos.x, pos.y)
        : BTTile.NonExist;
      if (tile === BTTile.Empty) {
        const oppoPos = this.movePos(grid, pos.x, pos.y);
        if (
          oppoPos === null ||
          grid.getTile(oppoPos.x, oppoPos.y) === BTTile.NonExist
        )
          return false;
        else {
          if (grid.getTile(oppoPos.x, oppoPos.y) === BTTile.Empty) {
            tilesNeedCheck.set(oppoPos.x, oppoPos.y, 1);
            ratings.push({ pos: oppoPos, score: 1 });
          }
          tilesNeedCheck.set(pos.x, pos.y, 1);
          ratings.push({ pos, score: 1 });
        }
      } else if (tile === BTTile.NonExist) {
        const oppoPos = this.movePos(grid, pos.x, pos.y);
        if (
          oppoPos !== null &&
          grid.getTile(oppoPos.x, oppoPos.y) !== BTTile.NonExist
        ) {
          return false;
        }
      } else {
        const oppoPos = this.movePos(grid, pos.x, pos.y);
        if (oppoPos !== null) {
          const oppoTile = grid.getTile(oppoPos.x, oppoPos.y);
          if (oppoTile === BTTile.Empty) {
            tilesNeedCheck.set(oppoPos.x, oppoPos.y, 1);
            ratings.push({ pos: oppoPos, score: 1 });
          } else if (oppoTile === BTTile.NonExist) return false;
        } else {
          return false;
        }
      }
    }

    if (ratings.length > 0) {
      return { tilesNeedCheck, ratings };
    }

    const queue: { pos: Position; color: BTColor; oppoColor: BTColor }[] =
      this.initialPositions
        .filter(
          pos =>
            grid.isInBound(pos.x, pos.y) &&
            grid.getTile(pos.x, pos.y) !== BTTile.NonExist
        )
        .map(pos => {
          const oppoPos = this.movePos(grid, pos.x, pos.y)!;
          return {
            pos,
            color: grid.getTile(pos.x, pos.y) as BTColor,
            oppoColor: grid.getTile(oppoPos.x, oppoPos.y) as BTColor,
          };
        });
    const visited = IntArray2D.create(grid.width, grid.height);

    // Visit all connected tiles
    while (queue.length > 0) {
      const curPos = queue.pop()!;

      if (visited.get(curPos.pos.x, curPos.pos.y)) continue;
      visited.set(curPos.pos.x, curPos.pos.y, 1);

      const oppoPos = this.movePos(grid, curPos.pos.x, curPos.pos.y);
      if (oppoPos === null) return false;

      const oppoTile = grid.getTile(oppoPos.x, oppoPos.y);
      if (!(oppoTile === BTTile.Empty || oppoTile === curPos.oppoColor))
        return false;

      for (const edge of grid.getEdges(curPos.pos)) {
        if (visited.get(edge.x, edge.y)) continue;

        const edgeTile = grid.getTile(edge.x, edge.y);
        if (edgeTile === BTTile.Empty) {
          tilesNeedCheck.set(edge.x, edge.y, 1);
          ratings.push({ pos: edge, score: 1 });
        } else if (edgeTile === curPos.color) {
          queue.push({
            pos: edge,
            color: curPos.color,
            oppoColor: curPos.oppoColor,
          });
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
