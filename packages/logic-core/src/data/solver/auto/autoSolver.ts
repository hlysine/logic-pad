import GridData from '../../grid.js';
import { Color, State } from '../../primitives.js';
import { instance as lyingSymbolInstance } from '../../rules/lyingSymbolRule.js';
import { instance as offByXInstance } from '../../rules/offByXRule.js';
import { instance as lotusInstance } from '../../symbols/lotusSymbol.js';
import { instance as galaxyInstance } from '../../symbols/galaxySymbol.js';
import { instance as wrapAroundInstance } from '../../rules/wrapAroundRule.js';
import { allSolvers } from '../allSolvers.js';
import Solver from '../solver.js';
import UndercluedRule from '../../rules/undercluedRule.js';
import validateGrid from '../../validate.js';

export default class AutoSolver extends Solver {
  public readonly id = 'auto';

  public readonly author = 'various contributors';

  public readonly description =
    'Automatically select the fastest solver based on supported instructions and environment.';

  public readonly supportsCancellation = true;

  private static readonly nonAdditiveInstructions = new Set([
    offByXInstance.id,
    lyingSymbolInstance.id,
    wrapAroundInstance.id,
  ]);

  public isGridSupported(grid: GridData): boolean {
    for (const solver of allSolvers.values()) {
      if (solver.id === this.id) continue;
      if (solver.isGridSupported(grid)) {
        return true;
      }
    }
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

  private fillSolution(grid: GridData, solution: GridData): GridData {
    return grid.withTiles(tiles => {
      return tiles.map((row, y) =>
        row.map((tile, x) => {
          if (!tile.exists || tile.fixed) return tile;
          const solutionTile = solution.tiles[y][x];
          return tile.withColor(solutionTile.color);
        })
      );
    });
  }

  private fixGrid(grid: GridData): GridData {
    return grid.withTiles(tiles => {
      return tiles.map(row =>
        row.map(tile => {
          if (tile.fixed) return tile;
          return tile.withFixed(tile.color !== Color.Gray);
        })
      );
    });
  }

  private async *solveWithProgress(
    solver: Solver,
    grid: GridData,
    progress: GridData,
    abortSignal?: AbortSignal
  ): AsyncGenerator<GridData | null> {
    for await (const updatedGrid of solver.solve(progress, abortSignal)) {
      if (abortSignal?.aborted) return;
      if (!updatedGrid) return updatedGrid;
      yield this.fillSolution(grid, updatedGrid);
    }
  }

  private async solveOne(
    generator: AsyncGenerator<GridData | null>
  ): Promise<GridData | null> {
    // eslint-disable-next-line no-unreachable-loop
    for await (const grid of generator) {
      return grid;
    }
    return null;
  }

  public async *solve(
    grid: GridData,
    abortSignal?: AbortSignal
  ): AsyncGenerator<GridData | null> {
    if (
      !!grid.findRule(r => AutoSolver.nonAdditiveInstructions.has(r.id)) ||
      !!grid.findSymbol(s => AutoSolver.nonAdditiveInstructions.has(s.id))
    ) {
      for (const solver of allSolvers.values()) {
        if (solver.id === this.id) continue;
        if (solver.isGridSupported(grid)) {
          yield* solver.solve(grid, abortSignal);
          return;
        }
      }
      throw new Error('No solver supports the given grid');
    } else {
      let progressGrid = grid;
      for (const solver of allSolvers.values()) {
        if (solver.id === this.id) continue;
        if (solver.isGridSupported(progressGrid)) {
          yield* this.solveWithProgress(
            solver,
            grid,
            progressGrid,
            abortSignal
          );
          return;
        } else if (solver.isGridSupported(grid)) {
          yield* solver.solve(grid, abortSignal);
          return;
        } else {
          let undercluedGrid = progressGrid
            .withRules(rules =>
              rules.filter(r => solver.isInstructionSupported(r.id))
            )
            .withSymbols(symbols => {
              for (const id of symbols.keys()) {
                if (!solver.isInstructionSupported(id)) symbols.delete(id);
              }
              return symbols;
            })
            .addRule(new UndercluedRule());
          if (!solver.isGridSupported(undercluedGrid)) {
            // special case for solvers that support lotus and galaxy symbols but not dual-color placement
            undercluedGrid = undercluedGrid.withSymbols(symbols => {
              symbols.delete(lotusInstance.id);
              symbols.delete(galaxyInstance.id);
              return symbols;
            });
          }
          if (!solver.isGridSupported(undercluedGrid)) continue;
          const undercluedSolution = await this.solveOne(
            this.solveWithProgress(
              solver,
              progressGrid,
              undercluedGrid,
              abortSignal
            )
          );
          if (undercluedSolution === null) continue;
          if (undercluedSolution.getTileCount(true, false, Color.Gray) === 0) {
            const result = this.fillSolution(grid, undercluedSolution);
            if (validateGrid(result, null).final !== State.Error) {
              yield result;
              yield null;
              return;
            } else {
              yield null;
              return;
            }
          }
          progressGrid = this.fixGrid(undercluedSolution);
        }
      }
      yield this.fillSolution(grid, progressGrid);
    }
  }
}
