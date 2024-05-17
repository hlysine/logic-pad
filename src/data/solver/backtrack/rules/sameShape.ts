import SameShapeRule from '../../../rules/sameShapeRule';
import { BTGridData, CheckResult } from '../data';
import RegionShapeBTModule from './regionShape';

export default class SameShapeBTModule extends RegionShapeBTModule {
  public instr: SameShapeRule;

  public constructor(instr: SameShapeRule) {
    super(instr);
    this.instr = instr;
  }

  public checkGlobal(grid: BTGridData): CheckResult | false {
    const regions = this.getShapeRegions(grid);

    return regions.length <= 1
      ? { tilesNeedCheck: null, ratings: null }
      : false;
  }
}
