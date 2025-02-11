import { AnyConfig, ConfigType } from '../config.js';
import { FinalValidationHandler } from '../events/onFinalValidation.js';
import GridData from '../grid.js';
import { Color, GridState, RuleState, State } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';
import CustomIconSymbol from '../symbols/customIconSymbol.js';
import validateGrid from '../validate.js';
import Symbol from '../symbols/symbol.js';

class IgnoredSymbol extends Symbol {
  public constructor(public readonly symbol: Symbol) {
    super(symbol.x, symbol.y);
    this.symbol = symbol;
  }

  public get id(): string {
    return this.symbol.id;
  }

  public get explanation(): string {
    return this.symbol.explanation;
  }

  public get configs(): readonly AnyConfig[] | null {
    return this.symbol.configs;
  }

  public createExampleGrid(): GridData {
    return this.symbol.createExampleGrid();
  }

  public get necessaryForCompletion(): boolean {
    return this.symbol.necessaryForCompletion;
  }

  public get visibleWhenSolving(): boolean {
    return this.symbol.visibleWhenSolving;
  }

  public get sortOrder(): number {
    return this.symbol.sortOrder;
  }

  public validateSymbol(_grid: GridData, _solution: GridData | null): State {
    return State.Ignored;
  }

  public copyWith({ symbol }: { symbol?: Symbol }): this {
    return new IgnoredSymbol(symbol ?? this.symbol) as this;
  }

  public withSymbol(symbol: Symbol): this {
    return this.copyWith({ symbol });
  }
}

class IgnoredRule extends Rule {
  public constructor(
    public readonly rule: Rule,
    public readonly state: State
  ) {
    super();
    this.rule = rule;
    this.state = state;
  }

  public get searchVariants(): SearchVariant[] {
    return [];
  }

  public get id(): string {
    return this.rule.id;
  }

  public get explanation(): string {
    return this.rule.explanation;
  }

  public createExampleGrid(): GridData {
    return this.rule.createExampleGrid();
  }

  public get necessaryForCompletion(): boolean {
    return this.rule.necessaryForCompletion;
  }

  public get visibleWhenSolving(): boolean {
    return this.rule.visibleWhenSolving;
  }

  public get isSingleton(): boolean {
    return this.rule.isSingleton;
  }

  public validateGrid(_grid: GridData): RuleState {
    if (this.state === State.Error)
      return { state: State.Error, positions: [] };
    else return { state: this.state };
  }

  public copyWith({ rule, state }: { rule?: Rule; state?: State }): this {
    return new IgnoredRule(rule ?? this.rule, state ?? this.state) as this;
  }
}

export default class LyingSymbolRule
  extends Rule
  implements FinalValidationHandler
{
  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['.']).addSymbol(
      new CustomIconSymbol('', GridData.create([]), 0, 0, 'MdOutlineDeblur')
    )
  );

  private static readonly CONFIGS: readonly AnyConfig[] = Object.freeze([
    {
      type: ConfigType.Number,
      default: 1,
      min: 1,
      max: 100,
      step: 1,
      field: 'count',
      description: 'Number of liars',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new LyingSymbolRule(1).searchVariant(),
  ];

  /**
   * **&lt;count&gt; symbols are lying and can be ignored**
   *
   * @param count Number of lying symbols
   */
  public constructor(public readonly count: number) {
    super();
    this.count = count;
  }

  public get id(): string {
    return `lying_symbols`;
  }

  public get explanation(): string {
    return `${this.count} symbol${this.count <= 1 ? ' is' : 's are'} *lying* and can be ignored`;
  }

  public get configs(): readonly AnyConfig[] | null {
    return LyingSymbolRule.CONFIGS;
  }

  public createExampleGrid(): GridData {
    return LyingSymbolRule.EXAMPLE_GRID;
  }

  public get searchVariants(): SearchVariant[] {
    return LyingSymbolRule.SEARCH_VARIANTS;
  }

  public validateGrid(_: GridData): RuleState {
    return { state: State.Incomplete };
  }

  public get isSingleton(): boolean {
    return true;
  }

  public onFinalValidation(
    grid: GridData,
    solution: GridData | null,
    state: GridState
  ): GridState {
    const ignoredSymbols: [string, number][] = [];
    state.symbols.forEach((values, key) => {
      values.forEach((state, idx) => {
        if (state === State.Error) ignoredSymbols.push([key, idx]);
      });
    });
    if (ignoredSymbols.length > this.count) {
      const thisIdx = grid.rules.findIndex(rule => rule.id === this.id);
      return {
        final: State.Error,
        rules: state.rules.map((rule, idx) =>
          idx === thisIdx ? { state: State.Error, positions: [] } : rule
        ),
        symbols: state.symbols,
      };
    }

    const newSymbols = new Map<string, Symbol[]>();
    grid.symbols.forEach((values, key) => {
      values.forEach((symbol, idx) => {
        if (!newSymbols.has(key)) {
          newSymbols.set(key, []);
        }
        if (ignoredSymbols.some(([k, i]) => k === key && i === idx)) {
          newSymbols.get(key)!.push(new IgnoredSymbol(symbol));
        } else {
          newSymbols.get(key)!.push(symbol);
        }
      });
    });
    const newRules = grid.rules.map(rule =>
      rule.id === this.id
        ? new IgnoredRule(
            this,
            ignoredSymbols.length === this.count
              ? State.Satisfied
              : grid.getTileCount(true, false, Color.Gray) === 0
                ? State.Error
                : State.Incomplete
          )
        : rule
    );
    return validateGrid(
      grid.copyWith({ rules: newRules, symbols: newSymbols }),
      solution
    );
  }

  public copyWith({ count }: { count?: number }): this {
    return new LyingSymbolRule(count ?? this.count) as this;
  }

  public withCount(count: number): this {
    return this.copyWith({ count });
  }
}

export const instance = new LyingSymbolRule(1);
