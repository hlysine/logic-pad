import {
  GrilopsContext,
  Point,
  SymbolGrid,
  SymbolSet,
  getRectangleLattice,
} from 'grilops';
import GridData from '../../grid';
import SolverBase from '../solverBase';
import { allZ3Modules } from './modules';
import { Color } from '../../primitives';
import { Model, init } from 'z3-solver';
import Z3SolverContext from './z3SolverContext';
import { array } from '../../helper';

export default class Z3Solver extends SolverBase {
  public readonly id = 'z3';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    console.log('Initializing dependencies');

    const { Z3, Context } = await init();
    const z3Ctx = Context('main');

    const grilopsCtx: GrilopsContext<'main'> = {
      z3: Z3,
      context: z3Ctx,
    };

    const symbolSet = new SymbolSet([
      ['empty', ' '],
      [Color.Gray, '.'],
      [Color.Dark, 'B'],
      [Color.Light, 'W'],
    ]);
    const lattice = getRectangleLattice(grid.height, grid.width);
    const symbolGrid = new SymbolGrid(grilopsCtx, lattice, symbolSet);

    const ctx = new Z3SolverContext(symbolGrid);

    console.log('Encoding constraints');

    grid.forEach((tile, x, y) => {
      // encode all empty tiles
      if (!tile.exists)
        ctx.solver.add(
          symbolGrid.cellAt(new Point(y, x)).eq(symbolSet.indices.empty)
        );
      // encode all given tiles
      else if (tile.fixed)
        ctx.solver.add(
          symbolGrid.cellAt(new Point(y, x)).eq(symbolSet.indices[tile.color])
        );
      // make sure tiles are filled
      else {
        ctx.solver.add(
          symbolGrid.cellAt(new Point(y, x)).neq(symbolSet.indices.empty)
        );
        ctx.solver.add(
          symbolGrid.cellAt(new Point(y, x)).neq(symbolSet.indices[Color.Gray])
        );
      }
    });

    // encode connections
    grid.connections.edges.forEach(edge => {
      ctx.solver.add(
        symbolGrid
          .cellAt(new Point(edge.y1, edge.x1))
          .eq(symbolGrid.cellAt(new Point(edge.y2, edge.x2)))
      );
    });

    [...new Set(grid.rules.map(r => r.id))].forEach(ruleId =>
      allZ3Modules.get(ruleId)!.encode(grid, ctx)
    );

    [...grid.symbols.keys()].forEach(symbolId =>
      allZ3Modules.get(symbolId)!.encode(grid, ctx)
    );

    const decodeResult = (model: Model) => {
      const tiles = array(grid.width, grid.height, (x, y) => {
        const tile = grid.getTile(x, y);
        if (!tile.exists || tile.fixed) return tile;
        const color = Number(model.eval(symbolGrid.cellAt(new Point(y, x))));
        return tile.withColor(symbolSet.symbols.get(color)!.name as Color);
      });
      return grid.withTiles(tiles);
    };

    console.log('Solving');

    console.time('Solve time');
    const result = await symbolGrid.solve();
    console.timeEnd('Solve time');

    if (!result) {
      yield null;
      return;
    }

    const model = ctx.solver.model();

    yield decodeResult(model);

    console.log('Checking uniqueness');

    console.time('Uniqueness time');
    const result2 = await symbolGrid.isUnique();
    console.timeEnd('Uniqueness time');

    if (result2) {
      yield null;
      return;
    }

    const model2 = ctx.solver.model();
    yield decodeResult(model2);
  }

  public isInstructionSupported(instructionId: string): boolean {
    return allZ3Modules.has(instructionId);
  }
}
