import { memo, useEffect, useState } from 'react';
import StateRing from '../StateRing';
import { useGrid } from '../GridContext';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import ErrorOverlay from './ErrorOverlay';
import { Color, State } from '../../data/primitives';
import GridData from '../../data/grid';

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
  const { grid, state, setGrid, metadata, setState } = useGrid();

  if(state.final === State.Satisfied) {
    const finishes = JSON.parse(localStorage.getItem('finishes') ?? '[]');
    if(!finishes.includes(metadata.id)) {
      finishes.push(metadata.id);
      localStorage.setItem('finishes', JSON.stringify(finishes));
    }
  }

  const [tileConfig, setTileConfig] = useState<{
    width: number;
    height: number;
    tileSize: number;
  }>({ width: 0, height: 0, tileSize: 0 });

  useEffect(() => {
    const finishes = JSON.parse(localStorage.getItem('finishes') ?? '[]');
    if(finishes.includes(metadata.id)) {
      setState({
        ...state,
        final: State.Satisfied
      })
    }
  }, [metadata]);

  useEffect(() => {
    const resizeHandler = () =>
      setTileConfig({
        width: grid.width,
        height: grid.height,
        tileSize: computeTileSize(grid),
      });
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
        <SymbolOverlay grid={grid} state={state.symbols} />
        {state.rules.map((rule, i) =>
          rule.state === State.Error ? (
            <ErrorOverlay key={i} positions={rule.positions} />
          ) : null
        )}
        {children}
      </Grid>
    </StateRing>
  );
});
