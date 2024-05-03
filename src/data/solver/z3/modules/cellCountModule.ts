import { Solver, Optimize, Arith } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import { Point } from 'grilops';
import CellCountRule, {
  instance as cellCountInstance,
} from '../../../rules/cellCountRule';
import { Color } from '../../../primitives';

export default class CellCountModule extends Z3Module {
  public readonly id = cellCountInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const rules = grid.rules.filter(
      rule => rule.id === this.id
    ) as CellCountRule[];

    // optimizations to try to simplify the encoding
    if (rules.length === 0) {
      return;
    }

    const colorMap = new Map<Color, number>();
    for (const rule of rules) {
      if (colorMap.has(rule.color)) {
        if (colorMap.get(rule.color)! !== rule.count) {
          ctx.solver.add(ctx.ctx.Bool.val(false));
          return;
        }
      } else {
        colorMap.set(rule.color, rule.count);
      }
    }

    for (const [color, count] of colorMap.entries()) {
      let min = 0;
      let max = grid.width * grid.height;
      if (min > count || max < count) {
        ctx.solver.add(ctx.ctx.Bool.val(false));
        return;
      }
      grid.forEach(tile => {
        if (!tile.exists || (tile.fixed && tile.color !== color)) {
          max--;
        }
        if (tile.exists && tile.fixed && tile.color === color) {
          min++;
        }
      });
      if (min > count || max < count) {
        ctx.solver.add(ctx.ctx.Bool.val(false));
        return;
      }
    }

    if (colorMap.has(Color.Light) && colorMap.has(Color.Dark)) {
      let total = 0;
      grid.forEach(tile => {
        if (tile.exists) total++;
      });
      if (colorMap.get(Color.Light)! + colorMap.get(Color.Dark)! !== total) {
        ctx.solver.add(ctx.ctx.Bool.val(false));
        return;
      }
    }

    // encode for real
    for (const [color, count] of colorMap.entries()) {
      const sumTerms: Arith<Name>[] = [];
      grid.forEach((tile, x, y) => {
        if (tile.exists) {
          sumTerms.push(
            ctx.ctx.If(
              ctx.grid.cellAt(new Point(y, x)).eq(ctx.symbolSet.indices[color]),
              1,
              0
            )
          );
        }
      });
      ctx.solver.add(ctx.ctx.Sum(sumTerms[0], ...sumTerms.slice(1)).eq(count));
    }
  }
}

export const instance = new CellCountModule();
