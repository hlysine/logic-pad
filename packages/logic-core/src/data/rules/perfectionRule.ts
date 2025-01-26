import { AnyConfig } from '../config.js';
import GridData from '../grid.js';
import { Color, RuleState, State } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';
import CustomIconSymbol from '../symbols/customIconSymbol.js';
import { SetGridHandler } from '../events/onSetGrid.js';

export default class PerfectionRule extends Rule implements SetGridHandler {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['w']).addSymbol(
      new CustomIconSymbol('', GridData.create(['w']), 0, 0, 'MdStars')
    )
  );

  private static readonly SEARCH_VARIANTS = []; // this rule is not searchable

  /**
   * **Quest for Perfection: cell colors are final**
   */
  public constructor() {
    super();
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

  public validateGrid(grid: GridData): RuleState {
    if (grid.getTileCount(true, undefined, Color.Gray) > 0) {
      return { state: State.Incomplete };
    } else {
      return { state: State.Satisfied };
    }
  }

  public onSetGrid(_oldGrid: GridData, newGrid: GridData): GridData {
    if (
      newGrid.getTileCount(true, false, Color.Light) > 0 ||
      newGrid.getTileCount(true, false, Color.Dark) > 0
    ) {
      return newGrid.withTiles(tiles =>
        tiles.map(row =>
          row.map(t =>
            t.exists && t.color !== Color.Gray ? t.withFixed(true) : t
          )
        )
      );
    }
    return newGrid;
  }

  public copyWith(_: object): this {
    return new PerfectionRule() as this;
  }
}

export const instance = new PerfectionRule();
