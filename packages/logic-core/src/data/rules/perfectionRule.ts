import { AnyConfig } from '../config.js';
import GridData from '../grid.js';
import {
  Color,
  GridState,
  RuleState,
  State,
  Position,
  Mode,
} from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';
import CustomIconSymbol from '../symbols/customIconSymbol.js';
import { SetGridHandler } from '../events/onSetGrid.js';
import { FinalValidationHandler } from '../events/onFinalValidation.js';
import validateGrid from '../validate.js';

export default class PerfectionRule
  extends Rule
  implements SetGridHandler, FinalValidationHandler
{
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['w']).addSymbol(
      new CustomIconSymbol('', GridData.create(['w']), 0, 0, 'MdStars')
    )
  );

  private static readonly SEARCH_VARIANTS = [
    new PerfectionRule().searchVariant(),
  ];

  /**
   * **Quest for Perfection: cell colors are final**
   *
   * @param editor - whether to enable editor mode. This field is automatically set by the editor.
   */
  public constructor(public readonly editor = false) {
    super();
    this.editor = editor;
  }

  public get id(): string {
    return `perfection`;
  }

  public get explanation(): string {
    return `*Quest for Perfection*: cell colors are final`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return null;
  }

  public createExampleGrid(): GridData {
    return PerfectionRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return PerfectionRule.SEARCH_VARIANTS;
  }

  public get necessaryForCompletion(): boolean {
    return false;
  }

  public get isSingleton(): boolean {
    return true;
  }

  public modeVariant(mode: Mode): Rule | null {
    // only allow this rule in perfection mode
    if (this.editor === (mode === Mode.Create)) {
      return this;
    } else if (mode === Mode.Create) {
      return this.copyWith({ editor: true });
    } else {
      return this.copyWith({ editor: false });
    }
  }

  public validateGrid(grid: GridData): RuleState {
    if (grid.getTileCount(true, undefined, Color.Gray) > 0) {
      return { state: State.Incomplete };
    } else {
      return { state: State.Satisfied };
    }
  }

  /**
   * If the grid passes validation but is different from the solution, indicate the error in the final state.
   */
  public onFinalValidation(
    grid: GridData,
    solution: GridData | null,
    state: GridState
  ): GridState {
    if (state.final === State.Error) return state;
    if (solution === null) return state;

    const positions: Position[] = [];
    grid.tiles.forEach((row, y) =>
      row.forEach((t, x) => {
        if (
          t.exists &&
          t.color !== Color.Gray &&
          t.color !== solution.getTile(x, y).color
        ) {
          positions.push({ x, y });
        }
      })
    );
    if (positions.length > 0) {
      const ruleId = grid.rules.indexOf(this);
      return {
        final: State.Error,
        rules: state.rules.map((r, idx) => {
          if (idx === ruleId) {
            return { state: State.Error, positions };
          } else {
            return r;
          }
        }),
        symbols: state.symbols,
      };
    }
    return state;
  }

  private fixTiles(grid: GridData, exclusions?: Position[]): GridData {
    if (
      grid.getTileCount(true, false, Color.Light) > 0 ||
      grid.getTileCount(true, false, Color.Dark) > 0
    ) {
      return grid.withTiles(tiles =>
        tiles.map((row, y) =>
          row.map((t, x) =>
            t.exists &&
            t.color !== Color.Gray &&
            !exclusions?.some(e => e.x === x && e.y === y)
              ? t.withFixed(true)
              : t
          )
        )
      );
    }
    return grid;
  }

  private isValid(grid: GridData, solution: GridData | null): boolean {
    return validateGrid(grid, solution).final !== State.Error;
  }

  private findSingleError(
    grid: GridData,
    solution: GridData | null
  ): Position[] {
    if (solution === null) return [];
    const positions: Position[] = [];
    // If a solution is available, we can compare against the solution and allow the user to modify the one single error.
    grid.tiles.forEach((row, y) =>
      row.forEach((t, x) => {
        if (
          t.exists &&
          t.color !== Color.Gray &&
          t.color !== solution.getTile(x, y).color
        ) {
          positions.push({ x, y });
        }
      })
    );
    if (positions.length > 1) {
      const connected = grid.connections.getConnectedTiles(positions[0]);
      if (
        !positions.every(p => connected.some(c => c.x === p.x && c.y === p.y))
      ) {
        return [];
      }
    }
    return positions;
  }

  /**
   * Force all tiles to be fixed.
   *
   * If the grid is already wrong, prevent the player from changing it further.
   */
  public onSetGrid(
    oldGrid: GridData,
    newGrid: GridData,
    solution: GridData | null
  ): GridData {
    if (this.editor) return newGrid;

    const oldGridIsValid = this.isValid(oldGrid, solution);
    const newGridIsValid = this.isValid(newGrid, solution);
    if (!oldGridIsValid && !newGridIsValid) {
      const oldPositions = this.findSingleError(oldGrid, solution);
      return this.fixTiles(oldGrid, oldPositions);
    } else if (!newGridIsValid) {
      const positions = this.findSingleError(newGrid, solution);
      return this.fixTiles(newGrid, positions);
    }
    return this.fixTiles(newGrid);
  }

  public copyWith({ editor }: { editor?: boolean }): this {
    return new PerfectionRule(editor ?? this.editor) as this;
  }
}

export const instance = new PerfectionRule();
