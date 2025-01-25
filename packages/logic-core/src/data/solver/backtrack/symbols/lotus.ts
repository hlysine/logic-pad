import { Orientation, Position } from '../../../primitives.js';
import LotusSymbol from '../../../symbols/lotusSymbol.js';
import { BTGridData, BTTile, CheckResult } from '../data.js';
import DirectionLinkerBTModule from './directionLinker.js';

export default class LotusBTModule extends DirectionLinkerBTModule {
  public instr: LotusSymbol;

  public constructor(instr: LotusSymbol) {
    super(instr);
    this.instr = instr;
  }

  // Translate a position in relative to a lotus symbol
  protected movePos(grid: BTGridData, x: number, y: number): Position | null {
    const symbol = this.instr;

    let pos!: Position;
    if (
      symbol.orientation === Orientation.Up ||
      symbol.orientation === Orientation.Down
    ) {
      pos = { x: 2 * symbol.x - x, y };
    } else if (
      symbol.orientation === Orientation.UpRight ||
      symbol.orientation === Orientation.DownLeft
    ) {
      pos = { x: symbol.y + symbol.x - y, y: symbol.y + symbol.x - x };
    } else if (
      symbol.orientation === Orientation.Right ||
      symbol.orientation === Orientation.Left
    ) {
      pos = { x, y: 2 * symbol.y - y };
    } else if (
      symbol.orientation === Orientation.DownRight ||
      symbol.orientation === Orientation.UpLeft
    ) {
      pos = { x: symbol.x - symbol.y + y, y: symbol.y - symbol.x + x };
    }

    return grid.isInBound(pos.x, pos.y) ? pos : null;
  }

  private getTileSafe(grid: BTGridData, x: number, y: number): BTTile {
    return grid.isInBound(x, y) ? grid.getTile(x, y) : BTTile.NonExist;
  }

  public checkGlobal(grid: BTGridData): false | CheckResult {
    if (
      this.instr.orientation === Orientation.DownLeft ||
      this.instr.orientation === Orientation.DownRight ||
      this.instr.orientation === Orientation.UpLeft ||
      this.instr.orientation === Orientation.UpRight
    ) {
      if (this.instr.x % 1 === 0 || this.instr.y % 1 === 0)
        if (this.instr.x % 1 !== 0 || this.instr.y % 1 !== 0) {
          if (
            this.getTileSafe(
              grid,
              Math.floor(this.instr.x),
              Math.floor(this.instr.y)
            ) === BTTile.NonExist &&
            this.getTileSafe(
              grid,
              Math.ceil(this.instr.x),
              Math.ceil(this.instr.y)
            ) === BTTile.NonExist &&
            this.getTileSafe(
              grid,
              Math.floor(this.instr.x),
              Math.ceil(this.instr.y)
            ) === BTTile.NonExist &&
            this.getTileSafe(
              grid,
              Math.ceil(this.instr.x),
              Math.floor(this.instr.y)
            ) === BTTile.NonExist
          ) {
            return { tilesNeedCheck: null, ratings: null };
          } else {
            return false;
          }
        }
    }
    return super.checkGlobal(grid);
  }
}
