import { AnyConfig, ConfigType } from '../config';
import { FinalValidationHandler } from '../events/onFinalValidation';
import { GridChangeHandler } from '../events/onGridChange';
import { GridResizeHandler } from '../events/onGridResize';
import GridData from '../grid';
import { array } from '../helper';
import { Color, GridState, RuleState, State } from '../primitives';
import CustomTextSymbol from '../symbols/customTextSymbol';
import Rule, { SearchVariant } from './rule';

export default class MysteryRule
  extends Rule
  implements FinalValidationHandler, GridChangeHandler, GridResizeHandler
{
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['.']).addSymbol(
      new CustomTextSymbol('', GridData.create([]), 0, 0, '?')
    )
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Tile,
      default: MysteryRule.EXAMPLE_GRID,
      resizable: false,
      field: 'solution',
      description: 'Solution',
      configurable: true,
    },
    {
      type: ConfigType.Boolean,
      default: true,
      field: 'visible',
      description: 'Visible',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new MysteryRule(MysteryRule.EXAMPLE_GRID, true).searchVariant(),
  ];

  /**
   * **Mystery: alternate solution**
   */
  public constructor(
    public readonly solution: GridData,
    public readonly visible: boolean
  ) {
    super();
    this.solution = MysteryRule.cleanSolution(solution);
    this.visible = visible;
  }

  public get id(): string {
    return `mystery`;
  }

  public get explanation(): string {
    return `*Mystery:* Alternate solution`;
  }

  public get visibleWhenSolving(): boolean {
    return this.visible;
  }

  public get configs(): readonly AnyConfig[] | null {
    return MysteryRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return MysteryRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return MysteryRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    if (grid.colorEquals(this.solution)) return { state: State.Satisfied };
    return { state: State.Incomplete };
  }

  public get necessaryForCompletion(): boolean {
    return false;
  }

  public onFinalValidation(
    grid: GridData,
    _solution: GridData | null,
    state: GridState
  ): GridState {
    if (state.final === State.Satisfied) return state;
    if (grid.colorEquals(this.solution))
      return {
        final: State.Satisfied,
        symbols: state.symbols,
        rules: state.rules,
      };
    return state;
  }

  public onGridChange(newGrid: GridData): this {
    if (
      newGrid.width === this.solution.width &&
      newGrid.height === this.solution.height
    ) {
      if (
        !newGrid.tiles.some((row, y) =>
          row.some((tile, x) => {
            const solutionTile = this.solution.getTile(x, y);
            if (solutionTile.exists !== tile.exists) return true;
            if (solutionTile.fixed !== tile.fixed) return true;
            if (
              solutionTile.exists &&
              solutionTile.fixed &&
              solutionTile.color !== tile.color
            )
              return true;
            return false;
          })
        )
      )
        return this;
    }
    return this.withSolution(MysteryRule.cleanSolution(this.solution, newGrid));
  }

  public onGridResize(
    _grid: GridData,
    mode: 'insert' | 'remove',
    direction: 'row' | 'column',
    index: number
  ): this | null {
    if (mode === 'insert') {
      if (direction === 'row') {
        return this.withSolution(this.solution.insertRow(index));
      } else if (direction === 'column') {
        return this.withSolution(this.solution.insertColumn(index));
      }
    } else if (mode === 'remove') {
      if (direction === 'row') {
        return this.withSolution(this.solution.removeRow(index));
      } else if (direction === 'column') {
        return this.withSolution(this.solution.removeColumn(index));
      }
    }
    return this;
  }

  public copyWith({
    solution,
    visible,
  }: {
    solution?: GridData;
    visible?: boolean;
  }): this {
    return new MysteryRule(
      solution ?? this.solution,
      visible ?? this.visible
    ) as this;
  }

  public withSolution(solution: GridData): this {
    return this.copyWith({ solution });
  }

  public withVisible(visible: boolean): this {
    return this.copyWith({ visible });
  }

  public static cleanSolution(
    solution: GridData,
    baseGrid?: GridData
  ): GridData {
    const tiles = baseGrid
      ? array(baseGrid.width, baseGrid.height, (x, y) => {
          const tile = baseGrid.getTile(x, y);
          if (!tile.exists || tile.fixed) return tile;
          const solutionTile = solution.getTile(x, y);
          if (!solutionTile.exists || solutionTile.color === Color.Gray)
            return tile;
          return tile.withColor(solutionTile.color);
        })
      : solution.tiles;
    return new GridData(
      baseGrid?.width ?? solution.width,
      baseGrid?.height ?? solution.height,
      tiles
    );
  }
}

export const instance = new MysteryRule(GridData.create([]), true);
