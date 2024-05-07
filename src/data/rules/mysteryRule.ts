import { AnyConfig, ConfigType } from '../config';
import { FinalValidationHandler } from '../events/onFinalValidation';
import GridData from '../grid';
import { array } from '../helper';
import { Color, GridState, RuleState, State } from '../primitives';
import CustomTextSymbol from '../symbols/customTextSymbol';
import TileData from '../tile';
import Rule, { SearchVariant } from './rule';

export default class MysteryRule
  extends Rule
  implements FinalValidationHandler
{
  private static readonly EXAMPLE_GRID = Object.freeze(
    new GridData(1, 1)
      .withTiles([[new TileData(false, false, Color.Dark)]])
      .addSymbol(new CustomTextSymbol('', GridData.create([]), 0, 0, '?'))
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Solution,
      default: MysteryRule.EXAMPLE_GRID,
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
    return `*Mystery*: alternate solution`;
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
