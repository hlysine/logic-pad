import GridData from '../../grid';
import Solver from '../solver';
import { Color, State, Position } from '../../primitives';
import TileData from '../../tile';
import validateGrid from '../../validate';
import Instruction from '../../instruction';
import { solveAdvanced, solveUnderclued } from './worker';
import { instance as undercluedInstance } from '../../rules/undercluedRule';

export default class BacktrackAdvancedSolver extends Solver {
  public readonly id = 'backtrack advanced';

  public readonly description =
    'Solves puzzles using backtracking with optimizations (much faster than naive backtrack). Support all rules and symbols except for underclued.';

  public async *solve(grid: GridData): AsyncGenerator<GridData | null> {
    console.log('Solving');

    console.time('Solve time');

    let res: GridData | null;
    if (grid.findRule(rule => rule.id == undercluedInstance.id)) {
      res = solveUnderclued(grid);
    } else {
      res = solveAdvanced(grid);
    }

    console.timeEnd('Solve time');

    console.log(res);

    yield res;
  }

  public isInstructionSupported(instructionId: string): boolean {
    if (instructionId == undercluedInstance.id) return true;

    return super.isInstructionSupported(instructionId);
  }

  // Internal functions

  isValid(grid: GridData): boolean {
    if (validateGrid(grid, null).final == State.Error) return false;

    // for (const rule of grid.rules) {
    //   if (rule.validateGrid(grid).state == State.Error) return false;
    // }

    // for (const symbols of grid.symbols.values()) {
    //   for (const symbol of symbols) {
    //     if (symbol.validateSymbol(grid) == State.Error) return false;
    //   }
    // }

    return true;
  }

  nextCell(grid: GridData): Position | null {
    for (let y = 0; y < grid.height; y++) {
      for (let x = 0; x < grid.width; x++) {
        const tile = grid.getTile(x, y);
        if (tile.exists && tile.color == Color.Gray) return { x, y };
      }
    }
    return null;
  }

  backtrack(grid: GridData): GridData | null {
    if (!this.isValid(grid)) return null;

    // Find the first empty cell
    let pos = this.nextCell(grid);
    if (!pos) return grid;

    // TODO: Use a better method to determine the order

    {
      const newGrid = grid.setTile(
        pos.x,
        pos.y,
        new TileData(true, false, Color.Light)
      );
      const res = this.backtrack(newGrid);
      if (res) return res;
    }

    {
      const newGrid = grid.setTile(
        pos.x,
        pos.y,
        new TileData(true, false, Color.Dark)
      );
      const res = this.backtrack(newGrid);
      if (res) return res;
    }

    return null;
  }
}
