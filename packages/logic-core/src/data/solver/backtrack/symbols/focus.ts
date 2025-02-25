import FocusSymbol from '../../../symbols/focusSymbol.js';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  IntArray2D,
  createOneTileResult,
} from '../data.js';

export default class FocusBTModule extends BTModule {
  public instr: FocusSymbol;

  private cachedCheckResult?: CheckResult;

  public constructor(instr: FocusSymbol) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const tile = grid.getTile(this.instr.x, this.instr.y);

    if (tile === BTTile.Empty)
      return createOneTileResult(grid, { x: this.instr.x, y: this.instr.y });

    let gray = 0;
    let same = 0;
    for (let y = this.instr.y - 1; y <= this.instr.y + 1; y++) {
      for (let x = this.instr.x - 1; x <= this.instr.x + 1; x++) {
        if (y !== this.instr.y && x !== this.instr.x) continue;
        if (!grid.isInBound(x, y) || (x === this.instr.x && y === this.instr.y))
          continue;

        const checkTile = grid.getTile(x, y);

        if (checkTile === BTTile.Empty) gray++;
        else if (checkTile === tile) same++;
      }
    }

    if (same > this.instr.number || same + gray < this.instr.number)
      return false;

    if (!this.cachedCheckResult)
      this.cachedCheckResult = this.buildCheckAndRating(grid);

    return this.cachedCheckResult;
  }

  private buildCheckAndRating(grid: BTGridData): CheckResult {
    const tilesNeedCheck = IntArray2D.create(grid.width, grid.height);
    const ratings = [];

    for (let y = this.instr.y - 1; y <= this.instr.y + 1; y++) {
      for (let x = this.instr.x - 1; x <= this.instr.x + 1; x++) {
        if (y !== this.instr.y && x !== this.instr.x) continue;
        if (!grid.isInBound(x, y) || (x === this.instr.x && y === this.instr.y))
          continue;

        tilesNeedCheck.set(x, y, 1);
        ratings.push({ pos: { x, y }, score: 1 });
      }
    }

    return { tilesNeedCheck, ratings };
  }
}
