import { Solver, Optimize, Arith } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import ConnectAllRule, {
  instance as connectAllInstance,
} from '../../../rules/connectAllRule';

export default class ConnectAllModule extends Z3Module {
  public readonly id = connectAllInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const rules = grid.rules.filter(
      rule => rule.id === this.id
    ) as ConnectAllRule[];

    // optimizations to try to simplify the encoding
    if (rules.length === 0) {
      return;
    }

    // encode for real
    const rc = ctx.regionConstrainer;
    for (const color of new Set(rules.map(rule => rule.color))) {
      const sumTerms: Arith<Name>[] = [];
      for (const [p, cell] of ctx.grid.grid.entries()) {
        sumTerms.push(
          ctx.ctx.If(
            cell
              .eq(ctx.symbolSet.indices[color])
              .and(rc.parentGrid.get(p)!.eq(1)),
            1,
            0
          )
        );
      }
      ctx.solver.add(ctx.ctx.Sum(sumTerms[0], ...sumTerms.slice(1)).eq(1));
    }
  }
}

export const instance = new ConnectAllModule();
