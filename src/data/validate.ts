import { handlesFinalValidation } from './events/onFinalValidation';
import { handlesSymbolValidation } from './events/onSymbolValidation';
import GridData from './grid';
import { Color, GridState, RuleState, State } from './primitives';
import Rule from './rules/rule';
import Symbol from './symbols/symbol';

export function aggregateState(
  rules: RuleState[],
  symbols: Map<string, State[]>
) {
  if (rules.some(s => s.state === State.Error)) return State.Error;
  for (const [_, symbolList] of symbols) {
    if (symbolList.some(s => s === State.Error)) return State.Error;
  }

  if (rules.some(s => s.state === State.Incomplete)) return State.Incomplete;
  for (const [_, symbolList] of symbols) {
    if (symbolList.some(s => s === State.Incomplete)) return State.Incomplete;
  }

  if (rules.length === 0 && symbols.size === 0) return State.Incomplete;

  return State.Satisfied;
}

export function applyFinalOverrides(
  grid: GridData,
  solution: GridData | null,
  state: GridState
) {
  grid.symbols.forEach(list => {
    list.forEach(sym => {
      if (handlesFinalValidation(sym)) {
        state = sym.onFinalValidation(grid, solution, state);
      }
    });
  });
  grid.rules.forEach(rule => {
    if (handlesFinalValidation(rule)) {
      state = rule.onFinalValidation(grid, solution, state);
    }
  });
  return state;
}

export default function validateGrid(
  grid: GridData,
  solution: GridData | null
): GridState {
  let requireSolution = false;

  // validate all rules with self-contained logic
  const ruleStates = grid.rules.map(rule => {
    if (rule.validateWithSolution) requireSolution = true;
    return rule.validateGrid(grid);
  });

  // validate all symbols with symbol overrides
  const symbolOverrideStates: State[][] = ruleStates.map(() => []);

  const applySymbolOverrides = (
    grid: GridData,
    rules: readonly Rule[],
    symbol: Symbol,
    validator: (grid: GridData) => State
  ): State => {
    const [rule, ...rest] = rules;
    if (rule) {
      const newValidator = (grid: GridData) =>
        applySymbolOverrides(grid, rest, symbol, () => validator(grid));
      if (!handlesSymbolValidation(rule)) return newValidator(grid);
      const result = rule.onSymbolValidation(grid, symbol, newValidator);
      if (result === undefined) {
        return newValidator(grid);
      }
      const index = grid.rules.indexOf(rule);
      symbolOverrideStates[index].push(result);
      return result;
    }
    return validator(grid);
  };

  const symbolStates = new Map<string, State[]>();
  grid.symbols.forEach((symbolList, id) =>
    symbolStates.set(
      id,
      symbolList.map(s => {
        if (s.validateWithSolution) requireSolution = true;
        return applySymbolOverrides(grid, grid.rules, s, g =>
          s.validateSymbol(g)
        );
      })
    )
  );

  // apply the result of symbol overrides to the rules that provided them
  symbolOverrideStates.forEach((states, i) => {
    if (ruleStates[i].state !== State.Incomplete) return;
    if (states.some(s => s === State.Error))
      ruleStates[i] = { state: State.Error, positions: [] };
    else if (states.length > 0 && states.every(s => s === State.Satisfied))
      ruleStates[i] = { state: State.Satisfied };
  });

  let final = aggregateState(ruleStates, symbolStates);

  // in addition to satisfying all rules and symbols, a solution must also fill the grid completely
  if (!requireSolution && final === State.Satisfied) {
    final = grid.forEach(tile =>
      tile.exists && tile.color === Color.Gray ? true : undefined
    )
      ? State.Incomplete
      : State.Satisfied;
  }

  // return early if there is no need to validate against a solution
  if (
    final === State.Satisfied ||
    !requireSolution ||
    !solution ||
    solution.width !== grid.width ||
    solution.height !== grid.height
  ) {
    return applyFinalOverrides(grid, solution, {
      final,
      rules: ruleStates,
      symbols: symbolStates,
    });
  }

  // validate against the solution
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (
        grid.getTile(x, y).exists &&
        grid.getTile(x, y).color !== solution.getTile(x, y).color
      ) {
        return applyFinalOverrides(grid, solution, {
          final: State.Incomplete,
          rules: ruleStates,
          symbols: symbolStates,
        });
      }
    }
  }

  // mark all rules and symbols that are satisfied by the solution
  grid.rules.forEach((rule, i) => {
    if (rule.validateWithSolution) {
      ruleStates[i] = { ...ruleStates[i], state: State.Satisfied };
    }
  });
  grid.symbols.forEach((_, id) => {
    const symbolList = symbolStates.get(id)!;
    symbolList.forEach((_, i) => {
      const symbol = grid.symbols.get(id)![i];
      if (symbol.validateWithSolution) {
        symbolList[i] = State.Satisfied;
      }
    });
  });

  const finalState: GridState = {
    final: State.Satisfied,
    rules: ruleStates,
    symbols: symbolStates,
  };
  return applyFinalOverrides(grid, solution, finalState);
}
