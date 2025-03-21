import { AnyConfig, ConfigType } from '../config.js';
import GridData from '../grid.js';
import { RuleState, State, Position, Mode } from '../primitives.js';
import CustomIconSymbol from '../symbols/customIconSymbol.js';
import Rule, { SearchVariant } from './rule.js';

export default class ForesightRule extends Rule {
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['.']).addSymbol(
      new CustomIconSymbol('', GridData.create([]), 0, 0, 'MdRemoveRedEye')
    )
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 5,
      min: 1,
      field: 'count',
      description: 'Foresight count',
      configurable: true,
    },
    {
      type: ConfigType.Number,
      default: 30,
      min: 1,
      field: 'regenInterval',
      description: 'Regen Interval (seconds)',
      configurable: true,
    },
    {
      type: ConfigType.Boolean,
      default: false,
      field: 'startFull',
      description: 'Start with full foresight',
      configurable: true,
    },
    {
      type: ConfigType.SolvePath,
      default: [],
      field: 'solvePath',
      description: 'Intended solve path',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new ForesightRule(5, 30, false).searchVariant(),
  ];

  /**
   * **Foresight: Show hints**
   */
  public constructor(
    public readonly count: number,
    public readonly regenInterval: number,
    public readonly startFull: boolean,
    public readonly solvePath: Position[] = []
  ) {
    super();
    this.count = count;
    this.regenInterval = regenInterval;
    this.startFull = startFull;
    this.solvePath = solvePath;
  }

  public get id(): string {
    return `foresight`;
  }

  public get explanation(): string {
    return `*Foresight:* Show hints`;
  }

  public get visibleWhenSolving(): boolean {
    return false;
  }

  public get configs(): readonly AnyConfig[] | null {
    return ForesightRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return ForesightRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return ForesightRule.SEARCH_VARIANTS;
  }

  public validateGrid(_grid: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public get necessaryForCompletion(): boolean {
    return false;
  }

  public get isSingleton(): boolean {
    return true;
  }

  public modeVariant(mode: Mode): Rule | null {
    // foresight is disabled in perfection mode
    if (mode === Mode.Perfection) {
      return null;
    }
    return this;
  }

  public copyWith({
    count,
    regenInterval,
    startFull,
    solvePath,
  }: {
    count?: number;
    regenInterval?: number;
    startFull?: boolean;
    solvePath?: Position[];
  }): this {
    return new ForesightRule(
      count ?? this.count,
      regenInterval ?? this.regenInterval,
      startFull ?? this.startFull,
      solvePath ?? this.solvePath
    ) as this;
  }
}

export const instance = new ForesightRule(5, 30, false);
