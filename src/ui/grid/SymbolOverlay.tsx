import GridData from '../../data/grid';
import Symbol from '../symbols/Symbol';
import { fg } from '../helper';
import GridOverlay from './GridOverlay';
import { GridState, State } from '../../data/primitives';
import { memo } from 'react';

export interface SymbolOverlayProps {
  grid: GridData;
  state?: GridState['symbols'];
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
          return (
            <Symbol
              key={`${symbol.id}(${symbol.x},${symbol.y})`}
              textClass={
                symbolState === State.Error
                  ? 'text-error'
                  : symbolState === State.Satisfied
                    ? 'text-success'
                    : fg(
                        grid.getTile(Math.floor(symbol.x), Math.floor(symbol.y))
                          .color
                      )
              }
              symbol={symbol}
            />
          );
        })
      )}
    </GridOverlay>
  );
});
