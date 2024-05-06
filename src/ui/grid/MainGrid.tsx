import { memo, useEffect, useState } from 'react';
import StateRing from '../StateRing';
import { useGrid } from '../GridContext';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import ErrorOverlay from './ErrorOverlay';
import { State, Position } from '../../data/primitives';
import GridData from '../../data/grid';
import Loading from '../components/Loading';
import { GridStateConsumer } from '../GridStateContext';
import { useDisplay } from '../DisplayContext';
import { useToolbox } from '../ToolboxContext';
import handleTileClick from './handleTileClick';

export interface MainGridProps {
  useToolboxClick: boolean;
  children?: React.ReactNode;
}

function computeTileSize(grid: GridData) {
  const newSize =
    window.innerWidth < 1280
      ? Math.min(
          (window.innerWidth - 120) / grid.width,
          (window.innerHeight - 180) / grid.height
        )
      : Math.min(
          (window.innerWidth - 120 - 640) / grid.width,
          (window.innerHeight - 180) / grid.height
        );
  return Math.max(
    25,
    Math.min(100 + Math.max(grid.width, grid.height) * 2, newSize)
  );
}

export default memo(function MainGrid({
  useToolboxClick,
  children,
}: MainGridProps) {
  const gridContext = useGrid();
  const { grid } = gridContext;
  const { scale } = useDisplay();
  const { onTileClick } = useToolbox();
  const [tileConfig, setTileConfig] = useState<{
    width: number;
    height: number;
    tileSize: number;
  }>({ width: 0, height: 0, tileSize: 0 });

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
    return <Loading />;

  return (
    <StateRing width={grid.width} height={grid.height}>
      <Grid
        size={tileConfig.tileSize * scale}
        grid={grid}
        editable={useToolboxClick ? !!onTileClick : true}
        onTileClick={(x, y, target, flood) => {
          if (useToolboxClick && onTileClick) {
            onTileClick(x, y, target, flood, gridContext);
            return;
          }
          handleTileClick(x, y, target, flood, gridContext, false);
        }}
      >
        <GridStateConsumer>
          {({ state }) => (
            <>
              <SymbolOverlay grid={grid} state={state.symbols} />
              <ErrorOverlay
                positions={
                  state.rules
                    .map(rule => rule.state === State.Error && rule.positions)
                    .filter(Boolean) as Position[][]
                }
                width={grid.width}
                height={grid.height}
              />
              {children}
            </>
          )}
        </GridStateConsumer>
      </Grid>
    </StateRing>
  );
});
