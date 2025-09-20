import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { minBy } from '../dataHelper.js';
import { Color, RuleState, State } from '../primitives.js';
import RegionShapeRule from './regionShapeRule.js';
import { SearchVariant } from './rule.js';

export default class SameShapeRule extends RegionShapeRule {
  public readonly title = 'Same Shape Areas';

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Color,
      default: Color.Light,
      allowGray: false,
      field: 'color',
      description: 'Color',
      configurable: true,
    },
  ]);

  private static readonly EXAMPLE_GRID_LIGHT = Object.freeze(
    GridData.create(['wwbww', 'wbwbw', 'wbwbw', 'bwwbb'])
  );

  private static readonly EXAMPLE_GRID_DARK = Object.freeze(
    GridData.create(['bbwbb', 'bwbwb', 'bwbwb', 'wbbww'])
  );

  private static readonly SEARCH_VARIANTS = [
    new SameShapeRule(Color.Light).searchVariant(),
    new SameShapeRule(Color.Dark).searchVariant(),
  ];

  /**
   * **All &lt;color&gt; areas have the same shape and size**
   *
   * @param color - The color of the regions to compare.
   */
  public constructor(color: Color) {
    super(color);
  }

  public get id(): string {
    return `same_shape`;
  }

  public get explanation(): string {
    return `All ${this.color} areas have the same shape and size`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return SameShapeRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return this.color === Color.Light
      ? SameShapeRule.EXAMPLE_GRID_LIGHT
      : SameShapeRule.EXAMPLE_GRID_DARK;
  }

  public get searchVariants(): SearchVariant[] {
    return SameShapeRule.SEARCH_VARIANTS;
  }

  public validateGrid(grid: GridData): RuleState {
    const { regions, complete } = this.getShapeRegions(grid);
    if (regions.length > 1) {
      return {
        state: State.Error,
        positions: minBy(regions, island => island.count)!.positions,
      };
    } else if (regions.length <= 1) {
      return { state: complete ? State.Satisfied : State.Incomplete };
    } else {
      return { state: State.Incomplete }; // not reachable but the TS is not happy
    }
  }

  public copyWith({ color }: { color?: Color }): this {
    return new SameShapeRule(color ?? this.color) as this;
  }
}

export const instance = new SameShapeRule(Color.Dark);
