import { AnyConfig, ConfigType } from '../config.js';
import { FinalValidationHandler } from '../events/onFinalValidation.js';
import GridData from '../grid.js';
import { Color, GridState, RuleState, State } from '../primitives.js';
import Rule, { SearchVariant } from './rule.js';
import CustomIconSymbol from '../symbols/customIconSymbol.js';
import validateGrid, { aggregateState } from '../validate.js';
import Symbol from '../symbols/symbol.js';

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
    if (ignoredSymbols.length < this.count) {
      const newSymbols = new Map<string, State[]>(state.symbols);
      newSymbols.forEach(values => {
        values.forEach((state, idx) => {
          if (state === State.Error) {
            values[idx] = State.Ignored;
          }
        });
      });
      const newState = aggregateState(state.rules, grid, newSymbols);
      if (grid.getTileCount(true, false, Color.Gray) === 0) {
        const thisIdx = grid.rules.findIndex(rule => rule.id === this.id);
        return {
          final: State.Error,
          rules: state.rules.map((rule, idx) =>
            idx === thisIdx ? { state: State.Error, positions: [] } : rule
          ),
          symbols: newSymbols,
        };
      }
      return {
        final: newState,
        rules: state.rules,
        symbols: newSymbols,
      };
    }

    const thisIdx = grid.rules.findIndex(rule => rule.id === this.id);
    const newSymbols = new Map<string, Symbol[]>();
    grid.symbols.forEach((values, key) => {
      values.forEach((symbol, idx) => {
        if (ignoredSymbols.some(([k, i]) => k === key && i === idx)) {
          return;
        }
        if (!newSymbols.has(key)) {
          newSymbols.set(key, []);
        }
        newSymbols.get(key)!.push(symbol);
      });
    });
    const newRules = grid.rules.filter(rule => rule.id !== this.id);
    const filteredState = validateGrid(
      grid.copyWith({ rules: newRules, symbols: newSymbols }),
      solution
    );
    const filteredRules = filteredState.rules.slice();
    filteredRules.splice(thisIdx, 0, { state: State.Satisfied });
    const filteredSymbols = new Map<string, State[]>(filteredState.symbols);
    ignoredSymbols.forEach(([key, idx]) => {
      if (!filteredSymbols.has(key)) {
        filteredSymbols.set(key, []);
      }
      filteredSymbols.get(key)!.splice(idx, 0, State.Ignored);
    });
    return {
      final: filteredState.final,
      rules: filteredRules,
      symbols: filteredSymbols,
    };
  }

  public copyWith({ count }: { count?: number }): this {
    return new LyingSymbolRule(count ?? this.count) as this;
  }

  public withCount(count: number): this {
    return this.copyWith({ count });
  }
}

export const instance = new LyingSymbolRule(1);
