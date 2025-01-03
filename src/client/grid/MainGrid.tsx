import { memo, useEffect, useRef, useState } from 'react';
import StateRing from './StateRing.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import { State, Position } from '../../data/primitives';
import GridData from '../../data/grid';
import Loading from '../components/Loading';
import { GridStateConsumer } from '../contexts/GridStateContext.tsx';
import { useDisplay } from '../contexts/DisplayContext.tsx';
import { useToolbox } from '../contexts/ToolboxContext.tsx';
import handleTileClick from './handleTileClick';
import TileCountOverlay from './TileCountOverlay';
import InstructionPartOutlet from '../instructions/InstructionPartOutlet';
import { PartPlacement } from '../instructions/parts/types';
import ErrorOverlay from './ErrorOverlay';
import { usePinch } from '@use-gesture/react';

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
  return Math.floor(
    Math.max(25, Math.min(100 + Math.max(grid.width, grid.height) * 2, newSize))
  );
}

export default memo(function MainGrid({
  useToolboxClick,
  children,
}: MainGridProps) {
  const gridContext = useGrid();
  const { grid } = gridContext;
  const { scale, setScale } = useDisplay();
  const { onTileClick } = useToolbox();
  const [tileConfig, setTileConfig] = useState<{
    width: number;
    height: number;
    tileSize: number;
  }>({ width: 0, height: 0, tileSize: 0 });

  const stateRingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeHandler = () =>
      setTileConfig({
        width: grid.width,
        height: grid.height,
        tileSize: computeTileSize(grid),
      });
    const preventDefault = (e: Event) => e.preventDefault();
    window.addEventListener('resize', resizeHandler);
    window.addEventListener('gesturestart', preventDefault);
    window.addEventListener('gesturechange', preventDefault);
    resizeHandler();
    return () => {
      window.removeEventListener('resize', resizeHandler);
      window.removeEventListener('gesturestart', preventDefault);
      window.removeEventListener('gesturechange', preventDefault);
    };
  }, [grid]);

  const bind = usePinch(
    ({ offset: [newScale] }) => {
      setScale(newScale);
    },
    {
      scaleBounds: { min: 2 ** -2, max: 2 ** 2 },
      pinchOnWheel: false,
      rubberband: true,
      pointer: { touch: true },
      from: [scale, 0],
      preventDefault: true,
    }
  );

  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        setScale(
          Math.min(
            2 ** 2,
            Math.max(2 ** -2, scale * (e.deltaY > 0 ? 1 / 1.1 : 1.1))
          )
        );
      }
    };
    const ring = stateRingRef.current;
    ring?.addEventListener('wheel', wheelHandler, {
      passive: false,
    });
    return () => {
      ring?.removeEventListener('wheel', wheelHandler);
    };
  });

  if (
    tileConfig.tileSize === 0 ||
    tileConfig.width !== grid.width ||
    tileConfig.height !== grid.height
  )
    return <Loading />;

  return (
    <StateRing
      ref={stateRingRef}
      width={grid.width}
      height={grid.height}
      {...bind()}
    >
      <Grid
        size={Math.round(tileConfig.tileSize * scale)}
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
              <TileCountOverlay grid={grid} />
              <InstructionPartOutlet placement={PartPlacement.GridOverlay} />
              {children}
            </>
          )}
        </GridStateConsumer>
      </Grid>
    </StateRing>
  );
});
