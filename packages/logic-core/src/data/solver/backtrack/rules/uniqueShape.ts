import UniqueShapeRule from '../../../rules/uniqueShapeRule.js';
import { BTGridData, CheckResult } from '../data.js';
import RegionShapeBTModule from './regionShape.js';

export default class UniqueShapeBTModule extends RegionShapeBTModule {
  public instr: UniqueShapeRule;

  public constructor(instr: UniqueShapeRule) {
    super(instr);
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const regions = this.getShapeRegions(grid);

    return regions.every(r => r.count === 1)
      ? { tilesNeedCheck: null, ratings: null }
      : false;
  }
}
