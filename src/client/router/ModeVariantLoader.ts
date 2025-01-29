import { useEffect } from 'react';
import { useGrid } from '../contexts/GridContext';
import { Mode } from '@logic-pad/core/data/primitives';
import Symbol from '@logic-pad/core/data/symbols/symbol';
import Rule from '@logic-pad/core/data/rules/rule';

export interface ModeVariantLoaderProps {
  mode: Mode;
}

function isRule(rule: Rule | null): rule is Rule {
  return rule !== null;
}

function isSymbol(symbol: Symbol | null): symbol is Symbol {
  return symbol !== null;
}

export default function ModeVariantLoader({ mode }: ModeVariantLoaderProps) {
  const { grid, setGridRaw } = useGrid();
  useEffect(() => {
    let changed = false;
    const newGrid = grid
      .withRules(rules =>
        rules
          .map(rule => {
            const newRule = rule.modeVariant(mode);
            if (newRule !== rule) changed = true;
            return newRule;
          })
          .filter<Rule>(isRule)
      )
      .withSymbols(symbols => {
        const symbolMap = new Map<string, Symbol[]>();
        symbols.forEach((symbols, key) => {
          const newSymbols = symbols
            .map(symbol => {
              const newSymbol = symbol.modeVariant(mode);
              if (newSymbol !== symbol) changed = true;
              return newSymbol;
            })
            .filter<Symbol>(isSymbol);
          symbolMap.set(key, newSymbols);
        });
        return symbolMap;
      });
    if (changed) setGridRaw(newGrid);
  }, [grid, mode, setGridRaw]);
  return null;
}
