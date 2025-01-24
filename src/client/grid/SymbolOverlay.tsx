import GridData from '@logic-pad/core/data/grid';
import Symbol from '../symbols/Symbol';
import GridOverlay from './GridOverlay';
import { Color, GridState, State } from '@logic-pad/core/data/primitives';
import { handlesSymbolDisplay } from '@logic-pad/core/data/events/onSymbolDisplay';
import { memo } from 'react';
import { cn } from '../uiHelper';

export interface SymbolOverlayProps {
  grid: GridData;
  state?: GridState['symbols'];
  editable: boolean;
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
  state,
  editable,
}: SymbolOverlayProps) {
  return (
    <GridOverlay>
      {[...grid.symbols.values()].flatMap(symbols =>
        symbols
          .filter(s => s.visibleWhenSolving || editable)
          .filter(s => {
            for (const [_, value] of grid.symbols.entries()) {
              for (const symbol of value) {
                if (
                  handlesSymbolDisplay(symbol) &&
                  !symbol.onSymbolDisplay(grid, s, editable)
                ) {
                  return false;
                }
              }
            }
            for (const rule of grid.rules) {
              if (
                handlesSymbolDisplay(rule) &&
                !rule.onSymbolDisplay(grid, s, editable)
              ) {
                return false;
              }
            }
            return true;
          })
          .map((symbol, i) => {
            let symbolState = state?.get(symbol.id)?.[i];
            if (!symbolState) symbolState = State.Incomplete;
            const tile = grid.getTile(
              Math.floor(symbol.x),
              Math.floor(symbol.y)
            );
            return (
              <Symbol
                key={`${symbol.id}(${symbol.x},${symbol.y})`}
                textClass={cn(
                  symbolState === State.Error
                    ? 'text-error'
                    : symbolState === State.Satisfied
                      ? 'text-success'
                      : fg(tile.exists ? tile.color : Color.Gray),
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
