import GridData from "../grid";
import { Color, GridState, RuleState, State } from "../primitives";
import AreaNumberSymbol from "../symbols/areaNumberSymbol";
import QuestionMarkSign from "../symbols/signs/questionMarkSign";
import Rule, { SearchVariant } from "./rule";
import validateGrid from "../validate.ts";

export default class UndercluedRule extends Rule {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['nbnnn', 'bwbnn', 'nbnnn', 'wwwnn'])
      .addSymbol(new AreaNumberSymbol(1, 1, 1))
      .addSymbol(new AreaNumberSymbol(0, 3, 4))
      .addSymbol(new QuestionMarkSign(0, 2))
      .addSymbol(new QuestionMarkSign(2, 2))
      .addSymbol(new QuestionMarkSign(3, 3))
  );

  private static readonly SEARCH_VARIANTS = [
    new UndercluedRule().searchVariant(),
  ];

  /**
   * **Underclued Grid: Mark only what is definitely true**
   *
   * This rule validates answers based on the provided solution.
   */
  public constructor() {
    super();
  }

  public get id(): string {
    return `underclued`;
  }

  public get explanation(): string {
    return `*Underclued Grid:* Mark only what is definitely true`;
  }

  public createExampleGrid(): GridData {
    return UndercluedRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return UndercluedRule.SEARCH_VARIANTS;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public copyWith(_: object): this {
    return new UndercluedRule() as this;
  }

  public get validateWithSolution(): boolean {
    return true;
  }

  public statusText(
    grid: GridData,
    solution: GridData | null,
    _state: GridState
  ): string | null {
    if (solution === null) return null;
    let solutionCount = 0;
    let gridCount = 0;
    grid.forEach(tile => {
      if (!tile.fixed && tile.color !== Color.Gray) gridCount++;
    });
    solution.forEach(tile => {
      if (!tile.fixed && tile.color !== Color.Gray) solutionCount++;
    });
    return `Tiles Remaining: ${solutionCount - gridCount}`;
  }
  private posToCoords(pos: number | undefined, width: number): [number, number] {
    if (pos === undefined) {
      throw new Error('pos is undefined');
    }
    return [pos % width, Math.floor(pos / width)];
  }

  private getValidGrid(grid: GridData, assumptions: number[], canAssump: boolean[]): [GridData, number[], boolean] {
    while (true) {
      // Get assumption
      const newAssump = canAssump.findIndex(
        (a, i) => a && !assumptions.includes(i)
      );
      if (newAssump === -1) {
        return [grid, assumptions, true];
      }
      // Set assumption's color to dark
      const coords = this.posToCoords(newAssump, grid.width);
      grid = grid.setTile(coords[0], coords[1], tile => tile.withColor(Color.Dark));
      assumptions.push(newAssump);
      const state = validateGrid(grid, null);
      // If the grid is invalid, try to backtrack to a right assumption
      if (state.final === State.Error) {
        [grid, assumptions] = this.tryToBacktrack(grid, assumptions);
        if (assumptions.length === 0) {
          return [grid, assumptions, false];
        }
      }
    }
  }

  private tryToBacktrack(grid: GridData, assumptions: number[]): [GridData, number[]] {
    while (assumptions.length > 0) {
      const coords = this.posToCoords(assumptions.at(-1), grid.width);
      if (grid.getTile(coords[0], coords[1]).color === Color.Light) {
        grid = grid.setTile(coords[0], coords[1], (tile) => tile.withColor(Color.Gray));
        assumptions.pop();
      } else {
        grid = grid.setTile(coords[0], coords[1], (tile) => tile.withColor(Color.Light));
        const state = validateGrid(grid, null);
        if (state.final === State.Error) {
          grid = grid.setTile(coords[0], coords[1], (tile) => tile.withColor(Color.Gray));
          assumptions.pop();
        } else {
          return [grid, assumptions];
        }
      }
    }
    return [grid, assumptions];
  }

  public computeSolution(initialGrid: GridData): GridData {
    const canAssump: boolean[] = initialGrid.tiles.map(row => row.map(t => t.exists && !t.fixed)).flat();
    let lastValidGrid: Color[] = [];
    let assumptions: number[] = [];
    let currentGrid: GridData = initialGrid.copyWith({});
    let anyNewGrid;
    while (assumptions.length > 0 || lastValidGrid.length === 0) {
      [currentGrid, assumptions, anyNewGrid] = this.getValidGrid(currentGrid, assumptions, canAssump);
      console.log(currentGrid.tiles.map(row => row.map(t => {
        const color = t.color === Color.Light ? 'w' : 'b';
        if (t.color === Color.Gray) return 'n';
        if (!t.exists) return '.';
        return t.fixed ? color.toUpperCase() : color;
      }).join('')).join('\n'));
      if (anyNewGrid === null) {
        break;
      }
      const newLastValidGrid = currentGrid.tiles.map(row => row.map(t => t.color)).flat();
      if (lastValidGrid.length !== 0) {
        const diff = newLastValidGrid.map((color, i) => color === lastValidGrid[i]);
        diff.forEach((same, i) => {
          if (!same) {
            canAssump[i] = false;
            newLastValidGrid[i] = Color.Gray;
          }
        });
        while (diff.indexOf(false) <= (assumptions.at(-1) ?? -1) && assumptions.length > 0) {
          [currentGrid, assumptions] = this.tryToBacktrack(currentGrid, assumptions);
        }
      } else {
        [currentGrid, assumptions] = this.tryToBacktrack(currentGrid, assumptions);
      }
      lastValidGrid = newLastValidGrid;
    }
    // Create a new grid with lastValidGrid
    let solutionGrid = initialGrid.copyWith({});
    lastValidGrid.forEach((color, i) => {
      const coords = this.posToCoords(i, solutionGrid.width);
      solutionGrid = solutionGrid.setTile(coords[0], coords[1], (tile) => tile.withColor(color));
    });
    console.log(solutionGrid.tiles.map(row => row.map(t => {
      const color = t.color === Color.Light ? 'w' : 'b';
      if (t.color === Color.Gray) return 'n';
      if (!t.exists) return '.';
      return t.fixed ? color.toUpperCase() : color;
    }).join('')).join('\n'));
    return solutionGrid;
  }
}
