import { Position } from '../../../primitives';
import ViewpointSymbol from '../../../symbols/viewpointSymbol';
import BTModule, {
  BTColor,
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  Rating,
  createOneTileResult,
  getOppositeColor,
} from '../data';

export default class ViewpointBTModule extends BTModule {
  public instr: ViewpointSymbol;

  public constructor(instr: ViewpointSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile == BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings: Rating[] = [];

    let completed = 1;
    let possible = 1;

    const traverse = (dirX: number, dirY: number): boolean => {
      let connected = true;
      let x = this.instr.x + dirX;
      let y = this.instr.y + dirY;

      while (grid.isInBound(x, y)) {
        const curTile = grid.getTile(x, y);

        if (connected) {
          if (tile == curTile) {
            completed += 1;
            if (completed > this.instr.number) return true;
          } else {
            if (curTile == BTTile.Empty) {
              tilesNeedCheck.set(x, y, 1);
              ratings.push({ pos: { x, y }, score: 1 });
            }
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
    };

    if (traverse(-1, 0) || traverse(1, 0) || traverse(0, -1) || traverse(0, 1))
      return false;

    if (possible < this.instr.number) return false;

    return { tilesNeedCheck, ratings };
  }

  public checkLocal(grid: BTGridData, _: Position[]): CheckResult | false {
    return this.checkGlobal(grid);
  }
}
