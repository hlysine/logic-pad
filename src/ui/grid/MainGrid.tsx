import { memo } from 'react';
import StateRing from '../StateRing';
import { GridConsumer } from '../GridContext';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import ErrorOverlay from './ErrorOverlay';
import { State } from '../../data/primitives';

export interface MainGridProps {
  editable: boolean;
  children?: React.ReactNode;
}

export default memo(function MainGrid({ editable, children }: MainGridProps) {
  return (
    <StateRing>
      <GridConsumer>
        {({ grid, state, setGrid }) => (
          <Grid
            size={28}
            grid={grid}
            editable={editable}
            onTileClick={(x, y, target) => {
              setGrid(grid.setTile(x, y, t => t.withColor(target)));
            }}
          >
            <SymbolOverlay size={28} grid={grid} state={state.symbols} />
            {state.rules.map((rule, i) =>
              rule.state === State.Error ? (
                <ErrorOverlay key={i} size={28} positions={rule.positions} />
              ) : null
            )}
            {children}
          </Grid>
        )}
      </GridConsumer>
    </StateRing>
  );
});
