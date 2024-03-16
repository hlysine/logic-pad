import { memo, useEffect, useState, useTransition } from 'react';
import StateRing from '../StateRing';
import { useGrid } from '../GridContext';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import ErrorOverlay from './ErrorOverlay';
import { State } from '../../data/primitives';
import GridData from '../../data/grid';
import debounce from 'lodash/debounce';

export interface MainGridProps {
  editable: boolean;
  children?: React.ReactNode;
}

function computeTileSize(grid: GridData) {
  let newSize = 50;
  const rect = document.body.getBoundingClientRect();
  newSize = Math.min(
    (rect.width - 80 - 640) / grid.width,
    (rect.height - 160) / grid.height
  );
  return Math.max(25, Math.min(100, newSize));
}

export default memo(function MainGrid({ editable, children }: MainGridProps) {
  const [_, startTransition] = useTransition();
  const { grid, state, setGrid } = useGrid();
  const [tileSize, setTileSize] = useState(computeTileSize(grid));

  useEffect(() => {
    const resizeHandler = debounce(() => {
      startTransition(() => setTileSize(computeTileSize(grid)));
    }, 150);
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [grid]);

  return (
    <StateRing>
      <Grid
        size={tileSize}
        grid={grid}
        editable={editable}
        onTileClick={(x, y, target) => {
          setGrid(grid.setTile(x, y, t => t.withColor(target)));
        }}
      >
        <SymbolOverlay size={tileSize} grid={grid} state={state.symbols} />
        {state.rules.map((rule, i) =>
          rule.state === State.Error ? (
            <ErrorOverlay key={i} size={tileSize} positions={rule.positions} />
          ) : null
        )}
        {children}
      </Grid>
    </StateRing>
  );
});
