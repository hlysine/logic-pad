import { memo, useEffect, useRef, useState } from 'react';
import StateRing from './StateRing.tsx';
import { useGrid } from '../contexts/GridContext.tsx';
import Grid from './Grid';
import SymbolOverlay from './SymbolOverlay';
import { State, Position } from '@logic-pad/core/data/primitives';
import GridData from '@logic-pad/core/data/grid';
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
import GridZoneOverlay from './GridZoneOverlay.tsx';
import { useSettings } from '../contexts/SettingsContext.tsx';

export interface MainGridProps {
  useToolboxClick: boolean;
  children?: React.ReactNode;
  animated?: boolean;
}

export function computeTileSize(
  grid: GridData,
  responsive: boolean,
  visualizeWrapArounds: boolean
) {
  const extraMargin = visualizeWrapArounds && grid.wrapAround.value ? 55 : 0;
  const windowWidth = responsive ? window.innerWidth : 1920;
  const windowHeight = responsive ? window.innerHeight : 1080;
  const newSize =
    windowWidth < 1280
      ? Math.min(
          (windowWidth - 128 - extraMargin) / grid.width,
          (windowHeight - 180 - extraMargin) / grid.height
        )
      : Math.min(
          (windowWidth - 128 - 640 - extraMargin) / grid.width,
          (windowHeight - 180 - extraMargin) / grid.height
        );
  return Math.floor(
    Math.max(25, Math.min(100 + Math.max(grid.width, grid.height) * 2, newSize))
  );
}

export default memo(function MainGrid({
  useToolboxClick,
  children,
  animated,
}: MainGridProps) {
  animated = animated ?? true;
  const gridContext = useGrid();
  const { grid, solution } = gridContext;
  const { scale, setScale, responsiveScale } = useDisplay();
  const { onTileClick } = useToolbox();
  const [tileConfig, setTileConfig] = useState<{
    width: number;
    height: number;
    tileSize: number;
  }>({ width: 0, height: 0, tileSize: 0 });

  const stateRingRef = useRef<HTMLDivElement>(null);
  const [visualizeWrapArounds] = useSettings('visualizeWrapArounds');

  useEffect(() => {
    const resizeHandler = () =>
      setTileConfig({
        width: grid.width,
        height: grid.height,
        tileSize: computeTileSize(grid, responsiveScale, visualizeWrapArounds),
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
  }, [grid, responsiveScale, visualizeWrapArounds]);

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
      animated={animated}
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
        bleed={grid.wrapAround.value ? 0.5 : 0}
      >
        <GridStateConsumer>
          {({ state }) => (
            <>
              <SymbolOverlay
                grid={grid}
                solution={solution}
                state={state.symbols}
                editable={useToolboxClick}
              />
              <InstructionPartOutlet
                grid={grid}
                placement={PartPlacement.GridOverlay}
              />
              <InstructionPartOutlet
                grid={grid}
                placement={PartPlacement.MainGridOverlay}
              />
              <ErrorOverlay
                positions={
                  state.rules
                    .map(rule => rule.state === State.Error && rule.positions)
                    .filter(Boolean) as Position[][]
                }
                width={grid.width}
                height={grid.height}
              />
              <GridZoneOverlay grid={grid} />
              <TileCountOverlay grid={grid} />
              {children}
            </>
          )}
        </GridStateConsumer>
      </Grid>
    </StateRing>
  );
});
