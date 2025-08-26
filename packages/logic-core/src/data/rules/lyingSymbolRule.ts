import { AnyConfig, ConfigType } from '../config.js';
import { FinalValidationHandler } from '../events/onFinalValidation.js';
import GridData from '../grid.js';
import {
  Color,
  GridState,
  Orientation,
  RuleState,
  State,
} from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';
import validateGrid from '../validate.js';
import Symbol from '../symbols/symbol.js';
import Instruction from '../instruction.js';
import LetterSymbol from '../symbols/letterSymbol.js';
import GalaxySymbol from '../symbols/galaxySymbol.js';
import LotusSymbol from '../symbols/lotusSymbol.js';
import AreaNumberSymbol from '../symbols/areaNumberSymbol.js';

class IgnoredSymbol extends Symbol {
  public readonly title = 'Ignored Symbol';

  public constructor(
    public readonly symbol: Symbol,
    public readonly state: State
  ) {
    super(symbol.x, symbol.y);
    this.symbol = symbol;
    this.state = state;
  }

  public get id(): string {
    return `ignored_${this.symbol.id}`;
  }

  public get explanation(): string {
    return this.symbol.explanation;
  }

  public get configs(): readonly AnyConfig[] | null {
    return [];
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
    return this.state;
  }

  public copyWith({ symbol, state }: { symbol?: Symbol; state?: State }): this {
    return new IgnoredSymbol(
      symbol ?? this.symbol,
      state ?? this.state
    ) as this;
  }

  public withSymbol(symbol: Symbol): this {
    return this.copyWith({ symbol });
  }

  public equals(other: Instruction): boolean {
    return other === this;
  }
}

class IgnoredRule extends Rule {
  public readonly title = 'Ignored Rule';

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
    return `ignored_${this.rule.id}`;
  }

  public get explanation(): string {
    return this.rule.explanation;
  }

  public get configs(): readonly AnyConfig[] | null {
    return [];
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

  public equals(other: Instruction): boolean {
    return other === this;
  }
}

export default class LyingSymbolRule
  extends Rule
  implements FinalValidationHandler
{
  public readonly title = 'Lying Symbols';

  private static readonly EXAMPLE_GRID = Object.freeze(
    GridData.create(['bbbbw', 'wwbbb', 'bbbbw', 'wbbww']).withSymbols([
      new LetterSymbol(4, 0, 'A'),
      new GalaxySymbol(1, 1),
      new LotusSymbol(2, 2, Orientation.Up),
      new LetterSymbol(0, 3, 'A'),
      new AreaNumberSymbol(4, 3, 1),
    ])
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
      explanation:
        'Number of symbols that are not satisfied in the final solution.',
      configurable: true,
    },
  ]);

  private static readonly SEARCH_VARIANTS = [
    new LyingSymbolRule(1).searchVariant(),
  ];

  /**
   * **&lt;count&gt; symbols are lying and are incorrect**
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
    return `${this.count} symbol${this.count <= 1 ? ' is' : 's are'} *lying* and ${this.count <= 1 ? 'is' : 'are'} incorrect`;
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
          newSymbols.get(key)!.push(new IgnoredSymbol(symbol, State.Ignored));
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
