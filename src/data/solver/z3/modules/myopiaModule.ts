import { Solver, Optimize, Arith } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import MyopiaSymbol, {
  instance as myopiaInstance,
} from '../../../symbols/myopiaSymbol';
import { Point, reduceCells } from 'grilops';
import { DIRECTIONS, ORIENTATIONS } from '../../../primitives';
import { convertDirection } from '../utils';
import { move } from '../../../dataHelper';

export default class MyopiaModule extends Z3Module {
  public readonly id = myopiaInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const symbols = grid.symbols.get(this.id) as MyopiaSymbol[] | undefined;

    // optimizations
    if (!symbols || symbols.length === 0) {
      return;
    }

    // encode for real
    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);
      const startPos = new Point(y, x);
      const origin = ctx.grid.cellAt(new Point(y, x));
      const pointedTerms: Arith<Name>[] = [];
      const otherTerms: Arith<Name>[] = [];
      ORIENTATIONS.filter(d => symbol.directions[d]).forEach(direction => {
        pointedTerms.push(
          reduceCells<Name, Arith<Name>>(
            ctx.grid.ctx,
            ctx.grid,
            startPos,
            convertDirection(direction),
            ctx.ctx.Int.val(0),
            (acc, cell, p) => {
              const nextPos = move({ x: p.x, y: p.y }, direction);
              if (grid.isPositionValid(nextPos.x, nextPos.y)) {
                return ctx.ctx.If(cell.eq(origin), acc.add(1), acc);
              } else {
                return ctx.ctx.If(
                  cell.eq(origin),
                  acc.add(Number.MAX_SAFE_INTEGER),
                  acc
                );
              }
            },
            (_, cell) => cell.neq(origin)
          )
        );
      });
      (symbol.containsDiagonal ? ORIENTATIONS : DIRECTIONS)
        .filter(d => !symbol.directions[d])
        .forEach(direction => {
          otherTerms.push(
            reduceCells<Name, Arith<Name>>(
              ctx.grid.ctx,
              ctx.grid,
              startPos,
              convertDirection(direction),
              ctx.ctx.Int.val(0),
              (acc, cell, p) => {
                const nextPos = move({ x: p.x, y: p.y }, direction);
                if (grid.isPositionValid(nextPos.x, nextPos.y)) {
                  return ctx.ctx.If(cell.eq(origin), acc.add(1), acc);
                } else {
                  return ctx.ctx.If(
                    cell.eq(origin),
                    acc.add(Number.MAX_SAFE_INTEGER),
                    acc
                  );
                }
              },
              (_, cell) => cell.neq(origin)
            )
          );
        });

      for (let i = 1; i < pointedTerms.length; i++) {
        ctx.solver.add(pointedTerms[i].eq(pointedTerms[0]));
      }
      for (const otherTerm of otherTerms) {
        ctx.solver.add(otherTerm.gt(pointedTerms[0]));
      }
    }
  }
}

export const instance = new MyopiaModule();
