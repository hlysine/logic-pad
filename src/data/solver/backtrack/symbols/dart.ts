import DartSymbol from '../../../symbols/dartSymbol';
import { move } from '../../../helper';
import { Position } from '../../../primitives';
import BTModule, {
  BTColor,
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  createOneTileResult,
  getOppositeColor,
} from '../data';

export default class DartBTModule extends BTModule {
  public instr: DartSymbol;

  private cachedCheckResult?: CheckResult;

  public constructor(instr: DartSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile == BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    let pos = move(
      { x: this.instr.x, y: this.instr.y },
      this.instr.orientation
    );

    let completed = 0;
    let empty = 0;

    while (grid.isInBound(pos.x, pos.y)) {
      // Opposite tiles
      if (grid.getTile(pos.x, pos.y) == getOppositeColor(tile as BTColor)) {
        completed += 1;
        if (completed > this.instr.number) return false;
      }

      // Empty tiles
      if (grid.getTile(pos.x, pos.y) == BTTile.Empty) empty += 1;

      pos = move(pos, this.instr.orientation);
    }

    if (completed + empty < this.instr.number) return false;

    if (!this.cachedCheckResult)
      this.cachedCheckResult = this.buildCheckAndRating(grid);

    return this.cachedCheckResult;
  }

  public checkLocal(grid: BTGridData, _: Position[]): CheckResult | false {
    return this.checkGlobal(grid);
  }

  private buildCheckAndRating(grid: BTGridData): CheckResult {
    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings = [];

    let pos = { x: this.instr.x, y: this.instr.y };

    while (grid.isInBound(pos.x, pos.y)) {
      if (grid.getTile(pos.x, pos.y) == BTTile.Empty) {
        tilesNeedCheck.set(pos.x, pos.y, 1);
        ratings.push({ pos, score: 1 });
      }

      pos = move(pos, this.instr.orientation);
    }

    return { tilesNeedCheck, ratings };
  }
}
