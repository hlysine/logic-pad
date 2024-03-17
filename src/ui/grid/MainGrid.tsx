import { memo, useEffect, useState, useTransition } from 'react';
import StateRing from '../StateRing';
import { useGrid } from '../GridContext';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import ErrorOverlay from './ErrorOverlay';
import { Color, State } from '../../data/primitives';
import GridData from '../../data/grid';
import debounce from 'lodash/debounce';

export interface MainGridProps {
  editable: boolean;
  children?: React.ReactNode;
}

function computeTileSize(grid: GridData) {
  let newSize = 50;
  newSize = Math.min(
    (window.innerWidth - 80 - 640) / grid.width,
    (window.innerHeight - 160) / grid.height
  );
  return Math.max(25, Math.min(80, newSize));
}

export default memo(function MainGrid({ editable, children }: MainGridProps) {
  const [_, startTransition] = useTransition();
  const { grid, state, setGrid } = useGrid();
  const [tileConfig, setTileConfig] = useState<{
    width: number;
    height: number;
    tileSize: number;
  }>({ width: 0, height: 0, tileSize: 0 });

  useEffect(() => {
    const resizeHandler = debounce(() => {
      startTransition(() =>
        setTileConfig({
          width: grid.width,
          height: grid.height,
          tileSize: computeTileSize(grid),
        })
      );
    }, 150);
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => window.removeEventListener('resize', resizeHandler);
  }, [grid]);

  if (
    tileConfig.tileSize === 0 ||
    tileConfig.width !== grid.width ||
    tileConfig.height !== grid.height
  )
    return <span className="loading loading-bars loading-lg"></span>;

  return (
    <StateRing>
      <Grid
        size={tileConfig.tileSize}
        grid={grid}
        editable={editable}
        onTileClick={(x, y, target, flood) => {
          const tile = grid.getTile(x, y);
          console.log('tile', tile, target, flood);
          if (flood && target === Color.Gray) {
            // target is Color.Gray if the tile is already the target color
            setGrid(grid.floodFillAll(Color.Gray, tile.color));
          } else if (flood && !tile.fixed) {
            setGrid(grid.floodFill({ x, y }, Color.Gray, target));
          } else if (!tile.fixed) {
            setGrid(grid.setTile(x, y, t => t.withColor(target)));
          }
        }}
      >
        <SymbolOverlay
          size={tileConfig.tileSize}
          grid={grid}
          state={state.symbols}
        />
        {state.rules.map((rule, i) =>
          rule.state === State.Error ? (
            <ErrorOverlay
              key={i}
              size={tileConfig.tileSize}
              positions={rule.positions}
            />
          ) : null
        )}
        {children}
      </Grid>
    </StateRing>
  );
});
