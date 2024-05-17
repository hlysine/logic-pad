import UniqueShapeRule from '../../../rules/uniqueShapeRule';
import { BTGridData, CheckResult } from '../data';
import RegionShapeBTModule from './regionShape';

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
