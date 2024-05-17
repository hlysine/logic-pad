import { Orientation, Position } from '../../../primitives';
import LotusSymbol from '../../../symbols/lotusSymbol';
import { BTGridData } from '../data';
import DirectionLinkerBTModule from './directionLinker';

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
}
