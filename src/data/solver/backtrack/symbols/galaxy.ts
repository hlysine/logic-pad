import { Position } from '../../../primitives';
import GalaxySymbol from '../../../symbols/galaxySymbol';
import { BTGridData } from '../data';
import DirectionLinkerBTModule from './directionLinker';

export default class GalaxyBTModule extends DirectionLinkerBTModule {
  public instr: GalaxySymbol;

  public constructor(instr: GalaxySymbol) {
    super(instr);
    this.instr = instr;
  }

  // Translate a position in relative to a galaxy symbol
  protected movePos(grid: BTGridData, x: number, y: number): Position | null {
    const symbol = this.instr;

    const pos = { x: 2 * symbol.x - x, y: 2 * symbol.y - y };
    return grid.isInBound(pos.x, pos.y) ? pos : null;
  }
}
