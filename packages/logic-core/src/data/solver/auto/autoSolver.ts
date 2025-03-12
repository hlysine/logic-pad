import GridData from '../../grid.js';
import { allSolvers } from '../allSolvers.js';
import Solver from '../solver.js';

export default class AutoSolver extends Solver {
  public readonly id = 'auto';

  public readonly author = 'various contributors';

  public readonly description =
    'Automatically select the fastest solver based on supported instructions and environment.';

  public readonly supportsCancellation = true;

  private gridSupportCache: [GridData, Solver | null] | null = null;

  public isGridSupported(grid: GridData): boolean {
    for (const solver of allSolvers.values()) {
      if (solver.id === this.id) continue;
      if (solver.isGridSupported(grid)) {
        this.gridSupportCache = [grid, solver];
        return true;
      }
    }
    this.gridSupportCache = [grid, null];
    return false;
  }

  public isInstructionSupported(instructionId: string): boolean {
    for (const solver of allSolvers.values()) {
      if (solver.id === this.id) continue;
      if (solver.isInstructionSupported(instructionId)) {
        return true;
      }
    }
    return false;
  }

  protected async isEnvironmentSupported(): Promise<boolean> {
    for (const solver of allSolvers.values()) {
      if (solver.id === this.id) continue;
      if (await solver.environmentCheck.value) {
        return true;
      }
    }
    return false;
  }

  public solve(
    grid: GridData,
    abortSignal?: AbortSignal | undefined
  ): AsyncGenerator<GridData | null> {
    let targetSolver: Solver | null = null;
    if (this.gridSupportCache && this.gridSupportCache[0] === grid) {
      targetSolver = this.gridSupportCache[1];
    } else {
      for (const solver of allSolvers.values()) {
        if (solver.id === this.id) continue;
        if (solver.isGridSupported(grid)) {
          targetSolver = solver;
        }
      }
    }
    if (targetSolver) {
      return targetSolver.solve(grid, abortSignal);
    }
    throw new Error('No solver supports the given grid');
  }
}
