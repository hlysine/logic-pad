import { Solver, Optimize } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import RegionAreaRule, {
  instance as regionAreaInstance,
} from '../../../rules/regionAreaRule';
import { Color } from '../../../primitives';

export default class RegionAreaModule extends Z3Module {
  public readonly id = regionAreaInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const rules = grid.rules.filter(
      rule => rule.id === this.id
    ) as RegionAreaRule[];

    // optimizations
    if (rules.length === 0) {
      return;
    }

    const colorMap = new Map<Color, number>();
    for (const rule of rules) {
      if (colorMap.has(rule.color)) {
        if (colorMap.get(rule.color)! !== rule.size) {
          ctx.solver.add(ctx.ctx.Bool.val(false));
          return;
        }
      } else {
        colorMap.set(rule.color, rule.size);
      }
    }

    for (const [color, count] of colorMap.entries()) {
      if (count < 0 || count > grid.getColorCount(color).max) {
        ctx.solver.add(ctx.ctx.Bool.val(false));
        return;
      }
    }

    // encode for real
    const rc = ctx.regionConstrainer;
    for (const [color, count] of colorMap.entries()) {
      for (const [p, cell] of ctx.grid.grid.entries()) {
        ctx.solver.add(
          cell
            .eq(ctx.symbolSet.indices[color])
            .implies(rc.regionSizeGrid.get(p)!.eq(count))
        );
      }
    }
  }
}

export const instance = new RegionAreaModule();
