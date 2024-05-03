import { Solver, Optimize, Arith } from 'z3-solver';
import GridData from '../../../grid';
import Z3SolverContext from '../z3SolverContext';
import Z3Module from './z3Module';
import DartSymbol, {
  instance as dartInstance,
} from '../../../symbols/dartSymbol';
import { Point, RectangularLattice, reduceCells } from 'grilops';
import { Color, Orientation } from '../../../primitives';
import { move } from '../../../helper';

function convertDirection(direction: Orientation) {
  switch (direction) {
    case Orientation.Up:
      return RectangularLattice.VERTEX_DIRECTIONS.N;
    case Orientation.Down:
      return RectangularLattice.VERTEX_DIRECTIONS.S;
    case Orientation.Left:
      return RectangularLattice.VERTEX_DIRECTIONS.W;
    case Orientation.Right:
      return RectangularLattice.VERTEX_DIRECTIONS.E;
    case Orientation.DownLeft:
      return RectangularLattice.VERTEX_DIRECTIONS.SW;
    case Orientation.DownRight:
      return RectangularLattice.VERTEX_DIRECTIONS.SE;
    case Orientation.UpLeft:
      return RectangularLattice.VERTEX_DIRECTIONS.NW;
    case Orientation.UpRight:
      return RectangularLattice.VERTEX_DIRECTIONS.NE;
  }
}

export default class DartModule extends Z3Module {
  public readonly id = dartInstance.id;

  public encode<Name extends string>(
    grid: GridData,
    ctx: Z3SolverContext<Name, Solver<Name> | Optimize<Name>>
  ): void {
    const symbols = grid.symbols.get(this.id) as DartSymbol[] | undefined;

    // optimizations
    if (!symbols || symbols.length === 0) {
      return;
    }
    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);
      const startPos = move({ x, y }, symbol.orientation);
      const tile = grid.getTile(x, y);
      if (tile.fixed) {
        let min = 0;
        let unknown = 0;
        grid.iterateDirectionAll(
          startPos,
          symbol.orientation,
          () => true,
          cell => {
            if (!cell.exists) return;
            if (
              cell.fixed &&
              cell.color !== tile.color &&
              cell.color !== Color.Gray
            )
              min++;
            if (!cell.fixed) unknown++;
          }
        );
        if (min > symbol.number || min + unknown < symbol.number) {
          ctx.solver.add(ctx.ctx.Bool.val(false));
          return;
        }
      } else {
        let count = 0;
        grid.iterateDirectionAll(
          startPos,
          symbol.orientation,
          () => true,
          cell => {
            if (!cell.exists) return;
            count++;
          }
        );
        if (count < symbol.number) {
          ctx.solver.add(ctx.ctx.Bool.val(false));
          return;
        }
      }
    }

    // encode for real
    for (const symbol of symbols) {
      const x = Math.floor(symbol.x);
      const y = Math.floor(symbol.y);
      const startPos = move({ x, y }, symbol.orientation);
      const origin = ctx.grid.cellAt(new Point(y, x));

      ctx.solver.add(
        reduceCells<Name, Arith<Name>>(
          ctx.grid.ctx,
          ctx.grid,
          new Point(startPos.y, startPos.x),
          convertDirection(symbol.orientation),
          ctx.ctx.Int.val(0),
          (acc, cell) =>
            ctx.ctx.If(
              ctx.ctx.Or(
                cell.eq(origin),
                cell.eq(ctx.symbolSet.indices.empty),
                cell.eq(ctx.symbolSet.indices[Color.Gray])
              ),
              acc,
              acc.add(1)
            )
        ).eq(symbol.number)
      );
    }
  }
}

export const instance = new DartModule();
