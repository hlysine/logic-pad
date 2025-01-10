import { Position } from '../../../primitives.js';
import BanPatternRule from '../../../rules/banPatternRule.js';
import BTModule, {
  BTColor,
  BTGridData,
  BTTile,
  CheckResult,
  Rating,
  colorToBTTile,
} from '../data.js';

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
    const ratings: Rating[] = [];

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

          // We add a tile into ratings if that tile is the only mismatched tile
          let match = true;
          let mismatchPos: Position | null = null;
          for (const element of shape.elements) {
            const eleTile = grid.getTile(
              element.x - origin.x + x,
              element.y - origin.y + y
            );
            if (eleTile === BTTile.Empty) {
              if (match) {
                match = false;

                mismatchPos = {
                  x: element.x - origin.x + x,
                  y: element.y - origin.y + y,
                };
              } else {
                mismatchPos = null;
                break;
              }
            } else if (eleTile !== colorToBTTile(element.color)) {
              match = false;
              mismatchPos = null;
              break;
            }
          }

          if (match) return false;
          if (mismatchPos) ratings.push({ pos: mismatchPos, score: 10000 });
        }
      }
    }

    // TODO: Redesign API - This is not the best!
    // Ratings refresh on every backtrack! Ratings should be appended on the previous result instead of over-writing!
    return { tilesNeedCheck: null, ratings };
  }
}
