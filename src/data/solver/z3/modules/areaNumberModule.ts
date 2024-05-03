import { Solver, Optimize } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import AreaNumberSymbol, {
  instance as areaNumberInstance,
} from '../../../symbols/areaNumberSymbol';
import { Point } from 'grilops';

export default class AreaNumberModule extends Z3Module {
  public readonly id = areaNumberInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const symbols = grid.symbols.get(this.id) as AreaNumberSymbol[] | undefined;

    // optimizations
    if (!symbols || symbols.length === 0) {
      return;
    }

    for (const symbol of symbols) {
      if (symbol.number < 1) {
        ctx.solver.add(ctx.ctx.Bool.val(false));
        return;
      }
      const { min, max } = grid.getColorCount(
        grid.getTile(symbol.x, symbol.y).color
      );
      if (min > symbol.number || max < symbol.number) {
        ctx.solver.add(ctx.ctx.Bool.val(false));
        return;
      }
    }

    // encode for real
    const rc = ctx.regionConstrainer;

    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);

      ctx.solver.add(rc.regionSizeGrid.get(new Point(y, x))!.eq(symbol.number));
    }
  }
}

export const instance = new AreaNumberModule();
