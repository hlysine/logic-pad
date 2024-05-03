import { RegionConstrainer, SymbolGrid } from 'grilops';
import { Optimize, Solver } from 'z3-solver';

export default class Z3SolverContext<
  Name extends string,
  const Core extends Solver<Name> | Optimize<Name> =
    | Solver<Name>
    | Optimize<Name>,
> {
  private _regionConstrainer: RegionConstrainer<Name, Core> | undefined;

  public constructor(public readonly grid: SymbolGrid<Name, Core>) {
    this.grid = grid;
  }

  public get solver(): Core {
    return this.grid.solver;
  }

  public get lattice() {
    return this.grid.lattice;
  }

  public get symbolSet() {
    return this.grid.symbolSet;
  }

  public get ctx() {
    return this.grid.ctx.context;
  }

  public get z3() {
    return this.grid.ctx.z3;
  }

  public get regionConstrainer(): RegionConstrainer<Name, Core> {
    if (!this._regionConstrainer) {
      this._regionConstrainer = new RegionConstrainer(
        this.grid.ctx,
        this.lattice,
        this.solver,
        true,
        false,
        1
      );
      for (const p of this.lattice.points) {
        for (const np of this.lattice.edgeSharingNeighbors(this.grid.grid, p)) {
          this.solver.add(
            this.grid
              .cellAt(p)
              .eq(this.grid.cellAt(np.location))
              .eq(
                this._regionConstrainer.regionIdGrid
                  .get(p)!
                  .eq(this._regionConstrainer.regionIdGrid.get(np.location)!)
              )
          );
        }
      }
    }
    return this._regionConstrainer;
  }
}
