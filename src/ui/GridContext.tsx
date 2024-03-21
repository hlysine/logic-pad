import { createContext, memo, useContext, useState } from 'react';
import GridData from '../data/grid';
import { GridState, RuleState, State } from '../data/primitives';
import { useEdit } from './EditContext';
import { PuzzleMetadata } from '../data/puzzle';

interface GridContext {
  grid: GridData;
  solution: GridData | null;
  state: GridState;
  metadata: PuzzleMetadata;
  setGrid: (value: GridData, solution?: GridData | null) => void;
  setGridRaw: (value: GridData, solution?: GridData | null) => void;
  setState: (value: GridState) => void;
  setMetadata: (value: PuzzleMetadata) => void;
}

const defaultGrid = GridData.create([]);
const defaultState: GridState = {
  final: State.Incomplete,
  rules: [],
  symbols: new Map(),
};
const defaultMetadata: PuzzleMetadata = {
  title: '',
  author: '',
  description: '',
  link: '',
  difficulty: 0,
};

const context = createContext<GridContext>({
  grid: defaultGrid,
  solution: null,
  state: defaultState,
  metadata: defaultMetadata,
  setGrid: () => {},
  setGridRaw: () => {},
  setState: () => {},
  setMetadata: () => {},
});

export const useGrid = () => {
  return useContext(context);
};

export const GridConsumer = context.Consumer;

function aggregateState(rules: RuleState[], symbols: Map<string, State[]>) {
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

function validateGrid(grid: GridData, solution: GridData | null) {
  let requireSolution = false;
  const rules = grid.rules.map(rule => {
    if (rule.validateWithSolution) requireSolution = true;
    return rule.validateGrid(grid);
  });
  const symbols = new Map<string, State[]>();
  grid.symbols.forEach((symbolList, id) =>
    symbols.set(
      id,
      symbolList.map(s => {
        if (s.validateWithSolution) requireSolution = true;
        return s.validateSymbol(grid);
      })
    )
  );
  const final = aggregateState(rules, symbols);
  if (
    final !== State.Incomplete ||
    !requireSolution ||
    !solution ||
    solution.width !== grid.width ||
    solution.height !== grid.height
  ) {
    return { final, rules, symbols };
  }
  for (let y = 0; y < grid.height; y++) {
    for (let x = 0; x < grid.width; x++) {
      if (grid.getTile(x, y).color !== solution.getTile(x, y).color) {
        return { final: State.Incomplete, rules, symbols };
      }
    }
  }
  grid.rules.forEach((rule, i) => {
    if (rule.validateWithSolution) {
      rules[i] = { ...rules[i], state: State.Satisfied };
    }
  });
  grid.symbols.forEach((_, id) => {
    const symbolList = symbols.get(id)!;
    symbolList.forEach((_, i) => {
      const symbol = grid.symbols.get(id)![i];
      if (symbol.validateWithSolution) {
        symbolList[i] = State.Satisfied;
      }
    });
  });
  return { final: State.Satisfied, rules, symbols };
}

export default memo(function GridContext({
  children,
}: {
  children: React.ReactNode;
}) {
  const { recordEdit } = useEdit();

  const [grid, setGrid] = useState(defaultGrid);
  const [solution, setSolution] = useState<GridData | null>(null);
  const [state, setState] = useState(defaultState);
  const [metadata, setMetadata] = useState<PuzzleMetadata>(defaultMetadata);

  const setGridRaw: GridContext['setGridRaw'] = (grid, sol) => {
    setGrid(grid);
    if (sol !== undefined) setSolution(sol);
    setState(validateGrid(grid, sol === undefined ? solution : sol));
  };

  return (
    <context.Provider
      value={{
        grid,
        solution,
        state,
        metadata,
        setGrid: (grid, sol) => {
          recordEdit(grid);
          setGridRaw(grid, sol);
        },
        setGridRaw,
        setState,
        setMetadata,
      }}
    >
      {children}
    </context.Provider>
  );
});
