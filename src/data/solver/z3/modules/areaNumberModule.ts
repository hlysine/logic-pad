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
    if (!symbols || symbols.length === 0) {
      return;
    }

    const rc = ctx.regionConstrainer;

    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);

      ctx.solver.add(rc.regionSizeGrid.get(new Point(y, x))!.eq(symbol.number));
    }
  }
}

export const instance = new AreaNumberModule();
