import { Solver, Optimize, Arith } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import ViewpointSymbol, {
  instance as viewpointInstance,
} from '../../../symbols/viewpointSymbol';
import { Point, reduceCells } from 'grilops';
import { DIRECTIONS } from '../../../primitives';
import { move } from '../../../dataHelper';
import { convertDirection } from '../utils';

export default class ViewpointModule extends Z3Module {
  public readonly id = viewpointInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const symbols = grid.symbols.get(this.id) as ViewpointSymbol[] | undefined;

    // optimizations
    if (!symbols || symbols.length === 0) {
      return;
    }

    // encode for real
    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);
      const origin = ctx.grid.cellAt(new Point(y, x));
      const sumTerms: Arith<Name>[] = [];
      DIRECTIONS.forEach(direction => {
        const startPos = move({ x, y }, direction);
        sumTerms.push(
          reduceCells<Name, Arith<Name>>(
            ctx.grid.ctx,
            ctx.grid,
            new Point(startPos.y, startPos.x),
            convertDirection(direction),
            ctx.ctx.Int.val(0),
            (acc, cell) => ctx.ctx.If(cell.eq(origin), acc.add(1), acc),
            (_, cell) => cell.neq(origin)
          )
        );
      });
      ctx.solver.add(
        ctx.ctx.Sum(ctx.ctx.Int.val(1), ...sumTerms).eq(symbol.number)
      );
    }
  }
}

export const instance = new ViewpointModule();
