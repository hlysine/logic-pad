import { Position } from '../../../primitives';
import BanPatternRule from '../../../rules/banPatternRule';
import BTModule, {
  BTColor,
  BTGridData,
  CheckResult,
  colorToBTTile,
} from '../data';

export default class BanPatternBTModule extends BTModule {
  public instr: BanPatternRule;

  public constructor(instr: BanPatternRule) {
    super();
    this.instr = instr;
  }

  public checkGlobal(_: BTGridData): CheckResult | false {
    // TODO: Impl this properly
    return { tilesNeedCheck: null, ratings: null };
  }

  public checkLocal(
    grid: BTGridData,
    positions: Position[]
  ): CheckResult | false {
    // TODO: Do not iterate positions
    for (const { x, y } of positions) {
      const tile = grid.getTile(x, y) as BTColor;

      for (const shape of this.instr.cache) {
        for (const origin of shape.elements) {
          if (colorToBTTile(origin.color) !== tile) continue;
          if (
            origin.x > x ||
            origin.y > y ||
            shape.width - origin.x + x > grid.width ||
            shape.height - origin.y + y > grid.height
          )
            continue;

          if (
            shape.elements.every(
              element =>
                grid.getTile(
                  element.x - origin.x + x,
                  element.y - origin.y + y
                ) === colorToBTTile(element.color)
            )
          )
            return false;
        }
      }
    }

    return { tilesNeedCheck: null, ratings: null };
  }
}
