import GridData from '@logic-pad/core/data/grid.js';
import Symbol from '../symbols/Symbol';
import GridOverlay from './GridOverlay';
import { Color, GridState, State } from '@logic-pad/core/data/primitives.js';
import { memo } from 'react';
import { cn } from '../uiHelper';

export interface SymbolOverlayProps {
  grid: GridData;
  state?: GridState['symbols'];
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
}: SymbolOverlayProps) {
  return (
    <GridOverlay>
      {[...grid.symbols.values()].flatMap(symbols =>
        symbols.map((symbol, i) => {
          let symbolState = state?.get(symbol.id)?.[i];
          if (!symbolState) symbolState = State.Incomplete;
          const tile = grid.getTile(Math.floor(symbol.x), Math.floor(symbol.y));
          return (
            <Symbol
              key={`${symbol.id}(${symbol.x},${symbol.y})`}
              textClass={
                symbolState === State.Error
                  ? 'text-error'
                  : symbolState === State.Satisfied
                    ? 'text-success'
                    : fg(tile.exists ? tile.color : Color.Gray)
              }
              symbol={symbol}
            />
          );
        })
      )}
    </GridOverlay>
  );
});
