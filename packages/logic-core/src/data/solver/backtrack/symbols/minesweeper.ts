import MinesweeperSymbol from '../../../symbols/minesweeperSymbol.js';
import BTModule, {
  BTColor,
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  createOneTileResult,
  getOppositeColor,
} from '../data.js';

export default class MinesweeperBTModule extends BTModule {
  public instr: MinesweeperSymbol;

  private cachedCheckResult?: CheckResult;

  public constructor(instr: MinesweeperSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile === BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    let gray = 0;
    let opposite = 0;
    for (let y = this.instr.y - 1; y <= this.instr.y + 1; y++) {
      for (let x = this.instr.x - 1; x <= this.instr.x + 1; x++) {
        if (!grid.isInBound(x, y) || (x === this.instr.x && y === this.instr.y))
          continue;

        const checkTile = grid.getTile(x, y);

        if (checkTile === BTTile.Empty) gray++;
        else if (checkTile === getOppositeColor(tile as BTColor)) opposite++;
      }
    }

    if (opposite > this.instr.number || opposite + gray < this.instr.number)
      return false;

    this.cachedCheckResult ??= this.buildCheckAndRating(grid);

    return this.cachedCheckResult;
  }

  private buildCheckAndRating(grid: BTGridData): CheckResult {
    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings = [];

    for (let y = this.instr.y - 1; y <= this.instr.y + 1; y++) {
      for (let x = this.instr.x - 1; x <= this.instr.x + 1; x++) {
        if (!grid.isInBound(x, y) || (x === this.instr.x && y === this.instr.y))
          continue;

        tilesNeedCheck.set(x, y, 1);
        ratings.push({ pos: { x, y }, score: 1 });
      }
    }

    return { tilesNeedCheck, ratings };
  }
}
