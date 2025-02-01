import GridData from '@logic-pad/core/data/grid';
import Symbol from '../symbols/Symbol';
import GridOverlay from './GridOverlay';
import {
  Color,
  GridState,
  State,
  Position,
} from '@logic-pad/core/data/primitives';
import { handlesSymbolDisplay } from '@logic-pad/core/data/events/onSymbolDisplay';
import { memo } from 'react';
import { cn } from '../uiHelper';
import SymbolData from '@logic-pad/core/data/symbols/symbol';

export interface SymbolOverlayProps {
  grid: GridData;
  solution: GridData | null;
  state?: GridState['symbols'];
  editable: boolean;
}

function forceGrayFg(symbol: SymbolData, grid: GridData) {
  const toCheck: Position[] = [];
  if (symbol.x % 1 !== 0 && symbol.y % 1 !== 0) {
    toCheck.push({ x: Math.floor(symbol.x), y: Math.floor(symbol.y) });
    toCheck.push({ x: Math.ceil(symbol.x), y: Math.ceil(symbol.y) });
    toCheck.push({ x: Math.floor(symbol.x), y: Math.ceil(symbol.y) });
    toCheck.push({ x: Math.ceil(symbol.x), y: Math.floor(symbol.y) });
  } else if (symbol.x % 1 !== 0) {
    toCheck.push({ x: Math.floor(symbol.x), y: symbol.y });
    toCheck.push({ x: Math.ceil(symbol.x), y: symbol.y });
  } else if (symbol.y % 1 !== 0) {
    toCheck.push({ x: symbol.x, y: Math.floor(symbol.y) });
    toCheck.push({ x: symbol.x, y: Math.ceil(symbol.y) });
  } else {
    toCheck.push({ x: symbol.x, y: symbol.y });
  }
  let color: Color | null = null;
  for (const pos of toCheck) {
    if (!grid.isPositionValid(pos.x, pos.y)) return true;
    const tile = grid.getTile(pos.x, pos.y);
    if (!tile.exists) return true;
    if (color === null) color = tile.color;
    else if (color !== tile.color) return true;
  }
  return false;
}

function fg(color: Color) {
  switch (color) {
    case Color.Dark:
      return cn('text-white');
    case Color.Light:
      return cn('text-black');
    case Color.Gray:
      return cn('text-neutral-content');
  }
}

export default memo(function SymbolOverlay({
  grid,
  solution,
  state,
  editable,
}: SymbolOverlayProps) {
  return (
    <GridOverlay>
      {[...grid.symbols.values()].flatMap(symbols =>
        symbols.map((symbol, i) => {
          if (!symbol.visibleWhenSolving && !editable) return null;
          for (const [_, value] of grid.symbols.entries()) {
            for (const s of value) {
              if (
                handlesSymbolDisplay(s) &&
                !s.onSymbolDisplay(grid, solution, symbol, editable)
              ) {
                return null;
              }
            }
          }
          for (const rule of grid.rules) {
            if (
              handlesSymbolDisplay(rule) &&
              !rule.onSymbolDisplay(grid, solution, symbol, editable)
            ) {
              return null;
            }
          }

          let symbolState = state?.get(symbol.id)?.[i];
          if (!symbolState) symbolState = State.Incomplete;
          const tile = grid.getTile(Math.floor(symbol.x), Math.floor(symbol.y));
          return (
            <Symbol
              key={`${symbol.id}(${symbol.x},${symbol.y})`}
              textClass={cn(
                symbolState === State.Error
                  ? 'text-error'
                  : symbolState === State.Satisfied
                    ? 'text-success'
                    : fg(forceGrayFg(symbol, grid) ? Color.Gray : tile.color),
                editable && !symbol.visibleWhenSolving ? 'opacity-60' : ''
              )}
              symbol={symbol}
            />
          );
        })
      )}
    </GridOverlay>
  );
});
