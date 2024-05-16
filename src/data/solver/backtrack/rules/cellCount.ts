import CellCountRule from '../../../rules/cellCountRule';
import BTModule, {
  BTGridData,
  BTTile,
  CheckResult,
  colorToBTTile,
} from '../data';

export default class CellCountBTModule extends BTModule {
  public instr: CellCountRule;

  public constructor(instr: CellCountRule) {
    super();
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const color = colorToBTTile(this.instr.color);

    let colored = 0;
    let possible = 0;

    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const tile = grid.getTile(x, y);

        if (tile === color) colored += 1;
        else if (tile === BTTile.Empty) possible += 1;
      }
    }

    if (colored > this.instr.count || colored + possible < this.instr.count)
      return false;

    return { tilesNeedCheck: null, ratings: null };
  }
}
